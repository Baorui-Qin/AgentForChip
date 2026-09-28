$ErrorActionPreference = 'Stop'
$root = 'D:\AMD\p100-0922-c3'
Add-Type -TypeDefinition @'
using System;
using System.ComponentModel;
using System.Runtime.InteropServices;
public static class CampaignPowerGuard {
    [StructLayout(LayoutKind.Explicit, Size=40)]
    private struct ReasonContext {
        [FieldOffset(0)] public uint Version;
        [FieldOffset(4)] public uint Flags;
        [FieldOffset(8)] public IntPtr Reason;
    }
    [StructLayout(LayoutKind.Sequential)]
    public struct PowerStatus {
        public byte ACLineStatus, BatteryFlag, BatteryLifePercent, SystemStatusFlag;
        public uint BatteryLifeTime, BatteryFullLifeTime;
    }
    [DllImport("kernel32.dll", SetLastError=true)] private static extern IntPtr PowerCreateRequest(ref ReasonContext context);
    [DllImport("kernel32.dll", SetLastError=true)] private static extern bool PowerSetRequest(IntPtr request, int type);
    [DllImport("kernel32.dll", SetLastError=true)] private static extern bool PowerClearRequest(IntPtr request, int type);
    [DllImport("kernel32.dll", SetLastError=true)] private static extern bool CloseHandle(IntPtr handle);
    [DllImport("kernel32.dll", SetLastError=true)] private static extern bool GetSystemPowerStatus(out PowerStatus status);
    public static PowerStatus Status() {
        PowerStatus status;
        if (!GetSystemPowerStatus(out status)) throw new Win32Exception(Marshal.GetLastWin32Error());
        return status;
    }
    public static IntPtr Acquire() {
        if (Status().ACLineStatus != 1) throw new InvalidOperationException("STABLE_AC_POWER_REQUIRED");
        IntPtr text = Marshal.StringToHGlobalUni("Authorized 100-task RTL comparison; release when campaign exits");
        IntPtr handle;
        try {
            var reason = new ReasonContext { Version=0, Flags=1, Reason=text };
            handle = PowerCreateRequest(ref reason);
        } finally { Marshal.FreeHGlobal(text); }
        if (handle == new IntPtr(-1)) throw new Win32Exception(Marshal.GetLastWin32Error());
        if (!PowerSetRequest(handle, 1)) {
            int error = Marshal.GetLastWin32Error(); CloseHandle(handle); throw new Win32Exception(error);
        }
        return handle;
    }
    public static void Release(IntPtr handle) {
        bool cleared = PowerClearRequest(handle, 1);
        int error = Marshal.GetLastWin32Error();
        bool closed = CloseHandle(handle);
        if (!cleared) throw new Win32Exception(error);
        if (!closed) throw new Win32Exception(Marshal.GetLastWin32Error());
    }
}
'@
$status=[CampaignPowerGuard]::Status()
$handle=[CampaignPowerGuard]::Acquire()
$powerLog=Join-Path $root 'power-request.jsonl'
$code=1
try {
    [ordered]@{event='acquired';at=[DateTime]::UtcNow.ToString('o');pid=$PID;request='SystemRequired';ac_line=$status.ACLineStatus;battery_percent=$status.BatteryLifePercent;permanent_settings_changed=$false} | ConvertTo-Json -Compress | Add-Content -LiteralPath $powerLog -Encoding utf8NoBOM
    Write-Output 'Temporary SystemRequired power request acquired; permanent settings unchanged.'
    $env:XILINX_LOCAL_USER_DATA='no'
    $env:NODE_OPTIONS='--max-old-space-size=4096'
    node (Join-Path $root 'continue-comparison.mjs') $root 'D:\deepseek-harness' compare
    $code=$LASTEXITCODE
} finally {
    [CampaignPowerGuard]::Release($handle)
    [ordered]@{event='released';at=[DateTime]::UtcNow.ToString('o');pid=$PID;request='SystemRequired';campaign_exit=$code} | ConvertTo-Json -Compress | Add-Content -LiteralPath $powerLog -Encoding utf8NoBOM
    Write-Output 'Temporary power request released.'
}
exit $code

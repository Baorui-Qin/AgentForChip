[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$RefRoot = $PSScriptRoot
$Headers = @{ "User-Agent" = "rtl-reference-archiver/1.0" }
$Failures = [System.Collections.Generic.List[object]]::new()

function Save-RemoteFile {
    param(
        [Parameter(Mandatory = $true)][string]$Url,
        [Parameter(Mandatory = $true)][string]$Path
    )

    $parent = Split-Path -Parent $Path
    New-Item -ItemType Directory -Force -Path $parent | Out-Null
    if ((Test-Path -LiteralPath $Path) -and (Get-Item -LiteralPath $Path).Length -gt 0) {
        Write-Host "SKIP $Path"
        return
    }
    Invoke-WebRequest -Uri $Url -Headers $Headers -UseBasicParsing -MaximumRedirection 10 -OutFile $Path

    $item = Get-Item -LiteralPath $Path
    if ($item.Length -eq 0) {
        throw "Downloaded an empty file: $Url"
    }
    Write-Host ("OK {0} ({1} bytes)" -f $Path, $item.Length)
}

function Save-GitHubDocs {
    param([Parameter(Mandatory = $true)][string]$Repository)

    $name = $Repository.Replace("/", "__")
    $destination = Join-Path $RefRoot "repos\$name"
    $archive = Join-Path $RefRoot "_tmp\$name.zip"
    $extract = Join-Path $RefRoot "_tmp\$name"

    if (Test-Path -LiteralPath (Join-Path $destination "_SOURCE.json")) {
        Write-Host "SKIP GitHub docs $Repository"
        return
    }

    $repoInfo = Invoke-RestMethod -Uri "https://api.github.com/repos/$Repository" -Headers $Headers
    $branch = $repoInfo.default_branch
    $commitInfo = Invoke-RestMethod -Uri "https://api.github.com/repos/$Repository/commits/$branch" -Headers $Headers
    $sha = $commitInfo.sha

    Save-RemoteFile -Url "https://codeload.github.com/$Repository/zip/$sha" -Path $archive
    New-Item -ItemType Directory -Force -Path $extract | Out-Null
    Expand-Archive -LiteralPath $archive -DestinationPath $extract -Force
    $sourceRoot = Get-ChildItem -LiteralPath $extract -Directory | Select-Object -First 1
    if (-not $sourceRoot) {
        throw "No repository root found in archive for $Repository"
    }

    New-Item -ItemType Directory -Force -Path $destination | Out-Null
    $docExtensions = @(".md", ".mdx", ".rst", ".txt", ".adoc", ".pdf", ".bib")
    foreach ($file in Get-ChildItem -LiteralPath $sourceRoot.FullName -Recurse -File) {
        $relative = $file.FullName.Substring($sourceRoot.FullName.Length).TrimStart("\", "/")
        $underDocs = $relative -match "(^|[\\/])(docs?|documentation)([\\/]|$)"
        if (($docExtensions -contains $file.Extension.ToLowerInvariant()) -or $underDocs) {
            $target = Join-Path $destination $relative
            New-Item -ItemType Directory -Force -Path (Split-Path -Parent $target) | Out-Null
            Copy-Item -LiteralPath $file.FullName -Destination $target -Force
        }
    }

    [ordered]@{
        repository = "https://github.com/$Repository"
        default_branch = $branch
        commit = $sha
        archived_at = (Get-Date).ToUniversalTime().ToString("o")
        scope = "Markdown/text/PDF files plus files under doc, docs, or documentation directories"
    } | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $destination "_SOURCE.json") -Encoding UTF8
    Write-Host "OK GitHub docs $Repository at $sha"
}

New-Item -ItemType Directory -Force -Path $RefRoot | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $RefRoot "papers") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $RefRoot "web") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $RefRoot "model_cards") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $RefRoot "repos") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $RefRoot "_tmp") | Out-Null

$papers = [ordered]@{
    "2107.03374" = "Evaluating_Large_Language_Models_Trained_on_Code"
    "2309.07544" = "VerilogEval_Evaluating_Large_Language_Models_for_Verilog_Code_Generation"
    "2408.08927" = "VerilogCoder_Autonomous_Verilog_Coding_Agents_with_Graph_based_Planning_and_Abstract_Syntax_Tree_Symbolic_Waveform_Analysis"
    "2408.11053" = "Revisiting_VerilogEval"
    "2412.07822" = "MAGE_A_Multi_Agent_Engine_for_Automated_RTL_Code_Generation"
    "2504.15659" = "VeriCoder_Functionally_Validated_RTL_Data"
    "2601.18067" = "EvolVE_Evolutionary_Search_for_Verilog_Generation"
    "2603.19347" = "Exploring_the_Agentic_Frontier_of_Verilog_Code_Generation"
}

foreach ($entry in $papers.GetEnumerator()) {
    $path = Join-Path $RefRoot ("papers\arxiv_{0}_{1}.pdf" -f $entry.Key, $entry.Value)
    try {
        Save-RemoteFile -Url "https://arxiv.org/pdf/$($entry.Key).pdf" -Path $path
    } catch {
        $Failures.Add([pscustomobject]@{ url = "https://arxiv.org/pdf/$($entry.Key).pdf"; error = $_.Exception.Message })
        Write-Warning $_.Exception.Message
    }
}

$repositories = @(
    "NVlabs/verilog-eval",
    "sharc-lab/hls-eval",
    "ggml-org/llama.cpp",
    "QwenLM/Qwen2.5-Coder",
    "NVlabs/VerilogCoder",
    "hkust-zhiyao/RTL-Coder",
    "Xilinx/Vitis-HLS-Introductory-Examples",
    "stable-lab/MAGE",
    "chipweaver/veripower",
    "wilyub/Exploring-the-Agentic-Frontier-of-Verilog-Code-Generation",
    "qhy991/Awesome-LLM-Circuit-Agent",
    "dorianbrown/rank_bm25",
    "xhluca/bm25s"
)

foreach ($repository in $repositories) {
    try {
        Save-GitHubDocs -Repository $repository
    } catch {
        $Failures.Add([pscustomobject]@{ url = "https://github.com/$repository"; error = $_.Exception.Message })
        Write-Warning $_.Exception.Message
    }
}

$modelCards = [ordered]@{
    "Qwen2.5-Coder-7B-Instruct.md" = "https://huggingface.co/Qwen/Qwen2.5-Coder-7B-Instruct/resolve/main/README.md"
    "Qwen2.5-Coder-14B-Instruct.md" = "https://huggingface.co/Qwen/Qwen2.5-Coder-14B-Instruct/resolve/main/README.md"
    "Qwen2.5-Coder-14B-Instruct-GGUF.md" = "https://huggingface.co/Qwen/Qwen2.5-Coder-14B-Instruct-GGUF/resolve/main/README.md"
    "Qwen3-8B.md" = "https://huggingface.co/Qwen/Qwen3-8B/resolve/main/README.md"
}

foreach ($entry in $modelCards.GetEnumerator()) {
    try {
        Save-RemoteFile -Url $entry.Value -Path (Join-Path $RefRoot "model_cards\$($entry.Key)")
    } catch {
        $Failures.Add([pscustomobject]@{ url = $entry.Value; error = $_.Exception.Message })
        Write-Warning $_.Exception.Message
    }
}

$webPages = [ordered]@{
    "fpgachina_home.html" = "http://www.fpgachina.cn/"
    "fpgachina_download.html" = "http://www.fpgachina.cn/download.html"
    "fpgachina_download_index.html" = "http://www.fpgachina.cn/index.html?page=download"
    "fpgachina_download_content.html" = "http://www.fpgachina.cn/download-content.html"
    "fpgachina_httpUtils.js" = "http://www.fpgachina.cn/js/httpUtils.js"
    "amd_ug900_xelab_xvhdl_xvlog_xsim_options.html" = "https://docs.amd.com/r/2025.2-English/ug900-vivado-logic-simulation/xelab-xvhdl-and-xvlog-xsim-Command-Options"
    "amd_ug937_running_xelab.html" = "https://docs.amd.com/r/en-US/ug937-vivado-design-suite-simulation-tutorial/Running-xelab"
    "amd_ug901_running_synthesis_with_tcl.html" = "https://docs.amd.com/r/2025.2-English/ug901-vivado-synthesis/Running-Synthesis-with-Tcl"
    "amd_ug1399_hls_command_line.html" = "https://docs.amd.com/r/2025.2-English/ug1399-vitis-hls/Creating-HLS-Components-from-the-Command-Line"
    "amd_ug1399_programmers_model.html" = "https://docs.amd.com/r/JQtJoZLV908LbR5xokDqLw/Bb94T_tL_6y_pGPeNsOjxg"
    "vllm_gpu_installation.html" = "https://docs.vllm.ai/en/latest/getting_started/installation/gpu/"
    "vllm_quantization.html" = "https://docs.vllm.ai/en/latest/features/quantization/"
    "stanford_okapi_bm25.html" = "https://nlp.stanford.edu/IR-book/html/htmledition/okapi-bm25-a-non-binary-model-1.html"
    "rocm_vllm_7.1.1_optimization.html" = "https://rocm.docs.amd.com/en/docs-7.1.1/how-to/rocm-for-ai/inference-optimization/vllm-optimization.html"
    "rocm_vllm_latest_optimization.html" = "https://rocm.docs.amd.com/projects/ai-ecosystem/en/latest/optimization/vllm-v1-optimization.html"
    "hdlbits_main_page.html" = "https://hdlbits.01xz.net/wiki/Main_Page"
    "bm25s_documentation.html" = "https://bm25s.github.io/"
}

foreach ($entry in $webPages.GetEnumerator()) {
    try {
        Save-RemoteFile -Url $entry.Value -Path (Join-Path $RefRoot "web\$($entry.Key)")
    } catch {
        $Failures.Add([pscustomobject]@{ url = $entry.Value; error = $_.Exception.Message })
        Write-Warning $_.Exception.Message
    }
}

$fpgaChinaItems = @()
try {
    $timestamp = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds().ToString()
    $nonce = -join ((48..57 + 65..90 + 97..122) | Get-Random -Count 16 | ForEach-Object { [char]$_ })
    $signingText = "nonce=$nonce&pageNum=1&pageSize=100&timestamp=$timestamp&key=kiHjr0YY2GXSu8FySitOKUiwRGmKwGaGFjc1Cm"
    $md5 = [System.Security.Cryptography.MD5]::Create()
    $sign = ([BitConverter]::ToString($md5.ComputeHash([Text.Encoding]::UTF8.GetBytes($signingText)))).Replace("-", "")
    $listUrl = "http://www.fpgachina.cn/rest/pc/cms/file/list?pageNum=1&pageSize=100&timestamp=$timestamp&nonce=$nonce&sign=$sign"
    $fileList = Invoke-RestMethod -Uri $listUrl -Headers (@{ "User-Agent" = $Headers["User-Agent"]; lang = "zh-CN" })
    $fileList | ConvertTo-Json -Depth 10 | Set-Content -LiteralPath (Join-Path $RefRoot "web\fpgachina_file_list.json") -Encoding UTF8

    foreach ($row in $fileList.rows) {
        $uri = [uri]$row.file
        $extension = [IO.Path]::GetExtension($uri.AbsolutePath)
        if ([string]::IsNullOrWhiteSpace($extension)) {
            $extension = ".bin"
        }
        $fileName = "fpgachina_id_$($row.id)$extension"
        $downloadUrl = $row.file -replace "^https://oss\.fpgachina\.cn/", "http://oss.fpgachina.cn/"
        Save-RemoteFile -Url $downloadUrl -Path (Join-Path $RefRoot "fpgachina\$fileName")
        $savedPath = Join-Path $RefRoot "fpgachina\$fileName"
        $fpgaChinaItems += [ordered]@{
            id = $row.id
            created_at = $row.createTime
            source = $row.file -replace "\?.*$", ""
            local_file = $fileName
            bytes = (Get-Item -LiteralPath $savedPath).Length
            sha256 = (Get-FileHash -Algorithm SHA256 -LiteralPath $savedPath).Hash.ToLowerInvariant()
        }
    }

    [ordered]@{
        generated_at = (Get-Date).ToUniversalTime().ToString("o")
        source_api = "http://www.fpgachina.cn/rest/pc/cms/file/list"
        item_count = $fpgaChinaItems.Count
        note = "HTTPS certificate-name mismatch was not bypassed; same-host HTTP endpoints were used where HTTPS validation failed."
        items = $fpgaChinaItems
    } | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $RefRoot "fpgachina\manifest.json") -Encoding UTF8
} catch {
    $Failures.Add([ordered]@{ url = "http://www.fpgachina.cn/rest/pc/cms/file/list"; error = $_.Exception.Message })
    Write-Warning $_.Exception.Message
}

$manifest = [ordered]@{
    generated_at = (Get-Date).ToUniversalTime().ToString("o")
    source_markdown = "../reference-index markdown files in doc plus the links supplied in the request"
    scope_note = "One-hop archive only: references inside newly downloaded papers and Awesome lists are not recursively downloaded."
    papers = $papers
    repositories = $repositories
    model_cards = $modelCards
    web_pages = $webPages
    fpgachina_attachments = [ordered]@{
        item_count = $fpgaChinaItems.Count
        local_manifest = "fpgachina/manifest.json"
    }
    failures = @($Failures)
}
$manifest | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $RefRoot "manifest.json") -Encoding UTF8
$failuresPath = Join-Path $RefRoot "failures.json"
if ($Failures.Count -eq 0) {
    "[]" | Set-Content -LiteralPath $failuresPath -Encoding UTF8
} else {
    @($Failures) | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $failuresPath -Encoding UTF8
}

$tempRoot = (Resolve-Path -LiteralPath (Join-Path $RefRoot "_tmp")).Path
$expectedTempRoot = [System.IO.Path]::GetFullPath((Join-Path $RefRoot "_tmp"))
if ($tempRoot -eq $expectedTempRoot -and $tempRoot.StartsWith([System.IO.Path]::GetFullPath($RefRoot))) {
    Remove-Item -LiteralPath $tempRoot -Recurse -Force
}

Write-Host "Reference archive completed: $RefRoot"

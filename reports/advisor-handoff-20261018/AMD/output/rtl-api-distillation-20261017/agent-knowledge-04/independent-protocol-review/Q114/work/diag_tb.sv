module tb(output reg done);
  reg clk=0, rst=1, s_valid=0, m_ready=0;
  reg [7:0] s_data=0;
  wire s_ready,m_valid;
  wire [7:0] m_data;
  top_module dut(.*);
  always #5 clk=~clk;
  integer checks=0, pushes=0, pops=0;
  reg occupied=0, blocked=0;
  reg [7:0] expected=0, offered=0;
  task step(input reset_in, input valid_in, input [7:0] data_in, input ready_in);
    reg push,pop;
    begin
      @(negedge clk);
      if(blocked && !reset_in && (!valid_in || data_in!==offered))
        $fatal(1,"test source withdrew a blocked offer");
      rst=reset_in; s_valid=valid_in; s_data=data_in; m_ready=ready_in;
      #1;
      if(!rst) begin
        if(s_ready!==(!occupied || m_ready) || m_valid!==occupied)
          $fatal(1,"pre-edge handshake state mismatch");
        if(occupied && m_data!==expected) $fatal(1,"pre-edge data mismatch");
      end
      @(posedge clk);
      push=!rst && s_valid && s_ready; pop=!rst && m_valid && m_ready;
      blocked=!rst && s_valid && !s_ready; offered=s_data;
      if(rst) begin occupied=0; expected=0; end
      else begin
        pushes=pushes+push; pops=pops+pop;
        if(push) begin occupied=1; expected=s_data; end
        else if(pop) occupied=0;
      end
      #1;
      if(m_valid!==occupied || (occupied && m_data!==expected)) $fatal(1,"post-NBA mismatch");
      checks=checks+1;
    end
  endtask
  initial begin
    done=0;
    step(1,0,0,0);
    step(0,1,8'hA1,0);
    step(0,1,8'hB2,0);
    step(0,1,8'hB2,0);
    step(0,1,8'hB2,1);
    step(0,0,0,1);
    step(0,1,8'hC3,0);
    step(0,1,8'hD4,1);
    step(0,0,0,1);
    if(pushes!=4 || pops!=4) $fatal(1,"event count mismatch");
    step(0,1,8'hE5,0);
    step(1,0,0,0);
    step(0,0,0,1);
    $display("PROTOCOL_CHECKS=%0d PUSHES=%0d POPS=%0d",checks,pushes,pops);
    done=1;
  end
endmodule

module tb(output reg done);
  localparam DEPTH=3,CW=$clog2(DEPTH+1);
  reg clk=0,rst=1,s_valid=0,m_ready=0;
  reg [7:0] s_data=0;
  wire s_ready,m_valid;
  wire [7:0] m_data;
  wire [CW-1:0] count;
  top_module #(.DEPTH(DEPTH)) dut(.*);
  always #5 clk=~clk;
  reg [7:0] queue[0:63];
  integer head=0,tail=0,size=0,checks=0,i;
  reg blocked=0;
  reg [7:0] offered=0;
  task step(input reset_in,input valid_in,input [7:0] data_in,input ready_in);
    reg push,pop;
    begin
      @(negedge clk);
      if(blocked && !reset_in && (!valid_in || data_in!==offered)) $fatal(1,"source changed a blocked offer");
      rst=reset_in;s_valid=valid_in;s_data=data_in;m_ready=ready_in;
      #1;
      if(!rst) begin
        if(count!==size || m_valid!==(size!=0) || s_ready!==((size<DEPTH)||((size!=0)&&m_ready)))
          $fatal(1,"pre-edge FIFO control mismatch");
        if(m_data!==(size!=0?queue[head]:8'd0)) $fatal(1,"pre-edge head mismatch");
      end
      @(posedge clk);
      push=!rst&&s_valid&&s_ready;pop=!rst&&m_valid&&m_ready;
      blocked=!rst&&s_valid&&!s_ready;offered=s_data;
      if(rst) begin head=0;tail=0;size=0;end
      else begin
        if(pop) begin head=head+1;size=size-1;end
        if(push) begin queue[tail]=s_data;tail=tail+1;size=size+1;end
      end
      #1;
      if(count!==size || m_valid!==(size!=0) || m_data!==(size!=0?queue[head]:8'd0))
        $fatal(1,"post-NBA FIFO state mismatch");
      checks=checks+1;
    end
  endtask
  initial begin
    done=0;
    step(1,0,0,0);
    for(i=0;i<3;i=i+1) step(0,1,8'h10+i,0);
    step(0,1,8'hAA,0);
    step(0,1,8'hAA,0);
    step(0,1,8'hAA,1);
    for(i=0;i<10;i=i+1) step(0,1,8'h30+i,1);
    repeat(3) step(0,0,0,1);
    if(size!=0 || head!=tail) $fatal(1,"missing or duplicate transfers");
    step(0,1,8'h99,0);
    step(1,0,0,0);
    step(0,0,0,1);
    $display("FIFO_PROTOCOL_CHECKS=%0d",checks);done=1;
  end
endmodule

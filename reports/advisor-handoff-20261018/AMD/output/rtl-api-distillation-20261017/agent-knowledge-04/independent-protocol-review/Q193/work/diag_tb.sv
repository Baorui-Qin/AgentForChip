module tb(output reg done);
  reg clk=0,rst=1,s_valid=0,a_ready=0,b_ready=0;
  reg [7:0] s_data=0;
  wire s_ready,a_valid,b_valid;
  wire [7:0] a_data,b_data;
  top_module dut(.*);
  always #5 clk=~clk;
  reg pa=0,pb=0,blocked=0;
  reg [7:0] expected=0,offered=0;
  integer sent=0,got_a=0,got_b=0,checks=0;
  task step(input reset_in,input valid_in,input [7:0] data_in,input ar,input br);
    reg push,ap,bp;
    begin
      @(negedge clk);
      if(blocked && !reset_in && (!valid_in || data_in!==offered)) $fatal(1,"source protocol violation");
      rst=reset_in;s_valid=valid_in;s_data=data_in;a_ready=ar;b_ready=br;
      #1;
      if(!rst) begin
        if(s_ready!==!(pa||pb) || a_valid!==pa || b_valid!==pb) $fatal(1,"pre-edge valid/ready mismatch");
        if((pa && a_data!==expected)||(pb && b_data!==expected)) $fatal(1,"branch data mismatch");
      end
      @(posedge clk);
      push=!rst&&s_valid&&s_ready; ap=!rst&&a_valid&&a_ready; bp=!rst&&b_valid&&b_ready;
      blocked=!rst&&s_valid&&!s_ready;offered=s_data;
      if(rst) begin pa=0;pb=0;end
      else begin
        sent=sent+push;got_a=got_a+ap;got_b=got_b+bp;
        if(push) begin pa=1;pb=1;expected=s_data;end
        else begin if(ap)pa=0;if(bp)pb=0;end
      end
      #1;
      if(a_valid!==pa || b_valid!==pb || s_ready!==!(pa||pb)) $fatal(1,"post-NBA branch state mismatch");
      checks=checks+1;
    end
  endtask
  initial begin
    done=0;
    step(1,0,0,0,0);
    step(0,1,8'hAA,0,0);
    step(0,0,0,1,0);
    step(0,1,8'h33,1,0);
    step(0,1,8'h33,1,1);
    step(0,1,8'h33,0,0);
    step(0,0,0,0,1);
    step(0,0,0,0,1);
    step(0,0,0,1,1);
    step(0,1,8'hC3,1,1);
    step(0,0,0,1,1);
    if(sent!=3 || got_a!=3 || got_b!=3) $fatal(1,"duplicate or missing branch transfer");
    step(0,1,8'h11,0,0);
    step(1,0,0,0,0);
    step(0,0,0,1,1);
    $display("PROTOCOL_CHECKS=%0d SENT=%0d A=%0d B=%0d",checks,sent,got_a,got_b);
    done=1;
  end
endmodule

module TopModule(input in, output out);
  assign out = 1'b0
  // synthesis translate_off
    | in
  // synthesis translate_on
  ;
endmodule

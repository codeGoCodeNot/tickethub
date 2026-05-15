import Big from "big.js";

Big.DP = 2; // Set decimal places to 2 for currency calculations
Big.RM = Big.roundHalfEven; // Set rounding mode to round half to even

export const MyBig = Big;

# OnlineOptionPricer: An online Black-Scholes calculator

This repository contains some basic code for calculating the Black-Scholes (BS) formula for European options. The used formulation includes the possibility of using the cost of carry.

I did this repo as I wanted to have a portable BS calculator that includes the carry rate without having to checkout my other git repositories. This is my first HTML/CSS/JS project and I did it just for fun.

The difference with a usual BS calculator is that the stock has a rate of return equal to `b`, but all cash flows are still discounted with the risk free rate `r`. This generate a net cost of borrowing the underlying security which is given by the difference between `b` and `r`. In the popular framework the difference is 0, whilst in reality this can be non-negative.

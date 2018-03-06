"use strict"

const oneOverSqrt2PI = 1.0 / Math.sqrt(2.0 * Math.PI);

function std_cdf(x) 
{
    return cdf(x, 0.0, 1.0);
}

function std_pdf(x) 
{
    return pdf(x, 0.0, 1.0);
}

function cdf(x, mean, variance) 
{
    return 0.5 * (1 + erf((x - mean) / (Math.sqrt(2 * variance))));
}

function pdf(x, mean, variance) 
{
    const z = (x - mean) / variance;
    return Math.exp(-.5 * z * z) * oneOverSqrt2PI;
}
  
function erf(x) 
{
    // save the sign of x
    const sign = (x >= 0) ? 1 : -1;
    x = Math.abs(x);
  
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;
  
    // Abramovitz-Stegun formula 7.1.26
    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    return sign * y;
}
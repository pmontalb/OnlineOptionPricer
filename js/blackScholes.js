"use strict"

class BlackScholes extends PricingModel {
    constructor(S, K, r, b, sigma, T, dayCountingConvention) {
        super(S, K, r, b, sigma, T, dayCountingConvention);
    }

    Price() {
        var [d1, d2] = this.GetD();
        var Nd1 = std_cdf(d1), Nd2 = std_cdf(d2);

        const discountFactor = Math.exp(-this.r * this.T);
        const growthFactor = Math.exp(this.b * this.T);
        const callPrice = discountFactor * (this.S * growthFactor * Nd1 - this.K * Nd2);

        const forwardPrice = discountFactor * (this.S * growthFactor - this.K);
        const putPrice = callPrice - forwardPrice; // call-put parity

        return [callPrice, putPrice];
    }

    Delta() {
        var [d1, _] = this.GetD();
        var Nd1 = std_cdf(d1);

        const growthFactorTimesDiscountFactor = Math.exp((this.b - this.r) * this.T);
        const callDelta = growthFactorTimesDiscountFactor * Nd1;
        const putDelta = growthFactorTimesDiscountFactor * (Nd1 - 1.0);

        return [callDelta, putDelta];
    }

    Gamma() {
        var [d1, _] = this.GetD();
        const Pd1 = std_pdf(d1);

        const oneOverS = 1.0 / this.S;
        const oneOverSigmaSqrtT = 1.0 / (this.sigma * Math.sqrt(this.T));
        const growthFactorTimesDiscountFactor = Math.exp((this.b - this.r) * this.T);

        const gamma = oneOverS * Pd1 * oneOverSigmaSqrtT * growthFactorTimesDiscountFactor;

        return [gamma, gamma];
    }

    Vega()
    {
        var [d1, _] = this.GetD();
        const Pd1 = std_pdf(d1);

        const growthFactorTimesDiscountFactor = Math.exp((this.b - this.r) * this.T);

        const vega = this.S * Math.sqrt(this.T) * growthFactorTimesDiscountFactor * Pd1;

        return [vega, vega];
    }

    _Rho()
    {
        const price = this.Price();

        return [-this.T * price[0], -this.T * price[1]];
    }

    CarryRho()
    {
        var [d1, _] = this.GetD();
        var Nd1 = std_cdf(d1);
        
        const growthFactorTimesDiscountFactor = Math.exp((this.b - this.r) * this.T);

        const callCarryRho = this.S * this.T * Nd1 * growthFactorTimesDiscountFactor;
        const putCarryRho = -this.S * this.T * (1.0 - Nd1) * growthFactorTimesDiscountFactor;

        return [callCarryRho, putCarryRho];
    }

    GetD() {
        const logMoneyness = Math.log(this.S / this.K);

        const sigmaSqrtT = this.sigma * Math.sqrt(this.T);
        const tmp = (logMoneyness + this.b * this.T) / sigmaSqrtT;

        const d1 = tmp + .5 * sigmaSqrtT;
        const d2 = tmp - .5 * sigmaSqrtT;
        return [d1, d2];
    }
}
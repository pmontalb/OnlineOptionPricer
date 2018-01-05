const ALLOWED_DAY_COUNTING_CONVENTION = [365, 252];

class PricingModel {
    constructor(S, K, r, b, sigma, T, dayCountingConvention) {
        this.S = Math.max(1e-4, Number(S));
        if (this.S <= 0.0)
            throw RangeError("Spot price must be positive");

        this.K = Math.max(1e-4, Number(K));
        if (this.K <= 0.0)
            throw RangeError("Strike price must be positive");

        this.r = Number(r);
        this.b = Number(b);

        this.sigma = Math.max(1e-4, Number(sigma));
        if (this.sigma <= 0.0)
            throw RangeError("Volatility must be positive");

        T = Math.max(1e-4, Number(T));
        if (this.T <= 0.0)
            throw RangeError("Strike price must be positive");

        dayCountingConvention = Number(dayCountingConvention);
        if (ALLOWED_DAY_COUNTING_CONVENTION.indexOf(dayCountingConvention) === -1)
            throw RangeError("Invalid day counting convention");
        this.T = T / dayCountingConvention;
    }

    Price() {
        throw TypeError("This method must be overridden");
    }

    __FiniteDifferenceFirstDerivative(paramDelegate)
    {
        const dp = 1e-4;

        paramDelegate(this, dp);
        const [callPriceUp, putPriceUp] = this.Price();

        paramDelegate(this, -2.0 * dp);
        const [callPriceDown, putPriceDown] = this.Price();

        paramDelegate(this, dp);
        
        const callDerivative = (callPriceUp - callPriceDown) / (2.0 * dp);
        const putDerivative = (putPriceUp - putPriceDown) / (2.0 * dp);

        return [callDerivative, putDerivative];
    }
    __FiniteDifferenceSecondDerivative(paramDelegate)
    {
        const dp = 1e-4;

        paramDelegate(this, dp);
        const [callPriceUp, putPriceUp] = this.Price();

        paramDelegate(this, -2.0 * dp);
        const [callPriceDown, putPriceDown] = this.Price();

        paramDelegate(this, dp);
        const [callPrice, putPrice] = this.Price();
        
        const callDerivative = (callPriceUp - 2.0 * callPrice + callPriceDown) / (dp * dp);
        const putDerivative = (putPriceUp - 2.0 * putPrice + putPriceDown) / (dp * dp);

        return [callDerivative, putDerivative];
    }
    __FiniteDifferenceSecondPartialDerivative(paramDelegate1, paramDelegate2)
    {
        const dp = 1e-4;
        const dq = 1e-4;

        paramDelegate1(this, dp);
        paramDelegate1(this, dq);
        const [callPriceUpUp, putPriceUpUp] = this.Price();

        paramDelegate2(this, -2.0 * dq);
        const [callPriceUpDown, putPriceUpDown] = this.Price();

        paramDelegate1(this, -2.0 * dp);
        const [callPriceDownDown, putPriceDownDown] = this.Price();

        paramDelegate2(this, +2.0 * dq);
        const [callPriceDownUp, putPriceDownUp] = this.Price();

        paramDelegate1(this, +dp);
        paramDelegate2(this, -dq);
               
        const callDerivative = (callPriceUpUp - callPriceUpDown - callPriceDownUp + callPriceDownDown) / (4.0 * dp * dq);
        const putDerivative = (putPriceUpUp - putPriceUpDown - putPriceDownUp + putPriceDownDown) / (4.0 * dp * dq);

        return [callDerivative, putDerivative];
    }

    Delta() {
        return this.__FiniteDifferenceFirstDerivative(function (that, dp) { that.S += dp; });
    }

    Gamma() {
        return this.__FiniteDifferenceSecondDerivative(function (that, dp) { that.S += dp; });
    }

    Vega() {
        return this.__FiniteDifferenceFirstDerivative(function (that, dp) { that.sigma += dp; });
    }
    Rho()
    {
        const rho = this._Rho();
        const rhoB = this.CarryRho();
        return [rho[0] + rhoB[0], rho[1] + rhoB[1]];
    }
    _Rho()
    {
        return this.__FiniteDifferenceFirstDerivative(function (that, dp) { that.r += dP; });
    }
    CarryRho() {
        return this.__FiniteDifferenceFirstDerivative(function (that, dp) { that.b += dP; });
    }
    Theta() {
        return this.__FiniteDifferenceFirstDerivative(function (that, dp) { that.T -= dp; });
    }
    Charm() {
        return this.__FiniteDifferenceSecondPartialDerivative(function (that, dp) { that.T -= dp; }, function (that, dp) { that.S += dp; });
    }
    Theta2() {
        return this.__FiniteDifferenceSecondDerivative(function (that, dp) { that.T -= dp; });
    }
};
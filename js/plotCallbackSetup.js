"use strict"

function Compute() {
    const sliderSpot = $('#slider-spot');
    const S = parseFloat(sliderSpot.val());

    const sliderInterestRate = $('#slider-interest-rate');
    const r = 0.01 * parseFloat(sliderInterestRate.val());

    const sliderCarryRate = $('#slider-carry-rate');
    const b = 0.01 * parseFloat(sliderCarryRate.val());

    const sliderVolatility = $('#slider-volatility');
    const sigma = 0.01 * parseFloat(sliderVolatility.val());

    const sliderDaysToExpiry = $('#slider-expiry');
    var T = sliderDaysToExpiry.val();

    const dcc = parseInt($(":radio:checked").val());

    const bs = new BlackScholes(S, S, r, b, sigma, T, dcc);

    DrawValues(bs);
}

function DrawValues(model) {

    const kMin = Math.max(1e-4, parseFloat($("#min-strike-value").val()));
    const kMax = Math.max(kMin + 1e-4, parseFloat($("#max-strike-value").val()));
    const nStrikes = Math.max(10, parseInt($("#n-strikes-value").val()));

    const dK = (kMax - kMin) / (nStrikes - 1);

    var strikes = [];
    var callPrice = [], putPrice = [];
    var callDelta = [], putDelta = [];
    var callGamma = [], putGamma = [];
    var callVega = [], putVega = [];
    var callRho = [], putRho = [];
    var callCarryRho = [], putCarryRho = [];
    var callTheta = [], putTheta = [];
    var callCharm = [], putCharm = [];
    var callTheta2 = [], putTheta2 = [];

    var tmpC = 0.0, tmpP = 0.0;
    for (let i = 0; i < nStrikes; ++i) {
        strikes.push(kMin + i * dK);
        model.K = strikes[strikes.length - 1];

        [tmpC, tmpP] = model.Price();
        callPrice.push(tmpC), putPrice.push(tmpP);

        [tmpC, tmpP] = model.Delta();
        callDelta.push(tmpC), putDelta.push(tmpP);

        [tmpC, tmpP] = model.Gamma();
        callGamma.push(tmpC), putGamma.push(tmpP);

        [tmpC, tmpP] = model.Vega();
        callVega.push(tmpC), putVega.push(tmpP);

        [tmpC, tmpP] = model.Rho();
        callRho.push(tmpC), putRho.push(tmpP);

        [tmpC, tmpP] = model.CarryRho();
        callCarryRho.push(tmpC), putCarryRho.push(tmpP);

        [tmpC, tmpP] = model.Theta();
        callTheta.push(tmpC), putTheta.push(tmpP);

        [tmpC, tmpP] = model.Charm();
        callCharm.push(tmpC), putCharm.push(tmpP);

        [tmpC, tmpP] = model.Theta2();
        callTheta2.push(tmpC), putTheta2.push(tmpP);
    }

    Plot(strikes, callPrice, putPrice, "Price", "price-chart");
    Plot(strikes, callDelta, putDelta, "Delta", "delta-chart");
    Plot(strikes, callGamma, putGamma, "Gamma", "gamma-chart");
    Plot(strikes, callVega, putVega, "Vega", "vega-chart");
    Plot(strikes, callRho, putRho, "Rho", "rho-chart");
    Plot(strikes, callCarryRho, putCarryRho, "Carry Rho", "carry-rho-chart");
    Plot(strikes, callTheta, putTheta, "Theta", "theta-chart");
    Plot(strikes, callCharm, putCharm, "Charm", "charm-chart");
    Plot(strikes, callTheta2, putTheta2, "Theta2", "theta2-chart");
}

function Plot(strikes, callData, putData, analytic, id) {

    Chart.helpers.each(Chart.instances, function(instance){
        if(instance.chart.canvas.id !== id)
            return;
        instance.chart.config.data.labels = strikes;
        instance.chart.config.data.datasets = [
            {
                fill: false,
                label: "Call " + analytic,
                data: callData,
                borderColor: "blue",
            },
            {
                fill: false,
                label: "Put " + analytic,
                data: putData,
                borderColor: "red"
            },
        ];

        instance.update();
      });
}

var callbackSetup = {
    Setup: function () {
        const sliders = $('.slider');
        sliders.on("slide", Compute);

        const modelInputs = $(".model-input-number");
        modelInputs.keypress(function (e) {
            if (e.keyCode == 13)
                Compute();
        });

        const radioButtons = $(":radio");
        radioButtons.on("change", function (e) {
            Compute();
        });

        Compute();
    }
}


"use strict"

function Compute() {
    const sliderSpot = $('#slider-spot');
    const S = parseFloat(sliderSpot.val());

    const sliderStrike = $('#slider-strike');
    const K = parseFloat(sliderStrike.val());

    const sliderInterestRate = $('#slider-interest-rate');
    const r = 0.01 * parseFloat(sliderInterestRate.val());

    const sliderCarryRate = $('#slider-carry-rate');
    const b = 0.01 * parseFloat(sliderCarryRate.val());

    const sliderVolatility = $('#slider-volatility');
    const sigma = 0.01 * parseFloat(sliderVolatility.val());

    const sliderDaysToExpiry = $('#slider-expiry');
    var T = sliderDaysToExpiry.val();

    const dcc = parseInt($(":radio:checked").val());
    const bs = new BlackScholes(S, K, r, b, sigma, T, dcc);

    SetValues(bs);
}

function SetValues(model) {
    SetValue(function () { return model.Price(); }, "price");
    SetValue(function () { return model.Delta(); }, "delta");
    SetValue(function () { return model.Gamma(); }, "gamma");
    SetValue(function () { return model.Vega(); }, "vega");
    SetValue(function () { return model.Rho(); }, "rho");
    SetValue(function () { return model.CarryRho(); }, "carry-rho");
    SetValue(function () { return model.Theta(); }, "theta");
    SetValue(function () { return model.Charm(); }, "charm");
    SetValue(function () { return model.Theta2(); }, "theta2");
}

function SetValue(delegate, analytic) {
    const [call, put] = delegate();
    SetOutput(call, "call", analytic);
    SetOutput(put, "put", analytic);
}

function SetOutput(analytic, callPut, output) {
    const modelOutput = $("#" + callPut + "-" + output);
    modelOutput.val(analytic.toPrecision(8));
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


"use strict"

function __sliderSetup(jSlider, jLabel, min, max, val) {
    jSlider.noUiSlider({
        start: val,
        connect: "lower",
        range: {
            min: min,
            max: max
        }
    });

    jLabel.on("paste keyup", function () { jSlider.val($(this).val()); });
    jSlider.on("slide", function (event, values) { jLabel.val(values); });
}

var sliderSetup = {
    Setup: function () {
        const sliderSpot = $('#slider-spot');
        const sliderSpotLabel = $("#slider-spot-value");
        __sliderSetup(sliderSpot, sliderSpotLabel, 0.0, 1000.0, 100.0);

        const sliderStrike = $('#slider-strike');
        const sliderStrikeLabel = $("#slider-strike-value");
        __sliderSetup(sliderStrike, sliderStrikeLabel, 0.0, 1000.0, 100.0);

        const sliderInterestRate = $('#slider-interest-rate');
        const sliderInterestRateLabel = $("#slider-interest-rate-value");
        __sliderSetup(sliderInterestRate, sliderInterestRateLabel, -100, 100, -0.01);

        const sliderCarryRate = $('#slider-carry-rate');
        const sliderCarryRateLabel = $("#slider-carry-rate-value");
        __sliderSetup(sliderCarryRate, sliderCarryRateLabel, -100, 100, -0.01);

        const sliderVolatility = $('#slider-volatility');
        const sliderVolatilityLabel = $("#slider-volatility-value");
        __sliderSetup(sliderVolatility, sliderVolatilityLabel, 1e-4, 500, 30);

        const sliderDaysToExpiry = $('#slider-expiry');
        const sliderDaysToExpiryLabel = $("#slider-expiry-value");
        __sliderSetup(sliderDaysToExpiry, sliderDaysToExpiryLabel, 1e-4, 10000, 365);
    }
}


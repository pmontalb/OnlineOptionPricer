"use strict"

function __plotSetup(id, analytic) {
    var ctx = document.getElementById(id).getContext('2d');

    var chart = new Chart(ctx, {
        type: 'line',
        options: {
            elements: {
                line: {
                    tension: 0, // disables bezier curves
                },
                point: {
                    radius: 0
                }
            },
            animation: {
                duration: 0, // general animation time
            },
            hover: {
                animationDuration: 0, // duration of animations when hovering an item
            },
            responsiveAnimationDuration: 0, // animation duration after a resize
        }
    });
}

var plotSetup = {
    Setup: function() {
        __plotSetup("price-chart", "Price");
        __plotSetup("delta-chart", "Delta");
        __plotSetup("gamma-chart", "Gamma");
        __plotSetup("vega-chart", "Vega");
        __plotSetup("rho-chart", "Rho");
        __plotSetup("carry-rho-chart", "Carry Rho");
        __plotSetup("theta-chart", "Theta");
        __plotSetup("charm-chart", "Charm");
        __plotSetup("theta2-chart", "Theta 2");
    }
}
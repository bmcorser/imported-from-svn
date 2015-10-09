(function(){
    "use strict";

    // Require the classes for the app
    var CalculationModel = require("./CalculationModel.js"),
    CalculatorView = require("./CalculatorView.js"),
    CalculatorController = require("./CalculatorController.js"),
    httpUtils = require("./HttpUtils.js"),

    // Set up the model, view and controller
    calculation = new CalculationModel(),
    view = new CalculatorView(document.querySelector("body"), calculation),

    controller = new CalculatorController(calculation, view, httpUtils);

    // Initialise the controller and we're ready to go
    controller.initModel();
    controller.initView();
}());
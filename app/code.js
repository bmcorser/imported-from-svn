var CalculationModel = require("./js/CalculationModel.js"),
    CalculatorView = require("./js/CalculatorView.js"),
    calculation = new CalculationModel(),
    view = new CalculatorView(document.querySelector("body"), calculation);

// To comply with the way the old code functions, start with 0 in the history
calculation.addHistory(0);


function addFive () {
    calculation.addHistory(5);
    view.updateCalculation();
    view.updateResult();
}


function addTen () { 
    var completeCalc = calculation.addHistory(10, true);
    view.updateCalculation();
    view.updatePending();

    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", function(){
        completeCalc();
        view.updateResult();
        view.updatePending();
    });
    oReq.open("GET", "http://www.httpbin.org/delay/1", true);
    oReq.send();
}

view.registerButtons(addFive, addTen);
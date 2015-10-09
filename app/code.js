var CalculationModel = require("./js/CalculationModel.js"),
    CalculatorView = require("./js/CalculatorView.js"),
    calculation = new CalculationModel(),
    view = new CalculatorView(document.querySelector("body"), calculation),
    element2,
    btn;

// To comply with the way the old code functions, start with 0 in the history
calculation.addHistory(0);


function addFive () {
    calculation.addHistory(5);
    view.updateCalculation();
    view.updateResult();
}

function reqListener () {
   view.updateResult();
   element2.remove();
}

function addTen () { 
    calculation.addHistory(10);
    view.updateCalculation();
    element2 = document.createElement('div');
    element2.textContent = 'adding';
    document.querySelector('body').insertBefore(element2, document.querySelector('button'));

    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", "http://www.httpbin.org/delay/1", true);
    oReq.send();
}

view.registerButtons(addFive, addTen);
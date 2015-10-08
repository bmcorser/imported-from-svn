var CalculationModel = require("./js/CalculationModel.js"),
    CalculatorView = require("./js/CalculatorView.js"),
    // Make this model available to the whole scope for now, until we can pass
    // it in where it's specifically needed
    calculation = new CalculationModel(),
    view = new CalculatorView(),
    element = document.querySelector("#result"),
    element2,
    btn;

// To comply with the way the old code functions, start with 0 in the history
calculation.addHistory(0);


function addFive () {
    calculation.addHistory(5);
    addhistory(5);
    element.textContent = calculation.getResult();
}

function addhistory (Added) {
    document.querySelector('#calculation').textContent = calculation.getHistory().join(" + ");
}

function reqListener () {
   element.textContent = calculation.getResult();
   element2.remove();
}

function addTen () { 
    calculation.addHistory(10);
    addhistory(10);
    element2 = document.createElement('div');
    element2.textContent = 'adding';
    document.querySelector('body').insertBefore(element2, document.querySelector('button'));

    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", "http://www.httpbin.org/delay/1", true);
    oReq.send();
}

setTimeout(function () {
    document.querySelector('button').onclick = function () {
        addFive();
    };
}, 200);

// Temporary code to hook up the addTen function to its button so we can test it,
// now that addTen is no longer in the global scope.
// In time this will be done in a more sensible way.
btn = document.querySelector("#addTenBtn");
if(btn){   
    btn.addEventListener("click", addTen, false);
}
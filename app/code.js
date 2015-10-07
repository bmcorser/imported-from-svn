var CalculationModel = require("./js/CalculationModel.js"),
    // Make this model available to the whole scope for now, until we can pass
    // it in where it's specifically needed
    calculation = new CalculationModel(),
    element = document.createElement('div'),
    element2,
    btn;

// To comply with the way the old code functions, start with 0 in the history
calculation.addHistory(0);

setTimeout(function(){
  document.querySelector('body').insertBefore(element, document.querySelector('button'));
  element.textContent = 0;
}, 200);

function addFive () {
    calculation.addHistory(5);
    addhistory(5);
    element.textContent = calculation.getResult();
}

function addhistory (Added) {
    document.querySelector('span:last-child').appendChild(
        document.createElement('span')
    );
    document.querySelector('span:last-child').textContent = calculation.getHistory().join("+");
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

element = document.createElement('div');

setTimeout(function(){
    document.querySelector('body').insertBefore(element, document.querySelector('button'));
}, 500);

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
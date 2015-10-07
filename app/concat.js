(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var CalculationModel = require("./js/CalculationModel.js"),
    // Make this model available to the whole scope for now, until we can pass
    // it in where it's specifically needed
    calculation = new CalculationModel(),
    element = document.createElement('div'),
    element2,
    btn;

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
},{"./js/CalculationModel.js":2}],2:[function(require,module,exports){
(function(){
    "use strict";

    /**
     * A simple model for the calculation being performed.
     */
    function CalculationModel(){
        var history = [];

        return {
            /**
             * Returns the array of numbers that have been added so far.
             * Exposing getHistory as a function means the array can be modified
             * outside of this class but not completely replaced.
             * @return {Number[]} The array of numbers added so far
             */
            getHistory: function(){
                return history;
            },

            /**
             * Adds an element to the history array, with some extra error conditions.
             * @param {Number} number The number to add to the history.
             */
            addHistory: function(number){
                if((typeof number === "number") && isFinite(number)){
                    history.push(number);
                }else{
                    throw new TypeError("Only numbers can be added to the history.");
                }
            },

            /**
             * Returns the result of the calculation, which is the sum of the
             * numbers inside the history array.
             * @return {Number} The calculation's result.
             */
            getResult: function(){
                // Use the built-in array.reduce to add all numbers.
                return history.reduce(function(sum, value){
                    return sum + value;
                }, 0);
            }
        };
    }

    module.exports = CalculationModel;
}());
},{}]},{},[2,1]);

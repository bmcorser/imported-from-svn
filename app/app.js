(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function(){
    "use strict";

    /**
     * A simple model for the calculation being performed.
     */
    function CalculationModel(){
        var history = [],
            // A queue to keep track of whether any additions are still pending
            pendingAdditions = [],
            // Must keep track of the result separately, as sometimes an item in the history array will be pending.
            total = 0,
            /**
             * Function for removing an item from the pending additions array and adding its value to the total
             * @param  {Object} token The object to remove from pendingAdditions
             */
            removePending = function(token){
                var index = pendingAdditions.indexOf(token);
                if(index >= 0){
                    pendingAdditions.splice(index, 1);
                }else{
                    // This should never happen
                    throw new Error("The token { value: " + token.value + " } has already been removed from the pending queue.");
                }
                total += token.value;
            };

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
             * Adds an element to the history array and updates the result.
             * @param {Number} number The number to add to the history.
             * @param {Boolean} [delay] True if the calculation is to be delayed.
             * @return {Function|undefined} If `delay` is specified, the return value is a function which, when called, signals the end of the delay,
             *                              at which point `number` will be added to the result value.
             */
            addHistory: function(number, delay){
                var token;

                if((typeof number === "number") && isFinite(number)){
                    history.push(number);
                }else{
                    throw new TypeError("Only numbers can be added to the history.");
                }

                // The user may wish to delay the addition of the value,
                // so use a token in a queue to keep track of what is still pending.
                if(delay){
                    token = { value: number };
                    pendingAdditions.push(token);

                    // Return the removal function
                    return removePending.bind(null, token);
                }else{
                    // If there's no delay, update the total immediately.
                    total += number;
                }
            },

            /**
             * Returns the result of the calculation, which is the sum of the
             * numbers inside the history array excluding those that are pending.
             * @return {Number} The calculation's result.
             */
            getResult: function(){
                return total;
            },

            /**
             * Signals whether any delayed additions are currently pending/
             * @return {Boolean} true if there are any additions still pending, else false.
             */
            isPending: function(){
                return pendingAdditions.length > 0;
            }
        };
    }

    module.exports = CalculationModel;
}());
},{}],2:[function(require,module,exports){
(function(){
    "use strict";

    /**
     * Controller class for the calculator
     * @param {CalculationModel} model       The model for the calculator
     * @param {CalculatorView}   view        The view for the calculator
     * @param {Object}           httpUtils   The httpUtils class
     */
    function CalculatorController(model, view, httpUtils){
        return {
            /**
             * Adds five to the calculation and updates the result.
             */
            addFive: function (){
                model.addHistory(5);
                view.updateCalculation();
                view.updateResult();
            },
            /**
             * Adds ten to the calculation, but waits for a 1 second http
             * request before updating the result.
             */
            addTen: function (){ 
                var completeCalc = model.addHistory(10, true);
                
                view.updateCalculation();
                view.updatePending();

                httpUtils.delay(function(){
                    completeCalc();
                    view.updateResult();
                    view.updatePending();
                });
            },
            /**
             * Initialises the model
             */
            initModel: function(){
                // To comply with the way the old code functions, start with 0 in the history
                model.addHistory(0);
            },
            /**
             * Initialises the view
             */
            initView: function(){
                view.registerButtons(this.addFive, this.addTen);
            }
        };
    }

    module.exports = CalculatorController;
}());
},{}],3:[function(require,module,exports){
(function(){
    "use strict";

    /**
     * A class for handling interactions with the HTML view
     * @param {HTMLBodyElement} body  The document's body element
     * @param {CalculationModel} model The model holding the calculation data
     */
    function CalculatorView(body, model){
        var resultEl = body.querySelector("#result"),
            calculationEl = body.querySelector("#calculation"),
            addFiveButton = body.querySelector("#addFiveBtn"),
            addTenButton = body.querySelector("#addTenBtn"),
            pendingMsg = body.querySelector("#pendingMsg");

        return {
            /**
             * Updates the calculation element with the current list of calculations
             */
            updateCalculation: function(){
                calculationEl.textContent = model.getHistory().join(" + ");
            },

            /**
             * Updates the result element with the current calculation result.
             */
            updateResult: function(){
                resultEl.textContent = model.getResult();
            },

            /**
             * Updates the visibility of the "adding" message element
             */
            updatePending: function(){
                var pendingCls = pendingMsg.getAttribute("class") || "",
                    hiddenClsIdx;

                // Get the list of classes on the element
                pendingCls = pendingCls.length > 0 ? pendingCls.split(" ") : [];
                hiddenClsIdx = pendingCls.indexOf("hidden");

                // If the model is pending and the element is hidden
                // or if the model is not pending and the element is visible
                // we need to change the class
                if(model.isPending() === (hiddenClsIdx >= 0)){
                    if(model.isPending()){
                        // Show the message by removing the hidden class
                        pendingCls.splice(hiddenClsIdx, 1);
                    }else{
                        // Hide the element
                        pendingCls.push("hidden");
                    }

                    // Turn the array back into a string
                    pendingCls = pendingCls.join(" ");
                    pendingMsg.setAttribute("class", pendingCls);
                }
            },

            /**
             * Sets up the functions for the buttons' click handlers
             * @param  {Function} addFiveFn The function to be run when the Add Five button is clicked
             * @param  {Function} addTenFn  The function to be run when the Add Ten button is clicked
             */
            registerButtons: function(addFiveFn, addTenFn){
                addFiveButton.addEventListener("click", addFiveFn, false);
                addTenButton.addEventListener("click", addTenFn, false);
            }
        };
    }

    module.exports = CalculatorView;
}());
},{}],4:[function(require,module,exports){
(function(){
    "use strict";

    /**
     * A utility class that creates a delay by making an HTTP request.
     */
    var HttpUtils = {
        delay: function(callback){
            var oReq = new XMLHttpRequest();
            
            oReq.addEventListener("load", callback);
            oReq.open("GET", "http://www.httpbin.org/delay/1", true);
            oReq.send();
        }
    };

    module.exports = HttpUtils;
}());
},{}],5:[function(require,module,exports){
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
},{"./CalculationModel.js":1,"./CalculatorController.js":2,"./CalculatorView.js":3,"./HttpUtils.js":4}]},{},[1,2,3,4,5]);

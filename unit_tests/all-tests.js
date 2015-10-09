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
describe("CalculationModel", function(){
    var CalculationModel = require("../../dev/js/CalculationModel.js");

    it("has an array of calculation history that can be added to", function(){
        var model = new CalculationModel();

        // History should start blank
        expect(model.getHistory()).toEqual([]);

        // Each add history call should add a new item to the array
        model.addHistory(5);
        expect(model.getHistory()).toEqual([5]);

        model.addHistory(10);
        expect(model.getHistory()).toEqual([5, 10]);
    });

    it("should only allow finite numbers to be added to the array", function(){
        var model = new CalculationModel();

        expect(function(){
            model.addHistory("five");
        }).toThrow();

        expect(function(){
            model.addHistory(NaN);
        }).toThrow();

        expect(function(){
            model.addHistory(Infinity);
        }).toThrow();
    });

    it("has a function to return the total of the calculation", function(){
        var model = new CalculationModel();

        // Result should start at 0
        expect(model.getResult()).toEqual(0);

        // Each add history call should increase the result by the passed value
        model.addHistory(5);
        expect(model.getResult()).toEqual(5);

        model.addHistory(10);
        expect(model.getResult()).toEqual(15);
    });

    it("can delay the calculation of a value added to the history, and signals whether any calculations are currently pending", function(){
        var model = new CalculationModel(),
            resolve1,
            resolve2;

        // Pre-check: pending flag should be false
        expect(model.isPending()).toBe(false);

        // Create a couple of delayed calculation
        resolve1 = model.addHistory(10, true);
        resolve2 = model.addHistory(10, true);

        // Should get functions as return values
        expect(resolve1).toEqual(jasmine.any(Function));
        expect(resolve2).toEqual(jasmine.any(Function));

        // Values should be in the history but no calculation should be made yet
        // and the pending flag should be on
        expect(model.getHistory()).toEqual([10, 10]);
        expect(model.getResult()).toBe(0);
        expect(model.isPending()).toBe(true);

        // Resolve first addition, check result and flag
        resolve1();
        expect(model.getResult()).toBe(10);
        expect(model.isPending()).toBe(true);

        // Resolve second addition, flag should be cleared
        resolve2();
        expect(model.getResult()).toBe(20);
        expect(model.isPending()).toBe(false);
    });
});
},{"../../dev/js/CalculationModel.js":1}],5:[function(require,module,exports){
describe("CalculatorController", function(){
    var CalculatorController = require("../../dev/js/CalculatorController.js");

    it("has a function that adds five to the calculation", function(){
        var model = jasmine.createSpyObj("model", ["addHistory"]),
            view = jasmine.createSpyObj("view", ["updateCalculation", "updateResult"]),
            controller = new CalculatorController(model, view, {});

        controller.addFive();

        expect(model.addHistory).toHaveBeenCalledWith(5);
        expect(view.updateResult).toHaveBeenCalled();
        expect(view.updateCalculation).toHaveBeenCalled();
    });

    it("has a function that adds ten to the calculation and pauses before the result", function(){
        var model = jasmine.createSpyObj("model", ["addHistory"]),
            view = jasmine.createSpyObj("view", ["updateCalculation", "updateResult", "updatePending"]),
            httpUtils = jasmine.createSpyObj("httpUtils", ["delay"]),
            controller = new CalculatorController(model, view, httpUtils),
            addHistoryCallback = jasmine.createSpy();

        model.addHistory.and.returnValue(addHistoryCallback);

        controller.addTen();

        expect(model.addHistory).toHaveBeenCalledWith(10, true);
        expect(addHistoryCallback).not.toHaveBeenCalled();

        expect(view.updateCalculation).toHaveBeenCalled();
        expect(view.updatePending).toHaveBeenCalled();
        expect(view.updateResult).not.toHaveBeenCalled();

        expect(httpUtils.delay).toHaveBeenCalledWith(jasmine.any(Function));

        // Call the function passed to httpUtils.delay() to simulate the http request's completion
        httpUtils.delay.calls.argsFor(0)[0]();

        expect(view.updateResult).toHaveBeenCalled();
        expect(view.updatePending.calls.count()).toBe(2);
        expect(addHistoryCallback).toHaveBeenCalled();
    });

    it("initialises the model by adding 0 to the history", function(){
        var model = jasmine.createSpyObj("model", ["addHistory"]),
            controller = new CalculatorController(model, {}, {});

        controller.initModel();

        expect(model.addHistory).toHaveBeenCalledWith(0);
    });

    it("initialises the view by setting up the event handlers", function(){
        var view = jasmine.createSpyObj("view", ["registerButtons"]),
            controller = new CalculatorController({}, view, {});

        controller.initView();

        expect(view.registerButtons).toHaveBeenCalledWith(controller.addFive, controller.addTen);
    });
});
},{"../../dev/js/CalculatorController.js":2}],6:[function(require,module,exports){
describe("CalculatorView", function(){
    var CalculatorView = require("../../dev/js/CalculatorView.js");

    it("can update the calculation element with the current calculation list", function(){
        var mockModel = {},
            mockBody = document.createElement("body"),
            mockCalcDiv = document.createElement("div"),
            view;

        // Set the data in the fake model
        mockModel.getHistory = function(){ return [0, 5, 10, 10]; };

        // Set up the fake DOM
        mockCalcDiv.setAttribute("id", "calculation");
        mockBody.appendChild(mockCalcDiv);

        // Create the view with the mock values
        view = new CalculatorView(mockBody, mockModel);

        // Test
        view.updateCalculation();

        // Result
        expect(mockCalcDiv.innerText).toEqual("0 + 5 + 10 + 10");
    });

    it("can update the result element with the result of the calculation", function(){
        var mockModel = {},
            mockBody = document.createElement("body"),
            mockResultDiv = document.createElement("div"),
            view;

        // Set the data in the fake model
        mockModel.getResult = function(){ return 25; };

        // Set up the fake DOM
        mockResultDiv.setAttribute("id", "result");
        mockBody.appendChild(mockResultDiv);

        // Create the view with the mock values
        view = new CalculatorView(mockBody, mockModel);

        // Test
        view.updateResult();

        // Result
        expect(mockResultDiv.innerText).toEqual("25");
    });

    it("can update the visibility of the \"adding\" div", function(){
        var mockModel = {
                pending: false,
                isPending: function(){ return this.pending; }
            },
            mockBody = document.createElement("body"),
            mockPendingDiv = document.createElement("div"),
            view;

            // Set up the fake DOM
            mockPendingDiv.setAttribute("id", "pendingMsg");
            mockBody.appendChild(mockPendingDiv);

            // Create the view
            view = new CalculatorView(mockBody, mockModel);

            // Pending: false should mean the hidden class is added
            view.updatePending();
            expect(mockPendingDiv.getAttribute("class")).toBe("hidden");

            // Should be no change if called again
            view.updatePending();
            expect(mockPendingDiv.getAttribute("class")).toBe("hidden");

            // Div should become visible when pending
            mockModel.pending = true;

            view.updatePending();
            expect(mockPendingDiv.getAttribute("class")).toBe("");

            // Should be no change if called again
            view.updatePending();
            expect(mockPendingDiv.getAttribute("class")).toBe("");
    });

    it("registers functions on the buttons' click event handlers", function(){
        var mockBody = document.createElement("body"),
            mockFiveBtn = document.createElement("button"),
            mockTenBtn = document.createElement("button"),
            // Create spies to act as the event handler functions
            addFive = jasmine.createSpy("Add Five"),
            addTen = jasmine.createSpy("Add Ten"),
            view;

        // Set up the fake DOM
        mockFiveBtn.setAttribute("id", "addFiveBtn");
        mockTenBtn.setAttribute("id", "addTenBtn");
        mockBody.appendChild(mockFiveBtn);
        mockBody.appendChild(mockTenBtn);

        // Create the view with the mock values
        view = new CalculatorView(mockBody, {});

        // Test
        view.registerButtons(addFive, addTen);
        mockFiveBtn.click();
        mockTenBtn.click();

        // Result
        expect(addFive).toHaveBeenCalled();
        expect(addTen).toHaveBeenCalled();
    });
});
},{"../../dev/js/CalculatorView.js":3}]},{},[4,5,6]);

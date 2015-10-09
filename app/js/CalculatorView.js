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
            addTenButton = body.querySelector("#addTenBtn");

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
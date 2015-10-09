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
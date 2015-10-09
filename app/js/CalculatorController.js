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
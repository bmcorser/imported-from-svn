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
                return Math.sum(history);
            }
        };
    }

    module.exports = CalculationModel;
}());
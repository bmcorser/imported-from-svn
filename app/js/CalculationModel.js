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
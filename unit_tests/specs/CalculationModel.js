describe("CalculationModel", function(){
    var CalculationModel = require("../../app/js/CalculationModel.js");

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
});
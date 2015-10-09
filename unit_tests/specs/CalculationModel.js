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
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
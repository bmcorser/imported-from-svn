describe("CalculatorView", function(){
    var CalculatorView = require("../../app/js/CalculatorView.js");

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
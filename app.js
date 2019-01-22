/*=======BUDGET CONTROLLER========*/

var budgetController = (function (){
	
})();

/*=========================*/

/*=======UI CONTROLLER=========*/

var UIController = (function() {
	//Some code here
	var DOMstrings = {
		inputType: '.add__type',
		inputDesc: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn'

	};
	return {
		getInput: function(){
			return {
				type: document.querySelector(DOMstrings.inputType).value, //Will be either inc or exp
				desc: document.querySelector(DOMstrings.inputDesc).value,
				value: document.querySelector(DOMstrings.inputValue).value
			}
		},

		getDOMstrings: function(){
			return DOMstrings;
		}
	};
})();

/*=========================*/

/*=======GLOBAL APP CONTROLLER=========*/

var controller = (function(budgetCtrl, UICtrl) {
	//Some code here

	var DOM = UICtrl.getDOMstrings();
	//Controler Add Item funciton
	var ctrlAddItem = function(){
		//TO DO LIST
		//1. Get values from input field
		var input = UICtrl.getInput();
		console.log(input);
		//2. Add item to the budget controller

		//3. Add item to UI

		//4. Calculate the budget

		//5. Display the budget on the UI
		
	}

	document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);


	document.addEventListener('keypress', function(event) {
		if (event.keyCode === 13 || event.which === 13){
			//console.log('Enter is pressed!');
			ctrlAddItem();
		}
	});

})(budgetController, UIController);

/*=========================*/
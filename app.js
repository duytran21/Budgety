/*=======BUDGET CONTROLLER========*/

var budgetController = (function (){
	//Some code here
	//this is function constructor. Capitol 1st letter to distinguish with other regular funciton
	var Expense = function(id, description, value){
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var Income = function(id, description, value){
		this.id = id;
		this.description = description;
		this.value = value;
	};

	//Create arrays to store all incomes and all expenses 

	/*var allExpenses = [];
	var allIncomes = [];
	var totalExpenses = 0;*/

	//Better way is creating a data structure to store data

	var data = {
		allItems: {
			exp: [],
			inc: []
		},
		total: {
			exp: 0,
			inc: 0
		}
	};

	return {
		addItem: function(type, desc, val){
			var newItem, ID;
			//Creat new ID
			if (data.allItems[type].length > 0){
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
			} else {
				ID = 0;
			}
			if (type === 'exp'){
				newItem = new Expense(ID, desc, val)
			}else if (type === 'inc'){
				newItem = new Income(ID, desc, val);
			}

			data.allItems[type].push(newItem);

			return newItem;
		}, 
		testing: function(){
			return data;
		}
	};

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
	var setupEventListener = function(){
		
		var DOM = UICtrl.getDOMstrings();

		document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

		document.addEventListener('keypress', function(event) {
			if (event.keyCode === 13 || event.which === 13){
				//console.log('Enter is pressed!');
				ctrlAddItem();
			}
		});
	};
	
	//Controler Add Item funciton
	var ctrlAddItem = function(){
		var input, newItem;
		//TO DO LIST
		//1. Get values from input field
		input = UICtrl.getInput();
		//console.log(input);
		//2. Add item to the budget controller
		newItem = budgetCtrl.addItem(input.type, input.desc, input.value);
		//3. Add item to UI

		//4. Calculate the budget

		//5. Display the budget on the UI
		
	};

	return {
		init: function(){
			console.log("Application has started!");
			setupEventListener();
		}
	}

})(budgetController, UIController);

/*=========================*/

controller.init();
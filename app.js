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
		totals: {
			exp: 0,
			inc: 0
		},
		budget: 0,
		percentage: -1 // is usually set to non existence value
	};

	var calculateTotal = function(type){
		var sum = 0;

		data.allItems[type].forEach(function(current){
			sum += current.value;
		});

		data.totals[type] = sum;
	}

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

		calculateBudget: function(){
			// 1. Calculate total income and expense
			calculateTotal('exp');
			calculateTotal('inc');
			// 2. Calculate the budget: income - expenses
			data.budget = data.totals.inc - data.totals.exp;
			// 3. Calculate the percentage of income that we spent
			if (data.totals.inc > 0){
				data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
			} else {
				data.percentage = -1;
			}
		},

		getBudget: function(){
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage
			}
		},

		deleteBudget: function(type, id){
			var ids, index;
			// id = 6
			// data.allItems[type][id];
			// [1 2 4 6 8]
			// index = 3

			ids = data.allItems[type].map(function(current){ //map will return brand new array
				return current.id; // will return [1 2 4 6 8] this is an example for tutor to show us how to use map. It's not necessary here
			});

			index = ids.indexOf(id);

			if (index !== -1){
				data.allItems[type].splice(index, 1); // [1 2 4 - 8];
			}

		},


		testing: function(){
			console.log(data);
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
		inputBtn: '.add__btn',
		incomeContainer: '.income__list',
		expensesContainer: '.expenses__list',
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expensesLabel: '.budget__expenses--value',
		percentageLabel: '.budget__expenses--percentage',
		container: '.container'

	};
	return {
		getInput: function(){
			return {
				type: document.querySelector(DOMstrings.inputType).value, //Will be either inc or exp
				desc: document.querySelector(DOMstrings.inputDesc).value,
				value: parseFloat(document.querySelector(DOMstrings.inputValue).value) //Parse will convert string to number
			}
		},

		addListItem: function(obj, type){
			var html, newHtml, element;
			// Create HTML string with placeholder text
			if (type === 'inc'){
				element = DOMstrings.incomeContainer;
				html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
			} else if (type === 'exp'){
				element = DOMstrings.expensesContainer;
				html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
			}

			// Replace the placeholder text with some actual data
			newHtml = html.replace("%id%", obj.id);
			newHtml = newHtml.replace("%description%", obj.description);
			newHtml = newHtml.replace("%value%", obj.value);

			// Insert the HTML into the DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
		},

		clearField: function(){
			var fields, fieldsArr;

			fields = document.querySelectorAll(DOMstrings.inputDesc + ', ' + DOMstrings.inputValue);

			// This trick used to convert List to Array 
			fieldsArr = Array.prototype.slice.call(fields);

			fieldsArr.forEach(function(current, index, array){
				current.value = "";
			});

			fieldsArr[0].focus();

		},

		displayBudget: function(obj){
			if(obj.budget > 0){
				document.querySelector(DOMstrings.budgetLabel).textContent = '+ ' + obj.budget;
			} else {
				document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
			}
			document.querySelector(DOMstrings.incomeLabel).textContent = '+ ' + obj.totalInc;
			document.querySelector(DOMstrings.expensesLabel).textContent = '- ' + obj.totalExp;
			if(obj.percentage > 0){
				document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
			} else{
				document.querySelector(DOMstrings.percentageLabel).textContent = '---';
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

		// Using Event Delegation for this case
		document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

	};

	var updateBudget = function(){

		// 1. Calculate the budget
		budgetCtrl.calculateBudget();

		// 2. Return the budget
		var budget = budgetCtrl.getBudget();

		// 3. Display the budget on the UI
		//console.log(budget);
		UICtrl.displayBudget(budget);

	}
	
	//Controler Add Item funciton
	var ctrlAddItem = function(){
		var input, newItem;
		//TO DO LIST
		//1. Get values from input field
		input = UICtrl.getInput();
		//console.log(input);

		if (input.description !== "" && !isNaN(input.value) && input.value > 0 ){
			//2. Add item to the budget controller
			newItem = budgetCtrl.addItem(input.type, input.desc, input.value);
			//3. Add item to UI
			UICtrl.addListItem(newItem, input.type);
			//4. Clear the fields
			UICtrl.clearField();
			//5. Calculate and Update budget
			updateBudget();
		}
		
	};

	var ctrlDeleteItem = function(event){
		//console.log(event.target);
		var itemID, splitID, type, ID;

		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

		if (itemID) {
			splitID = itemID.split('-');
			type = splitID[0];
			ID = parseInt(splitID[1]);

			// 1. Delete the item from datastruture.
			budgetCtrl.deleteBudget(type, ID);

			// 2. Delete the item from the UI.


			// 3. Update and show the new budget.
		}
	}

	return {
		init: function(){
			console.log("Application has started!");
			UICtrl.displayBudget({
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentage: -1
			});
			setupEventListener();
		}
	}

})(budgetController, UIController);

/*=========================*/

controller.init();
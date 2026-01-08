// --- GLOBAL VARIABLES ---
let firstOperand = '';
let secondOperand = '';
let currentOperator = null;
let result = '';

// --- MATH FUNCTIONS ---
function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

/**
 * Takes an operator and two strings, converts them to numbers,
 * and calls the relevant math function.
 */
function operate(operator, rawNum1, rawNum2) {
    const a = Number(rawNum1);
    const b = Number(rawNum2);

    switch (operator) {
        case '+':
            return add(a, b);
        case '-':
            return subtract(a, b);
        case '*':
            return multiply(a, b);
        case '/':
            if (b === 0) return null; 
            return divide(a, b);
        default:
            return null;
    }
}

// --- UI INTERACTIONS ---

const display = document.querySelector('.display');
const buttons = document.querySelectorAll('button');

function populateDisplay(value) {
    display.textContent = value;
}

buttons.forEach(button => {
    button.addEventListener('click', () => {
        if (button.classList.contains('digit')) {
            if (currentOperator === null) {
                firstOperand += button.textContent;
                populateDisplay(firstOperand);
            } else {
                secondOperand += button.textContent;
                populateDisplay(firstOperand + currentOperator + secondOperand);
            }
        }
        else if (button.classList.contains('operator')) {
            if (firstOperand === '') return; 
            
            if (secondOperand !== '') {
                result = operate(currentOperator, firstOperand, secondOperand);
                firstOperand = result.toString();
                secondOperand = '';
            }
            currentOperator = button.textContent;
            populateDisplay(firstOperand + currentOperator);
        }
        else if (button.classList.contains('equals')) {
            if (firstOperand === '' || secondOperand === '' || currentOperator === null) return;
            result = operate(currentOperator, firstOperand, secondOperand);
            populateDisplay(result);
            firstOperand = result.toString();
            secondOperand = '';
            currentOperator = null;
        }
        else if (button.classList.contains('clear-all')) {
            firstOperand = '';
            secondOperand = '';
            currentOperator = null;
            result = '';
            populateDisplay('0');
        }
    }); 
}); 
// --- GLOBAL VARIABLES ---
// State variables to track the current calculation flow
let firstOperand = '';
let secondOperand = '';
let currentOperator = null;
let result = '';
let shouldResetScreen = false;

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
            if (b === 0) return null;  // Guard against division by zero
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

        // --- DIGIT INPUT ---
        if (button.classList.contains('digit')) {
            // Append digit to the correct operand based on whether an operator is currently active
            if (currentOperator === null) {
                firstOperand += button.textContent;
                populateDisplay(firstOperand);
            } else {
                secondOperand += button.textContent;
                populateDisplay(firstOperand + currentOperator + secondOperand);
            }
        }

        // --- OPERATOR INPUT ---
        else if (button.classList.contains('operator')) {
            // Edge Case: Handle unary minus for negative starting numbers (e.g., "-5")
            if (button.textContent === '-' && firstOperand === '') {
            firstOperand = '-';
                populateDisplay(firstOperand);
                return;
            }

            // Guard: Prevent operator selection if no number is entered yet
            if (firstOperand === '') return; 
            
            // Chained Operations: If expression is full (a + b), calculate immediately before adding new operator
            if (secondOperand !== '') {
                result = operate(currentOperator, firstOperand, secondOperand);

                // Error Handling: Check if division by zero occurred (operate returns null)
                if (result === null) {
                    populateDisplay("Don't divide by 0!");
                    firstOperand = '';
                    secondOperand = '';
                    currentOperator = null;
                    return;
                }

                firstOperand = result.toString(); // Move result to first position
                secondOperand = ''; // Reset second position
            }

            // Set new operator and update view
            currentOperator = button.textContent;
            populateDisplay(firstOperand + currentOperator);
        }

        // --- EQUALS INPUT ---
        else if (button.classList.contains('equals')) {
            if (firstOperand === '' || secondOperand === '' || currentOperator === null) return;
            result = operate(currentOperator, firstOperand, secondOperand);

            // Error Handling: Catch division by zero before updating state
            if (result === null) {
                populateDisplay("Nice try!");
                firstOperand = '';
                secondOperand = '';
                currentOperator = null;
                return;
            }

            populateDisplay(result);
            firstOperand = result.toString();
            secondOperand = '';
            currentOperator = null;
        }

        // --- CLEAR INPUT ---
        else if (button.classList.contains('clear-all')) {
            firstOperand = '';
            secondOperand = '';
            currentOperator = null;
            result = '';
            populateDisplay('0');
        }
    }); 
}); 
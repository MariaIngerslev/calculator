// --- GLOBAL VARIABLES ---
// State variables to track the current calculation flow
let firstOperand = '';
let secondOperand = '';
let currentOperator = null;
let result = '';
let shouldResetScreen = false;

// --- DOM ELEMENTS ---
const display = document.querySelector('.display');
const buttons = document.querySelectorAll('button');

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

function roundResult(number) {
    return Math.round(number * 1000) / 1000;
} 

// --- UI & STATE UPDATES ---
function populateDisplay(value) {
    display.textContent = value;
}

/**
 * Resets all state variables and clears the display.
 */
function resetCalculator() {
    firstOperand = '';
    secondOperand = '';
    currentOperator = null;
    result = '';
    shouldResetScreen = false;
    populateDisplay('0');
}

// --- HANDLER FUNCTIONS ---

function handleNumber(numStr) {
    // Check state flag: Do we need to clear the old result?
    if (shouldResetScreen === true) {
        resetCalculator();
        shouldResetScreen = false;
    }
    
    // Guard: Prevent input overflow (max 9 digits per operand)
    if (currentOperator === null && firstOperand.length >= 9) return;
    if (currentOperator !== null && secondOperand.length >= 9) return;

    // Append digit to the correct operand based on whether an operator is currently active
    if (currentOperator === null) {
        firstOperand += numStr;
        populateDisplay(firstOperand);
    } else {
        secondOperand += numStr;
        populateDisplay(firstOperand + " " + currentOperator + " " + secondOperand);
    }
}

function handleOperator(opStr) {
    shouldResetScreen = false;

    // Edge Case: Negative Number Input
    if (opStr === '-' && firstOperand === '') {
        firstOperand = '-';
        populateDisplay(firstOperand);
        return;
    }

    // Guard: Prevent operator selection if no number is entered yet
    if (firstOperand === '') return; 
    
    // Chained Operations: If expression is full (a + b), calculate immediately before adding new operator
    if (secondOperand !== '') {
        const tempResult = operate(currentOperator, firstOperand, secondOperand);
        // Error Handling: Check if division by zero occurred (operate returns null)
        if (tempResult === null) {
            populateDisplay("Don't divide by 0!");
            resetCalculator();
            return;
        }

        result = roundResult(tempResult);
        firstOperand = result.toString(); // Move result to first position
        secondOperand = ''; // Reset second position
    }

    // Set new operator and update view
    currentOperator = opStr;
    populateDisplay(firstOperand + " " + currentOperator);
}

function handleDecimal() {
    if (shouldResetScreen === true) {
        resetCalculator();
        firstOperand = '0.';
        populateDisplay(firstOperand);
        return;
    }

    if (currentOperator === null) {
        // Logic for first operand
        if (firstOperand.includes('.')) return; // Guard
        firstOperand = firstOperand === '' ? '0.' : firstOperand + '.';
        populateDisplay(firstOperand);
    } else {
        // Logic for second operand
        if (secondOperand.includes('.')) return; // Guard
        secondOperand = secondOperand === '' ? '0.' : secondOperand + '.';
        populateDisplay(firstOperand + " " + currentOperator + " " + secondOperand);
    }
}

function handleEquals() {
    if (firstOperand === '' || secondOperand === '' || currentOperator === null) return;
    
    const tempResult = operate(currentOperator, firstOperand, secondOperand);

    // Error Handling: Catch division by zero before updating state
    if (tempResult === null) {
        populateDisplay("Nice try!");
        resetCalculator();
        return;
    }

    result = roundResult(tempResult);
    populateDisplay(result);
    
    firstOperand = result.toString();
    secondOperand = '';
    currentOperator = null;

    shouldResetScreen = true; // Flag to reset on next digit input
}

// --- MAIN EVENT LISTENERS ---
buttons.forEach(button => {
    button.addEventListener('click', () => {

        // --- DIGIT INPUT ---
        if (button.classList.contains('digit')) {
            handleNumber(button.textContent);
        }

        // --- OPERATOR INPUT ---
        else if (button.classList.contains('operator')) {
            handleOperator(button.textContent);
            }

        // ... DECIMAL INPUT ...
        else if (button.classList.contains('decimal')) {
             handleDecimal();
        }

        // --- EQUALS INPUT ---
        else if (button.classList.contains('equals')) {
            handleEquals();
        }

        // --- CLEAR INPUT ---
        else if (button.classList.contains('clear-all')) {
            resetCalculator()
        }
    }); 
}); 
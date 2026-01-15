// --- GLOBAL VARIABLES ---
// State variables to track the current calculation flow
let firstOperand = '';
let secondOperand = '';
let currentOperator = null;
let result = '';
let shouldResetScreen = false;
const MAX_DIGITS = 7;

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
/**
 * Formats the result to fit the display.
 * Uses scientific notation for large numbers to prevent overflow.
 */
function formatResult(number) {
    // Guard clause: Handle invalid math operations (like division by zero)
    if (number === null) return null;

    const stringValue = number.toString();

    // Check if the number exceeds the display limit
    if (stringValue.length > MAX_DIGITS) {
        return number.toExponential(2); 
    }
    
    // Default: Round to 3 decimal places for readability
    return Math.round(number * 1000) / 1000;
}

// --- UI & STATE UPDATES ---

/**
 * Updates the DOM display element.
 * Acts as a single source of truth for UI rendering to prevent layout breakage.
 */
function updateDisplay(text) {
    const textStr = text.toString();
    
    // Safety Net: Hard truncate if text exceeds visual container limit (12 chars)
    // This handles edge cases like long negative numbers or decimals
    if (textStr.length > 8) {
        display.textContent = textStr.substring(0, 8);
    } else {
        display.textContent = textStr;
    }
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
    updateDisplay('0');
}

// --- HANDLER FUNCTIONS ---
function handleNumber(numStr) {
    // Check state flag: Do we need to clear the old result?
    if (shouldResetScreen === true) {
        resetCalculator();
        shouldResetScreen = false;
    }
    
    // LOGIC: Update operands individually to emulate standard calculator behavior

    if (currentOperator === null) {
        // Input Validation: Enforce character limit for the first operand
        if (firstOperand.length >= MAX_DIGITS) return;

        // Logic for First Operand
        firstOperand += numStr;
        updateDisplay(firstOperand); // Only show the number being typed
    } else {
        // Input Validation: Enforce character limit for the second operand
        if (secondOperand.length >= MAX_DIGITS) return;
        
        // Logic for Second Operand
        secondOperand += numStr;
        updateDisplay(secondOperand); // Visually overwrite display with second operand
    }
}

function handleOperator(opStr) {
    shouldResetScreen = false;

    // Edge Case: Negative Number Input
    if (opStr === '-' && firstOperand === '') {
        firstOperand = '-';
        updateDisplay(firstOperand);
        return;
    }

    // Guard: Prevent operator selection if no number is entered yet
    if (firstOperand === '') return; 
    
    // Chained Operations: If expression is full (a + b), calculate immediately before adding new operator
    if (secondOperand !== '') {
        const tempResult = operate(currentOperator, firstOperand, secondOperand);
        // Error Handling: Check if division by zero occurred (operate returns null)
        if (tempResult === null) {
            updateDisplay("Don't divide by 0!");
            resetCalculator();
            return;
        }

        result = formatResult(tempResult);
        firstOperand = result.toString(); // Move result to first position
        secondOperand = ''; // Reset second position
    }

    // Set new operator and update view
    currentOperator = opStr;
    updateDisplay(firstOperand + " " + currentOperator);
}

function handleDecimal() {
    if (shouldResetScreen === true) {
        resetCalculator();
        firstOperand = '0.';
        updateDisplay(firstOperand);
        return;
    }

    if (currentOperator === null) {
        // Logic for first operand
        if (firstOperand.includes('.')) return; // Guard
        firstOperand = firstOperand === '' ? '0.' : firstOperand + '.';
        updateDisplay(firstOperand);
    } else {
        // Logic for second operand
        if (secondOperand.includes('.')) return; // Guard
        secondOperand = secondOperand === '' ? '0.' : secondOperand + '.';
        updateDisplay(firstOperand + " " + currentOperator + " " + secondOperand);
    }
}

function handleEquals() {
    if (firstOperand === '' || secondOperand === '' || currentOperator === null) return;
    
    const tempResult = operate(currentOperator, firstOperand, secondOperand);

    // Error Handling: Catch division by zero before updating state
    if (tempResult === null) {
        updateDisplay("Nice try!");
        resetCalculator();
        return;
    }

    result = formatResult(tempResult);
    updateDisplay(result);
    
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
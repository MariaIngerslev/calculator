// --- GLOBAL VARIABLES ---
// State variables to track the current calculation flow
let firstOperand = '';
let secondOperand = '';
let currentOperator = null;
let result = '';
let shouldResetScreen = false;
const MAX_INPUT_LENGTH = 7;
const MAX_RESULT_LENGTH = 10;

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

function convertToPercent(a) {
    return a / 100;
}

/**
 * Calculates the percentage of a total value.
 */
function calculateRelativePercentage(total, percentage) {
    return (total * percentage) / 100;
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
 * Prioritizes rounding to standard decimal before falling back to scientific notation.
 */
function formatResult(number) {
    // Guard clause: Handle invalid math operations (like division by zero)
    if (number === null) return null;

    const rounded = parseFloat(number.toFixed(MAX_RESULT_LENGTH)); // Avoid floating point precision issues

    const stringValue = rounded.toString();

    // Check if the number exceeds the display limit
    if (stringValue.length > MAX_RESULT_LENGTH) {
        return number.toExponential(2); 
    }

    return rounded;
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
    if (textStr.length > MAX_RESULT_LENGTH) {
        display.textContent = textStr.substring(0, MAX_RESULT_LENGTH);
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
        if (firstOperand.length >= MAX_INPUT_LENGTH) return;

        // Logic for First Operand
        firstOperand += numStr;
        updateDisplay(firstOperand); // Only show the number being typed
    } else {
        // Input Validation: Enforce character limit for the second operand
        if (secondOperand.length >= MAX_INPUT_LENGTH) return;
        
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
        updateDisplay(firstOperand); // Show result of the chain
    }

    // Store the operator but DO NOT update display.
    currentOperator = opStr;
}

function handlePercentage() {
    // Logic for single operand
    if (currentOperator === null) {
        if (firstOperand === '') return;
        
        const currentNum = Number(firstOperand);
        const resultNum = convertToPercent(currentNum);
        
        // Update state and UI
        firstOperand = resultNum.toString();
        updateDisplay(firstOperand);
    } 
    // Logic for operation with two operands 
    else {
        if (secondOperand === '') return;

        const total = Number(firstOperand);
        const percentage = Number(secondOperand);
        
        // Calculate the relative value (e.g., 10% of 200 is 20)
        const relativeValue = calculateRelativePercentage(total, percentage);
        
        // Update state with the new value so the pending operation uses it
        secondOperand = relativeValue.toString();
        updateDisplay(secondOperand);
    }
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
        updateDisplay(secondOperand);
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

function handleBackspace() {
    if (shouldResetScreen === true) {
        resetCalculator();
    return; 
    }

    if (currentOperator === null) {
        // Logic for first operand
        firstOperand = firstOperand.slice(0, -1);
        updateDisplay(firstOperand === '' ? '0' : firstOperand);
    } else {
        // Logic for second operand
        secondOperand = secondOperand.slice(0, -1);
        updateDisplay(secondOperand === '' ? '0' : secondOperand);
    }
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
        const operatorValue = button.dataset.val || button.textContent;
        handleOperator(operatorValue);
        }
        
        // ... PERCENT INPUT ...
        else if (button.classList.contains('percent')) {
            handlePercentage();
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

        // --- BACKSPACE INPUT ---
        else if (button.classList.contains('delete')) {
            handleBackspace();
        }
    }); 
}); 

// --- KEYBOARD SUPPORT ---

window.addEventListener('keydown', (e) => {
    // e.key holds the value of the key pressed (e.g., "1", "Enter", "Backspace")
    
    // 1. Numbers (0-9)
    if (e.key >= '0' && e.key <= '9') {
        handleNumber(e.key);
    }
    
    // 2. Operators (+, -, *, /)
    if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        handleOperator(e.key);
    }
    
    // 3. Equals (Enter or =)
    if (e.key === 'Enter' || e.key === '=') {
        // Prevent default behavior implies preventing "Enter" from triggering a focused button
        e.preventDefault(); 
        handleEquals();
    }
    
    // 4. Backspace (Delete last char)
    if (e.key === 'Backspace') {
        handleBackspace();
    }

    // 5. Escape (Clear all)
    if (e.key === 'Escape') {
        resetCalculator();
    }

    // 6. Decimal point
    if (e.key === '.') {
        handleDecimal();
    }

    // 7. Percentage (%)
    if (e.key === '%') {
        handlePercentage();
    }
});
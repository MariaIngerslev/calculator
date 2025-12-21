// --- GLOBAL VARIABLES ---
let firstOperand = '';
let secondOperand = '';
let currentOperator = null;

// --- BASIC MATH LOGIC ---
//add two numbers
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
            return null; // Return null if the operator isn't valid
    }
}


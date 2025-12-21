// --- VARIABLES ---
let firstOperand = '';
let secondOperand = '';
let currentOperator = null;

// --- BASIC MATH LOGIC ---
//add two numbers
function add(a, b) {
    return a + b;
}

//subtract two numbers
function subtract(a, b) {
    return a - b;
}

//multiply two numbers
function multiply(a, b) {
    return a * b;
}

//divide two numbers
function divide(a, b) {
    return a / b;
}

//operate function to call the appropriate math function
function operate(operator, rawNum1, rawNum2) {
    // 1. Convert the raw strings (inputs) to actual numbers
    const a = Number(rawNum1);
    const b = Number(rawNum2);

    // 2. Check which math function to run based on the operator
    switch (operator) {
        case '+':
            return add(a, b);
        case '-':
            return subtract(a, b);
        case '*':
            return multiply(a, b);
        case '/':
            // Simple check to prevent dividing by zero crashing things
            if (b === 0) return null; 
            return divide(a, b);
        default:
            return null; // Return null if the operator isn't valid
    }
}
//basic-math-logic

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
    if (b === 0) {
        throw new Error("Cannot divide by zero");
    }
    return a / b;
}
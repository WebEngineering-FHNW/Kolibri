import {
    calc, result, add, multi, sub, pow, div, churchAdd as cadd, churchMulti as cmulti, churchSub as csub, churchPow as cpow
} from "./calculator.js";
import {
    jsNum, n0, n1, n2, n3, n4, n5, n6, n7, n8, n9
} from "../lambda-calculus-library/church-numerals.js";

let functionalOp = "calc";
let lambdaOp = "jsnum( calc";
let display = "";


const displayOutput = document.getElementById("displayOutput");
const functionalOutput = document.getElementById("functionalOutput");
const lambdaOutput = document.getElementById("lambdaOutput");

const operate = value => lambda => {
    if (lambda === "result") {
        solve();
    } else if (lambda === "clr") {
        clr();
    } else {
        functionalOp += (isNaN(value)) ? `(${lambda})` : `(${value})`;
        lambdaOp += (isNaN(value)) ? `(c${lambda})` : `(${lambda})`;
        display += value;
        displayOutput.value = display;
        functionalOutput.textContent = functionalOp;
        lambdaOutput.textContent = lambdaOp;
    }
};

const solve = () => {
    const evalResult = eval(functionalOp + `(result)`);

    displayOutput.value = evalResult;
    functionalOutput.textContent = functionalOp + " ===> " + evalResult;
    functionalOp = "calc";
    display = "";


    const evalLambdaResult = eval(lambdaOp + `(result) )`);
    lambdaOutput.textContent = lambdaOp + " ) ===> " + evalLambdaResult;
    lambdaOp = "jsnum( calc";
};

const clr = () => {
    displayOutput.value = "cleared";
    display = "";

    functionalOutput.textContent = "";
    functionalOp = "calc";

    lambdaOutput.textContent = "";
    lambdaOp = "jsnum( calc";
};

const operatorInputs = document.querySelectorAll("[lambda]");
operatorInputs.forEach(e => e.onclick = _ => operate(e.value)(e.getAttribute("lambda")));

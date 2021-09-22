import {
    calc, result, add, multi, sub, pow, div, churchAdd as cadd, churchMulti as cmulti, churchSub as csub, churchPow as cpow
} from "./calculator.js";
import {
    jsnum, n0, n1, n2, n3, n4, n5, n6, n7, n8, n9
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
        functionalOutput.innerText = functionalOp;
        lambdaOutput.innerText = lambdaOp;
    }
};

const solve = () => {
    const evalResult = eval(functionalOp + `(result)`);

    displayOutput.value = evalResult;
    functionalOutput.innerText = functionalOp + " ===> " + evalResult;
    functionalOp = "calc";
    display = "";


    const evalLambdaResult = eval(lambdaOp + `(result) )`);
    lambdaOutput.innerText = lambdaOp + " ) ===> " + evalLambdaResult;
    lambdaOp = "jsnum( calc";
};

const clr = () => {
    displayOutput.value = "cleared";
    display = "";

    functionalOutput.innerText = "";
    functionalOp = "calc";

    lambdaOutput.innerText = "";
    lambdaOp = "jsnum( calc";
};

const operatorInputs = document.querySelectorAll("[lambda]");
operatorInputs.forEach(e => e.onclick = _ => operate(e.value)(e.getAttribute("lambda")));
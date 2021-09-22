import {convertToJsBool, fst, snd} from "../src/lambda-calculus-library/lambda-calculus.js";
import {emptyStack, filter, forEach, push, size} from "../src/stack/stack.js";
import {jsnum} from '../src/lambda-calculus-library/church-numerals.js';

export {TestSuite}

const Assert = () => {
    let counter = 1;
    let ok = emptyStack;

    const equals = (actual, expected) => {
        const result = (actual === expected);
        addTest(actual, expected, result);
    };

    const churchNumberEquals = (actual, expected) => {
        const result = (jsnum(actual) === jsnum(expected));
        addTest(actual, expected, result);
    };

    const churchBooleanEquals = (actual, expected) => {
        const result = (convertToJsBool(actual) === convertToJsBool(expected));
        addTest(actual, expected, result);
    };

    const addTest = (actual, expected, result) => {
        ok = push(ok)({actual, expected, result, counter});
        counter++;
    };

    const arrayEquals = (actual, expected) => {
        if (actual.length === expected.length) {
            let counter = 0;
            let result = true;

            while (result && counter < actual.length) {
                result = actual[counter] === expected[counter];
                counter++;
            }

            addTest(actual, expected, result);
        } else {
            addTest(actual, expected, false);
        }
    };


    const pairEquals = (actual, expected) => {
        const p1Fst = actual(fst)
        const p1Snd = actual(snd)
        const p2Fst = expected(fst)
        const p2Snd = expected(snd)

        const result = p1Fst === p2Fst && p1Snd === p2Snd

        addTest(actual, expected, result);
    }

    return {
        getOk: () => ok,
        equals: equals,
        churchNumberEquals: churchNumberEquals,
        churchBooleanEquals: churchBooleanEquals,
        arrayEquals: arrayEquals,
        pairEquals: pairEquals
    }
};

const TestSuite = name => {
    let tests = emptyStack;
    const add = (origin, callback) => {
        const assert = Assert();
        callback(assert);
        tests = push(tests)({
            origin,
            asserts: assert.getOk()
        });
    };

    const report = () => {
        renderReport(name, tests);
    };

    return {
        add: add,
        report: report
    }
};

let totalTests = 0;
const renderReport = (name, tests) => {
    let outputHtml = "";

    let totalPassed = 0;
    let totalFailed = 0;

    const iterationF = (element, index) => {
            const {origin, asserts} = element;

            const sizeOfAsserts = jsnum(size(asserts));
            totalTests += sizeOfAsserts;

            const failed = filter(asserts)(testResult => !testResult.result);
            const churchSizeOfFailed = size(failed);
            const sizeOfFailed = jsnum(churchSizeOfFailed);

            const passed = sizeOfAsserts - sizeOfFailed;

            totalPassed += passed;
            totalFailed += sizeOfFailed;

            let failMessage = "";
            let passedLine = ` <span>${passed} / ${sizeOfAsserts}   </span>`;

            const failedFunc = (element, index) => {
                const {actual, expected, result, counter} = element;
                failMessage += `<pre ><span class="dot red"></span> <b>Test Nr. ${counter}  failed!</b> <br>    Actual:   <b>${actual}</b> <br>    Expected: <b>${expected} </b></pre>`;
            };

            forEach(failed)(failedFunc);

            outputHtml += `
            <tr>
                <td> 
                    <span class="dot ${passed === sizeOfAsserts ? 'green' : 'red'}"></span>${origin} 
                </td>
                <td>  
                    ${passedLine} 
                </td>
            </tr>    
        `;

            if (sizeOfFailed > 0) {
                outputHtml += `
            <tr>
                <td> 
                   <div class="failMessage">${failMessage} </div> 
                </td>
            </tr>    
        `;
            }
    };

    forEach(tests)(iterationF);

    document.getElementById("totalTests").innerText = totalTests;

    const output = document.getElementById("output");
    output.insertAdjacentHTML("beforeend",
        `<fieldset style="border-color: ${totalFailed > 0 ? 'red' : 'green'}">
                    <legend>${name}</legend>
                        <table style="width: fit-content"> 
                            <tr>
                                <th>Function</th>
                                <th>Passed</th>
                            </tr>
                            
                            ${outputHtml}
                     
                        </table>
                     <h4>Total passed: ${totalPassed}   failed: ${totalFailed} </h4>
                </fieldset>`
    );
};

// The test "framework", exports the Suite function plus a total of how many assertions have been tested

export { TestSuite, total }

import { Tuple, id }          from "../stdlib.js";

let total = 0;

function Assert() {
    const results = []; // [Bool], true if test passed, false otherwise
    return {
        results: results,
        true: (testResult) => {
            if (!testResult) { console.error("test failed") }
            results.push(testResult);
        },
        is: (actual, expected) => {
            const testResult = actual === expected;
            if (!testResult) {
                console.error("test failure. Got '"+ actual +"', expected '" + expected +"'");
            }
            results.push(testResult);
        }
    }
}

const [Test, name, logic] = Tuple(2); // data type to capture test to-be-run

function test(name, callback) {
    const assert = Assert();
    callback(assert);
    report(name, assert.results)
}

function TestSuite(suiteName) {
    const tests = []; // [Test]
    const suite = {
        test: (testName, callback) => test(suiteName + "-"+ testName, callback),
        add:  (testName, callback) => tests.push(Test (testName) (callback)),
        run:  () => {
            const suiteAssert = Assert();
            tests.forEach( test => test(logic) (suiteAssert) );
            total += suiteAssert.results.length;
            if (suiteAssert.results.every( id )) { // whole suite was ok, report whole suite
                report("suite " + suiteName, suiteAssert.results)
            } else { // some test in suite failed, rerun tests for better error indication
                tests.forEach( test => suite.test( test(name), test(logic) ) )
            }
        }
    };
    return suite;
}

// test result report
// report :: String, [Bool] -> DOM ()
function report(origin, ok) {
    const extend = 20;
    if ( ok.every( elem => elem) ) {
        write(" "+ String(ok.length).padStart(3) +" tests in " + origin.padEnd(extend) + " ok.");
        return;
    }
    let reportLine = "    Failing tests in " + origin.padEnd(extend);
    bar(reportLine.length);
    write("|" + reportLine+ "|");
    for (let i = 0; i < ok.length; i++) {
        if( ! ok[i]) {
            write("|    Test #"+ String(i).padEnd(3) +" failed                     |");
        }
    }
    bar(reportLine.length);
}

function write(message) {
    const out = document.getElementById('out');
    out.textContent += message + "\n";
}

function bar(extend) {
    write("+" + "-".repeat(extend) + "+");
}


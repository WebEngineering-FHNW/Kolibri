// The test "framework", exports the Suite function plus a total of how many assertions have been tested

export { TestSuite, total}

import {id, Tuple} from "../stdlib.js";

let total = 0;

function Assert() {
    const results = []; // [Bool], true if test passed, false otherwise
    const messages = [];
    return {
        results,
        messages,
        true: testResult => {
            let message = "";
            if (!testResult) {
                console.error("test failed");
                message = "not true";
            }
            results.push(testResult);
            messages.push(message);
        },
        is: (actual, expected) => {
            const testResult = actual === expected;
            let message = "";
            if (!testResult) {
                message = "Got '"+ actual +"', expected '" + expected +"'";
                console.error(message);
            }
            results.push(testResult);
            messages.push(message);
        }
    }
}

const [Test, name, logic] = Tuple(2); // data type to capture test to-be-run

function test(name, callback) {
    const assert = Assert();
    callback(assert);
    report(name, assert.results, assert.messages)
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
                report(suiteName, suiteAssert.results);
            } else { // some test in suite failed, rerun tests for better error indication
                tests.forEach( test => suite.test( test(name), test(logic) ) )
            }
        }
    };
    return suite;
}

// test result report
// report :: String, [Bool] -> DOM ()
function report(origin, results, messages) {
    if ( results.every( elem => elem) ) {
        write (`
            <div>${results.length}</div>
            <div>tests in </div> 
            <div>${origin}</div>
            <div class="ok">ok</div> 
        `);
        return;
    }
    write(`
            <div></div>
            <div>tests in </div> 
            <div>${origin}</div>
            <div class="failed">failed</div> 
    `);
    results.forEach((result, idx) => {
        if (result) return;
        write(`
                <div></div>
                <div>assertion </div> 
                <div class="failed">#${idx+1}: ${messages[idx]}</div>
                <div class="failed">failed</div> 
        `);
    });
}

function write(message) {
    const out = document.getElementById('out');
    out.innerHTML += message ;
}


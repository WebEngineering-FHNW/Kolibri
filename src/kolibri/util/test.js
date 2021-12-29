/**
 * @module util/test
 * The test "framework", exports the Suite function plus a total of how many assertions have been tested
 */
export { TestSuite, total}

import { id, Tuple } from "../stdlib.js";

/**
 * The running total of executed test assertions.
 * @impure Changes within this module but is read-only for module consumers.
 * @type { Number }
 */
let total = 0;

/**
 * @typedef {Object} AssertType
 * @template T
 * @property {Array<String>} messages -
 * @property {Array<Boolean>} results -
 * @property { (testResult: Boolean)     => void } true -
 * @property { (actual: T, expected: T)  => void } is   -
 */

/**
 * A newly created Assert object is passed into the {@link test} callback function where it is used to
 * asserts test results against expectations and keep track of the results for later reporting.
 * Follows GoF "Collecting Parameter Pattern".
 * @return { AssertType }
 * @constructor
 * @impure assembles test results.
 */
const Assert = () => {
    const results  = []; // [Bool], true if test passed, false otherwise
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

/**
 * @private data type to capture the test to-be-run. A triple of ctor and two getter functions.
 */
const [Test, name, logic] = Tuple(2);

/**
 * @callback TestCallback
 * @param { AssertType } assert
 */

/**
 * Creates a new assert object, passes it into the callback for execution, and reports the result.
 * Follows Smalltalk Best Practice Patterns: "Method Around Pattern".
 * @param { String } name - name of the test. Should be unique inside the {@link TestSuite}.
 * @param { TestCallback } callback
 * @private
 */
const test = (name, callback) => {
    const assert = Assert();
    callback(assert);
    report(name, assert.results, assert.messages)
}

/**
 * @typedef { Object } TestSuiteType
 * @property { (testName:String, callback:TestCallback) => void} test - running a test function for this suite
 * @property { (testName:String, callback:TestCallback) => void} add  - adding a test function for later execution
 * @property { function(): void } run:                                - running and reporting the suite
 */
/**
 * Tests are organised in test suites that contain test functions. Theses functions are added before the suite
 * itself is "run", which in turn executes the tests and reports the results.
 * @param  { String } suiteName
 * @return { TestSuiteType }
 * @constructor
 * @example
 * const suite = TestSuite("mysuite");
 * suite.add("myName", assert => {
 *     assert.is(true, true);
 *  });
 *  suite.run();
 */
const TestSuite = suiteName => {
    const tests = []; // [Test]
    return {
        test: (testName, callback) => test(suiteName + "-"+ testName, callback),
        add:  (testName, callback) => tests.push(Test (testName) (callback)),
        run:  () => {
            const suiteAssert = Assert();
            tests.forEach( test => test(logic) (suiteAssert) );
            total += suiteAssert.results.length;
            if (suiteAssert.results.every( id )) { // whole suite was ok, report whole suite
                report(suiteName, suiteAssert.results);
            } else { // some test in suite failed, rerun tests for better error indication
                tests.forEach( testInfo => test( testInfo(name), testInfo(logic) ) )
            }
        }
    };
}

/**
 * If all test results are ok, report a summary. Otherwise report the individual tests.
 * @param { String }         origin
 * @param { Array<Boolean> } results
 * @param { Array<String> }  messages
 * @private
 */
const report = (origin, results, messages) => {
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

/**
 * A not very efficient way to write the formatted test results in the holding report HTML page.
 * @param message
 * @private
 */
const write = message =>  {
    const out = document.getElementById('out');
    out.innerHTML += message ;
}


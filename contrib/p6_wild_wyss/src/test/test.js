/**
 * @module util/test
 * The test "framework", exports the Suite function plus a total of how many assertions have been tested
 */

import {accentColor, okColor} from "../../../../docs/src/kolibri/style/kolibriStyle.js";
import {id, Tuple} from "../../../../docs/src/kolibri/stdlib.js"
import {Observable} from "../../../../docs/src/kolibri/observable.js"
import {dom} from "../../../../docs/src/kolibri/util/dom.js"
import {LoggerFactory} from "../../../../docs/src/kolibri/logger/loggerFactory.js";
import {
    addToAppenderList,
    getLoggingLevel,
    removeFromAppenderList,
    setLoggingLevel,
    setLoggingContext,
    setMessageFormatter,
} from "../../../../docs/src/kolibri/logger/logging.js";
import {
  LOG_DEBUG,
} from "../../../../docs/src/kolibri/logger/logLevel.js";
import {Appender} from "../../../../docs/src/kolibri/logger/appender/consoleAppender.js";

export { TestSuite, total, asyncTest }

const { error } = LoggerFactory("kolibri.test");

/**
 * The running total of executed test assertions.
 * @impure the reference does not change, but the contained value. Listeners will produce side effects like DOM changes.
 * @type { IObservable<Number> }
 */
const total = Observable(0);

/** @type { (Number) => void } */
const addToTotal = num => total.setValue( num + total.getValue());

/** @typedef equalityCheckFunction
 * @template _T_
 * @function
 * @param { _T_ } actual
 * @param { _T_ } expected
 * @returns void
 * */

/**
 * @callback AssertThrows
 * @param { () => void } functionUnderTest - this function should throw an error
 * @param { String = ""} expectedErrorMsg  - if set, the thrown errors message will be compared to this string
 * @returns void
 */

/**
 * @callback IterableEq
 * @param { Iterable<*> } actual            - the actual iterable
 * @param { Iterable<*> } expected          - an iterable with the expected elements
 * @param { number } [maxElementsToConsume] - if set, the thrown errors message will be compared to this string
 * @returns void
 */

/**
 * @typedef  { Object }                AssertType
 * @property { Array<String> }         messages     - stores all assertions messages, one for each entry in "results"
 * @property { Array<Boolean> }        results      - stores all assertion results
 * @property { (Boolean)  => void }    isTrue       - assert that expression is true, side effects "results" and "messages"
 * @property { equalityCheckFunction } is           - assert that two expressions are equal,
 *                                                    side effects "results" and "messages", and
 *                                                    logs an error to the console incl. stack trace in case of failure
 * @property { AssertThrows }          throws       - assert that the given function throws an exception,
 *                                                    logs an error to the console incl. stack trace in case of failure
 * @property { IterableEq }            iterableEq   - assert that two objects conform to the [JS iteration protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) are equal.
 */

/**
 * A newly created Assert object is passed into the {@link test} callback function where it is used to
 * assert test results against expectations and keep track of the results for later reporting.
 * Follows GoF "Collecting Parameter Pattern".
 * @return { AssertType }
 * @constructor
 * @impure assembles test results.
 */
const Assert = () => {
    /** @type Array<Boolean> */ const results  = []; // true if test passed, false otherwise
    /** @type Array<String> */  const messages = [];
    return {
        results,
        messages,
        isTrue: testResult => {
            let message = "";
            if (!testResult) {
                error("test failed");
                message = "not true";
            }
            results .push(testResult);
            messages.push(message);
        },
        is: (actual, expected) => {
            const testResult = actual === expected;
            let message = "";
            if (!testResult) {
                message = `Got '${actual}', expected '${expected}'`;
                error(message);
            }
            results .push(testResult);
            messages.push(message);
        },
        iterableEq: (actual, expected, maxElementsToConsume = 1_000) => {
            /**
             // Following tests should fail
             assert.iterableEq([1,2], [1,2,3]);            // actual is shorter
             assert.iterableEq([1,2,3], [1,2]);            // expected is shorter
             assert.iterableEq([2,2,3,4],[1,2,3,4]);       // first element different
             assert.iterableEq([1,2,3,4],[1,2,4,4]);       // any element different
             assert.iterableEq([1,2,3,4],[1,2,3,5]);       // last element different
             assert.iterableEq(Range(100), Range(50), 100);// actual has more elements than default
             assert.iterableEq(Range(50), Range(100), 100);// expected has more elements than default
             assert.iterableEq(Range(100), Range(80), 80); // after 80, comparing will be aborted
             assert.iterableEq(Range(80), Range(100), 80); // after 80, comparing will be aborted

             // Following tests should pass
             assert.iterableEq([], []);                    // empty iterables
             assert.iterableEq([1], [1]);                  // single valued iterables
             assert.iterableEq([1,2,3,4], [1,2,3,4]);      // any iterable
             */
            if (actual[Symbol.iterator]   === undefined) error("actual is not iterable!");
            if (expected[Symbol.iterator] === undefined) error("expected is not iterable!");

            const actualIt     = actual[Symbol.iterator]();
            const expectedIt   = expected[Symbol.iterator]();

            let iterationCount = 0;
            let testPassed     = true;
            let message        = "";

            while (true) {
                const { value: actualValue,   done: actualDone   } = actualIt.next();
                const { value: expectedValue, done: expectedDone } = expectedIt.next();

                const oneIteratorDone      = actualDone || expectedDone;
                const bothIteratorDone     = actualDone && expectedDone;
                const tooManyIterations    = iterationCount > maxElementsToConsume;

                if (bothIteratorDone) break;
                if (oneIteratorDone) {
                    testPassed = false;
                    const actualMsg = actualDone ? "had no more elements" : "still had elements";
                    message = `Actual and expected do not have the same length! After comparing ${iterationCount} 
                               elements, actual ${actualMsg}, which was not expected!`;
                    break;
                }
                if (tooManyIterations) {
                    message = `It took more iterations than ${maxElementsToConsume}. Aborting.\n`;
                    testPassed = false;
                    break;
                }

                if (actualValue !== expectedValue) {
                    testPassed = false;
                    message = `Values were not equal in iteration ${iterationCount}! Expected ${expectedValue} but was ${actualValue}\n`;

                    break;
                }

                iterationCount++;
            }

            if (!testPassed) error(message);
            results.push(testPassed);
            messages.push(message);
        },
        throws: (functionUnderTest, expectedErrorMsg = "") => {
            let testResult    = false;
            let message       = "";
            const hasErrorMsg = expectedErrorMsg !== "";

            try {
                functionUnderTest();

                message = "Did not throw an error!";
                if (hasErrorMsg) {
                    message += ` Expected: '${expectedErrorMsg}'`;
                }
                error(message);
            } catch (e) {
                testResult = true;

                if (hasErrorMsg) {
                    testResult = expectedErrorMsg === e.message;
                }
            }
            results .push(testResult);
            messages.push(message);
        }
    }
};

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
};

/**
 * @callback AsyncTestCallback
 * @param    { AssertType } assert
 * @return   { Promise }
 */
/**
 * Testing async logic requires the testing facility to do out-of-order reporting.
 * These tests do not live in a suite but are run separately.
 * @param { String } name - name for the test report
 * @param { AsyncTestCallback } asyncCallback - test logic that returns a promise such that reporting can wait for completion
 */
const asyncTest = (name, asyncCallback) => {
    const assert = Assert();
    asyncCallback(assert) // returns a promise
        .catch( _ => {
            assert.results.unshift(false);
            assert.messages.unshift(name + " promise rejected");
        })
        .finally ( _ => {
            report(name, assert.results, assert.messages);
            addToTotal(assert.results.length);
        });
};

/**
 * @typedef { Object } TestSuiteType
 * @property { (testName:String, callback:TestCallback) => void} test - running a test function for this suite
 * @property { (testName:String, callback:TestCallback) => void} add  - adding a test function for later execution
 * @property { () => void} run                                        - runs the given test suite
 * @property { function(): void } run:                                - running and reporting the suite
 */
/**
 * Tests are organised in test suites that contain test functions. These functions are added before the suite
 * itself is "run", which in turn executes the tests and reports the results.
 * @param  { String } suiteName
 * @return { TestSuiteType }
 * @constructor
 * @example
 * const suite = TestSuite("mySuite");
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
            addToTotal(suiteAssert.results.length);
            if (suiteAssert.results.every( id )) { // whole suite was ok, report whole suite
                report(suiteName, suiteAssert.results, suiteAssert.messages);
            } else { // some test in suite failed, rerun tests for better error indication
                const prevLoggingLevel = getLoggingLevel();
                setLoggingLevel(LOG_DEBUG);
                setLoggingContext("");
                const appender = Appender();
                setMessageFormatter(
                  context => logLevel => logMessage => `[${logLevel}]\t${context} ${suiteName}: ${logMessage}`
                );
                addToAppenderList(appender);
                tests.forEach( testInfo => test( testInfo(name), testInfo(logic) ));
                setLoggingLevel(prevLoggingLevel);
                removeFromAppenderList(appender);
            }
        }
    };
};

/**
 * If all test results are ok, report a summary. Otherwise, report the individual tests.
 * @param { String }         origin
 * @param { Array<Boolean> } results
 * @param { Array<String> }  messages
 * @private
 */
const report = (origin, results, messages) => {
    const okStyle     = `style="color: ${okColor};"`;
    const failedStyle = `style="color: ${accentColor};"`;

    if ( results.every( elem => elem) ) {
        write (`
            <!--suppress ALL -->
            <div>${results.length}</div>
            <div>tests in </div> 
            <div>${origin}</div>
            <div ${okStyle}">ok</div> 
        `);
        return;
    }
    write(`
            <!--suppress ALL -->
            <div></div>
            <div>tests in </div> 
            <div>${origin}</div>
            <div ${failedStyle}>failed</div> 
    `);
    results.forEach((result, idx) => {
        if (result) return;
        write(`
                <!--suppress ALL -->
                <div></div>
                <div>assertion </div> 
                <div ${failedStyle}>#${idx+1}: ${messages[idx]}</div>
                <div ${failedStyle}>failed</div> 
        `);
    });
};

/**
 * Write the formatted test results in the holding report HTML page.
 * @param { !String } html - HTML string of the to-be-appended DOM
 * @private
 */
const write = html => out.append(...dom(html));


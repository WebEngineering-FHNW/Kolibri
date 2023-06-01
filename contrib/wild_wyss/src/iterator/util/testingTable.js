import {
  testCBNotCalledAfterDone,
  testCopy,
  testCopyAfterConsumption, testIterateMultipleTimes,
  testPrototype,
  testPurity,
  testSimple
} from "./testUtil.js";

export { addToTestingTable, TESTS }

/**
 * @typedef TestingFunction
 * @type {   "TEST_SIMPLE"
 *         | "TEST_COPY"
 *         | "TEST_PURITY"
 *         | "TEST_PROTOTYPE"
 *         | "TEST_COPY_AFTER_CONSUMPTION"
 *         | "TEST_CB_NOT_CALLED_AFTER_DONE"
 * }
 */

/**
 * @type {
 *         { TEST_COPY_AFTER_CONSUMPTION:   TestingFunction,
 *           TEST_CB_NOT_CALLED_AFTER_DONE: TestingFunction,
 *           TEST_SIMPLE:                   TestingFunction,
 *           TEST_PURITY:                   TestingFunction,
 *           TEST_COPY:                     TestingFunction,
 *           TEST_PROTOTYPE:                TestingFunction,
 *         }
 * }
 */
const TESTS = {
  TEST_SIMPLE:                   'TEST_SIMPLE',
  TEST_PURITY:                   'TEST_PURITY',
  TEST_PROTOTYPE:                'TEST_PROTOTYPE',
  TEST_CB_NOT_CALLED_AFTER_DONE: 'TEST_CB_NOT_CALLED_AFTER_DONE',
  TEST_ITERATE_MULTIPLE_TIMES:   'TEST_ITERATE_MULTIPLE_TIMES',
};


const testingFunctions = [];
testingFunctions.push({ name: TESTS.TEST_SIMPLE                  , test: testSimple});
testingFunctions.push({ name: TESTS.TEST_PURITY                  , test: testPurity});
testingFunctions.push({ name: TESTS.TEST_ITERATE_MULTIPLE_TIMES  , test: testIterateMultipleTimes});
testingFunctions.push({ name: TESTS.TEST_CB_NOT_CALLED_AFTER_DONE, test: testCBNotCalledAfterDone});
testingFunctions.push({ name: TESTS.TEST_PROTOTYPE               , test: testPrototype});

/**
 * @type {
 *       (testSuite: TestSuiteType)
 *    => (config: IteratorTestConfigType)
 *    => void
 * }
 */
const addToTestingTable = testSuite => config => {
  const { excludedTests } = config;

  testingFunctions
    .filter (({ name })        => !excludedTests.includes(name))
    .forEach(({ name, test })  => testSuite.add(`${name}: ${config.name}`, test(config)));
};
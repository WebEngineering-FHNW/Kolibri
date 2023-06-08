import {
  testCBNotCalledAfterDone,
  testIterateMultipleTimes,
  testPrototype,
  testPurity,
  testSimple,
  testInvariants
} from "./testUtil.js";

export { addToTestingTable, TESTS }

/**
 * @typedef TestingFunction
 * @type {
 *           "TEST_SIMPLE"
 *         | "TEST_PURITY"
 *         | "TEST_PROTOTYPE"
 *         | "TEST_INVARIANTS"
 *         | "TEST_CB_NOT_CALLED_AFTER_DONE"
 *         | "TEST_ITERATE_MULTIPLE_TIMES"
 * }
 */

/**
 * @type {
 *         {
 *           TEST_SIMPLE:                   TestingFunction,
 *           TEST_PURITY:                   TestingFunction,
 *           TEST_PROTOTYPE:                TestingFunction,
 *           TEST_INVARIANTS:                      TestingFunction,
 *           TEST_CB_NOT_CALLED_AFTER_DONE: TestingFunction,
 *           TEST_ITERATE_MULTIPLE_TIMES:   TestingFunction,
 *         }
 * }
 */
const TESTS = {
  TEST_SIMPLE:                   'TEST_SIMPLE',
  TEST_PURITY:                   'TEST_PURITY',
  TEST_PROTOTYPE:                'TEST_PROTOTYPE',
  TEST_INVARIANTS:               'TEST_INVARIANTS',
  TEST_ITERATE_MULTIPLE_TIMES:   'TEST_ITERATE_MULTIPLE_TIMES',
};


const testingFunctions = [];
testingFunctions.push({ name: TESTS.TEST_SIMPLE                  , test: testSimple});
testingFunctions.push({ name: TESTS.TEST_PURITY                  , test: testPurity});
testingFunctions.push({ name: TESTS.TEST_CB_NOT_CALLED_AFTER_DONE, test: testCBNotCalledAfterDone});
testingFunctions.push({ name: TESTS.TEST_PROTOTYPE               , test: testPrototype});
testingFunctions.push({ name: TESTS.TEST_INVARIANTS              , test: testInvariants});
testingFunctions.push({ name: TESTS.TEST_ITERATE_MULTIPLE_TIMES  , test: testIterateMultipleTimes});

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
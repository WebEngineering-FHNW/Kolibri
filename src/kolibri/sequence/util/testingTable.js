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
 *           TEST_INVARIANTS:               TestingFunction,
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

const testingTable = [
  { name: TESTS.TEST_SIMPLE,                   test: testSimple},
  { name: TESTS.TEST_PURITY,                   test: testPurity},
  { name: TESTS.TEST_CB_NOT_CALLED_AFTER_DONE, test: testCBNotCalledAfterDone},
  { name: TESTS.TEST_PROTOTYPE,                test: testPrototype},
  { name: TESTS.TEST_INVARIANTS,               test: testInvariants},
  { name: TESTS.TEST_ITERATE_MULTIPLE_TIMES,   test: testIterateMultipleTimes},
];

/**
 * @type {
 *       (testSuite: TestSuiteType)
 *    => (config: SequenceTestConfigType)
 *    => void
 * }
 */
const addToTestingTable = testSuite => config => {
  const { excludedTests } = config;

  testingTable
    .filter (({ name })        => !excludedTests.includes(name))
    .forEach(({ name, test })  => testSuite.add(`${name}: ${config.name}`, test(config)));
};

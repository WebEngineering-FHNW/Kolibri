import { createTestConfig }         from "../../../../kolibri/sequence/util/testUtil.js";
import { arrayEq }                  from "../../../../kolibri/util/arrayFunctions.js";
import { take }                     from "../../../../kolibri/sequence/sequence.js";
import { addToTestingTable, TESTS } from "../../../../kolibri/sequence/util/testingTable.js";
import { FibonacciSequence }        from "./fibonacciSequence.js";
import { TestSuite }                from "../../../../kolibri/util/test.js";

const testSuite = TestSuite("examples/sequence/generators/fibonacciSequence");

addToTestingTable(testSuite)(
  createTestConfig({
    name:     "FibonacciSequence",
    iterable: () => FibonacciSequence,
    expected: [1, 1, 2, 3, 5],
    evalFn:   expected => actual => {
      const expectedArray = take(5)(expected);
      const actualArray   = take(5)(actual);
      return arrayEq([...expectedArray])([...actualArray]);
    },
    excludedTests: [
      TESTS.TEST_PURITY,
      TESTS.TEST_CB_NOT_CALLED_AFTER_DONE,
    ]
  })
);

testSuite.run();

import { TestSuite }         from "../../../test/test.js";
import { createTestConfig }  from "../../util/testUtil.js";
import { arrayEq }           from "../../../../../../docs/src/kolibri/util/arrayFunctions.js";
import { FibonaccSequence } from "./fibonaccSequence.js";
import {
  addToTestingTable,
  TESTS
} from "../../util/testingTable.js";
import { take } from "../../iterator.js";

const testSuite = TestSuite("Sequence: Constructor FibonaccSequence");

addToTestingTable(testSuite)(
  createTestConfig({
    name:     "FibonacciIterator",
    iterator: () => FibonaccSequence(),
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

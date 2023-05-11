import { TestSuite }            from "../../../test/test.js";
import { createTestConfig }     from "../../util/testUtil.js";
import { takeWithoutCopy  }     from "../../util/util.js";
import { arrayEq }              from "../../../../../../docs/src/kolibri/util/arrayFunctions.js";
import { FibonacciIterator }    from "./fibonacciIterator.js";
import {
  addToTestingTable,
  TESTS
} from "../../util/testingTable.js";

const testSuite = TestSuite("Iterator: Constructor FibonacciIterator");

addToTestingTable(testSuite)(
  createTestConfig({
    name:     "FibonacciIterator",
    iterator: () => FibonacciIterator(),
    expected: [1, 1, 2, 3, 5, 8],
    evalFn:   expected => actual => {
      const expectedArray = takeWithoutCopy(5)(expected);
      const actualArray   = takeWithoutCopy(5)(actual);
      return arrayEq(expectedArray)(actualArray);
    },
    excludedTests: [TESTS.TEST_PURITY, TESTS.TEST_CB_NOT_CALLED_AFTER_DONE]
  })
);

testSuite.run();

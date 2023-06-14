import { TestSuite }                  from "../../../test/test.js";
import { createTestConfig }           from "../../util/testUtil.js";
import { arrayEq }                    from "../../../../../../docs/src/kolibri/util/arrayFunctions.js";
import { take, SquareNumberIterator } from "../../iterator.js";
import {
  addToTestingTable,
  TESTS
} from "../../util/testingTable.js";

const testSuite = TestSuite("Iterator: Constructor SquareNumberIterator");

addToTestingTable(testSuite)(
  createTestConfig({
    name:     "SquareNumberIterator",
    iterator: SquareNumberIterator,
    expected: [1, 4, 9, 16, 25],
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
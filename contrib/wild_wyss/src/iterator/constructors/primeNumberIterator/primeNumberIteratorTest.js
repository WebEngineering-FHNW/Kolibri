import { TestSuite }           from "../../../test/test.js";
import { createTestConfig }    from "../../util/testUtil.js";
import { PrimeNumberIterator } from "./primeNumberIterator.js";
import { takeWithoutCopy }     from "../../util/util.js";
import { arrayEq }             from "../../../../../../docs/src/kolibri/util/arrayFunctions.js";
import {
  addToTestingTable,
  TESTS
} from "../../util/testingTable.js";

const testSuite = TestSuite("Iterator: Constructor PrimeNumberIterator");

addToTestingTable(testSuite)(
  createTestConfig({
    name:     "PrimeNumberIterator",
    iterator: () => PrimeNumberIterator(),
    expected: [2, 3, 5, 7, 11],
    evalFn:   expected => actual => {
      const expectedArray = takeWithoutCopy(5)(expected);
      const actualArray   = takeWithoutCopy(5)(actual);
      return arrayEq(expectedArray)(actualArray);
    },
    excludedTests: [TESTS.TEST_PURITY, TESTS.TEST_CB_NOT_CALLED_AFTER_DONE]
  })
);

testSuite.run();
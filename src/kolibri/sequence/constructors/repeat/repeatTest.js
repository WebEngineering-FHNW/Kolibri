import { TestSuite }        from "../../../util/test.js";
import { createTestConfig } from "../../util/testUtil.js";
import { repeat, take }     from "../../sequence.js";
import { arrayEq }          from "../../../util/arrayFunctions.js";
import {
  addToTestingTable,
  TESTS
}                           from "../../util/testingTable.js";

const testSuite = TestSuite("Sequence: constructor repeat");

addToTestingTable(testSuite)(
  createTestConfig({
    name:     "repeat",
    iterable: () => repeat(42),
    expected: [42, 42, 42, 42, 42],
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

import { TestSuite }                from "../../../test/test.js";
import { createTestConfig }         from "../../util/testUtil.js";
import { PureIterator }             from "./pureIterator.js";
import { addToTestingTable, TESTS } from "../../util/testingTable.js";

const testSuite = TestSuite("Iterator: Constructor PureIterator");

addToTestingTable(testSuite)(
  createTestConfig({
    name:     "PureIterator",
    iterator: () => PureIterator(42),
    expected: [42],
    excludedTests: [
      TESTS.TEST_PURITY,
      TESTS.TEST_CB_NOT_CALLED_AFTER_DONE,
    ]
  })
);

testSuite.run();
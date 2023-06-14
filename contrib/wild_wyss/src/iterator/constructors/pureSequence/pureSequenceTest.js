import { TestSuite }                from "../../../test/test.js";
import { createTestConfig }         from "../../util/testUtil.js";
import { PureSequence }             from "./pureSequence.js";
import { addToTestingTable, TESTS } from "../../util/testingTable.js";

const testSuite = TestSuite("Sequence: Constructor PureSequence");

addToTestingTable(testSuite)(
  createTestConfig({
    name:     "PureIterator",
    iterator: () => PureSequence(42),
    expected: [42],
    excludedTests: [
      TESTS.TEST_PURITY,
      TESTS.TEST_CB_NOT_CALLED_AFTER_DONE,
    ]
  })
);

testSuite.run();
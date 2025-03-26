import { TestSuite }                from "../../../util/test.js";
import { createTestConfig }         from "../../util/testUtil.js";
import { PureSequence }             from "./pureSequence.js";
import { addToTestingTable, TESTS } from "../../util/testingTable.js";

const testSuite = TestSuite("Sequence: constructor PureSequence");

addToTestingTable(testSuite)(
  createTestConfig({
    name:     "PureSequence",
    iterable: () => PureSequence(42),
    expected: [42],
    excludedTests: [
      TESTS.TEST_PURITY,
      TESTS.TEST_CB_NOT_CALLED_AFTER_DONE,
    ]
  })
);

testSuite.run();

import { TestSuite }                from "../../../util/test.js";
import { createTestConfig }         from "../../util/testUtil.js";
import { nil }                      from "./nil.js";
import { addToTestingTable, TESTS } from "../../util/testingTable.js";

const testSuite = TestSuite("Sequence: constructor nil");

addToTestingTable(testSuite)(
  createTestConfig({
    name:     "nil",
    iterable: () => nil,
    expected: [],
    excludedTests: [
      TESTS.TEST_PURITY,
      TESTS.TEST_CB_NOT_CALLED_AFTER_DONE,
    ]
  })
);

testSuite.run();

import { TestSuite }        from "../../../test/test.js";
import { createTestConfig } from "../../util/testUtil.js";
import { replicate }        from "./replicate.js";
import {
  addToTestingTable,
  TESTS
} from "../../util/testingTable.js";

const testSuite = TestSuite("Iterator: Constructor replicate");

addToTestingTable(testSuite)(
  createTestConfig({
    name:     "replicate",
    iterator: () => replicate(3)(true),
    expected: [true, true, true],
    excludedTests: [TESTS.TEST_PURITY, TESTS.TEST_CB_NOT_CALLED_AFTER_DONE]
  })
);

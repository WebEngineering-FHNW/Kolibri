import { AngleIterator }     from "./angleIterator.js";
import { TestSuite }         from "../../../test/test.js";
import { createTestConfig }  from "../../util/testUtil.js";
import {
  addToTestingTable,
  TESTS
} from "../../util/testingTable.js";

const testSuite = TestSuite("Iterator: Constructor AngleIterator");

addToTestingTable(testSuite)(
  createTestConfig({
    name:     "AngleIterator",
    iterator: () => AngleIterator(4),
    expected: [0, 90, 180, 270],
    excludedTests: [TESTS.TEST_PURITY, TESTS.TEST_CB_NOT_CALLED_AFTER_DONE]
  })
);

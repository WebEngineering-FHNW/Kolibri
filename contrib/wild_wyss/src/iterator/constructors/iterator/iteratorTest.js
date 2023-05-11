import { TestSuite }         from "../../../test/test.js";
import { createTestConfig }  from "../../util/testUtil.js";
import { Iterator }          from "./iterator.js";
import {
  addToTestingTable,
  TESTS
} from "../../util/testingTable.js";

const testSuite = TestSuite("Iterator: Constructor Iterator");

addToTestingTable(testSuite)(
  createTestConfig({
    name:      "Iterator",
    iterator:  () => Iterator(0, current => current + 1, current => 4 < current),
    expected:  [0,1,2,3,4],
    excludedTests: [TESTS.TEST_PURITY, TESTS.TEST_CB_NOT_CALLED_AFTER_DONE]
  })
);

import { TestSuite }         from "../../../test/test.js";
import { createTestConfig }  from "../../util/testUtil.js";
import {
  addToTestingTable,
  TESTS
} from "../../util/testingTable.js";
import {JsonIterator} from "./jsonIterator.js";

const testSuite = TestSuite("Iterator: Constructor JsonIterator");

const sampleJson = JSON.parse( `{ "id": 42 }`);

// TODO: add test for copy after consumption
addToTestingTable(testSuite)(
  createTestConfig({
    name:     "JsonIterator test with object",
    iterator: () => JsonIterator(sampleJson),
    expected: [{id: 42}],
    evalFn: expected => actual => {
      const actualVal = [...actual];
      const expectedVal = [...expected];
      return expectedVal[0].id === actualVal[0].id
    },
    excludedTests: [TESTS.TEST_PURITY, TESTS.TEST_CB_NOT_CALLED_AFTER_DONE, TESTS.TEST_COPY_AFTER_CONSUMPTION]
  })
);

const sampleJsonArray = JSON.parse( `[1,2,3]`);

// TODO: add test for copy after consumption
addToTestingTable(testSuite)(
  createTestConfig({
    name:     "JsonIterator test with object",
    iterator: () => JsonIterator(sampleJsonArray),
    expected: [1,2,3],
    excludedTests: [TESTS.TEST_PURITY, TESTS.TEST_CB_NOT_CALLED_AFTER_DONE, TESTS.TEST_COPY_AFTER_CONSUMPTION]
  })
);


// TODO: add special case test with complex object in array
testSuite.run();
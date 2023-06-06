import { TestSuite }         from "../../../test/test.js";
import { createTestConfig }  from "../../util/testUtil.js";
import {
  addToTestingTable,
  TESTS
} from "../../util/testingTable.js";
import { toMonadicIterable } from "./toMonadicIterable.js";

const testSuite = TestSuite("Iterator: Constructor toMonadicIterable");

const sampleObj = { id: 42 };

addToTestingTable(testSuite)(
  createTestConfig({
    name:     "JsonIterator test with object",
    iterator: () => toMonadicIterable(sampleObj),
    expected: [sampleObj],
    evalFn: expected => actual => {
      const actualVal = [...actual];
      const expectedVal = [...expected];
      return expectedVal[0].id === actualVal[0].id
    },
    excludedTests: [TESTS.TEST_CB_NOT_CALLED_AFTER_DONE]
  })
);

const sampleArray = [1,2,3];
addToTestingTable(testSuite)(
  createTestConfig({
    name:           "JsonIterator test with array",
    iterator:       () => toMonadicIterable(sampleArray),
    expected:       sampleArray,
    excludedTests:  [TESTS.TEST_CB_NOT_CALLED_AFTER_DONE]
  })
);

// TODO: add special case test with complex object in array
testSuite.run();
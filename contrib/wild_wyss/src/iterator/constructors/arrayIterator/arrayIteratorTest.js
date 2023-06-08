import { TestSuite }         from "../../../test/test.js";
import { createTestConfig }  from "../../util/testUtil.js";
import { ArrayIterator }     from "./arrayIterator.js";
import { arrayEq }           from "../../../../../../docs/src/kolibri/util/arrayFunctions.js";
import { nil }               from "../nil/nil.js";
import {
  addToTestingTable,
  TESTS
} from "../../util/testingTable.js";

const testSuite = TestSuite("Iterator: Constructor ArrayIterator");

addToTestingTable(testSuite)(
  createTestConfig({
    name:      "ArrayIterator",
    iterator:  () => ArrayIterator([0,1,2,3,4]),
    expected:  [0,1,2,3,4],
    excludedTests: [
      TESTS.TEST_PURITY,
      TESTS.TEST_CB_NOT_CALLED_AFTER_DONE,
    ]
  })
);

testSuite.add("test iterate on copy", assert => {
  // Given
  const arr = [1,2,3];
  const arrayIterator = ArrayIterator(arr);

  // When
  arr.push(4);

  // Then
  assert.isTrue(arrayEq([1,2,3])([...arrayIterator]));
});

testSuite.add("test empty array", assert => {
  // Given
  const arr = [];

  // When
  const arrayIterator = ArrayIterator(arr);

  // Then
  assert.iterableEq(arrayIterator, nil);
});

testSuite.run();
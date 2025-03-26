import { addToTestingTable, TESTS } from "../../util/testingTable.js";
import { TestSuite }                from "../../../util/test.js";
import { take }                     from "../../operators/take/take.js";
import { isEmpty }                  from "./isEmpty.js";
import {
  createTestConfig,
  newSequence,
  UPPER_SEQUENCE_BOUNDARY
}                                   from "../../util/testUtil.js";

const testSuite = TestSuite("Sequence: terminal operation isEmpty");

addToTestingTable(testSuite)(
  createTestConfig({
    name:      "isEmpty",
    iterable:  () => take(0)(newSequence(UPPER_SEQUENCE_BOUNDARY)),
    operation: () => isEmpty,
    evalFn:    expected => actual => expected === actual,
    expected:  true,
    excludedTests: [TESTS.TEST_CB_NOT_CALLED_AFTER_DONE]
  })
);

testSuite.add("test typical case: isEmpty should return false", assert => {
  // Given
  const sequence = [1,2,3];

  // When
  const result   = isEmpty(sequence);

  // Then
  assert.is(result, false);
});

testSuite.run();

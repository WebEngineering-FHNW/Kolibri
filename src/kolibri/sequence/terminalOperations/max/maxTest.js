import { ILLEGAL_ARGUMENT_EMPTY_ITERABLE }    from "../../util/errorMessages.js";
import { addToTestingTable, TESTS }           from "../../util/testingTable.js";
import { TestSuite }                          from "../../../util/test.js";
import { PureSequence, max$, replicate, nil } from "../../sequence.js";
import {
  createTestConfig,
  newSequence,
  UPPER_SEQUENCE_BOUNDARY
}                                             from "../../util/testUtil.js";

const testSuite = TestSuite("Sequence: terminal operation max$");

addToTestingTable(testSuite)(
  createTestConfig({
    name:      "max$",
    iterable:  () => newSequence(UPPER_SEQUENCE_BOUNDARY),
    operation: () => max$,
    expected:  4,
    evalFn:    expected => actual => expected === actual,
    excludedTests: [TESTS.TEST_CB_NOT_CALLED_AFTER_DONE]
  })
);

testSuite.add("test single element: should return the only element ", assert =>
  // Then
  assert.is(max$(PureSequence(1)), 1));

testSuite.add("test empty sequence: should throw an error", assert =>
  // Then
  assert.throws(() => max$(nil), ILLEGAL_ARGUMENT_EMPTY_ITERABLE));

testSuite.add("test comparator on strings: should return the longest string", assert => {
  // Given
  const strings = ["a", "b", "aa", "bb"];

  // When
  const result = max$(strings, (a, b) => a.length < b.length);

  // Then
  assert.is(result, "aa");
});

testSuite.add("test largest element at the end of the iterable", assert => {
  // Given
  const sequence = [4,3,2,5,1,0,9];

  // When
  const result   = max$(sequence);

  // Then
  assert.is(result, 9);
});

testSuite.add("test largest element at the start of the iterable", assert => {
  // Given
  const sequence = [9,4,3,2,5,1,0];

  // When
  const result   = max$(sequence);

  // Then
  assert.is(result, 9);
});

testSuite.add("test multiple of equal values", assert => {
  // Given
  const values = replicate(4)(7);

  // When
  const result = max$(values);

  // Then
  assert.is(result, 7);
});

testSuite.run();

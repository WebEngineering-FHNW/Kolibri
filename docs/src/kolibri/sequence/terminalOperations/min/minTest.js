import { ILLEGAL_ARGUMENT_EMPTY_ITERABLE }    from "../../util/errorMessages.js";
import { addToTestingTable, TESTS }           from "../../util/testingTable.js";
import { TestSuite }                          from "../../../util/test.js";
import { replicate, PureSequence, nil, min$ } from "../../sequence.js";
import {
  createTestConfig,
  newSequence,
  UPPER_SEQUENCE_BOUNDARY
}                                             from "../../util/testUtil.js";

const testSuite = TestSuite("Sequence: terminal operation min$");

addToTestingTable(testSuite)(
  createTestConfig({
    name:      "min$",
    iterable:  () => newSequence(UPPER_SEQUENCE_BOUNDARY),
    operation: () => min$,
    param:     () => {},
    expected:  0,
    evalFn:    expected => actual => expected === actual,
    excludedTests: [TESTS.TEST_CB_NOT_CALLED_AFTER_DONE]
  })
);

testSuite.add("test single element should return the element ", assert =>
  // Then
  assert.is(min$(PureSequence(1)), 1));

testSuite.add("test empty sequence: should throw an error", assert =>
  // Then
  assert.throws(() => min$(nil), ILLEGAL_ARGUMENT_EMPTY_ITERABLE));

testSuite.add("test min on strings: should return the shortest string", assert => {
  // Given
  const strings = ["a", "aa", ];

  // When
  const result = min$(strings, (a, b) => a.length < b.length);

  // Then
  assert.is(result, "a");
});

testSuite.add("test smallest element at the end of the iterable", assert => {
  // Given
  const sequence = [4,3,2,5,1,9,0];

  // When
  const result   = min$(sequence);

  // Then
  assert.is(result, 0);
});

testSuite.add("test smallest element at the start of the iterable", assert => {
  // Given
  const sequence = [0,9,4,3,2,5,1];

  // When
  const result   = min$(sequence);

  // Then
  assert.is(result, 0);
});

testSuite.add("test multiple of equal values", assert => {
  // Given
  const values = replicate(4)(7);

  // When
  const result = min$(values);

  // Then
  assert.is(result, 7);
});

testSuite.run();

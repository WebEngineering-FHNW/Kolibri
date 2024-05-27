import { addToTestingTable, TESTS } from "../../util/testingTable.js";
import { TestSuite }                from "../../../util/test.js";
import { show }                     from "./show.js";
import { nil, Range }               from "../../sequence.js";
import {
  createTestConfig,
  newSequence,
  UPPER_SEQUENCE_BOUNDARY
}                                   from "../../util/testUtil.js";

const testSuite = TestSuite("Sequence: terminal operation show");

addToTestingTable(testSuite)(
  createTestConfig({
    name:      "show",
    iterable:  () => newSequence(UPPER_SEQUENCE_BOUNDARY),
    operation: () => show,
    evalFn:    expected => actual => expected === actual,
    expected:  "[0,1,2,3,4]",
    excludedTests: [TESTS.TEST_CB_NOT_CALLED_AFTER_DONE]
  })
);

testSuite.add("test boundary value", assert => {
  // Given
  const it = Range(0);

  // When
  const result = show(it);

  // Then
  assert.is(result, "[0]");
});

testSuite.add("test given output length", assert => {
  // Given
  const range  = Range(100);

  // When
  const result = show(range, 2);

  // Then
  assert.is(result, "[0,1]");
});

testSuite.add("test equality of show and toString", assert => {
  // Given
  const range  = Range(10);

  // When
  const result = show(range);

  // Then
  assert.is(result, range.toString());
});


testSuite.add("test exceed default output length (50)", assert => {
  // Given
  const range  = Range(100);

  // When
  const result = show(range);
  /**
   * 2  [braces]
   * 49 [commas]
   * 10 [0-9]
   * 40 [10-49] ( x2 )
   */
  const outputLength = 2 + 49 + 10 + 2 * 40;

  // Then
  assert.is(result.length, outputLength);
});

testSuite.add("test show of an iterable of iterables", assert => {
  // Given
  const ranges = [Range(1), Range(2), Range(3)];

  // When
  const result = show(ranges);

  // Then
  assert.is(result, "[[0,1],[0,1,2],[0,1,2,3]]");
});

testSuite.add("test show of an empty iterable", assert => {
  // When
  const result = show(nil);

  // Then
  assert.is(result, "[]");
});

testSuite.run();

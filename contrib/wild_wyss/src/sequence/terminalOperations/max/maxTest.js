import { ILLEGAL_ARGUMENT_EMPTY_ITERATOR }    from "../../util/errorMessages.js";
import { addToTestingTable, TESTS }           from "../../util/testingTable.js";
import { TestSuite }                          from "../../../test/test.js";
import { PureSequence, max$, replicate, nil } from "../../sequence.js";
import {
  createTestConfig,
  newSequence,
  UPPER_ITERATOR_BOUNDARY
} from "../../util/testUtil.js";

const testSuite = TestSuite("Sequence: terminal Operations max$");

addToTestingTable(testSuite)(
  createTestConfig({
    name:      "max$",
    iterable:  () => newSequence(UPPER_ITERATOR_BOUNDARY),
    operation: () => max$,
    expected:  4,
    evalFn:    expected => actual => expected === actual,
    excludedTests: [TESTS.TEST_CB_NOT_CALLED_AFTER_DONE]
  })
);

testSuite.add("test single element: should return the only element ", assert =>
 assert.is(max$(PureSequence(1)), 1));

testSuite.add("test empty iterator: should throw an error", assert =>
  assert.throws(() => max$(nil), ILLEGAL_ARGUMENT_EMPTY_ITERATOR));

testSuite.add("test comparator on strings: should return the longest string", assert => {
  // Given
  const strings = ["a", "b", "aa", "bb"];

  // When
  const result = max$(strings, (a, b) => a.length < b.length);

  // Then
  assert.is(result, "aa");
});

testSuite.add("test largest element at the end of the iterator", assert => {
  // Given
  const iterator = [4,3,2,5,1,0,9];

  // When
  const result   = max$(iterator);

  // Then
  assert.is(result, 9);
});

testSuite.add("test largest element at the start of the iterator", assert => {
  // Given
  const iterator = [9,4,3,2,5,1,0];

  // When
  const result   = max$(iterator);

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
import { ILLEGAL_ARGUMENT_EMPTY_ITERATOR } from "../../util/errorMessages.js";
import { nil }                             from "../../constructors/nil/nil.js";
import { addToTestingTable, TESTS }        from "../../util/testingTable.js";
import { TestSuite }                       from "../../../test/test.js";
import { min$ }                            from "./min.js"
import { PureIterator }                    from "../../constructors/pureIterator/pureIterator.js";
import { ArrayIterator }                   from "../../constructors/arrayIterator/arrayIterator.js";
import { replicate }                       from "../../constructors/replicate/replicate.js";
import {
  createTestConfig,
  newIterator,
  UPPER_ITERATOR_BOUNDARY
} from "../../util/testUtil.js";

const testSuite = TestSuite("Iterator: terminal Operations min$");

addToTestingTable(testSuite)(
  createTestConfig({
    name:      "min$",
    iterator:  () => newIterator(UPPER_ITERATOR_BOUNDARY),
    operation: () => min$,
    param:     () => {},
    expected:  0,
    evalFn:    expected => actual => expected === actual,
    excludedTests: [
      TESTS.TEST_CB_NOT_CALLED_AFTER_DONE
    ]
  })
);

testSuite.add("test single element should return the element ", assert =>
 assert.is(min$(PureIterator(1)), 1));

testSuite.add("test empty iterator: should throw an error", assert =>
  assert.throws(() => min$(nil), ILLEGAL_ARGUMENT_EMPTY_ITERATOR));

testSuite.add("test min on strings: should return the shortest string", assert => {
  // Given
  const strings = ["a", "b", "aa", "bb"];

  // When
  const result = min$(strings, (a, b) => b.length < a.length);

  // Then
  assert.is(result, "a");
});

testSuite.add("test smallest element at the end of the iterator", assert => {
  // Given
  const iterator = [4,3,2,5,1,9,0];

  // When
  const result   = min$(iterator);

  // Then
  assert.is(result, 0);
});

testSuite.add("test smallest element at the start of the iterator", assert => {
  // Given
  const iterator = [0,9,4,3,2,5,1];

  // When
  const result   = min$(iterator);

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
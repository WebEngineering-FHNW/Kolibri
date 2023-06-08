import { nil }                      from "../../constructors/nil/nil.js";
import { addToTestingTable, TESTS } from "../../util/testingTable.js";
import { TestSuite }                from "../../../test/test.js";
import { PureIterator }             from "../../constructors/pureIterator/pureIterator.js";
import { ArrayIterator }            from "../../constructors/arrayIterator/arrayIterator.js";
import { replicate }                from "../../constructors/replicate/replicate.js";
import { Just }                     from "../../../stdlib/maybe.js";
import { safeMin$ }                 from "./safeMin.js";
import {
  createTestConfig,
  newIterator,
  UPPER_ITERATOR_BOUNDARY
} from "../../util/testUtil.js";

const testSuite = TestSuite("Iterator: terminal Operations safeMin$");

addToTestingTable(testSuite)(
  createTestConfig({
    name:      "safeMin$",
    iterator:  () => newIterator(UPPER_ITERATOR_BOUNDARY),
    operation: () => safeMin$,
    expected:  Just(0),
    evalFn:    expected => actual => {
      let unwrappedVal;
      expected(_ => {})(x => unwrappedVal = x);

      let result = false;
      actual
      (_ => false)
      (x => result = x === unwrappedVal);
      return result;
    },
    excludedTests: [
      TESTS.TEST_CB_NOT_CALLED_AFTER_DONE,
      TESTS.TEST_INVARIANTS
    ]
  })
);

testSuite.add("test single element: should return the only element ", assert => {
  // Given
  const single = PureIterator(1);

  // When
  const maybeMin = safeMin$(single);

  // Then
  maybeMin
  (_ => assert.isTrue(false))
  (x => assert.is(x, 1));
});

testSuite.add("test empty iterator: should return Nothing", assert => {
  // When
  const maybeMin = safeMin$(nil);

  // Then
  maybeMin
  (_ => assert.isTrue(true))
  (_ => assert.isTrue(false));
});

testSuite.add("test comparator on strings: should return the longest string", assert => {
  // Given
  const strings = ArrayIterator(["a", "b", "aa", "bb"]);

  // When
  const maybeMin = safeMin$(strings, (a, b) => a.length > b.length);

  // Then
  maybeMin
  (_ => assert.isTrue(false))
  (x => assert.is(x, "a"));
});

testSuite.add("test smallest element at the end of the iterator", assert => {
  // Given
  const iterator = ArrayIterator([4,3,2,5,1,9,0]);

  // When
  const maybeMin   = safeMin$(iterator);

  // Then
  maybeMin
  (_ => assert.isTrue(false))
  (x => assert.is(x, 0));
});

testSuite.add("test smallest element at the start of the iterator", assert => {
  // Given
  const iterator = ArrayIterator([0,9,4,3,2,5,1]);

  // When
  const maybeMin   = safeMin$(iterator);

  // Then
  maybeMin
  (_ => assert.isTrue(false))
  (x => assert.is(x, 0));
});

testSuite.add("test multiple of equal values", assert => {
  // Given
  const values = replicate(4)(7);

  // When
  const maybeMin = safeMin$(values);

  // Then
  maybeMin
  (_ => assert.isTrue(false))
  (x => assert.is(x, 7));
});

testSuite.run();

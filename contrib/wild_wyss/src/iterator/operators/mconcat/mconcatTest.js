import { addToTestingTable } from "../../util/testingTable.js";
import { TestSuite }         from "../../../test/test.js";
import { ArrayIterator }     from "../../constructors/arrayIterator/arrayIterator.js";
import { nil }               from "../../constructors/nil/nil.js";
import { arrayEq }           from "../../../../../../docs/src/kolibri/util/arrayFunctions.js";
import { Iterator }          from "../../constructors/iterator/iterator.js";
import { mconcat }           from "./mconcat.js";
import {
  createTestConfig,
  newIterator, UPPER_ITERATOR_BOUNDARY,
} from "../../util/testUtil.js";

const testSuite = TestSuite("Iterator: Operation mconcat");

addToTestingTable(testSuite)(
  createTestConfig({
    name:       "mconcat",
    iterator:   () => ArrayIterator([ newIterator(2), newIterator(2), newIterator(2), ]),
    operation:  () => mconcat,
    expected:   [0, 1, 2, 0, 1, 2, 0, 1, 2]
  })
);

testSuite.add("test left/right neutrality: mconcat", assert => {
  // Given
  const iterable = [0,1,2,3,4];

  // When
  const left  = mconcat([nil, iterable]);
  const right = mconcat([iterable, nil]);

  // Then
  assert.iterableEq(left, iterable);
  assert.iterableEq(right, iterable);
});

testSuite.add("test left/right associativity: mconcat", assert => {
  // Given
  const it1   = [0];
  const it2   = [0, 1];
  const it3   = [0, 1, 2];

  // When
  const left  = mconcat([mconcat([it1, it2]), it3]);
  const right = mconcat([it1, mconcat([it2, it3])]);

  // Then
  const expected = [0,0,1,0,1,2];
  assert.iterableEq(left, expected);
  assert.iterableEq(right, expected);
});

testSuite.add("test concat with infinity: mconcat", assert => {
  // Given
  let called  = false;
  let counter = 0;

  const endless                = Iterator(0, i => i + 1, _ => false);
  const iteratorWithSideEffect = Iterator(false, _ => called = true, _ => false);
  const concatenated           = mconcat([endless, iteratorWithSideEffect]);

  // When
  for (const _ of concatenated) {
    if (counter++ > 10) break; // consume a few elements
  }

  // Then
  assert.is(called, false);
});

// TODO: remove as soon, as test with nil is in testing table
testSuite.add("test empty: mconcat", assert => {
  // Given
  const concatenated = mconcat([nil]);

  // Then
  assert.iterableEq([], concatenated);
});


testSuite.run();

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
  const left  = mconcat(ArrayIterator([nil, newIterator(UPPER_ITERATOR_BOUNDARY)]));
  const right = mconcat(ArrayIterator([newIterator(UPPER_ITERATOR_BOUNDARY), nil]));
  const expected = [0,1,2,3,4];
  assert.isTrue(arrayEq(expected)([...right]));
  assert.isTrue(arrayEq(expected)([...left]));
});

testSuite.add("test left/right associativity: mconcat", assert => {
  const it1   = newIterator(1);
  const it2   = newIterator(2);
  const it3   = newIterator(3);
  const left  = mconcat(ArrayIterator([mconcat(ArrayIterator([it1, it2])), it3]));
  const right = mconcat(ArrayIterator([it1, mconcat(ArrayIterator([it2, it3]))]));
  const expected = [0,1,0,1,2,0,1,2,3];
  assert.isTrue(arrayEq(expected)([...right]));
  assert.isTrue(arrayEq(expected)([...left]));
});

testSuite.add("test concat with infinity: mconcat", assert => {
  let called  = false;
  let counter = 0;

  const endless                = Iterator(0, i => i + 1, _ => false);
  const iteratorWithSideEffect = Iterator(false, _ => called = true, _ => false);
  const concatenated           = mconcat(ArrayIterator([endless, iteratorWithSideEffect]));

  for (const _ of concatenated) {
    if (counter++ > 10) break; // consume a few elements
  }
  assert.is(called, false);
});

testSuite.add("test empty: mconcat", assert => {
  const concatenated = mconcat(ArrayIterator([nil]));
  assert.isTrue(arrayEq([])([...concatenated]));
});

testSuite.add("test : mconcat", assert => {
  const concatenated = mconcat(ArrayIterator([nil]));
  assert.isTrue(arrayEq([])([...concatenated]));
});

testSuite.run();
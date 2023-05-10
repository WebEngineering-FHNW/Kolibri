import {TestSuite} from "../../test/test.js";
import {arrayEq} from "../../../../../docs/src/kolibri/util/arrayFunctions.js";
import {
  ArrayIterator,
  concat,
  Iterator,
  IteratorPrototype,
  nil,
  PureIterator,
  repeat,
  take,
  zipWith
} from "../iterator.js"
import {newIterator} from "../util/testUtil.js";
import {Range} from "../../range/range.js";

const iteratorSuite = TestSuite("Iterator");

iteratorSuite.add("test special case: no increment after done", assert => {
  let result = true;
  const iterator = Iterator(true, _ => result = false, _ => true);
  for (const iteratorElement of iterator) { /* exhausting iterator */ }
  assert.isTrue(result);
});

iteratorSuite.add("test iterate on copy: ArrayIterator", assert => {
  const arr = [1,2,3];
  const arrayIterator = ArrayIterator(arr);
  arr.push(4);

  assert.isTrue(arrayEq([1,2,3])([...arrayIterator]));
});

iteratorSuite.add("test purity: ConcatIterator", assert => {
  const it1 = newIterator(4);
  const it2 = newIterator(2);
  const concatIterator = concat(it1)(it2);
  for (const _ of concatIterator) { /* Exhausting */ }
  assert.isTrue(arrayEq([0,1,2,3,4])([...it1]));
  assert.isTrue(arrayEq([0,1,2])    ([...it2]));
});

iteratorSuite.add("test left/right neutrality: ConcatIterator", assert => {
  const left =  concat(nil)(newIterator(4));
  const right = concat(newIterator(4))(nil);
  const expected = [0,1,2,3,4];
  assert.isTrue(arrayEq(expected)([...right]));
  assert.is(arrayEq(expected)([...left]),  true);
});

iteratorSuite.add("test left/right associativity: ConcatIterator", assert => {
  const left  = concat(concat(newIterator(2))(newIterator(1)))(newIterator(3));
  const right = concat(newIterator(2))(concat(newIterator(1))(newIterator(3)));
  const expected = [0,1,2,0,1,0,1,2,3];
  assert.isTrue(arrayEq(expected)([...right]));
  assert.is(arrayEq(expected)([...left]),  true);
});

iteratorSuite.add("test concat with infinity: ConcatIterator", assert => {
  let called  = false;
  let counter = 0;

  const endless                = Iterator(0, i => i + 1, _ => false);
  const iteratorWithSideEffect = Iterator(false, _ => called = true, _ => false)
  const concatenated           = concat(endless)(iteratorWithSideEffect);

  for (const _ of concatenated) {
    if (counter++ > 10) break; // consume a few elements
  }
  assert.is(called, false);
});

iteratorSuite.add("test empty: ConcatIterator", assert => {
  const concatenated = concat(nil)(nil);
  assert.is(arrayEq([])([...concatenated]),  true);
});


iteratorSuite.add("test : and", assert => {
  const result = Range(3).and(el => Range(el));
  assert.isTrue(arrayEq([0, 0, 1, 0, 1, 2, 0, 1, 2, 3])([...result]));
});

// TODO: Add to testing table
iteratorSuite.add("test : prototype", assert => {
  assert.is(Object.getPrototypeOf(nil), IteratorPrototype);
});

iteratorSuite.run();

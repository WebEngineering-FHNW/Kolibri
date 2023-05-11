import { TestSuite }       from "../../test/test.js";
import { arrayEq }         from "../../../../../docs/src/kolibri/util/arrayFunctions.js";
import { Pair, fst, snd }  from "../../../../../docs/src/kolibri/stdlib.js";
import {
  ArrayIterator,
  nil,
  Iterator,
  cons,
  cycle,
  concat,
  drop,
  dropWhile,
  map,
  mconcat,
  rejectAll,
  retainAll,
  reverse$,
  take,
  takeWhile,
  zip,
  zipWith,
  bind,
} from "../iterator.js";

import {
  UPPER_ITERATOR_BOUNDARY,
  newIterator,
  testCBNotCalledAfterDone,
  testCopy,
  testCopyAfterConsumption,
  testPurity,
  createTestConfig,
  testSimple,
} from "../util/testUtil.js";
import {takeWithoutCopy} from "../util/util.js";
import {Range} from "../../range/range.js";

const iteratorSuite = TestSuite("IteratorOperators");

const prepareTestSuite = () =>
  [

  ].forEach(config => {
    const { name } = config;
    iteratorSuite.add(`test simple: ${name}`,                           testSimple             (config));
    iteratorSuite.add(`test copy: ${name}`,                             testCopy                (config));
    iteratorSuite.add(`test copy after consumption: ${name}`,           testCopyAfterConsumption(config));
    iteratorSuite.add(`test purity: ${name}.`,                          testPurity              (config));
    iteratorSuite.add(`test callback not called after done: ${name}.`,  testCBNotCalledAfterDone(config));
  });



// Special cases

// takeWhile
iteratorSuite.add("test advanced case: takeWhile inner iterator is shorter", assert => {
  // the inner iterator stops before the outer
  const iterator = newIterator(UPPER_ITERATOR_BOUNDARY);
  const some = takeWhile(_ => true)(iterator);
  assert.isTrue(arrayEq([0, 1, 2, 3, 4])([...some]));
});

// dropWhile
iteratorSuite.add("test advanced case: dropWhile inner iterator is shorter", assert => {
  // the inner iterator stops before the outer
  const iterator = newIterator(UPPER_ITERATOR_BOUNDARY);
  const some = dropWhile(_ => false)(iterator);
  assert.isTrue(arrayEq([0, 1, 2, 3, 4])([...some]));
});

// zipWith
iteratorSuite.add("test advanced case: zipWith one iterator is shorter", assert => {
  let iterationCount = 0;

  const it1 = newIterator(UPPER_ITERATOR_BOUNDARY);
  const it2 = newIterator(2);
  const zipper = (i, j) => {
    iterationCount++;
    return i + j;
  };
  const zipped1 = zipWith(zipper)(it2)(it1); // first iterator is shorter
  const zipped2 = zipWith(zipper)(it1)(it2); // second iterator is shorter

  for (const _ of zipped1) { /* Exhausting*/ }
  assert.is(iterationCount, 3);

  for (const _ of zipped2) { /* Exhausting*/ }
  assert.is(iterationCount, 6);
});

// zip
iteratorSuite.add("test advanced case: zip one iterator is shorter", assert => {
  const it1 = newIterator(UPPER_ITERATOR_BOUNDARY);
  const it2 = newIterator(2);
  const zipped1 = zip(it2)(it1); // first iterator is shorter
  const zipped2 = zip(it1)(it2); // second iterator is shorter

  assert.is([...zipped1].length, 3);
  assert.is([...zipped2].length, 3);
});

// mconcat
iteratorSuite.add("test left/right neutrality: mconcat", assert => {
  const left  = mconcat(ArrayIterator([nil, newIterator(UPPER_ITERATOR_BOUNDARY)]));
  const right = mconcat(ArrayIterator([newIterator(UPPER_ITERATOR_BOUNDARY), nil]));
  const expected = [0,1,2,3,4];
  assert.isTrue(arrayEq(expected)([...right]));
  assert.isTrue(arrayEq(expected)([...left]));
});

iteratorSuite.add("test left/right associativity: mconcat", assert => {
  const it1   = newIterator(1);
  const it2   = newIterator(2);
  const it3   = newIterator(3);
  const left  = mconcat(ArrayIterator([mconcat(ArrayIterator([it1, it2])), it3]));
  const right = mconcat(ArrayIterator([it1, mconcat(ArrayIterator([it2, it3]))]));
  const expected = [0,1,0,1,2,0,1,2,3];
  assert.isTrue(arrayEq(expected)([...right]));
  assert.isTrue(arrayEq(expected)([...left]));
});

iteratorSuite.add("test concat with infinity: mconcat", assert => {
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

iteratorSuite.add("test empty: mconcat", assert => {
  const concatenated = mconcat(ArrayIterator([nil]));
  assert.isTrue(arrayEq([])([...concatenated]));
});

iteratorSuite.add("test : mconcat", assert => {
  const concatenated = mconcat(ArrayIterator([nil]));
  assert.isTrue(arrayEq([])([...concatenated]));
});

prepareTestSuite();
iteratorSuite.run();

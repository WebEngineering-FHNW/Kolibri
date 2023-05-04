import { TestSuite }       from "../../test/test.js";
import { arrayEq }         from "../../../../../docs/src/kolibri/util/arrayFunctions.js";
import { Pair, fst, snd }  from "../../../../../docs/src/kolibri/stdlib.js";

import {
  ArrayIterator,
  emptyIterator,
  Iterator,
  cons,
  cycle,
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

const iteratorSuite = TestSuite("IteratorOperators");

const prepareTestSuite = () =>
  [
    mapConfig,
    mconcatConfig,
    reverse$Config,
    zipConfig,
    dropConfig,
    takeConfig,
    consConfig,
    cycleConfig,
    retainAllConfig,
    rejectAllConfig,
    dropWhileConfig,
    takeWhileConfig,
    zipWithConfig,
    bindConfig,
  ].forEach(config => {
    const { name } = config;
    iteratorSuite.add(`test simple: ${name}`,                           testSimple             (config));
    iteratorSuite.add(`test copy: ${name}`,                             testCopy                (config));
    iteratorSuite.add(`test copy after consumption: ${name}`,           testCopyAfterConsumption(config));
    iteratorSuite.add(`test purity: ${name}.`,                          testPurity              (config));
    iteratorSuite.add(`test callback not called after done: ${name}.`,  testCBNotCalledAfterDone(config));
  });

const mapConfig = createTestConfig({
  name:       "map",
  iterator:   () => newIterator(UPPER_ITERATOR_BOUNDARY),
  operation:  map,
  param:      el => 2 * el,
  expected:   [0, 2, 4, 6, 8]
});

const mconcatConfig = createTestConfig({
  name:       "mconcat",
  iterator:   () => ArrayIterator([ newIterator(2), newIterator(2), newIterator(2), ]),
  operation:  () => mconcat,
  expected:   [0, 1, 2, 0, 1, 2, 0, 1, 2]
});

const bindConfig = createTestConfig({
  name:       "bind",
  iterator:   () => newIterator(UPPER_ITERATOR_BOUNDARY),
  operation:  bind,
  param:      el => take(2)(Iterator(el.toString(), _ => _, _ => false)),
  expected:   ["0", "0", "1", "1", "2", "2", "3", "3", "4", "4"]
});

const zipWithConfig = createTestConfig({
  name:       "zipWith",
  iterator:   () => newIterator(UPPER_ITERATOR_BOUNDARY),
  operation:  zipper => zipWith(zipper)(newIterator(UPPER_ITERATOR_BOUNDARY)),
  param:      (i, j) => i + j,
  expected:   [0, 2, 4, 6, 8]
});

const takeWhileConfig = createTestConfig({
  name:       "takeWhile",
  iterator:   () => newIterator(UPPER_ITERATOR_BOUNDARY),
  operation:  takeWhile,
  param:      el => el < 2,
  expected:   [0, 1]
});

const dropWhileConfig = createTestConfig({
  name:       "dropWhile",
  iterator:   () => newIterator(UPPER_ITERATOR_BOUNDARY),
  operation:  dropWhile,
  param:      el => el < 2,
  expected:   [2, 3, 4]
});

const rejectAllConfig = createTestConfig({
  name:       "rejectAll",
  iterator:   () => newIterator(UPPER_ITERATOR_BOUNDARY),
  operation:  rejectAll,
  param:      el => el % 2 === 0,
  expected:   [1, 3]
});

const retainAllConfig = createTestConfig({
  name:       "retainAll",
  iterator:   () => newIterator(UPPER_ITERATOR_BOUNDARY),
  operation:  retainAll,
  param:      el => el % 2 === 0,
  expected:   [0, 2, 4]
});

const cycleConfig = createTestConfig({
  name:       "cycle",
  iterator:   () => newIterator(2),
  operation:  () => cycle,
  expected:   [0, 1, 2, 0, 1, 2, 0, 1, 2],
  evalFn:     expected => actual => {
    const actualArray = takeWithoutCopy(9)(actual);
    const expectedArray = takeWithoutCopy(9)(expected);
    return arrayEq(expectedArray)(actualArray);
  }
});

const consConfig = createTestConfig({
  name:       "cons",
  iterator:   () => newIterator(UPPER_ITERATOR_BOUNDARY),
  operation:  cons,
  param:      2,
  expected:   [2, 0, 1, 2, 3, 4]
});

const takeConfig = createTestConfig({
  name:       "take",
  iterator:   () => newIterator(UPPER_ITERATOR_BOUNDARY),
  operation:  take,
  param:      2,
  expected:   [0, 1]
});

const dropConfig = createTestConfig({
  name:       "drop",
  iterator:   () => newIterator(UPPER_ITERATOR_BOUNDARY),
  operation:  drop,
  param:      2,
  expected:   [2, 3, 4]
});

const reverse$Config = createTestConfig({
  name:       "reverse$",
  iterator:   () => newIterator(UPPER_ITERATOR_BOUNDARY),
  operation:  () => reverse$,
  expected:   [4, 3, 2, 1, 0]
});

const zipConfig = createTestConfig({
  name:       "zip",
  iterator:   () => newIterator(UPPER_ITERATOR_BOUNDARY),
  operation:  zip,
  param:      newIterator(UPPER_ITERATOR_BOUNDARY),
  expected:   [Pair(0)(0), Pair(1)(1), Pair(2)(2), Pair(3)(3), Pair(4)(4)],
  evalFn:     expected => actual => {
    const expectedArray = [...expected];
    const actualArray = [...actual];
    let result = true;
    for (let i = 0; i < expectedArray.length; i++) {
      result = result && actualArray[i](fst) === expectedArray[i](fst);
      result = result && actualArray[i](snd) === expectedArray[i](snd);
    }
    return result;
  }
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
  const left  = mconcat(ArrayIterator([emptyIterator, newIterator(UPPER_ITERATOR_BOUNDARY)]));
  const right = mconcat(ArrayIterator([newIterator(UPPER_ITERATOR_BOUNDARY), emptyIterator]));
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
  const concatenated = mconcat(ArrayIterator([emptyIterator]));
  assert.isTrue(arrayEq([])([...concatenated]));
});

iteratorSuite.add("test : mconcat", assert => {
  const concatenated = mconcat(ArrayIterator([emptyIterator]));
  assert.isTrue(arrayEq([])([...concatenated]));
});

prepareTestSuite();
iteratorSuite.run();

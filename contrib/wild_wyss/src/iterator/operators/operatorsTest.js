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
  repeat,
  bind,
} from "../iterator.js";

import {
  UPPER_ITERATOR_BOUNDARY,
  newIterator,
  testCBNotCalledAfterDone,
  testCopy,
  testCopyAfterConsumption,
  testPurity,
  testSimple, createTestConfig, testSimple2,
} from "../util/testUtil.js";

const iteratorSuite = TestSuite("IteratorOperators");

const prepareTestSuite = () => {
  [
    ["drop",          drop(2),                           [2, 3, 4],                 ],
    ["take",          take(2),                           [0, 1],                    ],
    ["reverse$",      reverse$,                          [4, 3, 2, 1, 0],           ],
    ["cons",          cons(2),                           [2, 0, 1, 2, 3, 4],        ],
    ["mconcat",       mconcatInit,                       [0, 1, 2, 0, 1, 2, 0, 1, 2]],
    ["cycle",         cycleInit,                         [0, 1, 2, 0, 1, 2, 0, 1, 2]],
    ["repeat",        repeatInit,                        [1, 1, 1, 1, 1, 1, ]       ],
    ["zip",           zipInit,                           expectedZipResult,         zipEvaluation]
  ].forEach(el => {
    const [ name, op, expected, evalFn ] = el;
    // iteratorSuite.add(`test simple: ${name}`,                 testSimple              (op)(expected)(evalFn));
    // iteratorSuite.add(`test copy: ${name}`,                   testCopy                (op)(evalFn));
    // iteratorSuite.add(`test copy after consumption: ${name}`, testCopyAfterConsumption(op)(evalFn));
    // iteratorSuite.add(`test purity: ${name}.`,                testPurity              (op));
  });


  // operations which take callbacks as arguments
  [
    ["map",           map,        (el => 2 * el),           [0, 2, 4, 6, 8],                                  ],
    ["retainAll",     retainAll,  (el => el % 2 === 0),     [0, 2, 4],                                        ],
    ["rejectAll",     rejectAll,  (el => el % 2 === 0),     [1, 3],                                           ],
    ["dropWhile",     dropWhile,  (el => el < 2),           [2, 3, 4],                                        ],
    ["takeWhile",     takeWhile,  (el => el < 2),           [0, 1],                                           ],
    ["zipWith",       zipWithInit,((i, j) => i + j),        [0, 2, 4, 6, 8]                                   ],
    ["bind",          bind,       bindFn,                   ["0", "0", "1", "1", "2", "2", "3", "3", "4", "4"]]
  ].forEach(el => {
    const [ name, op, callback, expected, evalFn] = el;
    // iteratorSuite.add(`test simple: ${name}`,                           testSimple              (op(callback))(expected)(evalFn));
    // iteratorSuite.add(`test copy: ${name}`,                             testCopy                (op(callback))(evalFn));
    // iteratorSuite.add(`test copy after consumption: ${name}`,           testCopyAfterConsumption(op(callback))(evalFn));
    // iteratorSuite.add(`test purity: ${name}.`,                          testPurity              (op(callback)));
    // iteratorSuite.add(`test callback not called after done: ${name}.`,  testCBNotCalledAfterDone(op)(callback));
  });

  [
    mapTester,
    dropTester,
    reverse$Tester,
    zipTester
  ].forEach(config => {
    iteratorSuite.add(`test simple: ${name}`,                           testSimple2             (config));
    iteratorSuite.add(`test copy: ${name}`,                             testCopy                (config));
    iteratorSuite.add(`test copy after consumption: ${name}`,           testCopyAfterConsumption(config));
    iteratorSuite.add(`test purity: ${name}.`,                          testPurity              (config));
    iteratorSuite.add(`test callback not called after done: ${name}.`,  testCBNotCalledAfterDone(config));
  })
};

const mapTester = createTestConfig({
  name:      "map",
  iterator:  () => newIterator(UPPER_ITERATOR_BOUNDARY),
  operation: map,
  param:     el => 2 * el,
  expected:  [0, 2, 4, 6, 8]
});

const dropTester = createTestConfig({
  name:     "drop",
  iterator: () => newIterator(UPPER_ITERATOR_BOUNDARY),
  operation: drop,
  param: 2,
  expected: [2, 3, 4]
});

const reverse$Tester = createTestConfig({
  name:     "reverse$",
  iterator: () => newIterator(UPPER_ITERATOR_BOUNDARY),
  operation: () => reverse$,
  expected: [4, 3, 2, 1, 0]
});

const zipTester = createTestConfig({
  name: "zip",
  iterator: () => newIterator(UPPER_ITERATOR_BOUNDARY),
  operation: zip,
  param: newIterator(UPPER_ITERATOR_BOUNDARY),
  expected: [Pair(0)(0), Pair(1)(1), Pair(2)(2), Pair(3)(3), Pair(4)(4)],
  evalFn: expectedArray => actualArray => {
    let result = true;
    for (let i = 0; i < expectedArray.length; i++) {
      result = result && actualArray[i](fst) === expectedArray[i](fst);
      result = result && actualArray[i](snd) === expectedArray[i](snd);
    }
    return result;
  }
});











































const bindFn =
  el => take(2)(Iterator(el.toString(), _ => _, _ => false));

// bootstrap operations for tests
const mconcatInit = _ => mconcat(ArrayIterator([
  newIterator(2),
  newIterator(2),
  newIterator(2),
]));

const cycleInit = _ => {
  const iterator = newIterator(2);
  const cycled = cycle(iterator);

  return take(9)(cycled);
};

const zipWithInit = zipper => {
  const it1 = newIterator(UPPER_ITERATOR_BOUNDARY);
  return zipWith(zipper)(it1);
};

const zipInit =
  zip(newIterator(UPPER_ITERATOR_BOUNDARY));

const repeatInit = _ => take(6)(repeat(1));

const zipEvaluation = expectedArray => actualArray => {
  let result = true;
  for (let i = 0; i < expectedArray.length; i++) {
    result = result && actualArray[i](fst) === expectedArray[i](fst);
    result = result && actualArray[i](snd) === expectedArray[i](snd);
  }
  return result;
};

const expectedZipResult = [Pair(0)(0), Pair(1)(1), Pair(2)(2), Pair(3)(3), Pair(4)(4)];

// operations which take values as arguments

iteratorSuite.add("test advanced case: takeWhile inner iterator is shorter", assert => {
  // the inner iterator stops before the outer
  const iterator = newIterator(UPPER_ITERATOR_BOUNDARY);
  const some = takeWhile(_ => true)(iterator);
  assert.isTrue(arrayEq([0, 1, 2, 3, 4])([...some]));
});

iteratorSuite.add("test advanced case: dropWhile inner iterator is shorter", assert => {
  // the inner iterator stops before the outer
  const iterator = newIterator(UPPER_ITERATOR_BOUNDARY);
  const some = dropWhile(_ => false)(iterator);
  assert.isTrue(arrayEq([0, 1, 2, 3, 4])([...some]));
});

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

iteratorSuite.add("test advanced case: zip one iterator is shorter", assert => {
  const it1 = newIterator(UPPER_ITERATOR_BOUNDARY);
  const it2 = newIterator(2);
  const zipped1 = zip(it2)(it1); // first iterator is shorter
  const zipped2 = zip(it1)(it2); // second iterator is shorter

  assert.is([...zipped1].length, 3);
  assert.is([...zipped2].length, 3);
});

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

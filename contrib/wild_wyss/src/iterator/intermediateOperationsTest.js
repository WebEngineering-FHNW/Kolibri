import {TestSuite} from "../../../../docs/src/kolibri/util/test.js";
import {arrayEq} from "../../../../docs/src/kolibri/util/arrayFunctions.js";

import {ArrayIterator, ConcatIterator, emptyIterator, Iterator} from "./iterator.js"
import {fst, snd} from "../../../../docs/src/kolibri/stdlib.js";


import {
  concat$,
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
} from "./intermediateOperations.js";

/**
 *
 * @param  { Number } limit
 * @returns { IteratorType<Number> }
 */
const newIterator = limit => Iterator(0, current => current + 1, current => current > limit);

const iteratorSuite = TestSuite("IntermediateOperations");
const UPPER_ITERATOR_BOUNDARY = 4;

const testSimple = op => expected => assert => {
  const it       = newIterator(UPPER_ITERATOR_BOUNDARY);
  const operated = op(it);
  assert.is(arrayEq(expected)([...operated]), true)
};

/**
 * Checks if a given operation does not modify the underlying iterator.
 */
const testPurity = op => assert => {
  const iterator = newIterator(UPPER_ITERATOR_BOUNDARY);
  op(iterator);
  assert.is(arrayEq([0,1,2,3,4])([...iterator]), true);
};

const testCopy = op => assert => {
  const expected = op(newIterator(UPPER_ITERATOR_BOUNDARY));
  const copied   = op(newIterator(UPPER_ITERATOR_BOUNDARY)).copy();

  assert.is(arrayEq([...expected])([...copied]), true);
};
/**
 * Since there is no guarantee that the value of the iterator is existing when done is true,
 * it must be ensured that the callback function is not called after that.
 * @type {
 *         (op: (number) => IteratorOperation<number>)
 *      => (callback: (el: number) => any)
 *      => (assert: any)
 *      => void
 * }
 */
const testCBNotCalledAfterDone = op => callback => assert => {
  let called = false;
  const it = Iterator(0, _ => 0, _ => true);
  const operated = op(el => {
    // since this iterator is empty, called should never be set to true
    called = true;
    return callback(el)
  })(it);

  for (const _ of operated) { /* exhausting */ }
  assert.is(called, false);
};

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

// operations which take values as argumnets
[
  ["drop",          drop(2),                           [2, 3, 4],                 ],
  ["take",          take(2),                           [0, 1],                    ],
  ["reverse$",      reverse$,                          [4, 3, 2, 1, 0],           ],
  ["concat$ (fst)", concat$(newIterator(1)),           [0, 1, 0, 1, 2, 3, 4],     ],
  ["concat$ (snd)", it => concat$(it)(newIterator(1)), [0, 1, 2, 3, 4, 0, 1],     ],
  ["cons",          cons(2),                           [2, 0, 1, 2, 3, 4],        ],
  ["mconcat",       mconcatInit,                       [0, 1, 2, 0, 1, 2, 0, 1, 2]],
  ["cycle",         cycleInit,                         [0, 1, 2, 0, 1, 2, 0, 1, 2]],
].forEach(el => {
  const [ name, op, expected ] = el;
  iteratorSuite.add(`test simple: ${name}`,  testSimple (op)(expected));
  iteratorSuite.add(`test copy: ${name}`,    testCopy   (op));
  iteratorSuite.add(`test purity: ${name}.`, testPurity (op));
});

// operations which take callbacks as arguments
[
  ["map",           map,        (el => 2 * el),           [0, 2, 4, 6, 8],           ],
  ["retainAll",     retainAll,  (el => el % 2 === 0),     [0, 2, 4],                 ],
  ["rejectAll",     rejectAll,  (el => el % 2 === 0),     [1, 3],                    ],
  ["dropWhile",     dropWhile,  (el => el < 2),           [2, 3, 4],                 ],
  ["takeWhile",     takeWhile,  (el => el < 2),           [0, 1],                    ],
  ["zipWith",       zipWithInit,((i, j) => i + j),        [0, 2, 4, 6, 8]            ],
].forEach(el => {
  const [ name, op, callback, expected ] = el;
  iteratorSuite.add(`test simple: ${name}`,                           testSimple(op(callback))(expected));
  iteratorSuite.add(`test copy: ${name}`,                             testCopy(op(callback)));
  iteratorSuite.add(`test purity: ${name}.`,                          testPurity(op(callback)));
  iteratorSuite.add(`test callback not called after done: ${name}.`,  testCBNotCalledAfterDone(op)(callback));
});

iteratorSuite.add("test advanced case: takeWhile inner iterator is shorter", assert => {
  // the inner iterator stops before the outer
  const iterator = newIterator(UPPER_ITERATOR_BOUNDARY);
  const some = takeWhile(_ => true)(iterator);
  assert.is(arrayEq([0, 1, 2, 3, 4])([...some]), true);
});

iteratorSuite.add("test advanced case: dropWhile inner iterator is shorter", assert => {
  // the inner iterator stops before the outer
  const iterator = newIterator(UPPER_ITERATOR_BOUNDARY);
  const some = dropWhile(_ => false)(iterator);
  assert.is(arrayEq([0, 1, 2, 3, 4])([...some]), true);
});

iteratorSuite.add("test advanced case: zipWith one iterator is shorter", assert => {
  let iterationCount = 0;
  // the inner iterator stops before the outer
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

iteratorSuite.add("test typical case: zip", assert => {
  const mapper = el => el * 2;

  const it1 = newIterator(UPPER_ITERATOR_BOUNDARY);
  const it2 = map(mapper)(newIterator(UPPER_ITERATOR_BOUNDARY));

  const zipped = [...zip(it1)(it2)];

  for (let i = 0; i <= UPPER_ITERATOR_BOUNDARY; i++) {
    assert.is(zipped[i](fst), i);
    assert.is(zipped[i](snd), mapper(i));
  }
});

iteratorSuite.add("test left/right identity of mconcat", assert => {
  const left = mconcat(
    ArrayIterator([emptyIterator, newIterator(UPPER_ITERATOR_BOUNDARY)])
  );
  const right = mconcat(
    ArrayIterator([newIterator(UPPER_ITERATOR_BOUNDARY), emptyIterator])
  );
  assert.is(arrayEq([0,1,2,3,4])([...right]), true);
  assert.is(arrayEq([0,1,2,3,4])([...left]),  true);
});

iteratorSuite.run();

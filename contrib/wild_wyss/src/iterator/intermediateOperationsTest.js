import { TestSuite } from "../../../../docs/src/kolibri/util/test.js";
import { arrayEq }   from "../../../../docs/src/kolibri/util/arrayFunctions.js";

import {ArrayIterator, Iterator} from "./iterator.js"

import {
  map,
  retainAll,
  rejectAll,
  dropWhile,
  drop,
  reverse$,
  concat$,
  cons,
  takeWhile,
  take,
  mconcat,
} from "./intermediateOperations.js";

/**
 *
 * @param  { Number } limit
 * @returns { IteratorType<Number> }
 */
const newIterator = limit => Iterator(0, current => current + 1, current => current > limit);

const iteratorSuite = TestSuite("IntermediateOperations");
const UPPER_ITERATOR_BOUNDARY = 4;
/**
 * Checks if a given operation does not modify the underlying iterator.
 */
const testPurity = op => assert => {
  const iterator = newIterator(UPPER_ITERATOR_BOUNDARY);
  op(iterator);
  assert.is(arrayEq([0,1,2,3,4])([...iterator]), true);
};

const testCopy = op => assert => {
  const expected  = op(newIterator(UPPER_ITERATOR_BOUNDARY));
  const copied    = op(newIterator(UPPER_ITERATOR_BOUNDARY)).copy();

  assert.is(arrayEq([...expected])([...copied]), true);
};

const testSimple = op => expected => assert => {
  const it        = newIterator(UPPER_ITERATOR_BOUNDARY);
  const operated  = op(it);
  assert.is(arrayEq(expected)([...operated]), true)
};

const mconcatInit = _ => mconcat(ArrayIterator([
  newIterator(2),
  newIterator(2),
  newIterator(2),
]));

[
  ["map",           map(el => 2 * el),                 [0, 2, 4, 6, 8],           ],
  ["retainAll",     retainAll(el => el % 2 === 0),     [0, 2, 4],                 ],
  ["rejectAll",     rejectAll(el => el % 2 === 0),     [1, 3],                    ],
  ["dropWhile",     dropWhile(el => el < 2),           [2, 3, 4],                 ],
  ["takeWhile",     takeWhile(el => el < 2),           [0, 1],                    ],
  ["drop",          drop(2),                           [2, 3, 4],                 ],
  ["take",          take(2),                           [0, 1],                    ],
  ["reverse$",      reverse$,                          [4, 3, 2, 1, 0],           ],
  ["concat$ (fst)", concat$(newIterator(1)),           [0, 1, 0, 1, 2, 3, 4],     ],
  ["concat$ (snd)", it => concat$(it)(newIterator(1)), [0, 1, 2, 3, 4, 0, 1],     ],
  ["cons",          cons(2),                           [2, 0, 1, 2, 3, 4],        ],
  ["mconcat",       mconcatInit,                       [0, 1, 2, 0, 1, 2, 0, 1, 2]],
].forEach(el => {
  const [ name, op, expected ] = el;
  iteratorSuite.add(`test simple: ${name}`,  testSimple (op)(expected));
  iteratorSuite.add(`test copy: ${name}`,    testCopy   (op));
  iteratorSuite.add(`test purity: ${name}.`, testPurity (op));
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

iteratorSuite.run();
import { Iterator } from "../iterator.js";
import { arrayEq } from "../../../../../docs/src/kolibri/util/arrayFunctions.js";

export {
  newIterator,
  UPPER_ITERATOR_BOUNDARY,
  testSimple,
  testCopyAfterConsumption,
  testPurity,
  testCopy,
  testCBNotCalledAfterDone
}

/**
 * This type is used to create testing table entry.
 * @template _T_
 * @template _U_
 * @typedef IteratorTestConfigType
 * @property { () => IteratorType<_T_> } iterator
 * @property { String } name
 * @property { (_: *) => IteratorOperation  } operation
 * @property { function | any } param
 * @property {Array<_U_> } expected
 */

/**
 *
 * @param  { Number } limit
 * @returns { IteratorType<Number> }
 */
const newIterator = limit => Iterator(0, current => current + 1, current => current > limit);
const UPPER_ITERATOR_BOUNDARY = 4;

/**
 * Tests if a given operation applicated on an iterator processes the expected result.
 * Optionally an evaluation function can be passed to compare the created array using the operation and the expected array.
 * @function
 * @template _T_
 * @type {
 *         (op: (number) => IteratorType<_T_>)
 *      => (expected: Array<_T_>)
 *      => (evalFn?: (expected: Array<_T_>) => (actual: Array<_T_> ) => boolean)
 *      => (assert: any)
 *      => void
 * }
 */
const testSimple = op => expected => (evalFn = arrayEq) => assert => {
  const it       = newIterator(UPPER_ITERATOR_BOUNDARY);
  const operated = op(it);
  assert.isTrue(evalFn([...expected])([...operated]));
};

/**
 * Checks if a given operation does not modify the underlying iterator.
 * @type {
 *         (op: (number) => IteratorType<number>)
 *      => (assert: any)
 *      => void
 * }
 */
const testPurity = op => assert => {
  const iterator = newIterator(UPPER_ITERATOR_BOUNDARY);
  op(iterator);
  assert.isTrue(arrayEq([0,1,2,3,4])([...iterator]));
};

/**
 * Tests if the copy function of a given operation works as intended.
 * Optionally an evaluation function can be passed to compare the created array using the operation and the expected array.
 * @type {
 *         (op: (number) => IteratorType<number>)
 *      => (evalFn?: (expected: Array<any>) => (actual: Array<any> ) => boolean)
 *      => (assert: any)
 *      => void
 * }
 */
const testCopy = op => (evalFn = arrayEq) => assert => {
  const expected = op(newIterator(UPPER_ITERATOR_BOUNDARY));
  const copied   = op(newIterator(UPPER_ITERATOR_BOUNDARY)).copy();
  assert.isTrue(evalFn([...expected])([...copied]));
};

const testCopyAfterConsumption = op => (evalFn = arrayEq) => assert => {
  const iterator = newIterator(UPPER_ITERATOR_BOUNDARY);
  const operated = op(iterator);
  // noinspection LoopStatementThatDoesntLoopJS
  for (const elem of operated) {
    break; // consume one element
  }
  const copy = operated.copy();
  assert.isTrue(evalFn([...operated])([...copy]));
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
    return callback(el);
  })(it);

  for (const _ of operated) { /* exhausting */ }
  assert.is(called, false);
};

// /**
//  * @template _T_
//  * @template _U_
//  * @function
//  * @param { IteratorTestConfigType<_T_> } config
//  * @returns IteratorTestConfigType<_U_>
//  */
// const createTestConfig = config => config;
//
// const mapTester = createTestConfig({
//   iterator: () => newIterator(UPPER_ITERATOR_BOUNDARY),
//   name:     "map",
//   operation: map,
//   callback: el => 2 * el,
//   expected: [0, 2, 4, 6, 8]
// });
//
// const bindTester = createTestConfig({
//   name:     "bind",
//   operation: bind,
//   callback: el => 2 * el,
//   expected: [0, 2, 4, 6, 8]
// });

import { Iterator } from "../iterator.js";
import { arrayEq } from "../../../../../docs/src/kolibri/util/arrayFunctions.js";

export {
  createTestConfig,
  newIterator,
  UPPER_ITERATOR_BOUNDARY,
  testSimple,
  testSimple2,
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
 * @property { (_: *) => IteratorOperation } operation
 * @property { * } param
 * @property {Array<_U_> } expected
 * @property { * } evalFn
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
 *
 * @param operation
 * @param { IteratorTestConfigType } obj
 * @returns {(function(*): void)|*}
 */
const testSimple2 = ({iterator, operation, evalFn, expected, param}) => assert => {
  const baseIterator = iterator();
  const operated = operation(param)(baseIterator);
  assert.isTrue(evalFn([...expected])([...operated]));
};
/**
 * Checks if a given operation does not modify the underlying iterator.
 * @type {
  *        (config: IteratorTestConfigType)
 *      => (assert: any)
 *      => void
 * }
 */
const testPurity = config => assert => {
  const {operation, param } = config;
  const iterator = newIterator(UPPER_ITERATOR_BOUNDARY);
  operation(param)(iterator);
  assert.isTrue(arrayEq([0,1,2,3,4])([...iterator]));
};

/**
 * Tests if the copy function of a given operation works as intended.
 * Optionally an evaluation function can be passed to compare the created array using the operation and the expected array.
 * @type {
 *         (config: IteratorTestConfigType)
 *      => (assert: any)
 *      => void
 * }
 */
const testCopy = config => assert => {
  const { operation, evalFn, iterator, param} = config;
  const expected = operation(param)(iterator());
  const copied   = operation(param)(iterator()).copy();
  assert.isTrue(evalFn([...expected])([...copied]));
};

/**
 * @type {
 *         (config: IteratorTestConfigType)
 *      => (assert: any)
 *      => void
 * }
 */
const testCopyAfterConsumption = config => assert => {
  const { operation, param, evalFn } = config;
  const iterator = config.iterator();
  const operated = operation(param)(iterator);
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
 *         (config: IteratorTestConfigType)
 *      => (assert: any)
 *      => void
 * }
 */
const testCBNotCalledAfterDone = config => assert => {
  const { operation, param } = config;
  if (typeof param !== "function") return;

  let called = false;
  const it   = Iterator(0, _ => 0, _ => true);

  const operated = operation(el => {
    // since this iterator is empty, called should never be set to true
    called = true;
    return param(el);
  })(it);

  for (const _ of operated) { /* exhausting */ }
  assert.is(called, false);
};

/**
 * EvalFn will be set to {@link arrayEq} if it has not been defined
 * @template _T_
 * @template _U_
 * @function
 * @param { IteratorTestConfigType<_T_> } config
 * @returns IteratorTestConfigType<_U_>
 */
const createTestConfig = config => ({
 ...config,
 evalFn : config.evalFn === undefined ? arrayEq : config.evalFn
});

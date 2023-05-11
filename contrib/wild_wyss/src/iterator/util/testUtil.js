import {AngleIterator, Iterator, IteratorPrototype} from "../iterator.js";
import { arrayEq }          from "../../../../../docs/src/kolibri/util/arrayFunctions.js";

export {
  createTestConfig,
  newIterator,
  UPPER_ITERATOR_BOUNDARY,
  testSimple,
  testCopyAfterConsumption,
  testPurity,
  testCopy,
  testCBNotCalledAfterDone,
  testPrototype,
}

const id = x => x;

/**
 * This type is used to create testing table entry.
 * @template _T_
 * @template _U_
 * @typedef IteratorTestConfigType
 * @property { String }                   name
 * @property { () => IteratorType<_T_> }  iterator
 * @property { Array<_U_> | _U_ }         expected
 * @property { EvalCallback? }            evalFn
 * @property { Array<TestingFunction>? }  excludedTests
 * @property { OperationCallback? }       operation
 * @property { *? }                       param
 */

/**
 * @template _T_
 * @callback OperationCallback
 * @type { (param: ?*) => (IteratorType<_T_> | _T_) }
 */

/**
 * @callback EvalCallback
 * @type {
 *             (expected: *)
 *          => (actual: *)
 *          => Boolean
 *      }
 */

/**
 *
 * @param  { Number } limit
 * @returns { IteratorType<Number> }
 */
const newIterator = limit => Iterator(0, current => current + 1, current => current > limit);
const UPPER_ITERATOR_BOUNDARY = 4;

/**
 *
 * @param operation
 * @param { IteratorTestConfigType } obj
 * @returns {(function(*): void)|*}
 */
const testSimple = ({iterator, operation, evalFn, expected, param}) => assert => {
  const baseIterator = iterator();
  const operated = operation(param)(baseIterator);
  assert.isTrue(evalFn(expected)(operated));
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
  const { operation, param, iterator, evalFn } = config;
  const underlyingIt = iterator();
  // if the iterator modifies the underlying iterator, the following test would fail, because both use the same
  // underlying iterator
  const first  = operation(param)(underlyingIt);
  const second = operation(param)(underlyingIt);
  assert.isTrue(evalFn(first)(second));
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
  const { operation, evalFn, iterator, param } = config;
  const expected = operation(param)(iterator());
  const copied   = operation(param)(iterator()).copy();
  assert.isTrue(evalFn(expected)(copied));
};

/**
 * @type {
 *         (config: IteratorTestConfigType)
 *      => (assert: any)
 *      => void
 * }
 */
const testCopyAfterConsumption = config => assert => {
  const { operation, param, evalFn, iterator } = config;
  const operated = operation(param)(iterator());
  // noinspection LoopStatementThatDoesntLoopJS
  for (const elem of operated) {
    break; // consume one element
  }
  const copy = operated.copy();
  assert.isTrue(evalFn(operated)(copy));
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

const testPrototype = config => assert => {
  assert.is(Object.getPrototypeOf(config.iterator()), IteratorPrototype);
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
  operation:     config.operation     === undefined ? () => id        : config.operation,
  evalFn:        config.evalFn        === undefined ? arrayEvaluation : config.evalFn,
  excludedTests: config.excludedTests === undefined ? []              : config.excludedTests,
});


const arrayEvaluation = expected => actual => arrayEq([...expected])([...actual]);
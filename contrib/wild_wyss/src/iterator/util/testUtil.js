import { Iterator, IteratorPrototype } from "../iterator.js";
import { arrayEq }  from "../../../../../docs/src/kolibri/util/arrayFunctions.js";

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
 *
 * @template _T_
 * @template _U_
 * @typedef  IteratorTestConfigType
 * @property { String }                   name            - The name of the iterator under test.
 * @property { () => IteratorType<_T_> }  iterator        - A function which constructs a new iterator to apply the operation to. If the iterator under test does not take an inner iterator, use this function instead of {@link operation}.
 * @property { Array<_U_> | _U_ }         expected        - The expected result of the {@link operation} applied to the {@link iterator}.
 * @property { Array<TestingFunction> }   [excludedTests] - An optional array of {@link TestingFunction TestingFunctions} to exclude tests in this table.
 * @property { OperationCallback<_T_> }   [operation]     - The operation to test. The value passed in {@link param} is passed as an argument (Leave this empty for constructor tests, since they do not take an inner iterator.)
 * @property { (Function | any) }         [param]         - A parameter passed to this operation. If it is a function, some extra tests will be performed.
 * @property { EvalCallback<_U_> }        [evalFn]        - An optional function which takes {@link expected} and the actual result in curried style. It defaults to {@link arrayEq}.
 */

/**
 *
 * @template _T_
 * @typedef {
 *              (param: any)
 *           => (base: IteratorType<_T_>)
 *           => (IteratorType<_T_> | _T_)
 * } OperationCallback
 */

/**
 * A functions which evaluates the output of the test.
 * returns true, if the test has been successful, false otherwise.
 * @template _U_
 * @callback
 * @typedef {
 *             (expected: [_U_] | _U_)
 *          => (actual:   [_U_] | _U_)
 *          => Boolean
 *      } EvalCallback
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
  evaluate(expected, operated, assert, evalFn);
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
  evaluate(first, second, assert, evalFn);
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
  evaluate(expected, copied, assert, evalFn);
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
  const copied = operated.copy();
  evaluate(operated, copied, assert, evalFn);
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
 * Tests, if {@link IteratorPrototype} is set on the {@link IteratorType} under test.
 *
 * @type {
 *         (config: IteratorTestConfigType)
 *      => (assert: any)
 *      => void
 * }
 */
const testPrototype = config => assert =>
  assert.is(Object.getPrototypeOf(config.iterator()), IteratorPrototype);

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
  excludedTests: config.excludedTests === undefined ? []              : config.excludedTests,
});


/**
 * Checks if the given iterables are equals.
 * @template _T_, _U_
 * @param { Array<_U_> | _T_ }        expected
 * @param { IteratorType<_T_> | _T_ } actual
 * @param { AssertType }              assert
 * @param { EvalCallback<_U_> }       [evalFn] - An evaluation function if the iterables shouldn't be compared using standard iteratable test.
 */
const evaluate = (expected, actual, assert, evalFn ) => {
  if (evalFn) {
    assert.isTrue(evalFn(expected)(actual));
  } else {
    assert.iterableEq(expected, actual);
  }
};

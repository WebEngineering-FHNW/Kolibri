import {Iterator, IteratorPrototype, nil, PureIterator} from "../iterator.js";
import { arrayEq }  from "../../../../../docs/src/kolibri/util/arrayFunctions.js";
import { Just, Nothing }     from "../../stdlib/maybe.js";

export {
  createTestConfig,
  newIterator,
  UPPER_ITERATOR_BOUNDARY,
  testSimple,
  testPurity,
  testIterateMultipleTimes,
  testCBNotCalledAfterDone,
  testPrototype,
  testInvariants,
}

const id = x => x;

/**
 * This type is used to create testing table entry.
 *
 * @template _T_
 * @template _U_
 * @typedef  IteratorTestConfigType
 * @property { String }                      name            - The name of the iterator under test.
 * @property { () => Iterable<_T_> }         iterator        - A function which constructs a new iterator to apply the operation to. If the iterator under test does not take an inner iterator, use this function instead of {@link operation}.
 * @property { Array<_U_> | _U_ }            expected        - The expected result of the {@link operation} applied to the {@link iterator}.
 * @property { Array<TestingFunction> }      [excludedTests] - An optional array of {@link TestingFunction TestingFunctions} to exclude tests in this table.
 * @property { OperationCallback<_T_> }      [operation]     - The operation to test. The value passed in {@link param} is passed as an argument (Leave this empty for constructor tests, since they do not take an inner iterator.)
 * @property { (Function | any) }            [param]         - A parameter passed to this operation. If it is a function, some extra tests will be performed.
 * @property { Array<InvariantCallback<T>> } [invariants]    - An optional array of {@link InvariantCallback}. The invariant must hold tests against different lists.
 * @property { EvalCallback<_U_> }           [evalFn]        - An optional function which takes {@link expected} and the actual result in curried style. It defaults to {@link arrayEq}.
 */

/**
 * @template _T_
 * @typedef {
 *              (param: any)
 *           => (base: Iterable<_T_>)
 *           => (IteratorMonadType<_T_> | _T_ | *)
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
 * @template _T_
 * @typedef {
 *              (it: Iterator<_T_>)
 *           => Boolean
 * } InvariantCallback
 */

/**
 * @param  { Number } limit
 * @returns { IteratorMonadType<Number> }
 */
const newIterator = limit => Iterator(0, current => current + 1, current => current > limit);
const UPPER_ITERATOR_BOUNDARY = 4;

/**
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
 * @param operation
 * @param { IteratorTestConfigType } obj
 * @returns {(function(*): void)|*}
 */
const testIterateMultipleTimes = ({iterator, operation, evalFn, param}) => assert => {
  const baseIterator = iterator();
  const operated = operation(param)(baseIterator);
  evaluate(operated, operated, assert, evalFn);
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
 * Tests, if {@link IteratorPrototype} is set on the {@link IteratorMonadType} under test.
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
 * Tests, whether the given invariants hold when passed different lists.
 * @type {
 *         (invariants: IteratorTestConfigType)
 *        => (assert: any)
 *        => void
 * }
 */
const testInvariants = config => assert => {
  const invariants = config.invariants;
  for (const inv of invariants) {
    invariantPenetration(inv)(assert);
  }
};

/**
 * Applies a series of lists to a given invariant.
 * @template _T_
 * @type {
 *           (invariant: InvariantCallback<_T_>)
 *        => (assert: any)
 *        => void
 * }
 */
const invariantPenetration = invariant => assert => {
  const testingLists = [
    nil,
    newIterator(1),
    newIterator(5),
    PureIterator("testString"),
    ['a', 'b', 'c', 1, 2, 3, Nothing, Just("testString")],
    [PureIterator(1), newIterator(4), '#', "abc", 1]
  ];

  for (const list of testingLists) {
    const result = invariant(list);
    assert.isTrue(result);
  }
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
  excludedTests: config.excludedTests === undefined ? []              : config.excludedTests,
});

/**
 * Checks if the given iterables are equals.
 * @template _T_
 * @param { Array<_T_> | _T_}        expected
 * @param { Iterable<_T_> | _T_ }    actual
 * @param { AssertType }              assert
 * @param { EvalCallback<_T_> }       [evalFn] - An evaluation function if the iterables shouldn't be compared using standard iteratable test.
 */
const evaluate = (expected, actual, assert, evalFn ) => {
  if (evalFn) {
    assert.isTrue(evalFn(expected)(actual));
  } else {
    // TODO: change following lines
    // assert.iterableEq(actual, expected);
    assert.isTrue(arrayEq([...expected])([...actual]));
  }
};

import { Iterator }         from "../iterator.js";
import { arrayEq }          from "../../../../../docs/src/kolibri/util/arrayFunctions.js";
import { takeWithoutCopy }  from "./util.js";

export {
  createTestConfig,
  newIterator,
  UPPER_ITERATOR_BOUNDARY,
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
 * @property { *? } param
 * @property { number? } maxIterations - How many iterations should be executed at maximum
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
 *
 * @param operation
 * @param { IteratorTestConfigType } obj
 * @returns {(function(*): void)|*}
 */
const testSimple2 = ({iterator, operation, evalFn, expected, param, maxIterations}) => assert => {
  const baseIterator = iterator();
  const operated = operation(param)(baseIterator);
  const evaluated = toArray(operated, maxIterations);
  assert.isTrue(evalFn([...expected])(evaluated));
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
  const { operation, param, iterator, maxIterations, evalFn } = config;
  const underlyingIt = iterator();
  const first  = toArray(operation(param)(underlyingIt), maxIterations); // just run operation to see if it produces any side effect
  const second = toArray(operation(param)(underlyingIt), maxIterations); // just run operation to see if it produces any side effect
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
  const { operation, evalFn, iterator, param, maxIterations } = config;
  const expected = operation(param)(iterator());
  const copied   = operation(param)(iterator()).copy();
  assert.isTrue(evalFn(toArray(expected, maxIterations))(toArray(copied, maxIterations)));
};

/**
 * @type {
 *         (config: IteratorTestConfigType)
 *      => (assert: any)
 *      => void
 * }
 */
const testCopyAfterConsumption = config => assert => {
  const { operation, param, evalFn, iterator, maxIterations } = config;
  const operated = operation(param)(iterator());
  // noinspection LoopStatementThatDoesntLoopJS
  for (const elem of operated) {
    break; // consume one element
  }
  const copy = operated.copy();
  assert.isTrue(evalFn(toArray(operated, maxIterations))(toArray(copy, maxIterations)));
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

/**
 * Collects the given {@link IteratorType} into an {@link Array}.
 * If takeSoMany is set, so many iterations will be proceeded.
 *
 * @template _T_
 * @param { IteratorType<_T_> } iterator
 * @param { Number? } takeSoMany
 * @returns Array<_T_>
 * @example
 * console.log(toArray(Range(5), 3));
 * // => logs [0, 1, 2] to the console
 * console.log(toArray(Range(5)));
 * // => logs [0, 1, 2, 3, 4, 5] to the console
 */
const toArray = (iterator, takeSoMany) =>
  takeSoMany ? takeWithoutCopy(takeSoMany)(iterator) : [...iterator];

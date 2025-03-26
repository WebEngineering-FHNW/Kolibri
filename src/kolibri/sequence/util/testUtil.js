// noinspection GrazieInspection

import { Sequence, nil, PureSequence, Walk } from "../sequence.js";
import { SequencePrototype }                 from "../sequencePrototype.js";
import { arrayEq }                           from "../../util/arrayFunctions.js";
import { Just, Nothing }                     from "../../lambda/maybe.js";
import { isSequence }                        from "./helpers.js";
import { LoggerFactory }                     from "../../logger/loggerFactory.js";
import { LOG_CONTEXT_KOLIBRI_TEST }          from "../../logger/logConstants.js";
import { id }                                from "../../stdlib.js";

export {
  createTestConfig,
  newSequence,
  UPPER_SEQUENCE_BOUNDARY,
  testSimple,
  testPurity,
  testIterateMultipleTimes,
  testCBNotCalledAfterDone,
  testPrototype,
  testInvariants,
}

const { error } = LoggerFactory(LOG_CONTEXT_KOLIBRI_TEST);

/**
 * This type is used to create testing table entry.
 *
 * @template _T_
 * @template _U_
 * @typedef  SequenceTestConfigType
 * @property { String }                      name            - The name of the {@link SequenceType} under test.
 * @property { () => Iterable<_T_> }         iterable        - A function which constructs a new {@link Iterable} to apply the operation to. If the sequence under test does not take an inner {@link Iterable}, use this function instead of {@link operation}.
 * @property { Array<_U_> | _U_ }            expected        - The expected result of the {@link operation} applied to the {@link SequenceType}.
 * @property { Array<TestingFunction> }      [excludedTests] - An optional array of {@link TestingFunction TestingFunctions} to exclude tests in this table.
 * @property { OperationCallback<_T_> }      [operation]     - The operation to test. The value passed in {@link param} is passed as an argument (leave this empty for constructor tests, since they do not take an inner iterator.)
 * @property { (Function | any) }            [param]         - A parameter passed to this operation. If it is a function, some extra tests will be performed.
 * @property { Array<InvariantCallback<T>> } [invariants]    - An optional array of {@link InvariantCallback}. The invariant must hold tests against different lists.
 * @property { EvalCallback<_U_> }           [evalFn]        - An optional function which takes {@link expected} and the actual result in curried style. It defaults to {@link arrayEq}.
 *
 * @example
 * const config = {
 *     name:       "function name",
 *     iterable:   () => newSequence(UPPER_SEQUENCE_BOUNDARY),
 *     operation:  param => fn(param),
 *     param:      el => 2 * el,
 *     expected:   [0, 2, 4, 6, 8],
 *     invariants: [
 *       it => map(x => x)(it) ["=="] (it),
 *       it => map(x => x[0])(map(x => [x])(it)) ["=="] (it),
 *     ],
 *     evalFn: expected => actual => {
 *                 // do some calculations
 *                 return arrayEq([...expectedArray])([...actualArray]);
 *     },
 *     excludedTests: [
 *       TESTS.TEST_PURITY,
 *       TESTS.TEST_CB_NOT_CALLED_AFTER_DONE
 *     ]
 * }
 */

/**
 * @template _T_
 * @typedef {
 *              (param: any)
 *           => (base: Iterable<_T_>)
 *           => (SequenceType<_T_> | _T_ | *)
 *         } OperationCallback
 */

/**
 * A functions which evaluates the output of the test.
 * returns true, if the test has been successful, false otherwise.
 * @template _U_
 * @callback
 * @typedef {
 *               (expected: [_U_] | _U_)
 *            => (actual:   [_U_] | _U_)
 *            => Boolean
 *         } EvalCallback
 */

/**
 * @template _T_
 * @typedef {
 *              (it: Sequence<Sequence>)
 *           => Boolean
 *          } InvariantCallback
 */

/**
 * @param { Number } limit
 * @returns { SequenceType<Number> }
 */
const newSequence = limit => Walk(limit);
const UPPER_SEQUENCE_BOUNDARY = 4;

/**
 * @type {
 *             (config: SequenceTestConfigType)
 *          => (assert: AssertType)
 *          => void
 *       }
 */
const testSimple = config => assert => {
  const { iterable, operation, evalFn, expected, param } = config;
  const baseIterable = iterable();
  const operated     = operation(param)(baseIterable);
  evaluate(expected, operated, assert, evalFn);
};

/**
 * Checks, if the result of an {@link Iterable} is the same twice.
 *
 * @type {
 *             (config: SequenceTestConfigType)
 *          => (assert: AssertType)
 *          => void
 *       }
 */
const testIterateMultipleTimes = config => assert => {
  const { iterable, operation, evalFn, param } = config;
  const baseIterable = iterable();
  const operated = operation(param)(baseIterable);
  evaluate(operated, operated, assert, evalFn);
};

/**
 * Checks if a given operation does not modify the underlying {@link SequenceType}.
 *
 * @type {
 *             (config: SequenceTestConfigType)
 *          => (assert: AssertType)
 *          => void
 *       }
 */
const testPurity = config => assert => {
  const { operation, param, iterable, evalFn } = config;
  const underlyingIterable = iterable();
  // if the iterable modifies the underlying iterable, the following test would fail, because both use the same
  // underlying iterable
  const first  = operation(param)(underlyingIterable);
  const second = operation(param)(underlyingIterable);
  evaluate(first, second, assert, evalFn);
};

/**
 * Since there is no guarantee that the value of the iterable is existing when done is true,
 * it must be ensured that the callback function is not called after that.
 *
 * @type {
 *             (config: SequenceTestConfigType)
 *          => (assert: AssertType)
 *          => void
 *       }
 */
const testCBNotCalledAfterDone = config => assert => {
  const { operation, param } = config;
  if (typeof param !== "function") return;

  let called = false;
  const it   = Sequence(0, _ => false, _ => 0);

  const operated = operation(el => {
    // since this iterable is empty, called should never be set to true
    called = true;
    return param(el);
  })(it);

  for (const _ of operated) { /* exhausting */ }
  assert.is(called, false);
};

/**
 * Tests, if {@link SequencePrototype} is set on the {@link SequenceType} under test.
 *
 * @type {
 *            (config: SequenceTestConfigType)
 *         => (assert: AssertType)
 *         => void
 *       }
 */
const testPrototype = config => assert =>
  assert.is(isSequence(config.iterable()), true);


/**
 * Tests, whether the given invariants hold when passed different lists.
 * @type {
 *           (invariants: SequenceTestConfigType)
 *        => (assert: AssertType)
 *        => void
 *      }
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
 *            (invariants: InvariantCallback)
 *         => (assert: AssertType)
 *         => void
 *       }
 */
const invariantPenetration = invariant => assert => {
  const testingLists = [
    { candidate: nil,                                                   purpose: "edge case nil"},
    { candidate: newSequence(1),                                        purpose: "edge case, done calculated"},
    { candidate: newSequence(3),                                        purpose: "typical number"},
    { candidate: PureSequence("testString"),                            purpose: "edge case, done set explicitly"},
    { candidate: ['a', 'b', 'c', 1, 2, 3, Nothing, Just("testString")], purpose: "mixing types"},
    { candidate: [PureSequence(1), newSequence(4), '#', "abc", 1],      purpose: "iterable of iterables"},
  ];

  for (const list of testingLists) {
    const result = invariant(list.candidate);
    if (!result) {
      console.error("error while evaluating invariant: "+list.purpose); // debugging entry point
    }
    assert.isTrue(result);
  }
};

/**
 * EvalFn will be set to {@link arrayEq} if it has not been defined
 *
 * @function
 * @template _T_, _U_
 * @param { SequenceTestConfigType<_T_> } config
 * @returns SequenceTestConfigType<_U_>
 */
const createTestConfig = config => ({
  ...config,
  invariants:    config.invariants    === undefined ? []       : config.invariants,
  operation:     config.operation     === undefined ? () => id : config.operation,
  excludedTests: config.excludedTests === undefined ? []       : config.excludedTests,
});

/**
 * Checks if the given iterables are equals.
 *
 * @template _T_
 * @param { Array<_T_> | _T_}     expected
 * @param { Iterable<_T_> | _T_ } actual
 * @param { AssertType }          assert
 * @param { EvalCallback<_T_> }   [evalFn] - An evaluation function if the iterables shouldn't be compared using standard iterable test.
 */
const evaluate = (expected, actual, assert, evalFn) => {
  if (evalFn) {
    const result = evalFn(expected)(actual);
    if (!result) {
      error(`test error expecting: '${expected}' but got '${actual}'`); // debugging entry point
    }
    assert.isTrue(result);
  } else {
    assert.iterableEq(actual, expected);
  }
};

import { TestSuite } from "../../test/test.js";
import { arrayEq }   from "../../../../../docs/src/kolibri/util/arrayFunctions.js";
import { Pair, fst, snd } from "../../../../../docs/src/kolibri/stdlib.js";
import {
  eq$,
  head,
  isEmpty,
  reduce$,
  forEach$,
  uncons,
  take,
} from "../iterator.js";
import {
  newIterator,
  createTestConfig,
  testPurity,
  testSimple,
  UPPER_ITERATOR_BOUNDARY
} from "../util/testUtil.js";
import { Range } from "../../range/range.js";

const terminalOperationsSuite = TestSuite("TerminalOperations");
const prepareTestSuite = () =>
  [
    eq$Config,
    forEach$Config,
    headConfig,
    isEmptyConfig,
    unconsConfig,
    reduce$Config
  ].forEach(config => {
    const { name } = config;
    terminalOperationsSuite.add(`test simple: ${name}`,  testSimple(config));
    terminalOperationsSuite.add(`test purity: ${name}.`, testPurity(config));
  });

const headConfig = createTestConfig({
  name:      "head",
  iterator:  () => newIterator(UPPER_ITERATOR_BOUNDARY),
  operation: () => head,
  evalFn:    expected => actual => expected === actual,
  expected:  0
});

const isEmptyConfig = createTestConfig({
  name:      "isEmpty",
  iterator:  () => take(0)(newIterator(UPPER_ITERATOR_BOUNDARY)),
  operation: () => isEmpty,
  evalFn:    expected => actual => expected === actual,
  expected:  true
});

const unconsConfig = createTestConfig({
  name:      "uncons",
  iterator:  () => newIterator(UPPER_ITERATOR_BOUNDARY),
  operation: () => uncons,
  expected:  Pair(0)(Range(1, UPPER_ITERATOR_BOUNDARY)),
  evalFn:    expected => actual =>
    expected(fst) === actual(fst) &&
    arrayEq([...expected(snd)])([...actual(snd)]),
});

const reduce$Config = createTestConfig({
  name:      "reduce$",
  iterator:  () => newIterator(UPPER_ITERATOR_BOUNDARY),
  operation: () => reduce$((acc, cur) => acc + cur, 0),
  expected:  10,
  evalFn:    expected => actual => expected === actual
});

const eq$Config = (() => {
  // eq$ takes two iterators which both shouldn't be modified when eq runs.
  // To keep this we keep two iterators in our closure scope, to ensure that neither is modified by pure.
  const firstIterator = newIterator(UPPER_ITERATOR_BOUNDARY);
  const secondIterator = newIterator(UPPER_ITERATOR_BOUNDARY);
  return createTestConfig({
    name:      "eq$",
    iterator:  () => firstIterator,
    operation: eq$,
    param:     secondIterator,
    evalFn:    expected => actual => expected === actual,
    expected:  true
  });
})();

const forEach$Config = (() => {
  // keep this state in the closure scope
  const iterElements = [];
  return createTestConfig({
    name:       "forEach$",
    iterator:   () => newIterator(UPPER_ITERATOR_BOUNDARY),
    operation:  forEach$,
    param:      cur => iterElements.push(cur),
    expected:   [0, 1, 2, 3, 4],
    evalFn:     expected => _actual => {
      let result;
      if (expected !== undefined) {
        result = arrayEq(expected)(iterElements);
        iterElements.splice(0, iterElements.length);
      } else {
        // test purity just runs two times the current function, since forEach does not return any value,
        // both expected and actual are set to undefined, so it can be checked if 10 elements are in the array
        result = arrayEq([...iterElements])([0, 1, 2, 3, 4, 0, 1, 2, 3, 4]);
        iterElements.splice(0, iterElements.length);
      }
      return result;
    },
  });
})();

// special cases

// isEmpty
terminalOperationsSuite.add("test typical case: isEmpty ist not empty", assert => {
  const iterator = newIterator(4);
  const result   = isEmpty(iterator);
  assert.is(result, false);
});

// head
terminalOperationsSuite.add("test advanced case: head of empty iterator", assert => {
  const iterator = newIterator(4);
  for (const iteratorElement of iterator) { /* exhaust iterator */ }
  assert.is(head(iterator), undefined);
});

// eq$
terminalOperationsSuite.add("test typical case: eq$ should return false", assert => {
  const it1 = newIterator(2);
  const it2 = newIterator(4);
  assert.is(eq$(it1)(it2), false);
});

prepareTestSuite();
terminalOperationsSuite.run();
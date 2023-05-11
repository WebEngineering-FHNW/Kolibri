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

  ].forEach(config => {
    const { name } = config;
    terminalOperationsSuite.add(`test simple: ${name}`,  testSimple(config));
    terminalOperationsSuite.add(`test purity: ${name}.`, testPurity(config));
  });


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
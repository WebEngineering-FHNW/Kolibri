import { TestSuite } from "../../../../docs/src/kolibri/util/test.js";
import { arrayEq }   from "../../../../docs/src/kolibri/util/arrayFunctions.js";
import { Tuple, fst, snd }     from "../../../../docs/src/kolibri/stdlib.js";

import {
  Iterator,
  ArrayIterator,
  TupleIterator
}  from "./iterator.js"

import {
  eq$,
  head,
  isEmpty,
  reduce$,
  forEach$,
  uncons
} from "./terminalOperations.js";

const newIterator = limit => Iterator(0, current => current + 1, current => current > limit);

const terminalOperationsSuite = TestSuite("TerminalOperations");

terminalOperationsSuite.add("test typical case: eq$ should return true", assert => {
  const it1 = newIterator(4);
  const it2 = newIterator(4);
  assert.is(eq$(it1)(it2), true);
});

terminalOperationsSuite.add("test typical case: eq$ should return false", assert => {
  const it1 = newIterator(2);
  const it2 = newIterator(4);
  assert.is(eq$(it1)(it2), false);
});

terminalOperationsSuite.add("test advanced case: eq$ should return true", assert => {
  const it1 = newIterator(4);
  const it2 = newIterator(4);
  for (const _ of it1) { /** Range gets exhausted. */ }
  assert.is(eq$(it1)(it2), false);
});

terminalOperationsSuite.add("test typical case: head", assert => {
  const iterator = newIterator(4);
  let iteratorHead = head(iterator);
  for (const iteratorElement of iterator) {
    assert.is(iteratorHead, iteratorElement);
    iteratorHead = head(iterator);
  }
  assert.is(head(iterator), undefined);
});

terminalOperationsSuite.add("test typical case: isEmpty", assert => {
  const iterator = newIterator(4);
  let result = isEmpty(iterator);
  assert.is(result, false);
  for (const _ of iterator) { /** Range gets exhausted. */ }
  result = isEmpty(iterator);
  assert.is(result, true);
});

terminalOperationsSuite.add("test typical case: reduce", assert => {
  const iterator = newIterator(4);
  const result = reduce$( (acc, cur) => acc + cur , 0)(iterator);
  assert.is(arrayEq([0,1,2,3,4])([...iterator]), true);
  assert.is(10, result);
});

terminalOperationsSuite.add("test typical case: forEach", assert => {
  const iterator = newIterator(4);
  const iterElements = [];
  forEach$(cur => iterElements.push(cur))(iterator);
  assert.is(arrayEq([0,1,2,3,4])(iterElements), true);
});

terminalOperationsSuite.add("test advanced case: forEach", assert => {
  const iterator = newIterator(4);
  const iterElements = [];
  forEach$(cur => {
    // consume all elements of the iterator, to test if the iterator has been copied correctly
    for (const _ of iterator) { }
    iterElements.push(cur);
  })(iterator);
  assert.is(arrayEq([0,1,2,3,4])(iterElements), true);
});

terminalOperationsSuite.add("test typical case: uncons", assert => {
  const iterator = newIterator(4);
  const pair = uncons(iterator);
  assert.is(pair(fst), 0);
  assert.is(arrayEq([1,2,3,4])([...pair(snd)]), true);
});

terminalOperationsSuite.add("test advanced case: uncons with copy", assert => {
  const iterator = newIterator(4);
  const pair = uncons(iterator);
  assert.is(pair(fst), 0);
  assert.is(arrayEq([1,2,3,4])([...pair(snd).copy()]), true);
  assert.is(arrayEq([1,2,3,4])([...pair(snd)]), true);
});

terminalOperationsSuite.run();
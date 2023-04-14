import { TestSuite } from "../../test/test.js";
import { arrayEq }   from "../../../../../docs/src/kolibri/util/arrayFunctions.js";
import { fst, snd }  from "../../../../../docs/src/kolibri/stdlib.js";
import {
  ArrayIterator,
  Iterator,
  eq$,
  head,
  isEmpty,
  reduce$,
  forEach$,
  uncons,
  map,
} from "../iterator.js";

const newIterator = limit => Iterator(0, current => current + 1, current => current > limit);

/**
 * Checks if a given operation does not modify the underlying iterator.
 */
const testPurity = op => assert => {
  const iterator = newIterator(5);
  op(iterator);
  assert.isTrue(arrayEq([0,1,2,3,4, 5])([...iterator]));
};

const terminalOperationsSuite = TestSuite("TerminalOperations");

terminalOperationsSuite.add("test typical case: eq$ should return true", assert => {
  const it1 = newIterator(4);
  const it2 = newIterator(4);
  assert.isTrue(eq$(it1)(it2));
});

terminalOperationsSuite.add("test typical case: eq$ should return false", assert => {
  const it1 = newIterator(2);
  const it2 = newIterator(4);
  assert.is(eq$(it1)(it2), false);
});

terminalOperationsSuite.add("test advanced case: eq$ should return false after exhausting", assert => {
  const it1 = newIterator(4);
  const it2 = newIterator(4);
  for (const _ of it1) { /** Range gets exhausted. */ }
  assert.is(eq$(it1)(it2), false);
});

terminalOperationsSuite.add("test purity: eq$. first iterator.",
  testPurity(it => eq$(it)(newIterator(4))));

terminalOperationsSuite.add("test purity: eq$. second iterator.",
  testPurity(it => eq$(newIterator(4))(it)));

terminalOperationsSuite.add("test advanced case: eq$ should return true after mapping", assert => {
  const texts = ["hello", "world"];
  const it1 = newIterator(1);
  const it2 = ArrayIterator(texts);
  assert.isTrue(eq$(map(idx => texts[idx])(it1))(it2));
});

terminalOperationsSuite.add("test typical case: head", assert => {
  const iterator = newIterator(4);
  let iteratorHead = head(iterator);
  // consume iterator and check if head always points to the first element
  for (const iteratorElement of iterator) {
    assert.is(iteratorHead, iteratorElement);
    iteratorHead = head(iterator);
  }
});

terminalOperationsSuite.add("test advanced case: head of empty iterator", assert => {
  const iterator = newIterator(4);
  for (const iteratorElement of iterator) { /*exhaust iterator*/ }
  assert.is(head(iterator), undefined);
});

terminalOperationsSuite.add("test purity: head.", testPurity(head) );

terminalOperationsSuite.add("test typical case: isEmpty", assert => {
  const iterator = newIterator(4);
  let result = isEmpty(iterator);
  assert.is(result, false);
  for (const _ of iterator) { /** Range gets exhausted. */ }
  result = isEmpty(iterator);
  assert.isTrue(result);
});

terminalOperationsSuite.add("test purity: isEmpty.", testPurity(isEmpty) );

terminalOperationsSuite.add("test typical case: reduce", assert => {
  const iterator = newIterator(4);
  const result = reduce$( (acc, cur) => acc + cur , 0)(iterator);
  assert.isTrue(arrayEq([0,1,2,3,4])([...iterator]));
  assert.is(10, result);
});

terminalOperationsSuite.add("test purity: reduce$.", testPurity(reduce$((acc, cur) => acc + cur , 0)));

terminalOperationsSuite.add("test typical case: forEach$", assert => {
  const iterator = newIterator(4);
  const iterElements = [];
  forEach$(cur => iterElements.push(cur))(iterator);
  assert.isTrue(arrayEq([0,1,2,3,4])(iterElements));
});

terminalOperationsSuite.add("test advanced case: forEach", assert => {
  const iterator = newIterator(4);
  const iterElements = [];
  forEach$(cur => {
    // consume all elements of the iterator, to test if the iterator has been copied correctly
    for (const _ of iterator) { }
    iterElements.push(cur);
  })(iterator);
  assert.isTrue(arrayEq([0,1,2,3,4])(iterElements));
});

terminalOperationsSuite.add("test purity: forEach$.", testPurity(forEach$(_ => undefined)));

terminalOperationsSuite.add("test typical case: uncons", assert => {
  const iterator = newIterator(4);
  const pair = uncons(iterator);
  assert.is(pair(fst), 0);
  assert.isTrue(arrayEq([1,2,3,4])([...pair(snd)]));
});

terminalOperationsSuite.add("test advanced case: uncons with copy", assert => {
  const iterator = newIterator(4);
  const pair = uncons(iterator);
  assert.is(pair(fst), 0);
  assert.isTrue(arrayEq([1,2,3,4])([...pair(snd).copy()]));
  assert.isTrue(arrayEq([1,2,3,4])([...pair(snd)]));
});

terminalOperationsSuite.add("test purity: uncons.", testPurity(uncons));

terminalOperationsSuite.run();
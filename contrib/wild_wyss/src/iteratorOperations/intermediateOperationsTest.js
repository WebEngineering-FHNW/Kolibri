import { TestSuite } from "../../../../docs/src/kolibri/util/test.js";
import { arrayEq }   from "../../../../docs/src/kolibri/util/arrayFunctions.js";

import { Iterator } from "./iterator.js"

import {
  map,
  retainAll,
  rejectAll,
  dropWhile,
  drop,
  reverse$,
  concat$,
  cons$,
  takeWhile,
  take,
} from "./intermediateOperations.js";

const newIterator = limit => Iterator(0, current => current + 1, current => current > limit);

const iteratorSuite = TestSuite("IntermediateOperations");

iteratorSuite.add("test typical case: map", assert => {
  const it     = newIterator(4);
  const mapped = map(el => el * 2)(it);
  assert.is(arrayEq([0, 2, 4, 6, 8])([...mapped]), true)
});

iteratorSuite.add("test advanced case: map and copy", assert => {
  const it         = newIterator(4);
  const mapped     = map(el => el * 2)(it);
  const copy       = mapped.copy();
  const copyMapped = map(el => el * 2)(copy);
  assert.is(arrayEq([0, 2, 4, 6, 8])  ([...mapped]),     true);
  assert.is(arrayEq([0, 2, 4, 6, 8])  ([...copy]),       true);
  assert.is(arrayEq([0, 4, 8, 12, 16])([...copyMapped]), true);
});

iteratorSuite.add("test typical case: retainAll", assert => {
  const iterator = newIterator(4);
  const filtered = retainAll(el => el % 2 === 0)(iterator);
  assert.is(arrayEq([0, 2, 4])([...filtered]), true)
});

iteratorSuite.add("test advanced case: retainAll then map", assert => {
  const iterator       = newIterator(4);
  const filtered       = retainAll(el => el % 2 === 0)(iterator);
  const copy           = filtered.copy();
  const copyFiltered   = retainAll(el => el === 2)(copy);
  const mappedFiltered = map(el => el * 2)(copyFiltered);

  assert.is(arrayEq([0, 2, 4])([...filtered]),       true);
  assert.is(arrayEq([2])      ([...copyFiltered]),   true);
  assert.is(arrayEq([4])      ([...mappedFiltered]), true);
});

iteratorSuite.add("test typical case: rejectAll", assert => {
  const iterator = newIterator(4);
  const filtered = rejectAll(el => el % 2 !== 0)(iterator);
  assert.is(arrayEq([0, 2, 4])([...filtered]), true)
});

iteratorSuite.add("test advanced case: rejectAll and map", assert => {
  const iterator       = newIterator(4);
  const filtered       = rejectAll(el => el % 2 === 0)(iterator);
  const mappedFiltered = map(el => el * 2)(filtered);
  const copyFiltered   = rejectAll(el => el === 2)(mappedFiltered);

  assert.is(arrayEq([1, 3])([...filtered]),       true);
  assert.is(arrayEq([2, 6])([...mappedFiltered]), true);
  assert.is(arrayEq([6])   ([...copyFiltered]),   true);
});

iteratorSuite.add("test typical case: dropWhile", assert => {
  const iterator = newIterator(4);
  const dropped  = dropWhile(el => el < 2)(iterator);
  assert.is(arrayEq([2, 3, 4])([...dropped]), true);
});

iteratorSuite.add("test advanced case: dropWhile and map", assert => {
  const iterator = newIterator(4);
  const result   = iterator.pipe(
    dropWhile(el => el < 2),
    map(el => el + 1)
  );
  assert.is(arrayEq([3, 4, 5])([...result]), true);
});

iteratorSuite.add("test typical case: drop", assert => {
  const iterator = newIterator(4);
  const dropped  = drop(2)(iterator);
  assert.is(arrayEq([2, 3, 4])([...dropped]), true);
});

iteratorSuite.add("test advanced case: drop 2 items", assert => {
  const iterator = newIterator(4);
  const dropped  = drop(1)(iterator);
  const dropped2  = drop(1)(dropped);
  assert.is(arrayEq([2, 3, 4])([...dropped2]), true);
});

iteratorSuite.add("test advanced case: drop than map", assert => {
  const iterator = newIterator(4);
  const result   = iterator.pipe(
    drop(2),
    map(el => el + 1)
  );
  assert.is(arrayEq([3, 4, 5])([...result]), true);
});

iteratorSuite.add("test typical case: reverse$", assert => {
  const iterator = newIterator(4);
  const reversed = reverse$(iterator);
  assert.is(arrayEq([4, 3, 2, 1, 0])([...reversed]), true);
});

iteratorSuite.add("test advanced case: reverse$ double", assert => {
  const iterator = newIterator(4);
  const reversed = reverse$(iterator);
  const doubleReversed = reverse$(reversed);
  assert.is(arrayEq([...iterator])([...doubleReversed]), true);
});

iteratorSuite.add("test typical case: concat$", assert => {
  const it1    = newIterator(1);
  const it2    = newIterator(2);
  const concat = concat$(it1)(it2);
  assert.is(arrayEq([0, 1, 0, 1, 2])([...concat]), true);
});

iteratorSuite.add("test typical case: cons$", assert => {
  const it   = newIterator(1);
  const cons = cons$(7)(it);
  assert.is(arrayEq([7, 0, 1])([...cons]), true);
});

iteratorSuite.add("test advanced case: cons$ in pipe", assert => {
  const it   = newIterator(4);
  const piped = it.pipe(
    map(el => el + 1),
    cons$(0),
    retainAll(el => el !== 1),
  );

  assert.is(arrayEq([0, 2, 3, 4, 5])([...piped]), true);
});

iteratorSuite.add("test typical case: takeWhile", assert => {
  const iterator = newIterator(10);
  const some = takeWhile(el => el < 5)(iterator);
  assert.is(arrayEq([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])([...iterator]), true);
  assert.is(arrayEq([0, 1, 2, 3, 4 ])([...some]), true);
});

iteratorSuite.add("test advanced case: takeWhile inner operator is shorter", assert => {
  // the inner iterator stops before the outer
  const iterator = newIterator(3);
  const some = takeWhile(el => el < 100)(iterator);
  assert.is(arrayEq([0, 1, 2, 3])([...some]), true);
});

iteratorSuite.add("test simple case: take", assert => {
  const iterator = newIterator(10);
  const some = take(4)(iterator);
  assert.is(arrayEq([0, 1, 2, 3])([...some]), true);
  assert.is(arrayEq([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])([...iterator]), true);
});

iteratorSuite.add("test advanced case: take with copy", assert => {
  const iterator = newIterator(10);
  const some = take(4)(iterator);
  assert.is(arrayEq([0, 1, 2, 3])([...some.copy()]), true);
  assert.is(arrayEq([0, 1, 2, 3])([...some]), true);
  assert.is(arrayEq([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])([...iterator]), true);
});

iteratorSuite.run();
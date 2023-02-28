import { TestSuite } from "../../../../docs/src/kolibri/util/test.js";
import { arrayEq }   from "../../../../docs/src/kolibri/util/arrayFunctions.js";
import { Tuple }     from "../../../../docs/src/kolibri/stdlib.js";

import {
  Iterator,
  ArrayIterator,
  TupleIterator
}  from "./iterator.js"

import {
  map,
  filter,
  eq$,
  head,
  isEmpty,
  dropWhile,
  drop,
  reverse$,
  concat$,
  cons$,
} from "./iteratorFunctions.js";

const newIterator = limit => Iterator(0, current => current + 1, current => current > limit);

const iteratorSuite = TestSuite("IteratorFunctions");

iteratorSuite.add("test typical case: map", assert => {
  const it     = newIterator(4);
  const mapped = map(el => el * 2)(it);
  assert.is(arrayEq([0, 2, 4, 6, 8])([...mapped]), true)
});

iteratorSuite.add("test advanced case: map", assert => {
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
  const filtered = filter(el => el % 2 === 0)(iterator);
  assert.is(arrayEq([0, 2, 4])([...filtered]), true)
});

iteratorSuite.add("test advanced case: retainAll", assert => {
  const iterator       = newIterator(4);
  const filtered       = filter(el => el % 2 === 0)(iterator);
  const copy           = filtered.copy();
  const copyFiltered   = filter(el => el === 2)(copy);
  const mappedFiltered = map(el => el * 2)(copyFiltered);
  assert.is(arrayEq([0, 2, 4])([...filtered]),       true);
  assert.is(arrayEq([2])      ([...copyFiltered]),   true);
  assert.is(arrayEq([4])      ([...mappedFiltered]), true);
});

iteratorSuite.add("test typical case: pipe", assert => {
  const iterator = newIterator(4);
  const piped    = iterator.pipe(
    map(i => i + 1),
    filter(el => el % 2 === 0)
  );
  assert.is(arrayEq([2,4])([...piped]), true);
});

iteratorSuite.add("test typical case: ArrayIterator", assert => {
  const  arrayIterator = ArrayIterator([1,2,3]);
  assert.is(arrayEq([1,2,3])([...arrayIterator]), true);
});

iteratorSuite.add("test advanced case: ArrayIterator", assert => {
  const arrayIterator      = ArrayIterator([1,2,3]);
  const pipedArrayIterator = arrayIterator.pipe(
    map(i => i + 1),
    filter(el => el % 2 === 0)
  );
  assert.is(arrayEq([2,4])([...pipedArrayIterator]), true);
});

iteratorSuite.add("test typical case: tuple iterator", assert => {
  const [ Triple ]    = Tuple(3);
  const triple        = Triple(1)(2)(3);
  const tupleIterator = TupleIterator(triple);
  assert.is(arrayEq([1,2,3])([...tupleIterator]), true);
});

iteratorSuite.add("test advanced case: tuple iterator", assert => {
  const [ Triple ]    = Tuple(3);
  const triple        = Triple(1)(2)(3);
  const tupleIterator = TupleIterator(triple);
  const pipedTupleIterator = tupleIterator.pipe(
    map(i => i + 1),
    filter(el => el % 2 === 0)
  );
  assert.is(arrayEq([2,4])([...pipedTupleIterator]), true);
});

iteratorSuite.add("test typical case: eq$ should return true", assert => {
  const it1 = newIterator(4);
  const it2 = newIterator(4);
  assert.is(eq$(it1)(it2), true);
});

iteratorSuite.add("test typical case: eq$ should return false", assert => {
  const it1 = newIterator(2);
  const it2 = newIterator(4);
  assert.is(eq$(it1)(it2), false);
});

iteratorSuite.add("test advanced case: eq$ should return true", assert => {
  const it1 = newIterator(4);
  const it2 = newIterator(4);
  for (const _ of it1) { /** Range gets exhausted. */ }
  assert.is(eq$(it1)(it2), false);
});

iteratorSuite.add("test typical case: head", assert => {
  const iterator = newIterator(4);
  let iteratorHead = head(iterator);
  for (const iteratorElement of iterator) {
    assert.is(iteratorHead, iteratorElement);
    iteratorHead = head(iterator);
  }
  assert.is(head(iterator), undefined);
});

iteratorSuite.add("test typical case: isEmpty", assert => {
  const iterator = newIterator(4);
  let result = isEmpty(iterator);
  assert.is(result, false);
  for (const _ of iterator) { /** Range gets exhausted. */ }
  result = isEmpty(iterator);
  assert.is(result, true);
});

iteratorSuite.add("test typical case: dropWhile", assert => {
  const iterator = newIterator(4);
  const dropped  = dropWhile(el => el < 2)(iterator);
  assert.is(arrayEq([2, 3, 4])([...dropped]), true);
});

iteratorSuite.add("test advanced case: dropWhile", assert => {
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

iteratorSuite.add("test advanced case: drop", assert => {
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


iteratorSuite.add("test advanced case: cons$", assert => {
  const it   = newIterator(4);
  const piped = it.pipe(
    map(el => el + 1),
    cons$(0),
    filter(el => el !== 1),
  );
  assert.is(arrayEq([0, 2, 3, 4, 5])([...piped]), true);
});
iteratorSuite.run();

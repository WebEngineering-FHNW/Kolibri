import { TestSuite }                from "../../../../docs/src/kolibri/util/test.js";
import { arrayEq }                  from "../../../../docs/src/kolibri/util/arrayFunctions.js";

import {map, filter, Iterator, ArrayIterator} from "./iteratorFunctions.js"
const newIterator = limit => Iterator(0, current => current + 1, current => current > limit);

// const assertIteratorValues = (assert, it, expected) =>
//   assert.is(ArrayIterator(expected).eq$(it), true);

const iteratorSuite = TestSuite("IteratorFunctions");
iteratorSuite.add("test simple map", assert => {
  const it = newIterator(4);
  const mapped = map(el => el * 2)(it);
  assert.is(arrayEq([0, 2, 4, 6, 8])([...mapped]), true)
});

iteratorSuite.add("test complex map", assert => {
  const it = newIterator(4);
  const mapped = map(el => el * 2)(it);
  const copyMapped = mapped.copy();
  const copyMappedMapped = map(el => el * 2)(copyMapped);
  assert.is(arrayEq([0, 2, 4, 6, 8])([...mapped]), true);
  assert.is(arrayEq([0, 2, 4, 6, 8])([...copyMapped]), true);
  assert.is(arrayEq([0, 4, 8, 12, 16])([...copyMappedMapped]), true);
});
iteratorSuite.add("test simple retainAll", assert => {
  const iterator = newIterator(4);
  const filtered = filter(el => el % 2 === 0)(iterator);
  assert.is(arrayEq([0, 2, 4])([...filtered]), true)
});

iteratorSuite.add("test simple retainAll", assert => {
  const iterator = newIterator(4);
  const filtered = filter(el => el % 2 === 0)(iterator);
  const copyFiltered = filtered.copy();
  const copyFF = filter(el => el === 2)(copyFiltered);
  const mappedFiltered = map(el => el * 2)(copyFF);
  assert.is(arrayEq([0, 2, 4])([...filtered]), true);
  assert.is(arrayEq([2])([...copyFF]), true);
  assert.is(arrayEq([4])([...mappedFiltered]), true);
});

iteratorSuite.add("test simple retainAll", assert => {
  const iterator = newIterator(4);
  const piped = iterator.pipe(
    map(i => i + 1),
    filter(el => el % 2 === 0)
  );

  assert.is(arrayEq([2,4])([...piped]), true);
});


iteratorSuite.add("test simple array iterator", assert => {
  const  arrayIterator = ArrayIterator([1,2,3]);

  assert.is(arrayEq([1,2,3])([...arrayIterator]), true);
});

iteratorSuite.add("test complex array iterator", assert => {
  const  arrayIterator = ArrayIterator([1,2,3]);
  const pipedArrayIterator = arrayIterator.pipe(
    map(i => i + 1),
    filter(el => el % 2 === 0)
  );
  assert.is(arrayEq([2,4])([...pipedArrayIterator]), true);
});

iteratorSuite.run();

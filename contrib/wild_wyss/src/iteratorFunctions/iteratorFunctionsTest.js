import { TestSuite }                from "../../../../docs/src/kolibri/util/test.js";
import { arrayEq }                  from "../../../../docs/src/kolibri/util/arrayFunctions.js";
import { map, filter }              from "./iteratorFunctions.js";
import { Iterator, ArrayIterator, TupleIterator }  from "./iterator.js"
import { Tuple }                    from "../../../../docs/src/kolibri/stdlib.js";

const newIterator = limit => Iterator(0, current => current + 1, current => current > limit);

const iteratorSuite = TestSuite("IteratorFunctions");
iteratorSuite.add("test typical case: map", assert => {
  const it = newIterator(4);
  const mapped = map(el => el * 2)(it);
  assert.is(arrayEq([0, 2, 4, 6, 8])([...mapped]), true)
});

iteratorSuite.add("test advanced case: map", assert => {
  const it = newIterator(4);
  const mapped = map(el => el * 2)(it);
  const copyMapped = mapped.copy();
  const copyMappedMapped = map(el => el * 2)(copyMapped);
  assert.is(arrayEq([0, 2, 4, 6, 8])([...mapped]), true);
  assert.is(arrayEq([0, 2, 4, 6, 8])([...copyMapped]), true);
  assert.is(arrayEq([0, 4, 8, 12, 16])([...copyMappedMapped]), true);
});
iteratorSuite.add("test typical case: retainAll", assert => {
  const iterator = newIterator(4);
  const filtered = filter(el => el % 2 === 0)(iterator);
  assert.is(arrayEq([0, 2, 4])([...filtered]), true)
});

iteratorSuite.add("test typical case: retainAll", assert => {
  const iterator = newIterator(4);
  const filtered = filter(el => el % 2 === 0)(iterator);
  const copyFiltered = filtered.copy();
  const copyFF = filter(el => el === 2)(copyFiltered);
  const mappedFiltered = map(el => el * 2)(copyFF);
  assert.is(arrayEq([0, 2, 4])([...filtered]), true);
  assert.is(arrayEq([2])([...copyFF]), true);
  assert.is(arrayEq([4])([...mappedFiltered]), true);
});

iteratorSuite.add("test typical case: retainAll", assert => {
  const iterator = newIterator(4);
  const piped = iterator.pipe(
    map(i => i + 1),
    filter(el => el % 2 === 0)
  );

  assert.is(arrayEq([2,4])([...piped]), true);
});


iteratorSuite.add("test typical case: array iterator", assert => {
  const  arrayIterator = ArrayIterator([1,2,3]);

  assert.is(arrayEq([1,2,3])([...arrayIterator]), true);
});

iteratorSuite.add("test advanced case: array iterator", assert => {
  const arrayIterator = ArrayIterator([1,2,3]);
  const pipedArrayIterator = arrayIterator.pipe(
    map(i => i + 1),
    filter(el => el % 2 === 0)
  );
  assert.is(arrayEq([2,4])([...pipedArrayIterator]), true);
});

iteratorSuite.add("test typical case: tuple iterator", assert => {
  const [ Triple ] = Tuple(3);
  const triple = Triple(1)(2)(3);
  const tupleIterator = TupleIterator(triple);
  assert.is(arrayEq([1,2,3])([...tupleIterator]), true);
});

iteratorSuite.add("test advanced case: tuple iterator", assert => {
  const [ Triple ] = Tuple(3);
  const triple = Triple(1)(2)(3);
  const tupleIterator = TupleIterator(triple);
  const pipedTupleIterator = tupleIterator.pipe(
    map(i => i + 1),
    filter(el => el % 2 === 0)
  );
  assert.is(arrayEq([2,4])([...pipedTupleIterator]), true);
});

iteratorSuite.run();

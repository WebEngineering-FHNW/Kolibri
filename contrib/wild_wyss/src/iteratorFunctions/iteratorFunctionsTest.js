import { TestSuite }                from "../../../../docs/src/kolibri/util/test.js";
import { arrayEq }                  from "../../../../docs/src/kolibri/util/arrayFunctions.js";
import { map, filter }              from "./iteratorFunctions.js";
import { Tuple }                    from "../../../../docs/src/kolibri/stdlib.js";
import { Iterator, ArrayIterator, TupleIterator }  from "./iterator.js"

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

iteratorSuite.run();

import { TestSuite } from "../../../../docs/src/kolibri/util/test.js";
import { arrayEq }   from "../../../../docs/src/kolibri/util/arrayFunctions.js";
import { Tuple }     from "../../../../docs/src/kolibri/stdlib.js";

import {
  Iterator,
  ArrayIterator,
  TupleIterator
} from "./iterator.js"

import {
  map,
  retainAll,
} from "./intermediateOperations.js";
import {reduce$} from "./terminalOperations.js";

const newIterator = limit => Iterator(0, current => current + 1, current => current > limit);

const iteratorSuite = TestSuite("Iterator");

iteratorSuite.add("test special case: no increment after done", assert => {
  let result = true;
  const iterator = Iterator(true, _ => result = false, _ => true);
  for (const iteratorElement of iterator) { /* exhausting iterator */ }
  assert.is(result, true);
});

iteratorSuite.add("test typical case: pipe", assert => {
  const iterator = newIterator(4);
  const piped    = iterator.pipe(
    map(i => i + 1),
    retainAll(el => el % 2 === 0)
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
    retainAll(el => el % 2 === 0)
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
    retainAll(el => el % 2 === 0)
  );
  assert.is(arrayEq([2,4])([...pipedTupleIterator]), true);
});

iteratorSuite.run();
import { TestSuite }  from "../../../../docs/src/kolibri/util/test.js";
import { Iterator }   from "./iterator.js";
import { arrayEq } from "../../../../docs/src/kolibri/util/arrayFunctions.js";

const iteratorSuite = TestSuite("Iterator");

iteratorSuite.add("test typical case for simple iterator.", assert => {
  const iterator = Iterator(0, current => current + 1, current => 0 < current);
  const [zero0, undef] = iterator;

  assert.is(zero0,0);
  assert.is(undef,undefined);
});

iteratorSuite.add("test edge case for empty iteration.", assert => {
  const iterator = Iterator(1, current => current + 1, current => 0 < current);
  const [undef]  = iterator;

  assert.is(undef,undefined);
});

iteratorSuite.add("test iterator identity.", assert => {
  const iterator = Iterator(0, current => current + 1, current => 0 < current);
  const [zero0]  = iterator;
  assert.is(zero0, 0);

  const [undef] = iterator;
  assert.is(undef,undefined);
});

iteratorSuite.add("test copy of iterator", assert => {
  const iterator = Iterator(0, current => current + 1, current => 4 < current);
  const iteratorCopy = iterator.copy();

  assert.is(iterator === iteratorCopy, false);

  assert.is(arrayEq([...iterator])([...iteratorCopy]), true)
});

iteratorSuite.add("test copy of iterator in use", assert => {
  const iterator = Iterator(0, current => current + 1, current => 4 < current);
  iterator.drop(1);
  const iteratorCopy = iterator.copy();

  assert.is(arrayEq([1, 2, 3, 4])([...iterator]),     true)
  assert.is(arrayEq([1, 2, 3, 4])([...iteratorCopy]), true)
});

iteratorSuite.add("test modify copy of iterator should not affect the origin", assert => {
  const iterator = Iterator(0, current => current + 1, current => 4 < current);
  const iteratorCopy = iterator.copy();
  iteratorCopy.drop(1);

  assert.is(arrayEq([0, 1, 2, 3, 4])([...iterator]),     true)
  assert.is(arrayEq([1, 2, 3, 4])   ([...iteratorCopy]), true)
});

iteratorSuite.add("test DO NOT USE stopDetection with side effect", assert => {
  let ended = false;
  const stopDetected = _value => {
    if(ended) return false;
    ended = true;
    return ended;
  };
  const iterator = Iterator(0, current => current + 1, stopDetected);
  const iteratorCopy = iterator.copy();

  assert.is(arrayEq([...iterator.take(1)])([...iteratorCopy.take(1)]), false);
});

iteratorSuite.run();
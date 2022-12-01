import { TestSuite }  from "../../../../docs/src/kolibri/util/test.js";
import { Iterator }   from "./iterator.js";
import { arrayEq }    from "../../../../docs/src/kolibri/util/arrayFunctions.js";

const newIterator = limit => Iterator(0, current => current + 1, current => current > limit);

const iteratorSuite = TestSuite("Iterator");

iteratorSuite.add("test typical case for simple iterator.", assert => {
  const iterator = newIterator(0);
  const [zero0, undef] = iterator;

  assert.is(zero0,0);
  assert.is(undef,undefined);
});

iteratorSuite.add("test edge case for empty iteration.", assert => {
  const iterator = newIterator(-1);
  const [undef]  = iterator;

  assert.is(undef, undefined);
});

iteratorSuite.add("test iterator identity.", assert => {
  const iterator = newIterator(0);
  const [zero0]  = iterator;
  assert.is(zero0, 0);

  const [undef] = iterator;
  assert.is(undef,undefined);
});

iteratorSuite.add("test copy of iterator", assert => {
  const iterator = newIterator(4);
  const iteratorCopy = iterator.copy();

  assert.is(iterator === iteratorCopy, false);
  assert.is(arrayEq([...iterator])([...iteratorCopy]), true)
});

iteratorSuite.add("test copy of iterator in use", assert => {
  const iterator = newIterator(4);
  iterator.drop(1);
  const iteratorCopy = iterator.copy();

  assert.is(arrayEq([1, 2, 3, 4])([...iterator]),     true);
  assert.is(arrayEq([1, 2, 3, 4])([...iteratorCopy]), true);
});

iteratorSuite.add("test modify copy of iterator should not affect the origin", assert => {
  const iterator = newIterator(4);
  const iteratorCopy = iterator.copy();
  iteratorCopy.drop(1);

  assert.is(arrayEq([0, 1, 2, 3, 4])([...iterator]),     true);
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

iteratorSuite.add("test simple map", assert => {
  const iterator = newIterator(4);
  iterator.map(el => el * 2);
  assert.is(arrayEq([0, 2, 4, 6, 8])([...iterator]), true)
});

iteratorSuite.add("test map to another type", assert => {
  const iterator = newIterator(4);
  iterator.map(el => el.toString());
  assert.is(arrayEq(["0", "1", "2", "3", "4"])([...iterator]), true)
});

iteratorSuite.add("test multiple map", assert => {
  const iterator = newIterator(4);
  iterator.map(el => el * 2).map(el => el * 2);
  assert.is(arrayEq([0, 4, 8, 12, 16])([...iterator]), true)
});

iteratorSuite.add("test copy after map", assert => {
  const iterator = newIterator(4);
  const copy = iterator.map(el => el * 2).copy();
  assert.is(arrayEq([0, 2, 4, 6, 8])([...copy]), true)
});

iteratorSuite.add("test simple retainAll", assert => {
  const iterator = newIterator(4);
  iterator.retainAll(el => el % 2 === 0);
  assert.is(arrayEq([0, 2, 4])([...iterator]), true)
});

iteratorSuite.add("test simple rejectAll", assert => {
  const iterator = newIterator(4);
  iterator.rejectAll(el => el % 2 === 0);
  assert.is(arrayEq([1, 3])([...iterator]), true)
});

iteratorSuite.add("test copy after filter", assert => {
  const iterator = newIterator(4);
  const copy = iterator.retainAll(el => el % 2 === 0).copy();
  assert.is(arrayEq([0, 2, 4])([...copy]), true)
});

iteratorSuite.add("test simple reduce", assert => {
  const iterator = newIterator(4);
  const result = iterator.reduce( (acc, cur) => acc + cur , 0);
  assert.is(10, result);
});

iteratorSuite.add("test simple cons", assert => {
  const iterator = newIterator(4).cons(7);
  assert.is(arrayEq([7, 0, 1, 2, 3, 4])([...iterator]), true);
});

iteratorSuite.add("test concat 2 iterators", assert => {
  const iterator = newIterator(4);
  const iterator2 = newIterator(6);
  iterator.concat(iterator2);
  assert.is(arrayEq([0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 5, 6])([...iterator]), true);
});

iteratorSuite.add("test simple head", assert => {
  const iterator = newIterator(4);
  assert.is(0, iterator.head());
  assert.is(arrayEq([0,1,2,3,4])([...iterator]), true);
});

iteratorSuite.add("test simple head", assert => {
  const iterator = newIterator(4);
  assert.is(0, iterator.head());
  assert.is(arrayEq([0,1,2,3,4])([...iterator]), true);
});

iteratorSuite.add("test head on empty iterator", assert => {
  const iterator = newIterator(-1);
  assert.is(iterator.head(), undefined);
});

iteratorSuite.add("test simple reverse", assert => {
  const iterator = newIterator(4).map(x => x * 2);
  assert.is(arrayEq([0,2,4,6,8].reverse())([...iterator.reverse()]), true);
});

iteratorSuite.add("test reverse exhausted iterator", assert => {
  const iterator = newIterator(4);
  for (const _ of iterator) { /** Range gets exhausted. */ }
  assert.is(arrayEq([])([...iterator.reverse()]), true);
});

iteratorSuite.add("test filter than map", assert => {
  const iterator = newIterator(4).rejectAll(x => x === 3).map(x => x * 2);
  // const copy = iterator.copy();
  console.log(...iterator);
  // assert.is(arrayEq([0,2,4,8].reverse())([...iterator]), true);
  assert.is(arrayEq([0,2,4,8].reverse())([...iterator]), true);
});

iteratorSuite.add("test map than filter", assert => {
  const iterator = newIterator(4).map(x => 10 * x).retainAll(x => x > 20 );
  console.log(...iterator.copy());
  assert.is(arrayEq([30, 40])([...iterator]), true);
});



iteratorSuite.run();
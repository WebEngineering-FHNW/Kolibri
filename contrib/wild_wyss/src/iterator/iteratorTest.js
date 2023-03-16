import { TestSuite }        from "../../../../docs/src/kolibri/util/test.js";
import { arrayEq }          from "../../../../docs/src/kolibri/util/arrayFunctions.js";
import { Tuple }            from "../../../../docs/src/kolibri/stdlib.js";
import { map, retainAll }   from "./intermediateOperations.js";
import { emptyStack, push } from "../../../p6_brodwolf_andermatt/src/stack/stack.js";
import {
  pipe,
  Iterator,
  ArrayIterator,
  TupleIterator,
  ConcatIterator,
  StackIterator,
  emptyIterator,
} from "./iterator.js"

const newIterator = limit => Iterator(0, current => current + 1, current => current > limit);

const iteratorSuite = TestSuite("Iterator");

iteratorSuite.add("test typical case: Iterator", assert => {
  const iterator = Iterator(0, current => current + 1, current => current > 5);
  assert.is(arrayEq([0, 1, 2, 3, 4, 5])([...iterator]), true);
  assert.is(arrayEq([])([...iterator]), true);
});

iteratorSuite.add("test copy: Iterator", assert => {
  const iterator = Iterator(0, current => current + 1, current => current > 5);
  const copy = iterator.copy();
  assert.is(arrayEq([0, 1, 2, 3, 4, 5])([...copy]), true);
  assert.is(arrayEq([0, 1, 2, 3, 4, 5])([...iterator]), true);
});

iteratorSuite.add("test special case: no increment after done", assert => {
  let result = true;
  const iterator = Iterator(true, _ => result = false, _ => true);
  for (const iteratorElement of iterator) { /* exhausting iterator */ }
  assert.is(result, true);
});

iteratorSuite.add("test typical case: pipe", assert => {
  const iterator = newIterator(4);
  const piped    = pipe(iterator)(
    map(i => i + 1),
    retainAll(el => el % 2 === 0)
  );

  assert.is(arrayEq([2,4])([...piped]), true);
});

iteratorSuite.add("test typical case: ArrayIterator", assert => {
  const arrayIterator = ArrayIterator([1,2,3]);
  assert.is(arrayEq([1,2,3])([...arrayIterator]), true);
});

iteratorSuite.add("test iterate on copy: ArrayIterator", assert => {
  const arr = [1,2,3];
  const arrayIterator = ArrayIterator(arr);
  arr.push(4);

  assert.is(arrayEq([1,2,3])([...arrayIterator]), true);

});

iteratorSuite.add("test advanced case: ArrayIterator", assert => {
  const arrayIterator      = ArrayIterator([1,2,3]);
  const pipedArrayIterator = pipe(arrayIterator)(
    map(i => i + 1),
    retainAll(el => el % 2 === 0)
  );
  assert.is(arrayEq([2,4])([...pipedArrayIterator]), true);
});

iteratorSuite.add("test array does not exceed", assert => {
  const arrayIterator      = ArrayIterator([1,2,3]);
  for (const _ of arrayIterator) { /*exhausting*/ }
  assert.is(arrayIterator[Symbol.iterator]().next().value, 3);
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
  const pipedTupleIterator = pipe(tupleIterator)(
    map(i => i + 1),
    retainAll(el => el % 2 === 0)
  );
  assert.is(arrayEq([2,4])([...pipedTupleIterator]), true);
});

iteratorSuite.add("test typical case: ConcatIterator", assert => {
  const it1 = newIterator(4);
  const it2 = newIterator(2);
  const concatIterator = ConcatIterator(it1)(it2);
  assert.is(arrayEq([0,1,2,3,4,0,1,2])([...concatIterator]), true);
});

iteratorSuite.add("test copy: ConcatIterator", assert => {
  const it1 = newIterator(4);
  const it2 = newIterator(2);
  const concatIterator = ConcatIterator(it1)(it2);
  const copy = concatIterator.copy();
  for (const _ of concatIterator) { /* Exhausting */ }
  assert.is(arrayEq([0,1,2,3,4,0,1,2])([...copy]), true);
});

iteratorSuite.add("test purity: ConcatIterator", assert => {
  const it1 = newIterator(4);
  const it2 = newIterator(2);
  const concatIterator = ConcatIterator(it1)(it2);
  for (const _ of concatIterator) { /* Exhausting */ }
  assert.is(arrayEq([0,1,2,3,4])([...it1]), true);
  assert.is(arrayEq([0,1,2])    ([...it2]), true);
});

iteratorSuite.add("test left/right neutrality: ConcatIterator", assert => {
  const left =  ConcatIterator(emptyIterator)(newIterator(4));
  const right = ConcatIterator(newIterator(4))(emptyIterator);
  const expected = [0,1,2,3,4];
  assert.is(arrayEq(expected)([...right]), true);
  assert.is(arrayEq(expected)([...left]),  true);
});

iteratorSuite.add("test left/right associativity: ConcatIterator", assert => {
  const left  = ConcatIterator(ConcatIterator(newIterator(2))(newIterator(1)))(newIterator(3));
  const right = ConcatIterator(newIterator(2))(ConcatIterator(newIterator(1))(newIterator(3)));
  const expected = [0,1,2,0,1,0,1,2,3];
  assert.is(arrayEq(expected)([...right]), true);
  assert.is(arrayEq(expected)([...left]),  true);
});

iteratorSuite.add("test concat with infinity: ConcatIterator", assert => {
  let called  = false;
  let counter = 0;

  const endless                = Iterator(0, i => i + 1, _ => false);
  const iteratorWithSideEffect = Iterator(false, _ => called = true, _ => false)
  const concatenated           = ConcatIterator(endless)(iteratorWithSideEffect);

  for (const _ of concatenated) {
    if (counter++ > 10) break; // consume a few elements
  }
  assert.is(called, false);
});

iteratorSuite.add("test empty: ConcatIterator", assert => {
  const concatenated = ConcatIterator(emptyIterator)(emptyIterator);
  assert.is(arrayEq([])([...concatenated]),  true);
});

iteratorSuite.add("test typical case: stack iterator", assert => {
  const stack = push(push(push(emptyStack)(1))(2))(3);

  const stackIterator = StackIterator(stack);
  assert.is(arrayEq([3,2,1])([...stackIterator]), true);
});

iteratorSuite.add("test copy: StackIterator", assert => {
  const stack = push(push(push(emptyStack)(1))(2))(3);

  const stackIterator = StackIterator(stack);
  const copy = stackIterator.copy();
  for (const _ of stackIterator) { /* Exhausting */ }
  assert.is(arrayEq([3,2,1])([...copy]), true);
});

iteratorSuite.run();
import { TestSuite }        from "../../test/test.js";
import { arrayEq }          from "../../../../../docs/src/kolibri/util/arrayFunctions.js";
import { Tuple }            from "../../../../../docs/src/kolibri/stdlib.js";
import { emptyStack, push } from "../../../../p6_brodwolf_andermatt/src/stack/stack.js";
import {
  pipe,
  Iterator,
  ArrayIterator,
  TupleIterator,
  ConcatIterator,
  StackIterator,
  emptyIterator,
  map,
  drop,
  retainAll, FibonacciIterator, AngleIterator, SquareNumberIterator, PrimeNumberIterator,
} from "./iterator.js"

const newIterator = limit => Iterator(0, current => current + 1, current => current > limit);

/**
 * Works exactly as take, but does not copy the iterator.
 * This is useful to test the functionality without the influence of copy.
 * @template _T_
 * @type {
 *         (n: Number)
 *         => (iterator: IteratorType<_T_>)
 *         => Array<_T_>
 * }
 */
const takeWithoutCopy = n => iterator => {
  const values = [];
  let i = 0;
  for (const element of iterator) {
    values.push(element);
    if (++i === n) break;
  }
  return values;
};

const iteratorSuite = TestSuite("Iterator");

iteratorSuite.add("test typical case: Constructors", assert => {
  const iterator = Iterator(0, current => current + 1, current => current > 5);
  assert.isTrue(arrayEq([0, 1, 2, 3, 4, 5])([...iterator]));
  assert.isTrue(arrayEq([])([...iterator]));
});

iteratorSuite.add("test copy: Constructors", assert => {
  const iterator = Iterator(0, current => current + 1, current => current > 5);
  const copy = iterator.copy();
  assert.isTrue(arrayEq([0, 1, 2, 3, 4, 5])([...copy]));
  assert.isTrue(arrayEq([0, 1, 2, 3, 4, 5])([...iterator]));
});

iteratorSuite.add("test special case: no increment after done", assert => {
  let result = true;
  const iterator = Iterator(true, _ => result = false, _ => true);
  for (const iteratorElement of iterator) { /* exhausting iterator */ }
  assert.isTrue(result);
});

iteratorSuite.add("test typical case: pipe", assert => {
  const iterator = newIterator(4);
  const piped    = pipe(iterator)(
    map(i => i + 1),
    retainAll(el => el % 2 === 0)
  );

  assert.isTrue(arrayEq([2,4])([...piped]));
});

iteratorSuite.add("test typical case: ArrayIterator", assert => {
  const arrayIterator = ArrayIterator([1,2,3]);
  assert.isTrue(arrayEq([1,2,3])([...arrayIterator]));
});

iteratorSuite.add("test iterate on copy: ArrayIterator", assert => {
  const arr = [1,2,3];
  const arrayIterator = ArrayIterator(arr);
  arr.push(4);

  assert.isTrue(arrayEq([1,2,3])([...arrayIterator]));

});

iteratorSuite.add("test advanced case: ArrayIterator", assert => {
  const arrayIterator      = ArrayIterator([1,2,3]);
  const pipedArrayIterator = pipe(arrayIterator)(
    map(i => i + 1),
    retainAll(el => el % 2 === 0)
  );
  assert.isTrue(arrayEq([2,4])([...pipedArrayIterator]));
});

iteratorSuite.add("test typical case: tuple iterator", assert => {
  const [ Triple ]    = Tuple(3);
  const triple        = Triple(1)(2)(3);
  const tupleIterator = TupleIterator(triple);
  assert.isTrue(arrayEq([1,2,3])([...tupleIterator]));
});

iteratorSuite.add("test advanced case: tuple iterator", assert => {
  const [ Triple ]    = Tuple(3);
  const triple        = Triple(1)(2)(3);
  const tupleIterator = TupleIterator(triple);
  const pipedTupleIterator = pipe(tupleIterator)(
    map(i => i + 1),
    retainAll(el => el % 2 === 0)
  );
  assert.isTrue(arrayEq([2,4])([...pipedTupleIterator]));
});

iteratorSuite.add("test typical case: ConcatIterator", assert => {
  const it1 = newIterator(4);
  const it2 = newIterator(2);
  const concatIterator = ConcatIterator(it1)(it2);
  assert.isTrue(arrayEq([0,1,2,3,4,0,1,2])([...concatIterator]));
});

iteratorSuite.add("test copy: ConcatIterator", assert => {
  const it1 = newIterator(4);
  const it2 = newIterator(2);
  const concatIterator = ConcatIterator(it1)(it2);
  const copy = concatIterator.copy();
  for (const _ of concatIterator) { /* Exhausting */ }
  assert.isTrue(arrayEq([0,1,2,3,4,0,1,2])([...copy]));
});

iteratorSuite.add("test purity: ConcatIterator", assert => {
  const it1 = newIterator(4);
  const it2 = newIterator(2);
  const concatIterator = ConcatIterator(it1)(it2);
  for (const _ of concatIterator) { /* Exhausting */ }
  assert.isTrue(arrayEq([0,1,2,3,4])([...it1]));
  assert.isTrue(arrayEq([0,1,2])    ([...it2]));
});

iteratorSuite.add("test left/right neutrality: ConcatIterator", assert => {
  const left =  ConcatIterator(emptyIterator)(newIterator(4));
  const right = ConcatIterator(newIterator(4))(emptyIterator);
  const expected = [0,1,2,3,4];
  assert.isTrue(arrayEq(expected)([...right]));
  assert.is(arrayEq(expected)([...left]),  true);
});

iteratorSuite.add("test left/right associativity: ConcatIterator", assert => {
  const left  = ConcatIterator(ConcatIterator(newIterator(2))(newIterator(1)))(newIterator(3));
  const right = ConcatIterator(newIterator(2))(ConcatIterator(newIterator(1))(newIterator(3)));
  const expected = [0,1,2,0,1,0,1,2,3];
  assert.isTrue(arrayEq(expected)([...right]));
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
  assert.isTrue(arrayEq([3,2,1])([...stackIterator]));
});

iteratorSuite.add("test copy: StackIterator", assert => {
  const stack = push(push(push(emptyStack)(1))(2))(3);

  const stackIterator = StackIterator(stack);
  const copy = stackIterator.copy();
  for (const _ of stackIterator) { /* Exhausting */ }
  assert.isTrue(arrayEq([3,2,1])([...copy]));
});

iteratorSuite.add("test typical: FibonacciIterator", assert => {
  const iterator = FibonacciIterator();
  const result = takeWithoutCopy(8)(iterator);
  assert.isTrue(arrayEq([1, 1, 2, 3, 5, 8, 13, 21])([...result]));
});

iteratorSuite.add("test copy: FibonacciIterator", assert => {
  const iterator = FibonacciIterator();
  const copy     = iterator.copy();
  assert.isTrue(arrayEq([1, 1, 2, 3, 5, 8, 13, 21])([...takeWithoutCopy(8)(iterator)]));
  assert.isTrue(arrayEq([1, 1, 2, 3, 5, 8, 13, 21])([...takeWithoutCopy(8)(copy)]));
});

iteratorSuite.add("test copy on used iterator: FibonacciIterator", assert => {
  const iterator = FibonacciIterator();
  const result   =  drop(1)(iterator);
  for (const elem of result) {
    if (elem !== 1) break;
  }
  const copy = result.copy();
  assert.isTrue(arrayEq([3, 5, 8, 13, 21])([...takeWithoutCopy(5)(result)]));
  assert.isTrue(arrayEq([3, 5, 8, 13, 21])([...takeWithoutCopy(5)(copy)]));
});

iteratorSuite.add("test typical case: AngleIterator", assert => {
  const iterator = AngleIterator(4);
  assert.isTrue(arrayEq([0, 90, 180, 270])([...iterator]));
});

iteratorSuite.add("test typical case: SquareNumberIterator", assert => {
  const iterator = takeWithoutCopy(5)(SquareNumberIterator());
  assert.isTrue(arrayEq([1, 4, 9, 16, 25])([...iterator]));
});

iteratorSuite.add("test typical case: PrimeNumberIterator", assert => {
  const iterator = PrimeNumberIterator();
  assert.isTrue(arrayEq([2, 3, 5, 7, 11, 13])([...takeWithoutCopy(6)(iterator)]));
});

iteratorSuite.add("test copy: PrimeNumberIterator", assert => {
  const iterator = PrimeNumberIterator();
  const copy = iterator.copy();

  assert.isTrue(arrayEq([2, 3, 5, 7, 11, 13])([...takeWithoutCopy(6)(iterator)]));
  assert.isTrue(arrayEq([2, 3, 5, 7, 11, 13])([...takeWithoutCopy(6)(copy)]));
});

iteratorSuite.add("test copy partially used: PrimeNumberIterator", assert => {
  const iterator = PrimeNumberIterator();
  // noinspection LoopStatementThatDoesntLoopJS
  for (const _ of iterator) { break; }
  const copy = iterator.copy();

  assert.isTrue(arrayEq([3, 5, 7, 11, 13, 17])([...takeWithoutCopy(6)(copy)]));
});

iteratorSuite.run();
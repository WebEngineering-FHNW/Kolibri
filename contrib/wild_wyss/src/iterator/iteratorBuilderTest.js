import { arrayEq }          from "../../../../docs/src/kolibri/util/arrayFunctions.js";
import { Range }            from "../range/range.js";
import {emptyIterator, Iterator} from "./iterator.js";
import { TestSuite }        from "../../../../docs/src/kolibri/util/test.js";
import { IteratorBuilder }  from "./iteratorBuilder.js";
import {eq$} from "./terminalOperations.js";


const iteratorBuilderSuite = TestSuite("IteratorBuilder");

iteratorBuilderSuite.add("test basic: IteratorBuilder", assert => {
  const it = IteratorBuilder()
    .append(1)
    .append(2, 3)
    .build();
  assert.is(arrayEq([1,2,3])([...it]), true);
});

iteratorBuilderSuite.add("test no start iterator: IteratorBuilder", assert => {
  const iterator = IteratorBuilder().build();
  assert.is(arrayEq([])([...iterator]), true);
});

iteratorBuilderSuite.add("test add values and iterator: IteratorBuilder", assert => {
  const range = Range(1, 3);
  const it = IteratorBuilder()
    .append(0)
    .append(range)
    .append(4)
    .build();
  assert.is(arrayEq([0,1,2,3,4])([...it]), true);
});

iteratorBuilderSuite.add("test varargs: IteratorBuilder", assert => {
  const iterator = Range(3, 5);
  const it = IteratorBuilder()
    .append(0,1,2)
    .append(iterator,6,7,8)
    .append(9,10,11)
    .build();
  assert.is(arrayEq([0,1,2,3,4,5,6,7,8,9,10,11])([...it]), true);
});
// copy, empty, infinity, purity, combinations, undefined

iteratorBuilderSuite.add("test add undefined & null: IteratorBuilder", assert => {
  const it = IteratorBuilder()
    .append(undefined)
    .append(null)
    .build();
  assert.is(arrayEq([undefined, null])([...it]), true);
});

iteratorBuilderSuite.add("test copy: IteratorBuilder", assert => {
  const it = IteratorBuilder()
    .append(1,2,3)
    .build();
  const copy = it.copy();
  assert.is(arrayEq([1,2,3])([...copy]), true);
  assert.is(arrayEq([1,2,3])([...it]),   true);
});

iteratorBuilderSuite.add("test copy index: IteratorBuilder", assert => {
  const it = IteratorBuilder()
    .append(1,2,3)
    .build();
  for (const element of it) {
    if(element === 2) break;
  }
  const copy = it.copy();
  assert.is(arrayEq([3])([...copy]), true);
  assert.is(arrayEq([3])([...it]),   true);
});

iteratorBuilderSuite.add("test infinity: IteratorBuilder", assert => {
  let called  = false;
  let counter = 0;

  const endless    = Iterator(false, _ => false, _ => false);
  const sideEffect = Iterator(false, _ => called = true, _ => false);
  const it = IteratorBuilder()
    .append(endless)
    .append(sideEffect)
    .build();

  for (const _ of it) if (counter++ > 10) break;

  assert.is(called, false);
});

iteratorBuilderSuite.add("test add undefined & null: IteratorBuilder", assert => {
  const it = IteratorBuilder(Range(3, 5))
    .prepend(0,1,2)
    .build();
  assert.is(arrayEq([0,1,2,3,4,5])([...it]), true);
});

iteratorBuilderSuite.add("test build two times: IteratorBuilder", assert => {
  const builder = IteratorBuilder(Range(3));
  const it1 = builder.build();
  const it2 = builder.build();

  assert.is(arrayEq([0,1,2,3])([...it1]), true);
  assert.is(it2, emptyIterator);
});

iteratorBuilderSuite.add("test add after build: IteratorBuilder", assert => {
  const builder = IteratorBuilder(Range(3));
  const it1 = builder.build();
  builder.append(4,5,6)
    .prepend(-3 -2,-1);
  const it2 = builder.build();

  assert.is(arrayEq([0,1,2,3])([...it1]), true);
  assert.is(it2, emptyIterator);
});

iteratorBuilderSuite.run();

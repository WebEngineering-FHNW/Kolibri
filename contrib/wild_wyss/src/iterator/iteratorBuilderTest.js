import { arrayEq }                    from "../../../../docs/src/kolibri/util/arrayFunctions.js";
import { Range }                      from "../range/range.js";
import { TestSuite }                  from "../../../../docs/src/kolibri/util/test.js";
import { IteratorBuilder, Iterator }  from "./iterator.js";


const iteratorBuilderSuite = TestSuite("IteratorBuilder");

iteratorBuilderSuite.add("test basic: IteratorBuilder", assert => {
  const it = IteratorBuilder()
    .append(1)
    .append(2, 3)
    .build();
  assert.isTrue(arrayEq([1,2,3])([...it]));
});

iteratorBuilderSuite.add("test no start iterator: IteratorBuilder", assert => {
  const iterator = IteratorBuilder().build();
  assert.isTrue(arrayEq([])([...iterator]));
});

iteratorBuilderSuite.add("test add values and iterator: IteratorBuilder", assert => {
  const range = Range(1, 3);
  const it = IteratorBuilder()
    .append(0)
    .append(range)
    .append(4)
    .build();
  assert.isTrue(arrayEq([0,1,2,3,4])([...it]));
});

iteratorBuilderSuite.add("test varargs: IteratorBuilder", assert => {
  const iterator = Range(3, 5);
  const it = IteratorBuilder()
    .append(0,1,2)
    .append(iterator,6,7,8)
    .append(9,10,11)
    .build();
  assert.isTrue(arrayEq([0,1,2,3,4,5,6,7,8,9,10,11])([...it]));
});

iteratorBuilderSuite.add("test add undefined & null: IteratorBuilder", assert => {
  const it = IteratorBuilder()
    .append(undefined)
    .append(null)
    .build();
  assert.isTrue(arrayEq([undefined, null])([...it]));
});

iteratorBuilderSuite.add("test copy: IteratorBuilder", assert => {
  const it = IteratorBuilder()
    .append(1,2,3)
    .build();
  const copy = it.copy();
  assert.isTrue(arrayEq([1,2,3])([...copy]));
  assert.isTrue(arrayEq([1,2,3])([...it]));
});

iteratorBuilderSuite.add("test copy index: IteratorBuilder", assert => {
  const it = IteratorBuilder()
    .append(1,2,3)
    .build();
  for (const element of it) { // take 2
    if (element === 2) {
      break;
    }
  }
  const copy = it.copy();
  assert.isTrue(arrayEq([3])([...copy]));
  assert.isTrue(arrayEq([3])([...it]));
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

  for (const _ of it) {
    counter++;
    if (counter > 10) {
     break;
    }
  }

  assert.is(called, false);
});

iteratorBuilderSuite.add("test add undefined & null: IteratorBuilder", assert => {
  const it = IteratorBuilder(Range(3, 5))
    .prepend(0,1,2)
    .build();
  assert.isTrue(arrayEq([0,1,2,3,4,5])([...it]));
});

iteratorBuilderSuite.add("test build two times: IteratorBuilder", assert => {
  const builder = IteratorBuilder(Range(3));
  const it1 = builder.build();
  try {
    builder.build();
    assert.isTrue(false); // should never be reached
  } catch (e) {
    assert.is(e.message, "Unsupported operation: Constructors has already been built!");
  }

  assert.isTrue(arrayEq([0,1,2,3])([...it1]));
});

iteratorBuilderSuite.add("test append after build: IteratorBuilder", assert => {
  const builder = IteratorBuilder(Range(3));
  const it1 = builder.build();

  try {
    builder.append(4,5,6);
    assert.isTrue(false); // should never be reached
  } catch (e) {
    assert.is(e.message, "Unsupported operation: Constructors has already been built!");
  }

  // nothing should happen to the previous built iterator
  assert.isTrue(arrayEq([0,1,2,3])([...it1]));
});

iteratorBuilderSuite.add("test prepend after build: IteratorBuilder", assert => {
  const builder = IteratorBuilder(Range(3));
  const it1 = builder.build();

  try {
    builder.prepend(4,5,6);
    assert.isTrue(false); // should never be reached
  } catch (e) {
    assert.is(e.message, "Unsupported operation: Constructors has already been built!");
  }

  // nothing should happen to the previous built iterator
  assert.isTrue(arrayEq([0,1,2,3])([...it1]));
});

iteratorBuilderSuite.run();

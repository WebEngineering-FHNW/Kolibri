import { Range }                      from "../range/range.js";
import { TestSuite }                  from "../test/test.js";
import { IteratorBuilder, Iterator }  from "./iterator.js";


const iteratorBuilderSuite = TestSuite("IteratorBuilder");

iteratorBuilderSuite.add("test basic: IteratorBuilder", assert => {
  const it = IteratorBuilder()
    .append(1)
    .append(2, 3)
    .build();
  assert.iterableEq(it, [1,2,3]);
});

iteratorBuilderSuite.add("test no start iterator: IteratorBuilder", assert => {
  const iterator = IteratorBuilder().build();
  assert.iterableEq(iterator, []);
});

iteratorBuilderSuite.add("test add values and iterator: IteratorBuilder", assert => {
  const range = Range(1, 3);
  const it = IteratorBuilder()
    .append(0)
    .append(range)
    .append(4)
    .build();
  assert.iterableEq(it, [0,1,2,3,4]);
});

iteratorBuilderSuite.add("test varargs: IteratorBuilder", assert => {
  const iterator = Range(3, 5);
  const it = IteratorBuilder()
    .append(0,1,2)
    .append(iterator,6,7,8)
    .append(9,10,11)
    .build();
  assert.iterableEq(it, [0,1,2,3,4,5,6,7,8,9,10,11]);
});

iteratorBuilderSuite.add("test add undefined & null: IteratorBuilder", assert => {
  const it = IteratorBuilder()
    .append(undefined)
    .append(null)
    .build();
  assert.iterableEq(it, [undefined, null]);
});

iteratorBuilderSuite.add("test purity: IteratorBuilder", assert => {
  const it = IteratorBuilder()
    .append(1,2,3)
    .build();
  for (const el of it) { /* consume iterable */}

  assert.iterableEq(it, [1,2,3]);
});

iteratorBuilderSuite.add("test purity with sub-iterables: IteratorBuilder", assert => {
  const it = IteratorBuilder()
      .append([1,2,3])
      .build();
  for (const el of it) { /* consume iterable */}

  assert.iterableEq(it, [1,2,3]);
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
  assert.iterableEq(it, [0,1,2,3,4,5]);
});

iteratorBuilderSuite.add("test build two times: IteratorBuilder", assert => {
  const builder = IteratorBuilder(Range(3));
  const it1 = builder.build();

  assert.throws(() => builder.build(), "Unsupported operation: Iterator has already been built!");
  assert.iterableEq(it1, [0,1,2,3]);
});


iteratorBuilderSuite.add("test append after build: IteratorBuilder", assert => {
  const builder = IteratorBuilder(Range(3));
  const it1 = builder.build();

  assert.throws(() => builder.append(4,5,6), "Unsupported operation: Iterator has already been built!");
  // nothing should happen to the previous built iterator
  assert.iterableEq(it1, [0,1,2,3]);
});

iteratorBuilderSuite.add("test prepend after build: IteratorBuilder", assert => {
  const builder = IteratorBuilder(Range(3));
  const it1 = builder.build();

  assert.throws(() => builder.prepend(4,5,6), "Unsupported operation: Iterator has already been built!");

  // nothing should happen to the previous built iterator
  assert.iterableEq(it1, [0,1,2,3]);
});

iteratorBuilderSuite.run();

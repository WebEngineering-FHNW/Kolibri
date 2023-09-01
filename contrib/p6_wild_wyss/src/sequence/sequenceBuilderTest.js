import { TestSuite }                        from "../test/test.js";
import { SequenceBuilder, Sequence, Range } from "./sequence.js";

const testSuite = TestSuite("SequenceBuilder");

testSuite.add("test basic: SequenceBuilder", assert => {
  // When
  const it = SequenceBuilder()
    .append(1)
    .append(2, 3)
    .build();

  // Then
  assert.iterableEq(it, [1,2,3]);
});

testSuite.add("test no start iterable: SequenceBuilder", assert => {
  // When
  const sequence = SequenceBuilder().build();

  // Then
  assert.iterableEq(sequence, []);
});

testSuite.add("test add values and iterable: SequenceBuilder", assert => {
  // Given
  const range = Range(1, 3);

  // When
  const it = SequenceBuilder()
    .append(0)
    .append(range)
    .append(4)
    .build();

  // Then
  assert.iterableEq(it, [0,1,2,3,4]);
});

testSuite.add("test varargs: SequenceBuilder", assert => {
  const range = Range(3, 5);
  const it = SequenceBuilder()
    .append(0,1,2)
    .append(range,6,7,8)
    .append(9,10,11)
    .build();
  assert.iterableEq(it, [0,1,2,3,4,5,6,7,8,9,10,11]);
});

testSuite.add("test add undefined & null: SequenceBuilder", assert => {
  // When
  const it = SequenceBuilder()
    .append(undefined)
    .append(null)
    .build();

  // Then
  assert.iterableEq(it, [undefined, null]);
});

testSuite.add("test purity: SequenceBuilder", assert => {
  // Given
  const it = SequenceBuilder()
    .append(1,2,3)
    .build();

  // When
  for (const el of it) { /* consume iterable */}

  // Then
  assert.iterableEq(it, [1,2,3]);
});

testSuite.add("test purity with sub-iterables: SequenceBuilder", assert => {
  // Given
  const it = SequenceBuilder()
      .append([1,2,3])
      .build();

  // When
  for (const el of it) { /* consume iterable */}

  // Then
  assert.iterableEq(it, [1,2,3]);
});

testSuite.add("test infinity: SequenceBuilder", assert => {
  // Given
  let called  = false;
  let counter = 0;

  // When
  const endless    = Sequence(false, _ => true, _ => false);
  const sideEffect = Sequence(false, _ => true, _ => called = true);
  const it = SequenceBuilder()
    .append(endless)
    .append(sideEffect)
    .build();

  for (const _ of it) {
    counter++;
    if (counter > 10) {
     break;
    }
  }

  // Then
  assert.is(called, false);
});

testSuite.add("test add undefined & null: SequenceBuilder", assert => {
  // When
  const it = SequenceBuilder(Range(3, 5))
    .prepend(0,1,2)
    .build();

  // Then
  assert.iterableEq(it, [0,1,2,3,4,5]);
});

testSuite.add("test build two times: SequenceBuilder", assert => {
  // When
  const builder = SequenceBuilder(Range(3));
  const it1 = builder.build();

  // Then
  assert.throws(() => builder.build(), "Unsupported operation: Sequence has already been built!");
  assert.iterableEq(it1, [0,1,2,3]);
});


testSuite.add("test append after build: SequenceBuilder", assert => {
  // When
  const builder = SequenceBuilder(Range(3));
  const it1 = builder.build();

  // Then
  assert.throws(() => builder.append(4,5,6), "Unsupported operation: Sequence has already been built!");
  // nothing should happen to the previous built sequence
  assert.iterableEq(it1, [0,1,2,3]);
});

testSuite.add("test prepend after build: SequenceBuilder", assert => {
  // When
  const builder = SequenceBuilder(Range(3));
  const it1 = builder.build();

  // Then
  assert.throws(() => builder.prepend(4,5,6), "Unsupported operation: Sequence has already been built!");

  // nothing should happen to the previous built sequence
  assert.iterableEq(it1, [0,1,2,3]);
});

testSuite.run();
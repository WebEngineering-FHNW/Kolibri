import { TestSuite } from "../../../test/test.js";
import { show }      from "../../terminalOperations/show/show.js";
import { map }       from "../../operators/map/map.js";
import { Sequence }  from "../../constructors/sequence/Sequence.js";

/**
 * used to perform various tests
 * @param { Number } from
 * @param { Number } to
 * @return { SequenceType<Number> }
 */
const range = (from, to) => Sequence(from, i => i <= to, i => i + 1);

const testSuite = TestSuite("Sequence Prototype Suite");

testSuite.add("test prototype: and", assert => {
  // When
  const result = range(0,3).and(el => range(0, el));

  // Then
  assert.iterableEq(result, [0, 0, 1, 0, 1, 2, 0, 1, 2, 3]);
});

testSuite.add("test prototype: fmap", assert => {
  // When
  const result = range(0,3).fmap(x => 2*x);

  // Then
  assert.iterableEq(result, [0, 2, 4, 6]);
});

testSuite.add("test prototype: pure", assert => {
  // When
  const result = range(0, 3).pure(3);

  // Then
  assert.iterableEq(result, [3]);
});

testSuite.add("test prototype: empty", assert => {
  // When
  const result = range(0, 3).empty();

  // Then
  assert.iterableEq(result, []);
});

// test other functions
testSuite.add("test prototype: toString", assert => {
  // Given
  const seq    = range(0, 3);

  // When
  const result = seq.toString();

  // Then
  assert.is(result, show(seq));
});

testSuite.add("test prototype: toString with max", assert => {
  // Given
  const seq       = range(0, 3);
  const maxValues = 2;

  // When
  const result = seq.toString(maxValues);

  // Then
  assert.is(result, show(seq, maxValues));
});
testSuite.add("test prototype: [==]", assert => {
  // Given
  const seq    = range(0, 3);

  // When
  const result = seq ["=="] (seq);

  // Then
  assert.isTrue(result);
});

testSuite.add("test prototype: pipe", assert => {
  // Given
  const seq      = range(0, 3);
  const double   = x => 2 * x;
  const expected = map(double)(seq);

  // When
  const actual = seq.pipe( map(double) );

  // Then
  assert.iterableEq(actual, expected);
});

testSuite.run();
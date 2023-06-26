import { TestSuite }        from "../../../test/test.js";
import { createTestConfig } from "../../util/testUtil.js";
import { Sequence }         from "./Sequence.js";
import { Range }            from "../../../range/range.js";
import { show }             from "../../terminalOperations/show/show.js";
import { map }              from "../../operators/map/map.js"

import {
  addToTestingTable,
  TESTS
} from "../../util/testingTable.js";

const testSuite = TestSuite("Sequence: constructor Sequence");

addToTestingTable(testSuite)(
  createTestConfig({
    name:          "Sequence",
    iterable:      () => Sequence(0, current => current < 4, current => current + 1),
    expected:      [0, 1, 2, 3],
    excludedTests: [
      TESTS.TEST_PURITY,
      TESTS.TEST_CB_NOT_CALLED_AFTER_DONE,
    ]
  })
);

testSuite.add("test special case: no increment after done", assert => {
  // Given
  let result     = true;
  const sequence = Sequence(true, _ => false, _ => result = false);

  // When
  for (const element of sequence) { /* exhausting sequence */ }

  // Then
  assert.isTrue(result);
});

// test monadic API
testSuite.add("test prototype: and", assert => {
  // When
  const result = range(0,3).and(el => Range(el));

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

/**
 *
 * @param { Number } from
 * @param { Number } to
 * @return { SequenceType<Number> }
 */
const range = (from, to) => Sequence(from, i => i <= to, i => i + 1);
testSuite.run();
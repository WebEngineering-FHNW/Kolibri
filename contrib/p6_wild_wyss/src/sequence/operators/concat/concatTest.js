import { addToTestingTable }             from "../../util/testingTable.js";
import { TestSuite }                     from "../../../test/test.js";
import { concat, Sequence, nil, Range }  from "../../sequence.js";
import { createTestConfig, newSequence } from "../../util/testUtil.js";

const testSuite = TestSuite("Sequence: operation concat");

addToTestingTable(testSuite)(
  createTestConfig({
    name:      "concat",
    iterable:  () => Range(3,4),
    operation: concat,
    param:     newSequence(2),
    expected:  [0,1,2,3,4],
    invariants: [
      it => concat(nil)(it) ["=="] (it),
      it => concat(it)(nil) ["=="] (it),
      it => [...concat([1])(it)].length > [...it].length,
    ],
  })
);

testSuite.add("test purity: concat - both sub iterables untouched.", assert => {
  // Given
  const it1            = newSequence(4);
  const it2            = newSequence(2);
  const concatIterator = concat(it1)(it2);

  // When
  for (const _ of concatIterator) { /* Exhausting */ }

  // Then
  assert.iterableEq([0,1,2,3,4], [...it1]);
  assert.iterableEq([0,1,2],     [...it2]);
});

testSuite.add("test left/right associativity: concat", assert => {
  // When
  const left  = concat(concat(newSequence(2))(newSequence(1)))(newSequence(3));
  const right = concat(newSequence(2))(concat(newSequence(1))(newSequence(3)));

  // Then
  const expected = [0,1,2,0,1,0,1,2,3];
  assert.iterableEq(expected, [...right]);
  assert.iterableEq(expected, [...left]);
});

testSuite.add("test concat with infinity: concat", assert => {
  // Given
  let called  = false;
  let counter = 0;

  const endless                = Sequence(0, _ => true, i => i + 1);
  const iterableWithSideEffect = Sequence(false, _ => true, _ => called = true);
  const concatenated           = concat(endless)(iterableWithSideEffect);

  // When
  for (const _ of concatenated) {
    if (counter++ > 10) break; // consume a few elements
  }

  // Then
  assert.is(called, false);
});

testSuite.add("test empty: concat", assert => {
  // When
  const concatenated = concat(nil)(nil);

  // Then
  assert.iterableEq([], [...concatenated]);
});

testSuite.run();
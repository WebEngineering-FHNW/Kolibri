import { addToTestingTable }                     from "../../util/testingTable.js";
import { TestSuite }                             from "../../../util/test.js";
import { append, Sequence, nil, Range, forever } from "../../sequence.js";
import { createTestConfig, newSequence }         from "../../util/testUtil.js";

const testSuite = TestSuite("Sequence: operation append");

addToTestingTable(testSuite)(
  createTestConfig({
    name:       "concat",
    iterable:   () => Range(3,4),
    operation:  append,
    param:      newSequence(2),
    expected:   [0,1,2,3,4],
    invariants: [
      it => append(nil)(it) ["=="] (it),
      it => append(it)(nil) ["=="] (it),
      it => [...append([1])(it)].length > [...it].length,
    ],
  })
);

testSuite.add("test purity: append - both sub iterables untouched.", assert => {
  // Given
  const it1            = newSequence(4);
  const it2            = newSequence(2);
  const concatIterator = append(it1)(it2);

  // When
  for (const _ of concatIterator) { /* Exhausting */ }

  // Then
  assert.iterableEq([0,1,2,3,4], [...it1]);
  assert.iterableEq([0,1,2],     [...it2]);
});

testSuite.add("test left/right associativity: append", assert => {
  // When
  const left  = append(append(newSequence(2))(newSequence(1)))(newSequence(3));
  const right = append(newSequence(2))(append(newSequence(1))(newSequence(3)));

  // Then
  const expected = [0,1,2,0,1,0,1,2,3];
  assert.iterableEq(expected, [...right]);
  assert.iterableEq(expected, [...left]);
});

testSuite.add("test append with infinity: append", assert => {
  // Given
  let called  = false;
  let counter = 0;

  const endless                = Sequence(0, forever, i => i + 1);
  const iterableWithSideEffect = Sequence(false, forever, _ => called = true);
  const concatenated           = append(endless)(iterableWithSideEffect);

  // When
  for (const _ of concatenated) {
    if (counter++ > 10) break; // consume a few elements
  }

  // Then
  assert.is(called, false);
});

testSuite.add("test empty: append", assert => {
  // When
  const concatenated = append(nil)(nil);

  // Then
  assert.iterableEq([], [...concatenated]);
});

testSuite.run();

import { addToTestingTable }             from "../../util/testingTable.js";
import { TestSuite }                     from "../../../util/test.js";
import { createTestConfig, newSequence } from "../../util/testUtil.js";
import {
  Sequence,
  PureSequence,
  mconcat,
  nil,
  Seq,
  forever
}                                        from "../../sequence.js";

const testSuite = TestSuite("Sequence: operation mconcat");

addToTestingTable(testSuite)(
  createTestConfig({
    name:       "mconcat",
    iterable:   () => Seq(newSequence(2), newSequence(2), newSequence(2)),
    operation:  () => mconcat,
    expected:   [0, 1, 2, 0, 1, 2, 0, 1, 2],
    invariants: [
      it => mconcat([nil, it]) ["=="] (it),
      it => mconcat([it, nil]) ["=="] (it),
      it => [...mconcat([PureSequence(1),it])].length > [...it].length,
    ],
  })
);

testSuite.add("test left/right associativity: mconcat", assert => {
  // Given
  const it1   = [0];
  const it2   = [0, 1];
  const it3   = [0, 1, 2];

  // When
  const left  = mconcat([mconcat([it1, it2]), it3]);
  const right = mconcat([it1, mconcat([it2, it3])]);

  // Then
  const expected = [0,0,1,0,1,2];
  assert.iterableEq(left, expected);
  assert.iterableEq(right, expected);
});

testSuite.add("test append with infinity: mconcat", assert => {
  // Given
  let called  = false;
  let counter = 0;

  const endless                = Sequence(0, forever, i => i + 1);
  const iterableWithSideEffect = Sequence(false, _ => false, _ => called = true);
  const concatenated           = mconcat([endless, iterableWithSideEffect]);

  // When
  for (const _ of concatenated) {
    if (counter++ > 10) break; // consume a few elements
  }

  // Then
  assert.is(called, false);
});

testSuite.run();

import { addToTestingTable } from "../../util/testingTable.js";
import { TestSuite }         from "../../../test/test.js";
import {
  Iterator,
  ArrayIterator,
  PureIterator,
  mconcat,
  nil
} from "../../../iterator/iterator.js";

import {
  createTestConfig,
  newIterator,
} from "../../util/testUtil.js";

const testSuite = TestSuite("Iterator: Operation mconcat");

addToTestingTable(testSuite)(
  createTestConfig({
    name:       "mconcat",
    iterator:   () => ArrayIterator([ newIterator(2), newIterator(2), newIterator(2) ]),
    operation:  () => mconcat,
    expected:   [0, 1, 2, 0, 1, 2, 0, 1, 2],
    invariants: [
      it =>mconcat([nil, it]) ["=="] (it),
      it =>mconcat([it, nil]) ["=="] (it),
      it => [...mconcat([PureIterator(1),it])].length > [...it].length,
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

testSuite.add("test concat with infinity: mconcat", assert => {
  // Given
  let called  = false;
  let counter = 0;

  const endless                = Iterator(0, i => i + 1, _ => false);
  const iteratorWithSideEffect = Iterator(false, _ => called = true, _ => false);
  const concatenated           = mconcat([endless, iteratorWithSideEffect]);

  // When
  for (const _ of concatenated) {
    if (counter++ > 10) break; // consume a few elements
  }

  // Then
  assert.is(called, false);
});

testSuite.run();

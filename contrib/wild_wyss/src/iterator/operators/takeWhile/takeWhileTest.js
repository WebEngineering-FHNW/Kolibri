import { addToTestingTable }   from "../../util/testingTable.js";
import { TestSuite }           from "../../../test/test.js";
import { takeWhile, eq$, nil } from "../../iterator.js";
import {
  createTestConfig,
  newIterator,
  UPPER_ITERATOR_BOUNDARY,
} from "../../util/testUtil.js";

const testSuite = TestSuite("Iterator: Operation takeWhile");

addToTestingTable(testSuite)(
  createTestConfig({
    name:       "takeWhile",
    iterator:   () => newIterator(UPPER_ITERATOR_BOUNDARY),
    operation:  takeWhile,
    param:      el => el < 2,
    expected:   [0, 1],
    invariants: [
      it => eq$(takeWhile(_ => true)(it))  /* === */ (it),
      it => eq$(takeWhile(_ => false)(it)) /* === */ (nil),
    ]
  })
);

testSuite.add("test advanced case: takeWhile inner iterator is shorter", assert => {
  // Given
  const iterator = newIterator(UPPER_ITERATOR_BOUNDARY);

  // When
  // take all elements
  const some = takeWhile(_ => true)(iterator);

  // Then
  assert.iterableEq([0, 1, 2, 3, 4], some);
});

testSuite.run();
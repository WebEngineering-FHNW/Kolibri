import { addToTestingTable } from "../../util/testingTable.js";
import { TestSuite }         from "../../../test/test.js";
import { snoc, nil }         from "../../sequence.js";
import {
  createTestConfig,
  newSequence,
  UPPER_ITERATOR_BOUNDARY,
} from "../../util/testUtil.js";

const testSuite = TestSuite("Sequence: Operation snoc");

addToTestingTable(testSuite)(
  createTestConfig({
    name:       "snoc",
    iterable:   () => newSequence(UPPER_ITERATOR_BOUNDARY),
    operation:  snoc,
    param:      42,
    expected:   [0, 1, 2, 3, 4, 42],
    invariants: [
      it => [...snoc(1)(it)].length > [...it].length,
    ]
  })
);

testSuite.add("test empty iterator: snoc an element to empty iterator", assert => {
  // When
  const result = snoc(42)(nil);
  // Then
  assert.iterableEq(result, [42]);
});

testSuite.add("test snoc 2 times", assert => {
  // When
  const result = snoc(42)(snoc(42)(nil));

  // Then
  assert.iterableEq([42, 42], result);
});

testSuite.run();
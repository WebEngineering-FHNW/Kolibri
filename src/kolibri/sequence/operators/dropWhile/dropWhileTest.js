import { addToTestingTable }       from "../../util/testingTable.js";
import { TestSuite }               from "../../../util/test.js";
import { dropWhile, forever, nil } from "../../sequence.js";
import {
  createTestConfig,
  newSequence,
  UPPER_SEQUENCE_BOUNDARY,
}                                  from "../../util/testUtil.js";

const testSuite = TestSuite("Sequence: operation dropWhile");

addToTestingTable(testSuite)(
  createTestConfig({
    name:       "dropWhile",
    iterable:   () => newSequence(UPPER_SEQUENCE_BOUNDARY),
    operation:  dropWhile,
    param:      el => el < 2,
    expected:   [2, 3, 4],
    invariants: [
      it => dropWhile(forever )(it) ["=="] (nil),
      it => dropWhile(_ => false)(it) ["=="] (it),
    ]
  })
);

testSuite.add("test advanced case: dropWhile inner iterable is shorter", assert => {
  // Given
  // the inner iterable stops before the outer
  const sequence = newSequence(UPPER_SEQUENCE_BOUNDARY);

  // When
  const some     = dropWhile(_ => false)(sequence);

  // Then
  assert.iterableEq([0, 1, 2, 3, 4], [...some]);
});

testSuite.run();

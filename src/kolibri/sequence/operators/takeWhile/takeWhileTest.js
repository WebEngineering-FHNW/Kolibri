import { addToTestingTable }       from "../../util/testingTable.js";
import { TestSuite }               from "../../../util/test.js";
import { takeWhile, nil, forever } from "../../sequence.js";
import {
  createTestConfig,
  newSequence,
  UPPER_SEQUENCE_BOUNDARY,
}                                  from "../../util/testUtil.js";

const testSuite = TestSuite("Sequence: operation takeWhile");

addToTestingTable(testSuite)(
  createTestConfig({
    name:       "takeWhile",
    iterable:   () => newSequence(UPPER_SEQUENCE_BOUNDARY),
    operation:  takeWhile,
    param:      el => el < 2,
    expected:   [0, 1],
    invariants: [
      it => takeWhile(forever)   (it) ["=="] (it),
      it => takeWhile(_ => false)(it) ["=="] (nil),
    ]
  })
);

testSuite.add("test advanced case: takeWhile inner iterable is shorter", assert => {
  // Given
  const sequence = newSequence(UPPER_SEQUENCE_BOUNDARY);

  // When
  // take all elements
  const some    = takeWhile(forever)(sequence);

  // Then
  assert.iterableEq([0, 1, 2, 3, 4], some);
});

testSuite.run();

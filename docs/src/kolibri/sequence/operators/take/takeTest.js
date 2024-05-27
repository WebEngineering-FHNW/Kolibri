import { addToTestingTable } from "../../util/testingTable.js";
import { TestSuite }         from "../../../util/test.js";
import { map, take, nil }    from "../../sequence.js";
import {
  createTestConfig,
  newSequence,
  UPPER_SEQUENCE_BOUNDARY,
}                            from "../../util/testUtil.js";

const testSuite = TestSuite("Sequence: operation take");

addToTestingTable(testSuite)(
  createTestConfig({
    name:       "take",
    iterable:   () => newSequence(UPPER_SEQUENCE_BOUNDARY),
    operation:  take,
    param:      2,
    expected:   [0, 1],
    invariants: [
      it => take(Number.MAX_VALUE)(it) ["=="] (it),
      it => take(0)               (it) ["=="] (nil),
      ]
  })
);

testSuite.add("test take not processing inner iterator to far", assert => {
  // this test fails, when the inner iterator is called even when the desired amount of elements has been taken
  // Given
  const numbers = [0,1,2,3,4,5];
  let counter = 0;
  const sideEffect = el => {
    counter++;
    return el;
  };
  const mappedSequence = map(sideEffect)(numbers);

  // When
  const taken = take(4)(mappedSequence);

  // Then
  assert.iterableEq(taken, [0, 1, 2, 3]);
  assert.is(counter, 4);
});

testSuite.run();

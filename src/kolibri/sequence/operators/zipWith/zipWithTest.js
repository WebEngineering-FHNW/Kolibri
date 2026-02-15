import { addToTestingTable } from "../../util/testingTable.js";
import { TestSuite }         from "../../../util/test.js";
import { zipWith, nil }      from "../../sequence.js";
import {
  createTestConfig,
  newSequence,
  UPPER_SEQUENCE_BOUNDARY,
}                            from "../../util/testUtil.js";

const testSuite = TestSuite("Sequence: operation zipWith");

addToTestingTable(testSuite)(
  createTestConfig({
    name:       "zipWith",
    iterable:   () => newSequence(UPPER_SEQUENCE_BOUNDARY),
    operation:  zipper => zipWith(zipper)(newSequence(UPPER_SEQUENCE_BOUNDARY)),
    param:      (i, j) => i + j,
    expected:   [0, 2, 4, 6, 8],
    invariants: [
      it => zipWith(x => x)(nil)(it) ["=="] (nil),
      it => zipWith(x => x)(it)(nil) ["=="] (nil),
    ]
  })
);

testSuite.add("test advanced case: zipWith one iterable is shorter", assert => {
  // Given
  let iterationCount = 0;

  const it1 = newSequence(UPPER_SEQUENCE_BOUNDARY);
  const it2 = newSequence(2);
  const zipper = (i, j) => {
    iterationCount++;
    return i + j;
  };

  // When
  const zipped1 = zipWith(zipper)(it2)(it1); // first iterable is shorter
  const zipped2 = zipWith(zipper)(it1)(it2); // second iterable is shorter

  // Then
  for (const _ of zipped1) { /* Exhausting*/ }
  assert.is(iterationCount, 3);

  for (const _ of zipped2) { /* Exhausting*/ }
  assert.is(iterationCount, 6);
});

testSuite.run();

import { TestSuite         }             from "../../../util/test.js";
import { addToTestingTable }             from "../../util/testingTable.js";
import { pipe, map, dropWhere, reduce$ } from "../../sequence.js";
import {
  createTestConfig,
  newSequence,
  UPPER_SEQUENCE_BOUNDARY
}                                        from "../../util/testUtil.js";

const testSuite = TestSuite("Sequence: operation pipe");

addToTestingTable(testSuite)(
  createTestConfig({
    name:       "pipe",
    iterable:   () => newSequence(UPPER_SEQUENCE_BOUNDARY),
    operation:  ops => pipe(...ops),
    param:      [map(x => 2*x), dropWhere(x => x > 4) ],
    expected:   [0, 2, 4],
    invariants: [
      it => pipe()(it) ["=="] (it),
    ]
  })
);

testSuite.add("Test pipe with terminal operation", assert => {
  // Given
  const base    = newSequence(5);
  const mapper  = map        (x => 2*x);
  const reducer = reduce$    ((acc, cur) => acc + cur, 0);

  // When
  const res = pipe(
    mapper, // [0, 2, 4, 6, 8, 10]
    reducer // 0 + 0 + 2 + 4 + 6 + 8 + 10
  )(base);  // [0, 1, 2, 3, 4, 5]

  //Then
  assert.is(res, 30);
});


testSuite.add("Test with no operations", assert => {
  // Given
  const base = newSequence(5);

  // When
  const res = pipe()(base);

  //Then
  assert.iterableEq([...base], [...res]);
});

testSuite.run();

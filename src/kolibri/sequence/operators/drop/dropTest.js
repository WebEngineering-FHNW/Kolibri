import { addToTestingTable } from "../../util/testingTable.js";
import { TestSuite }         from "../../../util/test.js";
import { drop, nil }         from "../../sequence.js";
import {
  createTestConfig,
  newSequence,
  UPPER_SEQUENCE_BOUNDARY,
}                            from "../../util/testUtil.js";

const testSuite = TestSuite("Sequence: operation drop");

addToTestingTable(testSuite)(
  createTestConfig({
    name:       "drop",
    iterable:   () => newSequence(UPPER_SEQUENCE_BOUNDARY),
    operation:  drop,
    param:      2,
    expected:   [2, 3, 4],
    invariants: [
      it => [...drop(1)(it)].length <= [...it].length,
      it => drop(Number.MAX_VALUE)(it) ["=="] (nil),
      it => drop(0)               (it) ["=="] (it),
    ]
  })
);

testSuite.run();

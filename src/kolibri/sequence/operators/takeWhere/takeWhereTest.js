import { addToTestingTable } from "../../util/testingTable.js";
import { TestSuite }         from "../../../util/test.js";
import { takeWhere, nil }    from "../../sequence.js";
import {
  createTestConfig,
  newSequence,
  UPPER_SEQUENCE_BOUNDARY,
}                            from "../../util/testUtil.js";

const testSuite = TestSuite("Sequence: operation takeWhere");

addToTestingTable(testSuite)(
  createTestConfig({
    name:       "retainAll",
    iterable:   () => newSequence(UPPER_SEQUENCE_BOUNDARY),
    operation:  takeWhere,
    param:      el => el % 2 === 0,
    expected:   [0, 2, 4],
    invariants: [
      it => takeWhere(_ => true )(it) ["=="] (it), // todo dk: think about infinite sequences
      it => takeWhere(_ => false)(it) ["=="] (nil),
    ]
  })
);

testSuite.run();

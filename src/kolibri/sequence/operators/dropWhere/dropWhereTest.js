import { addToTestingTable } from "../../util/testingTable.js";
import { TestSuite }         from "../../../util/test.js";
import { dropWhere, nil }    from "../../sequence.js";
import {
  createTestConfig,
  newSequence,
  UPPER_SEQUENCE_BOUNDARY,
}                            from "../../util/testUtil.js";

const testSuite = TestSuite("Sequence: operation dropWhere");

addToTestingTable(testSuite)(
  createTestConfig({
    name:       "rejectAll",
    iterable:   () => newSequence(UPPER_SEQUENCE_BOUNDARY),
    operation:  dropWhere,
    param:      el => el % 2 === 0,
    expected:   [1, 3],
    invariants: [
      it => dropWhere(_ => false)(it) ["=="] (it),
      it => dropWhere(_ => true )(it) ["=="] (nil),
    ]
  })
);

testSuite.run();

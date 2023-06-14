import { addToTestingTable } from "../../util/testingTable.js";
import { TestSuite }         from "../../../test/test.js";
import { rejectAll, nil }    from "../../sequence.js";
import {
  createTestConfig,
  newSequence,
  UPPER_SEQUENCE_BOUNDARY,
} from "../../util/testUtil.js";

const testSuite = TestSuite("Sequence: operation rejectAll");

addToTestingTable(testSuite)(
  createTestConfig({
    name:       "rejectAll",
    iterable:   () => newSequence(UPPER_SEQUENCE_BOUNDARY),
    operation:  rejectAll,
    param:      el => el % 2 === 0,
    expected:   [1, 3],
    invariants: [
      it => rejectAll(_ => false)(it) ["=="] (it),
      it => rejectAll(_ => true )(it) ["=="] (nil),
    ]
  })
);

testSuite.run();
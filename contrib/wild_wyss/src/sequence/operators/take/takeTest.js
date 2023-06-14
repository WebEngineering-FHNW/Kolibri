import { addToTestingTable } from "../../util/testingTable.js";
import { TestSuite }         from "../../../test/test.js";
import { take, nil }         from "../../sequence.js";
import {
  createTestConfig,
  newSequence,
  UPPER_SEQUENCE_BOUNDARY,
} from "../../util/testUtil.js";

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

testSuite.run();
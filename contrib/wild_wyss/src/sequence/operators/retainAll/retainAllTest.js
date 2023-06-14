import { addToTestingTable } from "../../util/testingTable.js";
import { TestSuite }         from "../../../test/test.js";
import { retainAll, nil }    from "../../sequence.js";
import {
  createTestConfig,
  newSequence,
  UPPER_SEQUENCE_BOUNDARY,
} from "../../util/testUtil.js";

const testSuite = TestSuite("Sequence: operation retainAll");

addToTestingTable(testSuite)(
  createTestConfig({
    name:       "retainAll",
    iterable:   () => newSequence(UPPER_SEQUENCE_BOUNDARY),
    operation:  retainAll,
    param:      el => el % 2 === 0,
    expected:   [0, 2, 4],
    invariants: [
      it => retainAll(_ => true )(it) ["=="] (it),
      it => retainAll(_ => false)(it) ["=="] (nil),
    ]
  })
);

testSuite.run();
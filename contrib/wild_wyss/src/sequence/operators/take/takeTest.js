import { addToTestingTable } from "../../util/testingTable.js";
import { TestSuite }         from "../../../test/test.js";
import { take, nil }         from "../../sequence.js";
import {
  createTestConfig,
  newSequence,
  UPPER_ITERATOR_BOUNDARY,
} from "../../util/testUtil.js";

const testSuite = TestSuite("Sequence: Operation take");

addToTestingTable(testSuite)(
  createTestConfig({
    name:       "take",
    iterable:   () => newSequence(UPPER_ITERATOR_BOUNDARY),
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
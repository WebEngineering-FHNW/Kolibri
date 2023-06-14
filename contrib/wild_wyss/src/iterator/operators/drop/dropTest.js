import { addToTestingTable } from "../../util/testingTable.js";
import { TestSuite }         from "../../../test/test.js";
import { drop, nil }         from "../../iterator.js";
import {
  createTestConfig,
  newIterator,
  UPPER_ITERATOR_BOUNDARY,
} from "../../util/testUtil.js";

const testSuite = TestSuite("Sequence: Operation drop");

addToTestingTable(testSuite)(
  createTestConfig({
    name:       "drop",
    iterator:   () => newIterator(UPPER_ITERATOR_BOUNDARY),
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
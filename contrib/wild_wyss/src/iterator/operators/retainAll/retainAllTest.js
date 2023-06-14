import { addToTestingTable } from "../../util/testingTable.js";
import { TestSuite }         from "../../../test/test.js";
import { retainAll, nil }    from "../../iterator.js";
import {
  createTestConfig,
  newIterator,
  UPPER_ITERATOR_BOUNDARY,
} from "../../util/testUtil.js";

const testSuite = TestSuite("Sequence: Operation retainAll");

addToTestingTable(testSuite)(
  createTestConfig({
    name:       "retainAll",
    iterator:   () => newIterator(UPPER_ITERATOR_BOUNDARY),
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
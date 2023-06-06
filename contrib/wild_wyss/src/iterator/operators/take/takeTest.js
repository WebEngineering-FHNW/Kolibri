import { addToTestingTable } from "../../util/testingTable.js";
import { TestSuite }         from "../../../test/test.js";
import { take, eq$, nil }    from "../../../iterator/iterator.js";
import {
  createTestConfig,
  newIterator,
  UPPER_ITERATOR_BOUNDARY,
} from "../../util/testUtil.js";

const testSuite = TestSuite("Iterator: Operation take");

addToTestingTable(testSuite)(
  createTestConfig({
    name:       "take",
    iterator:   () => newIterator(UPPER_ITERATOR_BOUNDARY),
    operation:  take,
    param:      2,
    expected:   [0, 1],
    invariants: [
      it => eq$(take(Number.MAX_VALUE)(it)) /* === */ (it),
      it => eq$(take(0)               (it)) /* === */ (nil),
      ]
  })
);

testSuite.run();
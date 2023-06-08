import { addToTestingTable }   from "../../util/testingTable.js";
import { TestSuite }           from "../../../test/test.js";
import { retainAll, eq$, nil } from "../../iterator.js";
import {
  createTestConfig,
  newIterator,
  UPPER_ITERATOR_BOUNDARY,
} from "../../util/testUtil.js";

const testSuite = TestSuite("Iterator: Operation retainAll");

addToTestingTable(testSuite)(
  createTestConfig({
    name:       "retainAll",
    iterator:   () => newIterator(UPPER_ITERATOR_BOUNDARY),
    operation:  retainAll,
    param:      el => el % 2 === 0,
    expected:   [0, 2, 4],
    invariants: [
      it => eq$(retainAll(_ => true)(it))  /* === */ (it),
      it => eq$(retainAll(_ => false)(it)) /* === */ (nil),
    ]
  })
);

testSuite.run();
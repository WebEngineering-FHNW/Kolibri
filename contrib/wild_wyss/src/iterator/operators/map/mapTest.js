import { addToTestingTable } from "../../util/testingTable.js";
import { TestSuite }         from "../../../test/test.js";
import { map, eq$ }          from "../../../iterator/iterator.js";
import {
  createTestConfig,
  newIterator,
  UPPER_ITERATOR_BOUNDARY,
} from "../../util/testUtil.js";

const testSuite = TestSuite("Iterator: Operation map");

addToTestingTable(testSuite)(
  createTestConfig({
    name:       "map",
    iterator:   () => newIterator(UPPER_ITERATOR_BOUNDARY),
    operation:  mapper => map(mapper),
    param:      el => 2 * el,
    expected:   [0, 2, 4, 6, 8],
    invariants: [
      it => eq$(map(x => x)(it ))                 /* === */ (it),
      it => eq$(map(x => x[0])(map(x => [x])(it)))/* === */ (it),
    ]
  })
);

testSuite.run();
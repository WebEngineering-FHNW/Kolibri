import { addToTestingTable } from "../../util/testingTable.js";
import { TestSuite }         from "../../../test/test.js";
import { rejectAll, nil }    from "../../iterator.js";
import {
  createTestConfig,
  newIterator,
  UPPER_ITERATOR_BOUNDARY,
} from "../../util/testUtil.js";

const testSuite = TestSuite("Iterator: Operation rejectAll");

addToTestingTable(testSuite)(
  createTestConfig({
    name:       "rejectAll",
    iterator:   () => newIterator(UPPER_ITERATOR_BOUNDARY),
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
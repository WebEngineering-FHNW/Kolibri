import { addToTestingTable } from "../../util/testingTable.js";
import { TestSuite }         from "../../../test/test.js";
import { drop }              from "./drop.js";
import {
  createTestConfig,
  newIterator,
  UPPER_ITERATOR_BOUNDARY,
} from "../../util/testUtil.js";

const testSuite = TestSuite("Iterator: Operation drop");

addToTestingTable(testSuite)(
  createTestConfig({
    name:       "drop",
    iterator:   () => newIterator(UPPER_ITERATOR_BOUNDARY),
    operation:  drop,
    param:      2,
    expected:   [2, 3, 4]
  })
);

testSuite.run();
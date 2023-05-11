import { addToTestingTable } from "../../util/testingTable.js";
import { TestSuite }         from "../../../test/test.js";
import { map }               from "./map.js"
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
    operation:  map,
    param:      el => 2 * el,
    expected:   [0, 2, 4, 6, 8]
  })
);

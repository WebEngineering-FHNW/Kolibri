import { addToTestingTable } from "../../util/testingTable.js";
import { TestSuite }         from "../../../test/test.js";
import { dropWhile }         from "./dropWhile.js";
import {
  createTestConfig,
  newIterator,
  UPPER_ITERATOR_BOUNDARY,
} from "../../util/testUtil.js";

const testSuite = TestSuite("Iterator: Operation dropWhile");

addToTestingTable(testSuite)(
  createTestConfig({
    name:       "dropWhile",
    iterator:   () => newIterator(UPPER_ITERATOR_BOUNDARY),
    operation:  dropWhile,
    param:      el => el < 2,
    expected:   [2, 3, 4]
  })
);

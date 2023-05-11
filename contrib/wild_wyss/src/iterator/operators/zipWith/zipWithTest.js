import { addToTestingTable } from "../../util/testingTable.js";
import { TestSuite }         from "../../../test/test.js";
import { zipWith }           from "./zipWith.js";
import {
  createTestConfig,
  newIterator,
  UPPER_ITERATOR_BOUNDARY,
} from "../../util/testUtil.js";

const testSuite = TestSuite("Iterator: Operation zipWith");

addToTestingTable(testSuite)(
  createTestConfig({
    name:       "zipWith",
    iterator:   () => newIterator(UPPER_ITERATOR_BOUNDARY),
    operation:  zipper => zipWith(zipper)(newIterator(UPPER_ITERATOR_BOUNDARY)),
    param:      (i, j) => i + j,
    expected:   [0, 2, 4, 6, 8]
  })
);

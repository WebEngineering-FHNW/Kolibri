import { addToTestingTable } from "../../util/testingTable.js";
import { TestSuite }         from "../../../test/test.js";
import { takeWhile }         from "./takeWhile.js";
import {
  createTestConfig,
  newIterator,
  UPPER_ITERATOR_BOUNDARY,
} from "../../util/testUtil.js";

const testSuite = TestSuite("Iterator: Operation takeWhile");

addToTestingTable(testSuite)(
  createTestConfig({
    name:       "takeWhile",
    iterator:   () => newIterator(UPPER_ITERATOR_BOUNDARY),
    operation:  takeWhile,
    param:      el => el < 2,
    expected:   [0, 1]
  })
);

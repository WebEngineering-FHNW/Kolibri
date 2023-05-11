import { addToTestingTable } from "../../util/testingTable.js";
import { TestSuite }         from "../../../test/test.js";
import { retainAll }         from "./retainAll.js";
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
    expected:   [0, 2, 4]
  })
);

testSuite.run();
import { addToTestingTable } from "../../util/testingTable.js";
import { bind }              from "./bind.js";
import { take }              from "../take/take.js";
import { Iterator }          from "../../constructors/iterator/iterator.js";
import { TestSuite }         from "../../../test/test.js";
import {
    createTestConfig,
    newIterator,
    UPPER_ITERATOR_BOUNDARY
} from "../../util/testUtil.js";

const testSuite = TestSuite("Iterator: Operation bind");

addToTestingTable(testSuite)(
  createTestConfig({
    name:       "bind",
    iterator:   () => newIterator(UPPER_ITERATOR_BOUNDARY),
    operation:  bind,
    param:      el => take(2)(Iterator(el.toString(), _ => _, _ => false)),
    expected:   ["0", "0", "1", "1", "2", "2", "3", "3", "4", "4"],
  })
);


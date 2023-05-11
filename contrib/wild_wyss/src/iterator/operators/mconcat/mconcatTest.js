import { addToTestingTable } from "../../util/testingTable.js";
import { TestSuite }         from "../../../test/test.js";
import { ArrayIterator }     from "../../constructors/arrayIterator/arrayIterator.js";
import { mconcat }           from "./mconcat.js";
import {
  createTestConfig,
  newIterator,
} from "../../util/testUtil.js";

const testSuite = TestSuite("Iterator: Operation mconcat");

addToTestingTable(testSuite)(
  createTestConfig({
    name:       "mconcat",
    iterator:   () => ArrayIterator([ newIterator(2), newIterator(2), newIterator(2), ]),
    operation:  () => mconcat,
    expected:   [0, 1, 2, 0, 1, 2, 0, 1, 2]
  })
);

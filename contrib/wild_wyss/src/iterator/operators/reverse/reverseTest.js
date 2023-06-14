import { addToTestingTable } from "../../util/testingTable.js";
import { TestSuite }         from "../../../test/test.js";
import { reverse$ }          from "./reverse.js";
import {
  createTestConfig,
  newIterator,
  UPPER_ITERATOR_BOUNDARY,
} from "../../util/testUtil.js";

const testSuite = TestSuite("Iterator: Operation reverse$");

addToTestingTable(testSuite)(
  createTestConfig({
    name:      "reverse$",
    iterator:  () => newIterator(UPPER_ITERATOR_BOUNDARY),
    operation: () => reverse$,
    expected:  [4, 3, 2, 1, 0],
    invariants: [
      it => reverse$(reverse$(it)) ["=="] (it),
    ]
  })
);

testSuite.run();
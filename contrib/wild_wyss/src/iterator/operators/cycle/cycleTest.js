import { addToTestingTable } from "../../util/testingTable.js";
import { TestSuite }         from "../../../test/test.js";
import { cycle }             from "./cycle.js";
import { takeWithoutCopy }   from "../../util/util.js";
import { arrayEq }           from "../../../../../../docs/src/kolibri/util/arrayFunctions.js";
import {
  createTestConfig,
  newIterator,
} from "../../util/testUtil.js";
import {take} from "../take/take.js";

const testSuite = TestSuite("Iterator: Operation cycle");

addToTestingTable(testSuite)(
  createTestConfig({
    name:       "cycle",
    iterator:   () => newIterator(2),
    operation:  () => cycle,
    expected:   [0, 1, 2, 0, 1, 2, 0, 1, 2],
    evalFn:     expected => actual => {
      const actualArray = takeWithoutCopy(9)(actual);
      const expectedArray = takeWithoutCopy(9)(expected);
      return arrayEq(expectedArray)(actualArray);
    }
  })
);

testSuite.run();
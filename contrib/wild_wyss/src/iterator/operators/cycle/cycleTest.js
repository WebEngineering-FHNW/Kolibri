import { addToTestingTable, TESTS } from "../../util/testingTable.js";
import { TestSuite }                from "../../../test/test.js";
import { takeWithoutCopy }          from "../../util/util.js";
import { arrayEq }                  from "../../../../../../docs/src/kolibri/util/arrayFunctions.js";
import { nil, cycle }               from "../../iterator.js"
import {
  createTestConfig,
  newIterator,
} from "../../util/testUtil.js";

const testSuite = TestSuite("Iterator: Operation cycle");

addToTestingTable(testSuite)(
  createTestConfig({
    name:       "cycle",
    iterator:   () => newIterator(2),
    operation:  () => cycle,
    expected:   [0, 1, 2, 0, 1, 2, 0, 1, 2],
    onNil:      nil,
    evalFn:     expected => actual => {
      const actualArray = takeWithoutCopy(9)(actual);
      const expectedArray = takeWithoutCopy(9)(expected);
      return arrayEq(expectedArray)(actualArray);
    },
    excludedTests: [TESTS.TEST_INVARIANTS]
  })
);

testSuite.run();
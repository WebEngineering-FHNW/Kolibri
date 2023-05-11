import { addToTestingTable, TESTS } from "../../util/testingTable.js";
import { TestSuite }                from "../../../test/test.js";
import { forEach$ }                 from "./forEach.js";
import { arrayEq }                  from "../../../../../../docs/src/kolibri/util/arrayFunctions.js";
import {
  createTestConfig,
  newIterator,
  UPPER_ITERATOR_BOUNDARY
} from "../../util/testUtil.js";

const testSuite = TestSuite("Iterator: terminal Operations forEach$");

const forEach$Config = (() => {
  // keep this state in the closure scope
  const iterElements = [];
  return createTestConfig({
    name:       "forEach$",
    iterator:   () => newIterator(UPPER_ITERATOR_BOUNDARY),
    operation:  forEach$,
    param:      cur => iterElements.push(cur),
    expected:   [0, 1, 2, 3, 4],
    evalFn:     expected => _actual => {
      let result;
      if (expected !== undefined) {
        result = arrayEq(expected)(iterElements);
        iterElements.splice(0, iterElements.length);
      } else {
        // test purity just runs two times the current function, since forEach does not return any value,
        // both expected and actual are set to undefined, so it can be checked if 10 elements are in the array
        result = arrayEq([...iterElements])([0, 1, 2, 3, 4, 0, 1, 2, 3, 4]);
        iterElements.splice(0, iterElements.length);
      }
      return result;
    },
    excludedTests: [
      TESTS.TEST_COPY,
      TESTS.TEST_COPY_AFTER_CONSUMPTION,
      TESTS.TEST_CB_NOT_CALLED_AFTER_DONE
    ]
  });
})();

addToTestingTable(testSuite)(forEach$Config);
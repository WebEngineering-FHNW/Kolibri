import { addToTestingTable } from "../../util/testingTable.js";
import { TestSuite }         from "../../../test/test.js";
import { takeWhile }         from "./takeWhile.js";
import {
  createTestConfig,
  newIterator,
  UPPER_ITERATOR_BOUNDARY,
} from "../../util/testUtil.js";
import {arrayEq} from "../../../../../../docs/src/kolibri/util/arrayFunctions.js";

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

testSuite.add("test advanced case: takeWhile inner iterator is shorter", assert => {
  // the inner iterator stops before the outer
  const iterator = newIterator(UPPER_ITERATOR_BOUNDARY);
  const some = takeWhile(_ => true)(iterator);
  assert.isTrue(arrayEq([0, 1, 2, 3, 4])([...some]));
});

testSuite.run();
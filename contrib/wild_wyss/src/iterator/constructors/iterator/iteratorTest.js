import { TestSuite }         from "../../../test/test.js";
import { createTestConfig }  from "../../util/testUtil.js";
import {Iterator, IteratorPrototype} from "./iterator.js";
import {
  addToTestingTable,
  TESTS
} from "../../util/testingTable.js";
import {Range} from "../../../range/range.js";
import {arrayEq} from "../../../../../../docs/src/kolibri/util/arrayFunctions.js";
import {nil} from "../nil/nil.js";

const testSuite = TestSuite("Iterator: Constructor Iterator");

addToTestingTable(testSuite)(
  createTestConfig({
    name:      "Iterator",
    iterator:  () => Iterator(0, current => current + 1, current => 4 < current),
    expected:  [0,1,2,3,4],
    excludedTests: [TESTS.TEST_PURITY, TESTS.TEST_CB_NOT_CALLED_AFTER_DONE]
  })
);

testSuite.add("test special case: no increment after done", assert => {
  let result = true;
  const iterator = Iterator(true, _ => result = false, _ => true);
  for (const iteratorElement of iterator) { /* exhausting iterator */ }
  assert.isTrue(result);
});

testSuite.add("test : and", assert => {
  const result = Range(3).and(el => Range(el));
  assert.isTrue(arrayEq([0, 0, 1, 0, 1, 2, 0, 1, 2, 3])([...result]));
});

// TODO: Add to testing table
testSuite.add("test : prototype", assert => {
  assert.is(Object.getPrototypeOf(nil), IteratorPrototype);
});

testSuite.run();
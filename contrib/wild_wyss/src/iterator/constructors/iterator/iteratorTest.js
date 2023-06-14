import { TestSuite }        from "../../../test/test.js";
import { createTestConfig } from "../../util/testUtil.js";
import { Iterator }         from "./iterator.js";
import { Range }            from "../../../range/range.js";
import {
  addToTestingTable,
  TESTS
} from "../../util/testingTable.js";

const testSuite = TestSuite("Iterator: Constructor Iterator");

addToTestingTable(testSuite)(
  createTestConfig({
    name:      "Iterator",
    iterator:  () => Iterator(0, current => 4 < current, current => current + 1),
    expected:  [0,1,2,3,4],
    excludedTests: [
      TESTS.TEST_PURITY,
      TESTS.TEST_CB_NOT_CALLED_AFTER_DONE,
    ]
  })
);

testSuite.add("test special case: no increment after done", assert => {
  let result = true;
  const iterator = Iterator(true, _ => true, _ => result = false);
  for (const iteratorElement of iterator) { /* exhausting iterator */ }
  assert.isTrue(result);
});

testSuite.add("test : and", assert => {
  const result = Range(3).and(el => Range(el));
  assert.iterableEq(result, [0, 0, 1, 0, 1, 2, 0, 1, 2, 3]);
});


testSuite.run();
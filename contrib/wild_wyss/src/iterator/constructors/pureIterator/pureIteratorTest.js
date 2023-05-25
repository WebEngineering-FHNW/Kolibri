import { TestSuite }              from "../../../test/test.js";
import { createTestConfig }       from "../../util/testUtil.js";
import { PureIterator }           from "./pureIterator.js";
import {addToTestingTable, TESTS} from "../../util/testingTable.js";

const testSuite = TestSuite("Iterator: Constructor PureIterator");

addToTestingTable(testSuite)(
  createTestConfig({
    name:     "PureIterator",
    iterator: () => PureIterator(42),
    expected: [42],
    excludedTests: [TESTS.TEST_PURITY, TESTS.TEST_CB_NOT_CALLED_AFTER_DONE, TESTS.TEST_COPY_AFTER_CONSUMPTION]
  })
);

testSuite.add("PureIterator: ", assert => {
  const iterator = PureIterator(42);
  const {value } = iterator[Symbol.iterator]().next();
  assert.is(value, 42);

  // copy intermediate state
  const copy = iterator.copy();
  const { done } = copy[Symbol.iterator]().next();
  assert.is(done, true)

});

testSuite.run();
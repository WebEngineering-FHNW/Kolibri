import {TestSuite} from "../../test/test.js";
import {addToTestingTable, TESTS} from "../util/testingTable.js";
import {createTestConfig,  UPPER_ITERATOR_BOUNDARY} from "../util/testUtil.js";
import {Iterator, map, retainAll, reduce$ } from "./poc.js";

const newIterator = limit => Iterator(0, current => current + 1, current => current > limit);

const testSuite = TestSuite("poc: Constructor Iterator");

addToTestingTable(testSuite)(
  createTestConfig({
    name:      "Iterator",
    iterator:  () => Iterator(0, current => current + 1, current => 4 < current),
    expected:  [0,1,2,3,4],
    excludedTests: [
      TESTS.TEST_PURITY,
      TESTS.TEST_COPY,
      TESTS.TEST_PROTOTYPE,
      TESTS.TEST_COPY_AFTER_CONSUMPTION,
    ]
  })
);

testSuite.add("test special case: no increment after done", assert => {
  let result = true;
  const iterator = Iterator(true, _ => result = false, _ => true);
  for (const iteratorElement of iterator) { /* exhausting iterator */ }
  assert.isTrue(result);
});


addToTestingTable(testSuite)(
  createTestConfig({
    name:       "map",
    iterator:   () => newIterator(UPPER_ITERATOR_BOUNDARY),
    operation:  map,
    param:      el => 2 * el,
    expected:   [0, 2, 4, 6, 8],
    excludedTests: [
      TESTS.TEST_PURITY,
      TESTS.TEST_COPY,
      TESTS.TEST_PROTOTYPE,
      TESTS.TEST_COPY_AFTER_CONSUMPTION,
    ]
  })
);

addToTestingTable(testSuite)(
  createTestConfig({
    name:       "retainAll",
    iterator:   () => newIterator(UPPER_ITERATOR_BOUNDARY),
    operation:  retainAll,
    param:      el => el % 2 === 0,
    expected:   [0, 2, 4],
    excludedTests: [
      TESTS.TEST_PURITY,
      TESTS.TEST_COPY,
      TESTS.TEST_PROTOTYPE,
      TESTS.TEST_COPY_AFTER_CONSUMPTION,
    ]
  })
);

addToTestingTable(testSuite)(
  createTestConfig({
    name:      "reduce$",
    iterator:  () => newIterator(UPPER_ITERATOR_BOUNDARY),
    operation: () => reduce$((acc, cur) => acc + cur, 0),
    expected:  10,
    evalFn:    expected => actual => expected === actual,
    excludedTests: [
      TESTS.TEST_COPY,
      TESTS.TEST_COPY_AFTER_CONSUMPTION,
      TESTS.TEST_CB_NOT_CALLED_AFTER_DONE,
      TESTS.TEST_PROTOTYPE
    ]
  })
);

testSuite.run();

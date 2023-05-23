import { addToTestingTable, TESTS } from "../../util/testingTable.js";
import { TestSuite }                from "../../../test/test.js";
import { show }                     from "./show.js";
import {
  createTestConfig,
  newIterator,
  UPPER_ITERATOR_BOUNDARY
} from "../../util/testUtil.js";
import {Range} from "../../../range/range.js";

const testSuite = TestSuite("Iterator: terminal Operations show");

addToTestingTable(testSuite)(
  createTestConfig({
    name:      "show",
    iterator:  () => newIterator(UPPER_ITERATOR_BOUNDARY),
    operation: () => show,
    evalFn:    expected => actual => expected === actual,
    expected:  "[0,1,2,3,4]",
    excludedTests: [
      TESTS.TEST_COPY,
      TESTS.TEST_COPY_AFTER_CONSUMPTION,
      TESTS.TEST_CB_NOT_CALLED_AFTER_DONE
    ]
  })
);

testSuite.add("test boundary value", assert => {
  const it = Range(0);
  const result = show(it);
  assert.is(result, "[0]");
});

testSuite.add("test given output length", assert => {
  const it     = Range(100);
  const result = show(it, 2);
  assert.is(result, "[0,1]");
});

testSuite.add("test equality of show and toString", assert => {
  const it     = Range(10);
  const result = show(it);
  assert.is(result, it.toString());
});


testSuite.add("test exceed default output length (50)", assert => {
  const it     = Range(100);
  const result = show(it);
  /**
   * 2  [braces]
   * 49 [commas]
   * 10 [0-9]
   * 40 [10-49] ( x2 )
   */
  const outputLength = 2 + 49 + 10 + 2 * 40;
  assert.is(result.length, outputLength);
});

testSuite.run();

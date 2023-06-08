import { addToTestingTable, TESTS } from "../../util/testingTable.js";
import { TestSuite }                from "../../../test/test.js";
import { reduce$ }                  from "./reduce.js";
import { nil }                      from "../../constructors/nil/nil.js";
import {
  createTestConfig,
  newIterator,
  UPPER_ITERATOR_BOUNDARY
} from "../../util/testUtil.js";

const testSuite = TestSuite("Iterator: terminal Operations reduce$");

addToTestingTable(testSuite)(
  createTestConfig({
    name:      "reduce$",
    iterator:  () => newIterator(UPPER_ITERATOR_BOUNDARY),
    operation: () => reduce$((acc, cur) => acc + cur, 0),
    expected:  10,
    evalFn:    expected => actual => expected === actual,
    excludedTests: [TESTS.TEST_CB_NOT_CALLED_AFTER_DONE]
  })
);

testSuite.add("test empty iterator: should return start value", assert => {
  const result = reduce$((cur, acc) => acc + cur, 0)(nil);
  assert.is(result , 0);
});

testSuite.run();
import { ILLEGAL_ARGUMENT_EMPTY_ITERATOR } from "../../util/errorMessages.js";
import { nil }                             from "../../constructors/nil/nil.js";
import { addToTestingTable, TESTS }        from "../../util/testingTable.js";
import { TestSuite }                       from "../../../test/test.js";
import { max$ }                            from "./max.js"
import { PureIterator }                    from "../../constructors/pureIterator/pureIterator.js";
import { ArrayIterator }                   from "../../constructors/arrayIterator/arrayIterator.js";
import { replicate }                       from "../../constructors/replicate/replicate.js";
import {
  createTestConfig,
  newIterator,
  UPPER_ITERATOR_BOUNDARY
} from "../../util/testUtil.js";

const testSuite = TestSuite("Iterator: terminal Operations max$");

addToTestingTable(testSuite)(
  createTestConfig({
    name:      "max$",
    iterator:  () => newIterator(UPPER_ITERATOR_BOUNDARY),
    operation: () => max$,
    expected:  4,
    evalFn:    expected => actual => expected === actual,
    excludedTests: [
      TESTS.TEST_COPY,
      TESTS.TEST_COPY_AFTER_CONSUMPTION,
      TESTS.TEST_CB_NOT_CALLED_AFTER_DONE
    ]
  })
);

testSuite.add("test single element: should return the only element ", assert =>
 assert.is(max$(PureIterator(1)), 1));

testSuite.add("test empty iterator: should throw an error", assert =>
  assert.throws(() => max$(nil), ILLEGAL_ARGUMENT_EMPTY_ITERATOR));

testSuite.add("test comparator on strings: should return the longest string", assert => {
  const strings = ArrayIterator(["a", "b", "aa", "bb"]);
  const result = max$(strings, (a, b) => a.length < b.length);
  assert.is(result, "aa");
});

testSuite.add("test largest element at the end of the iterator", assert => {
  const iterator = ArrayIterator([4,3,2,5,1,0,9]);
  const result   = max$(iterator);
  assert.is(result, 9);
});

testSuite.add("test largest element at the start of the iterator", assert => {
  const iterator = ArrayIterator([9,4,3,2,5,1,0]);
  const result   = max$(iterator);
  assert.is(result, 9);
});

testSuite.add("test multiple of equal values", assert => {
  const values = replicate(4)(7);
  const result = max$(values);
  assert.is(result, 7);
});

testSuite.run();
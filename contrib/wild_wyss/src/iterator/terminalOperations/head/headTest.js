import { addToTestingTable, TESTS } from "../../util/testingTable.js";
import { TestSuite }                from "../../../test/test.js";
import { head }                     from "./head.js";
import {
  createTestConfig,
  newIterator,
  UPPER_ITERATOR_BOUNDARY
} from "../../util/testUtil.js";
import { nil } from "../../constructors/nil/nil.js";

const testSuite = TestSuite("Iterator: terminal Operations head");

addToTestingTable(testSuite)(
  createTestConfig({
    name:      "head",
    iterator:  () => newIterator(UPPER_ITERATOR_BOUNDARY),
    operation: () => head,
    evalFn:    expected => actual => expected === actual,
    expected:  0,
    excludedTests: [
      TESTS.TEST_CB_NOT_CALLED_AFTER_DONE, TESTS.TEST_INVARIANTS
    ]
  })
);

testSuite.add("test advanced case: head of empty iterator", assert => assert.is(head(nil), undefined));

testSuite.run();

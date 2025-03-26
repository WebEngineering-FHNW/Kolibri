import { addToTestingTable, TESTS } from "../../util/testingTable.js";
import { TestSuite }                from "../../../util/test.js";
import { head }                     from "./head.js";
import { nil }                      from "../../constructors/nil/nil.js";
import {
  createTestConfig,
  newSequence,
  UPPER_SEQUENCE_BOUNDARY
}                                   from "../../util/testUtil.js";

const testSuite = TestSuite("Sequence: terminal operation head");

addToTestingTable(testSuite)(
  createTestConfig({
    name:      "head",
    iterable:  () => newSequence(UPPER_SEQUENCE_BOUNDARY),
    operation: () => head,
    evalFn:    expected => actual => expected === actual,
    expected:  0,
    excludedTests: [TESTS.TEST_CB_NOT_CALLED_AFTER_DONE]
  })
);

testSuite.add("test advanced case: head of empty sequence", assert => assert.is(head(nil), undefined));

testSuite.run();

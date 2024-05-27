import { addToTestingTable, TESTS } from "../../util/testingTable.js";
import { TestSuite }                from "../../../util/test.js";
import { foldr$ }                   from "./foldr.js";
import { nil }                      from "../../constructors/nil/nil.js";
import {
  createTestConfig,
  newSequence,
  UPPER_SEQUENCE_BOUNDARY
}                                   from "../../util/testUtil.js";

const testSuite = TestSuite("Sequence: terminal operation foldr$");

addToTestingTable(testSuite)(
  createTestConfig({
    name:          "foldr$",
    iterable:      () => newSequence(UPPER_SEQUENCE_BOUNDARY),
    operation:     () => foldr$((cur, acc) => acc + cur, 0),
    expected:      10,
    evalFn:        expected => actual => expected === actual,
    excludedTests: [TESTS.TEST_CB_NOT_CALLED_AFTER_DONE]
  })
);

testSuite.add("test empty sequence: should return start value", assert => {
  // When
  const result = foldr$((acc, cur) => acc + cur, 0)(nil);

  // Then
  assert.is(result , 0);
});

testSuite.run();

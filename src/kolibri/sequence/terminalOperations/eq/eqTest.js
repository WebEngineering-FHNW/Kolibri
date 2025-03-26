import { addToTestingTable, TESTS } from "../../util/testingTable.js";
import { TestSuite }                from "../../../util/test.js";
import { eq$ }                      from "./eq.js";
import { nil }                      from "../../constructors/nil/nil.js";
import {
  createTestConfig,
  newSequence,
  UPPER_SEQUENCE_BOUNDARY
}                                   from "../../util/testUtil.js";

const testSuite = TestSuite("Sequence: terminal operation eq$");

const eq$Config = (() => {
  // eq$ takes two iterables which both shouldn't be modified when eq runs.
  // To keep this we keep two iterables in our closure scope, to ensure that neither is modified by pure.
  const firstIterable  = newSequence(UPPER_SEQUENCE_BOUNDARY);
  const secondIterable = newSequence(UPPER_SEQUENCE_BOUNDARY);

  return createTestConfig({
    name:      "eq$",
    iterable:  () => firstIterable,
    operation: eq$,
    param:     secondIterable,
    evalFn:    expected => actual => expected === actual,
    expected:  true,
    excludedTests: [TESTS.TEST_CB_NOT_CALLED_AFTER_DONE]
  });
})();

addToTestingTable(testSuite)(eq$Config);

testSuite.add("test empty sequences", assert => {
  // Then
  assert.is(eq$(nil)(nil), true);
});

testSuite.run();

import { addToTestingTable, TESTS } from "../../util/testingTable.js";
import { TestSuite }                from "../../../test/test.js";
import { eq$ }                      from "./eq.js";
import { nil }                      from "../../constructors/nil/nil.js";
import {
  createTestConfig,
  newSequence,
  UPPER_ITERATOR_BOUNDARY
} from "../../util/testUtil.js";

const testSuite = TestSuite("Sequence: terminal Operations eq$");

const eq$Config = (() => {
  // eq$ takes two iterators which both shouldn't be modified when eq runs.
  // To keep this we keep two iterators in our closure scope, to ensure that neither is modified by pure.
  const firstIterator  = newSequence(UPPER_ITERATOR_BOUNDARY);
  const secondIterator = newSequence(UPPER_ITERATOR_BOUNDARY);

  return createTestConfig({
    name:      "eq$",
    iterable:  () => firstIterator,
    operation: eq$,
    param:     secondIterator,
    evalFn:    expected => actual => expected === actual,
    expected:  true,
    excludedTests: [TESTS.TEST_CB_NOT_CALLED_AFTER_DONE]
  });
})();

addToTestingTable(testSuite)(eq$Config);

testSuite.add("test empty iterator", assert => {
  assert.is(eq$(nil)(nil), true);
});

testSuite.run();
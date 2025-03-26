import { TestSuite }        from "../../../util/test.js";
import { createTestConfig } from "../../util/testUtil.js";
import { Sequence }         from "./Sequence.js";

import {
  addToTestingTable,
  TESTS
} from "../../util/testingTable.js";

const testSuite = TestSuite("Sequence: constructor Sequence");

addToTestingTable(testSuite)(
  createTestConfig({
    name:          "Sequence",
    iterable:      () => Sequence(0, current => current < 4, current => current + 1),
    expected:      [0, 1, 2, 3],
    excludedTests: [
      TESTS.TEST_PURITY,
      TESTS.TEST_CB_NOT_CALLED_AFTER_DONE,
    ]
  })
);

testSuite.add("test special case: no increment after done", assert => {
  // Given
  let result     = true;
  const sequence = Sequence(true, _ => false, _ => result = false);

  // When
  for (const element of sequence) { /* exhausting sequence */ }

  // Then
  assert.isTrue(result);
});
testSuite.run();

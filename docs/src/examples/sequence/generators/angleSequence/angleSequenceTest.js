import { AngleSequence }    from "./angleSequence.js";
import { TestSuite }        from "../../../../kolibri/util/test.js";

import { createTestConfig } from "../../../../kolibri/sequence/util/testUtil.js";
import {
  addToTestingTable,
  TESTS
}                           from "../../../../kolibri/sequence/util/testingTable.js";

const testSuite = TestSuite("examples/sequence/generators/angleSequence");

addToTestingTable(testSuite)(
  createTestConfig({
    name:     "AngleSequence",
    iterable: () => AngleSequence(4),
    expected: [0, 90, 180, 270],
    excludedTests: [
      TESTS.TEST_PURITY,
      TESTS.TEST_CB_NOT_CALLED_AFTER_DONE,
    ]
  })
);

testSuite.run();

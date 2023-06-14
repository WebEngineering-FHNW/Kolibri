import { TestSuite }                         from "../../../test/test.js";
import { createTestConfig }                  from "../../util/testUtil.js";
import { StackSequence }                     from "./stackSequence.js";
import { convertArrayToStack, reverseStack } from "../../../../../p6_brodwolf_andermatt/src/stack/stack.js";
import { addToTestingTable, TESTS }          from "../../util/testingTable.js";

const testSuite = TestSuite("Sequence: constructor StackSequence");

addToTestingTable(testSuite)(
  createTestConfig({
    name:     "StackSequence",
    iterable: () => {
      const stack = reverseStack(convertArrayToStack([0,1,2,3,4]));
      return StackSequence(stack);
    },
    expected: [0,1,2,3,4],
    excludedTests: [
      TESTS.TEST_PURITY,
      TESTS.TEST_CB_NOT_CALLED_AFTER_DONE,
    ]
  })
);

testSuite.run();
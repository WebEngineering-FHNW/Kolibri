import { TestSuite }        from "../../../test/test.js";
import { createTestConfig } from "../../util/testUtil.js";
import { StackIterator }    from "./stackIterator.js";
import {
  convertArrayToStack,
  reverseStack
} from "../../../../../p6_brodwolf_andermatt/src/stack/stack.js";
import {
  addToTestingTable,
  TESTS
} from "../../util/testingTable.js";

const testSuite = TestSuite("Iterator: Constructor StackIterator");

addToTestingTable(testSuite)(
  createTestConfig({
    name:     "StackIterator",
    iterator: () => {
      const stack = reverseStack(convertArrayToStack([0,1,2,3,4]));
      return StackIterator(stack);
    },
    expected: [0,1,2,3,4],
    excludedTests: [TESTS.TEST_PURITY, TESTS.TEST_CB_NOT_CALLED_AFTER_DONE]
  })
);

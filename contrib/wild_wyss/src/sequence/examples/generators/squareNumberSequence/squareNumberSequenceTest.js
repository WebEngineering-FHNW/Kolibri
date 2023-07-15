import { TestSuite }                from "../../../../test/test.js";
import { createTestConfig }         from "../../../util/testUtil.js";
import { arrayEq }                  from "../../../../../../../docs/src/kolibri/util/arrayFunctions.js";
import { take }                     from "../../../sequence.js";
import { SquareNumberSequence }     from "./squareNumberSequence.js";
import { addToTestingTable, TESTS } from "../../../util/testingTable.js";

const testSuite = TestSuite("Sequence: constructor SquareNumberSequence");

addToTestingTable(testSuite)(
  createTestConfig({
    name:     "SquareNumberSequence",
    iterable: SquareNumberSequence,
    expected: [1, 4, 9, 16, 25],
    evalFn:   expected => actual => {
      const expectedArray = take(5)(expected);
      const actualArray   = take(5)(actual);
      return arrayEq([...expectedArray])([...actualArray]);
    },
    excludedTests: [
      TESTS.TEST_PURITY,
      TESTS.TEST_CB_NOT_CALLED_AFTER_DONE,
    ]
  })
);

testSuite.run();
import { TestSuite }                from "../../../../kolibri/util/test.js";
import { createTestConfig }         from "../../../../kolibri/sequence/util/testUtil.js";
import { arrayEq }                  from "../../../../kolibri/util/arrayFunctions.js";
import { take }                     from "../../../../kolibri/sequence/sequence.js";
import { SquareNumberSequence }     from "./squareNumberSequence.js";
import { addToTestingTable, TESTS } from "../../../../kolibri/sequence/util/testingTable.js";

const testSuite = TestSuite("examples/sequence/generators/squareNumberSequence");

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

import { addToTestingTable, TESTS } from "../../util/testingTable.js";
import { TestSuite }                from "../../../util/test.js";
import { arrayEq }                  from "../../../util/arrayFunctions.js";
import { nil, cycle, take }         from "../../sequence.js"
import {
  createTestConfig,
  newSequence,
}                                   from "../../util/testUtil.js";

const testSuite = TestSuite("Sequence: operation cycle");

addToTestingTable(testSuite)(
  createTestConfig({
    name:       "cycle",
    iterable:   () => newSequence(2),
    operation:  () => cycle,
    expected:   [0, 1, 2, 0, 1, 2, 0, 1, 2],
    onNil:      nil,
    evalFn:     expected => actual => {
      const actualArray = take(9)(actual);
      const expectedArray = take(9)(expected);
      return arrayEq([...expectedArray])([...actualArray]);
    },
    excludedTests: [TESTS.TEST_INVARIANTS]
  })
);

testSuite.run();

import { addToTestingTable, TESTS } from "../../util/testingTable.js";
import { TestSuite }                from "../../../util/test.js";
import { Pair, fst, snd}            from "../../../lambda/churchExports.js";
import { Range }                    from "../../sequence.js";
import { uncons }                   from "./uncons.js";
import { arrayEq }                  from "../../../util/arrayFunctions.js";
import {
  createTestConfig,
  newSequence,
  UPPER_SEQUENCE_BOUNDARY
}                                   from "../../util/testUtil.js";

const testSuite = TestSuite("Sequence: terminal operations uncons");
addToTestingTable(testSuite)(
  createTestConfig({
    name:      "uncons",
    iterable:  () => newSequence(UPPER_SEQUENCE_BOUNDARY),
    operation: () => uncons,
    expected:  Pair(0)(Range(1, UPPER_SEQUENCE_BOUNDARY)),
    evalFn:    expected => actual =>
      expected(fst) === actual(fst) &&
      arrayEq([...expected(snd)])([...actual(snd)]),
    excludedTests: [
      TESTS.TEST_CB_NOT_CALLED_AFTER_DONE,
      TESTS.TEST_ITERATE_MULTIPLE_TIMES,
    ]
  })
);

testSuite.run();

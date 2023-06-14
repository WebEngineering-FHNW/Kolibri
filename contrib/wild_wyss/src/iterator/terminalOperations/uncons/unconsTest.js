import { addToTestingTable, TESTS } from "../../util/testingTable.js";
import { TestSuite }                from "../../../test/test.js";
import { Pair, fst, snd }           from "../../../../../../docs/src/kolibri/stdlib.js";
import { Range }                    from "../../../range/range.js";
import { uncons }                   from "./uncons.js";
import { arrayEq }                  from "../../../../../../docs/src/kolibri/util/arrayFunctions.js";
import {
  createTestConfig,
  newIterator,
  UPPER_ITERATOR_BOUNDARY
} from "../../util/testUtil.js";

const testSuite = TestSuite("Sequence: terminal Operations uncons");
addToTestingTable(testSuite)(
  createTestConfig({
    name:      "uncons",
    iterator:  () => newIterator(UPPER_ITERATOR_BOUNDARY),
    operation: () => uncons,
    expected:  Pair(0)(Range(1, UPPER_ITERATOR_BOUNDARY)),
    evalFn:    expected => actual =>
      expected(fst) === actual(fst) &&
      arrayEq([...expected(snd)])([...actual(snd)]),
    excludedTests: [
      TESTS.TEST_CB_NOT_CALLED_AFTER_DONE,
      TESTS.TEST_ITERATE_MULTIPLE_TIMES,
    ]
  })
);

// TODO: test empty iterator
testSuite.add("test purity forEach$", assert => {
  // Given

  // When

  // Then
  //assert.iterableEq(elements, expected);
});


testSuite.run();
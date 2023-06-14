import { TestSuite }                from "../../../test/test.js";
import { createTestConfig }         from "../../util/testUtil.js";
import { Tuple }                    from "../../../../../p6_haefliger_misic/branch-projector-pattern/church/rock.js";
import { TupleSequence }            from "./tupleSequence.js";
import { addToTestingTable, TESTS } from "../../util/testingTable.js";

const testSuite = TestSuite("Sequence: constructor TupleSequence");

addToTestingTable(testSuite)(
  createTestConfig({
    name:      "TupleSequence",
    iterable:  () => {
      const [ Triple ]    = Tuple(5);
      const triple        = Triple(0)(1)(2)(3)(4);
      return TupleSequence(triple)
    },
    expected:  [0,1,2,3,4],
    excludedTests: [
      TESTS.TEST_PURITY,
      TESTS.TEST_CB_NOT_CALLED_AFTER_DONE,
    ]
  })
);

testSuite.run();
import { addToTestingTable } from "../../util/testingTable.js";
import { TestSuite }         from "../../../test/test.js";
import { Range }             from "../../../range/range.js";
import { concat }            from "./concat.js"
import {
  createTestConfig,
  newIterator,
} from "../../util/testUtil.js";

const testSuite = TestSuite("Iterator: Operation concat");
addToTestingTable(testSuite)(
  createTestConfig({
    name:      "concat",
    iterator:  () => Range(3,4),
    operation: concat,
    param:     newIterator(2),
    expected:  [0,1,2,3,4],
  })
);


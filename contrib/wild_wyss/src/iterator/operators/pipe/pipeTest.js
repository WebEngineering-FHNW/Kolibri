import { addToTestingTable } from "../../util/testingTable.js";
import { TestSuite }         from "../../../test/test.js";
import { ArrayIterator }     from "../../constructors/arrayIterator/arrayIterator.js";
import {
  createTestConfig,
  newIterator,
} from "../../util/testUtil.js";

const testSuite = TestSuite("Iterator: Operation pipe");
testSuite.run();

// TODO

import { TestSuite         } from "../../../test/test.js";
import { addToTestingTable } from "../../util/testingTable.js";
import { pipe              } from "./pipe.js";
import { map               } from "../map/map.js";
import {
  createTestConfig,
  newIterator,
  UPPER_ITERATOR_BOUNDARY
}                            from "../../util/testUtil.js";
import {rejectAll} from "../rejectAll/rejectAll.js";

const testSuite = TestSuite("Iterator: Operation pipe");
testSuite.run();

addToTestingTable(testSuite)(
  createTestConfig({
    name:       "pipe",
    iterator:   () => newIterator(UPPER_ITERATOR_BOUNDARY),
    operation:  ops => pipe(...ops),
    param:      [ map(x => 2*x), rejectAll(x => x > 4) ],
    expected:   [0, 2, 4]
  })
);

testSuite.run();

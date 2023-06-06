import { addToTestingTable }   from "../../util/testingTable.js";
import { TestSuite }           from "../../../test/test.js";
import { dropWhile, eq$, nil } from "../../iterator.js";
import { arrayEq }             from "../../../../../../docs/src/kolibri/util/arrayFunctions.js";
import {
  createTestConfig,
  newIterator,
  UPPER_ITERATOR_BOUNDARY,
} from "../../util/testUtil.js";

const testSuite = TestSuite("Iterator: Operation dropWhile");

addToTestingTable(testSuite)(
  createTestConfig({
    name:       "dropWhile",
    iterator:   () => newIterator(UPPER_ITERATOR_BOUNDARY),
    operation:  dropWhile,
    param:      el => el < 2,
    expected:   [2, 3, 4],
    invariants: [
      it => eq$(dropWhile(_ => true)(it))  /* === */ (nil),
      it => eq$(dropWhile(_ => false)(it)) /* === */ (it),
    ]
  })
);

testSuite.add("test advanced case: dropWhile inner iterator is shorter", assert => {
  // the inner iterator stops before the outer
  const iterator = newIterator(UPPER_ITERATOR_BOUNDARY);
  const some = dropWhile(_ => false)(iterator);
  assert.isTrue(arrayEq([0, 1, 2, 3, 4])([...some]));
});

testSuite.run();
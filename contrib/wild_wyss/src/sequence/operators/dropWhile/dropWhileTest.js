import { addToTestingTable } from "../../util/testingTable.js";
import { TestSuite }         from "../../../test/test.js";
import { dropWhile, nil }    from "../../sequence.js";
import { arrayEq }           from "../../../../../../docs/src/kolibri/util/arrayFunctions.js";
import {
  createTestConfig,
  newSequence,
  UPPER_SEQUENCE_BOUNDARY,
} from "../../util/testUtil.js";

const testSuite = TestSuite("Sequence: Operation dropWhile");

addToTestingTable(testSuite)(
  createTestConfig({
    name:       "dropWhile",
    iterable:   () => newSequence(UPPER_SEQUENCE_BOUNDARY),
    operation:  dropWhile,
    param:      el => el < 2,
    expected:   [2, 3, 4],
    invariants: [
      it => dropWhile(_ => true )(it) ["=="] (nil),
      it => dropWhile(_ => false)(it) ["=="] (it),
    ]
  })
);

testSuite.add("test advanced case: dropWhile inner iterator is shorter", assert => {
  // the inner iterator stops before the outer
  const iterator = newSequence(UPPER_SEQUENCE_BOUNDARY);
  const some = dropWhile(_ => false)(iterator);
  assert.isTrue(arrayEq([0, 1, 2, 3, 4])([...some]));
});

testSuite.run();
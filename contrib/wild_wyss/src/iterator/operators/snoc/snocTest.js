import { addToTestingTable } from "../../util/testingTable.js";
import { TestSuite }         from "../../../test/test.js";
import { snoc }              from "./snoc.js";
import { nil }               from "../../constructors/nil/nil.js";
import { arrayEq }           from "../../../../../../docs/src/kolibri/util/arrayFunctions.js";
import {
  createTestConfig,
  newIterator,
  UPPER_ITERATOR_BOUNDARY,
} from "../../util/testUtil.js";

const testSuite = TestSuite("Iterator: Operation snoc");

addToTestingTable(testSuite)(
  createTestConfig({
    name:       "snoc",
    iterator:   () => newIterator(UPPER_ITERATOR_BOUNDARY),
    operation:  snoc,
    param:      42,
    expected:   [0, 1, 2, 3, 4, 42]
  })
);

testSuite.add("test empty iterator: snoc an element to empty iterator", assert => {
  const result = snoc(42)(nil);
  assert.isTrue(arrayEq([42])([...result]));
});

testSuite.add("test snoc 2 times", assert => {
  const result = snoc(42)(snoc(42)(nil));
  assert.isTrue(arrayEq([42, 42])([...result]));
});

testSuite.run();

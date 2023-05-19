import { addToTestingTable } from "../../util/testingTable.js";
import { TestSuite }         from "../../../test/test.js";
import { cons }              from "./cons.js"
import { nil }               from "../../constructors/nil/nil.js";
import { arrayEq }           from "../../../../../../docs/src/kolibri/util/arrayFunctions.js";
import {
  createTestConfig,
  newIterator,
  UPPER_ITERATOR_BOUNDARY,
} from "../../util/testUtil.js";

const testSuite = TestSuite("Iterator: Operation cons");

addToTestingTable(testSuite)(
  createTestConfig({
    name:       "cons",
    iterator:   () => newIterator(UPPER_ITERATOR_BOUNDARY),
    operation:  cons,
    param:      2,
    expected:   [2, 0, 1, 2, 3, 4]
  })
);

testSuite.add("test empty iterator: cons element to empty iterator", assert => {
  const result = cons(42)(nil);
  assert.isTrue(arrayEq([42])([...result]));
});

testSuite.run();
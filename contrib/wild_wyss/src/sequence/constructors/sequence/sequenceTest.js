import { TestSuite }        from "../../../test/test.js";
import { createTestConfig } from "../../util/testUtil.js";
import { Sequence }         from "./Sequence.js";
import { Range }            from "../../../range/range.js";
import {
  addToTestingTable,
  TESTS
} from "../../util/testingTable.js";

const testSuite = TestSuite("Sequence: Constructor Sequence");

addToTestingTable(testSuite)(
  createTestConfig({
    name:      "Sequence",
    iterable:  () => Sequence(0, current => 4 < current, current => current + 1),
    expected:  [0,1,2,3,4],
    excludedTests: [
      TESTS.TEST_PURITY,
      TESTS.TEST_CB_NOT_CALLED_AFTER_DONE,
    ]
  })
);

testSuite.add("test special case: no increment after done", assert => {
  // Given
  let result = true;
  const iterator = Sequence(true, _ => true, _ => result = false);

  // When
  for (const iteratorElement of iterator) { /* exhausting iterator */ }

  // Then
  assert.isTrue(result);
});

testSuite.add("test : and", assert => {
  // When
  const result = Range(3).and(el => Range(el));

  // Then
  assert.iterableEq(result, [0, 0, 1, 0, 1, 2, 0, 1, 2, 3]);
});

testSuite.run();
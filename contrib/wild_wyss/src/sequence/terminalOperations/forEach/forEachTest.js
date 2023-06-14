import { addToTestingTable, TESTS } from "../../util/testingTable.js";
import { TestSuite }                from "../../../test/test.js";
import { forEach$ }                 from "./forEach.js";
import { arrayEq }                  from "../../../../../../docs/src/kolibri/util/arrayFunctions.js";
import { nil }                      from "../../constructors/nil/nil.js";
import {
  createTestConfig,
  newSequence,
  UPPER_SEQUENCE_BOUNDARY
} from "../../util/testUtil.js";

const testSuite = TestSuite("Sequence: terminal operation forEach$");

const forEach$Config = (() => {
  // keep this state in the closure scope
  const iterElements = [];
  return createTestConfig({
    name:       "forEach$",
    iterable:   () => newSequence(UPPER_SEQUENCE_BOUNDARY),
    operation:  forEach$,
    param:      cur => iterElements.push(cur),
    expected:   [0, 1, 2, 3, 4],
    evalFn:     expected => _actual => {
      let result;
        result = arrayEq(expected)(iterElements);
        iterElements.splice(0, iterElements.length);
      return result;
    },
    excludedTests: [
      TESTS.TEST_PURITY,
      TESTS.TEST_CB_NOT_CALLED_AFTER_DONE,
      TESTS.TEST_ITERATE_MULTIPLE_TIMES,
    ]
  });
})();

addToTestingTable(testSuite)(forEach$Config);

testSuite.add("test purity forEach$", assert => {
  // Given
  const elements = [0, 1, 2, 3, 4];
  const expected = [];

  // When
  forEach$(x => expected.push(x))(elements);

  // Then
  assert.iterableEq(elements, expected);
});

testSuite.add("test empty iterable", assert => {
  // Given
  const expected = [];

  // When
  forEach$(x => expected.push(x))(nil);

  // Then
  assert.iterableEq(expected, nil);
});

testSuite.run();
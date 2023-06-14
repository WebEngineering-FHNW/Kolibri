import { addToTestingTable, TESTS } from "../../util/testingTable.js";
import { TestSuite }                from "../../../test/test.js";
import { catMaybes }                from "./catMaybes.js"
import { nil }                      from "../../constructors/nil/nil.js";
import { arrayEq }                  from "../../../../../../docs/src/kolibri/util/arrayFunctions.js";
import { Just, Nothing }            from "../../../stdlib/maybe.js";
import { createTestConfig }         from "../../util/testUtil.js";
import { PureSequence }             from "../../constructors/pureSequence/pureSequence.js";
import {toMonadicIterable} from "../../util/util.js";

const testSuite = TestSuite("Sequence: Operation catMaybes");

addToTestingTable(testSuite)(
  createTestConfig({
    name:       "catMaybes",
    iterable:   () => toMonadicIterable([Just(5), Just(3), Nothing]),
    operation:  () => catMaybes,
    expected:   [5, 3],
    excludedTests: [TESTS.TEST_INVARIANTS],
  })
);

testSuite.add("test catMaybes with Nothing", assert => {
  // When
  const result = catMaybes(PureSequence(Nothing));
  // Then
  assert.isTrue(arrayEq([])([...result]));
});

testSuite.add("test catMaybes with nil", assert => {
  // When
  const result = catMaybes(nil);
  // Then
  assert.isTrue(arrayEq([])([...result]));
});

testSuite.add("test catMaybes with no Nothings", assert => {
  // Given
  const inner = [Just(5), Just(3)];
  // When
  const result = catMaybes(inner);

  // Then
  assert.isTrue(arrayEq([5, 3])([...result]));
});

testSuite.run();
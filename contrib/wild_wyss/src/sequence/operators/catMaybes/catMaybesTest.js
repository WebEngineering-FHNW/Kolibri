import { addToTestingTable, TESTS }     from "../../util/testingTable.js";
import { TestSuite }                    from "../../../test/test.js";
import { Just, Nothing }                from "../../../stdlib/maybe.js";
import { createTestConfig }             from "../../util/testUtil.js";
import { toMonadicIterable }            from "../../util/sequenceUtil/toMonadicIterable.js";
import { catMaybes, nil, PureSequence } from "../../sequence.js"

const testSuite = TestSuite("Sequence: operation catMaybes");

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
  assert.iterableEq([],[...result]);
});

testSuite.add("test catMaybes with nil", assert => {
  // When
  const result = catMaybes(nil);

  // Then
  assert.iterableEq([],[...result]);
});

testSuite.add("test catMaybes with no Nothings", assert => {
  // Given
  const inner = [Just(5), Just(3)];

  // When
  const result = catMaybes(inner);

  // Then
  assert.iterableEq([5, 3],[...result]);
});

testSuite.run();
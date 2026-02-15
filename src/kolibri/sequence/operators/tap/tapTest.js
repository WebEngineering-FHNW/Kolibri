import { addToTestingTable } from "../../util/testingTable.js";
import { TestSuite }         from "../../../util/test.js";
import { tap }               from "./tap.js";
import { nil }               from "../../constructors/nil/nil.js";
import {
  createTestConfig,
  newSequence,
  UPPER_SEQUENCE_BOUNDARY
}                            from "../../util/testUtil.js";
import { map }               from "../map/map.js";
import { reduce$ }           from "../../terminalOperations/reduce/reduce.js";
import { pipe }              from "../pipe/pipe.js";
import { take }              from "../take/take.js";
import { repeat }            from "../../constructors/repeat/repeat.js";

const testSuite = TestSuite("Sequence: operation tap");

const forEachConfig = (() => {
  // keep this state in the closure scope
  const sideEffectStorage = [];
  return createTestConfig({
    name:          "forEach",
    iterable:      () => newSequence(UPPER_SEQUENCE_BOUNDARY),
    operation:     tap,
    param:      cur => sideEffectStorage.push(cur),
    expected:      [0, 1, 2, 3, 4],
    excludedTests: []
  });
})();

addToTestingTable(testSuite)(forEachConfig);

testSuite.add("test side effect tap", assert => {
  // Given
  const elements = [0, 1, 2, 3, 4];
  const expected = [0, 1, 2, 3, 4];

  // When
  tap(x => expected.push(x))(elements);

  // Then
  assert.iterableEq(elements, expected);
});

testSuite.add("test empty iterable", assert => {
  // Given
  const expected = [];

  // When
  tap(x => expected.push(x))(nil);

  // Then
  assert.iterableEq(expected, nil);
});

testSuite.add("can be piped", assert => {
  // Given
  const base    = newSequence(5);
  const mapper  = map        (x => 2*x);
  const reducer = reduce$    ((acc, cur) => acc + cur, 0);
  const sideEffectStorage = [];

  // When
  const res = pipe(
      mapper, // [0, 2, 4, 6, 8, 10]
      tap(x => sideEffectStorage.push(x)),
      reducer // 0 + 0 + 2 + 4 + 6 + 8 + 10
  )(base);  // [0, 1, 2, 3, 4, 5]

  //Then
  assert.is(res, 30);
  assert.iterableEq([0, 2, 4, 6, 8, 10], sideEffectStorage);
});

testSuite.add("can be called on infinite", assert => {
  // Given
  const infinite = repeat(0);
  const sideEffectStorage = [];

  // When
  const result = pipe(
      tap(x => sideEffectStorage.push(x)),
      take(1)
  )(infinite);

  //Then
  assert.iterableEq([0], result);
  assert.iterableEq([0], sideEffectStorage);
});

testSuite.run();

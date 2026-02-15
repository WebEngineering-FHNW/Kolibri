import { forEach$ } from "./forEach.js";
import { nil }      from "../../constructors/nil/nil.js";
import {TestSuite}  from "../../../util/test.js";

const testSuite = TestSuite("Sequence: terminal operation forEach$");


testSuite.add("test impurity of forEach$", assert => {
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

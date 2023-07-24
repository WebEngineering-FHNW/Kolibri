import { TestSuite } from "../test/test.js";
import { Pair      } from "./pair.js";
import { fst, snd  } from "../../../../docs/src/kolibri/stdlib.js"

const pairTestSuite = TestSuite("Pair");

pairTestSuite.add("test simple case pair", assert => {
  // Given
  const pair  = Pair("Tobi")("Andri");

  // When
  const tobi  = pair(fst);
  const andri = pair(snd);

  // Then
  assert.is(tobi, "Tobi");
  assert.is(andri, "Andri");
});

pairTestSuite.add("test destructuring pair", assert => {
  // Given
  const pair          = Pair("Tobi")("Andri");

  // When
  const [tobi, andri] = pair;

  // Then
  assert.is(tobi,  "Tobi");
  assert.is(andri, "Andri");
});

pairTestSuite.add("test destructuring multiple times", assert => {
  // Given
  const pair          = Pair("Tobi")("Andri");

  // When
  const [_1, _2]      = pair;
  const [tobi, andri] = pair;

  // Then
  assert.is(tobi,  "Tobi");
  assert.is(andri, "Andri");
});

pairTestSuite.add("test destructuring with spread-operator", assert => {
  // When
  const pair = Pair("Tobi")("Andri");

  // Then
  assert.iterableEq([...pair], ["Tobi","Andri"]);
});

pairTestSuite.run();
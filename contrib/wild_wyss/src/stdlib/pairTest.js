import { TestSuite } from "../test/test.js";
import { Pair      } from "./pair.js";
import { fst, snd  } from "../../../../docs/src/kolibri/stdlib.js"
import { arrayEq   } from "../../../../docs/src/kolibri/util/arrayFunctions.js";

const pairTestSuite = TestSuite("Pair");

pairTestSuite.add("test simple case pair", assert => {
  const pair  = Pair("Tobi")("Andri");
  const tobi  = pair(fst);
  const andri = pair(snd);

  assert.is(tobi, "Tobi");
  assert.is(andri, "Andri");
});

pairTestSuite.add("test destructuring pair", assert => {
  const pair          = Pair("Tobi")("Andri");
  const [tobi, andri] = pair;

  assert.is(tobi,  "Tobi");
  assert.is(andri, "Andri");
});

pairTestSuite.add("test destructuring multiple times", assert => {
  const pair          = Pair("Tobi")("Andri");
  const [_1, _2]      = pair;
  const [tobi, andri] = pair;

  assert.is(tobi,  "Tobi");
  assert.is(andri, "Andri");
});

pairTestSuite.add("test destructuring with spread-operator", assert => {
  const pair = Pair("Tobi")("Andri");
  assert.isTrue(arrayEq([...pair])(["Tobi","Andri"]));
});

pairTestSuite.run();



import { TestSuite }                         from "../../util/test.js";
import {isIterable, isSequence, plus, toSeq} from "./helpers.js";
import { Seq }                               from "../constructors/seq/seq.js";
import { Pair } from "../../lambda/pair.js";
// import {Pair} from "../../stdlib.js"; // todo dk: this might be suggested by auto-import, but it's not what we want

const testSuite = TestSuite("Sequence: helper");

testSuite.add("isSequence", assert => {
  assert.is(isSequence(Seq()),      true);
  assert.is(isSequence([]),         false);
  assert.is(isSequence({}),         false);
  assert.is(isSequence(null),       false);
  assert.is(isSequence(undefined),  false);
});

testSuite.add("pair as sequence", assert => {
  const p = Pair(1)(2);
  assert.is( isIterable(p),      true   );
  assert.is( toSeq(p).show(),    "[1,2]");
});

testSuite.add("plus with string", assert => {
  const strings = "a b c".split(" ");
  const string  = strings.reduce( plus, "");
  assert.is( string, "abc" );
});

testSuite.add("plus with numbers", assert => {
  const nums = Seq(1,2,3);
  const result  = nums.reduce$( plus, 0);
  assert.is(result, 6 );
});

testSuite.run();

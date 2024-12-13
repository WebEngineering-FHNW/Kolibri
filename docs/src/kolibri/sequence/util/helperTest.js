import { TestSuite }                                                  from "../../util/test.js";
import { Seq }                                                        from "../constructors/seq/seq.js";
import { Pair }                                                       from "../../lambda/pair.js";
import { count$, forever, isIterable, isSequence, plus, toSeq,limit } from "./helpers.js";
import { Walk }                                                       from "../constructors/range/range.js";
import { Sequence }                                                   from "../constructors/sequence/Sequence.js";

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

testSuite.add("toSeq is lazy", assert => {
  let trace = 0;
  const iterable = { [Symbol.iterator]: () => ({
      next: () => {
        trace++;
        return { value: 42, done:false }; // infinite iterator
      }
    }) };
  assert.is(trace, 0);
  const seq = toSeq(iterable);  // the iterable is not called, yet
  assert.is(trace, 0);
  const firstValue = seq.head(); // only now
  assert.is(trace, 1);
  assert.is(firstValue, 42);
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

testSuite.add("count$", assert => {
  assert.is(count$(Seq()),        0 );
  assert.is(count$(Seq("x")),     1 );
  assert.is(count$(Walk(1,1000)), 1000 );
});

testSuite.add("limit ok", assert => {
  const halves = Sequence(1, forever, n => n/2);
  assert.is(limit(1/2,    halves),       1/2    );
  assert.is(limit(1/1024, halves),       1/1024 );
});

testSuite.add("limit not found", assert => {
  assert.is(limit(1, Seq()),       undefined );
  assert.is(limit(1, Seq(10,5,3)), undefined );
});

testSuite.run();
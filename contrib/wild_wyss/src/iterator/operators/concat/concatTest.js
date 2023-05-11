import { addToTestingTable } from "../../util/testingTable.js";
import { TestSuite }         from "../../../test/test.js";
import { Range }             from "../../../range/range.js";
import { concat }            from "./concat.js"
import { arrayEq }           from "../../../../../../docs/src/kolibri/util/arrayFunctions.js";
import { Iterator }          from "../../constructors/iterator/iterator.js";
import { nil }               from "../../constructors/nil/nil.js";
import {
  createTestConfig,
  newIterator,
} from "../../util/testUtil.js";

const testSuite = TestSuite("Iterator: Operation concat");
addToTestingTable(testSuite)(
  createTestConfig({
    name:      "concat",
    iterator:  () => Range(3,4),
    operation: concat,
    param:     newIterator(2),
    expected:  [0,1,2,3,4],
  })
);

testSuite.add("test purity: concat", assert => {
  const it1 = newIterator(4);
  const it2 = newIterator(2);
  const concatIterator = concat(it1)(it2);
  for (const _ of concatIterator) { /* Exhausting */ }
  assert.isTrue(arrayEq([0,1,2,3,4])([...it1]));
  assert.isTrue(arrayEq([0,1,2])    ([...it2]));
});

testSuite.add("test left/right neutrality: concat", assert => {
  const left =  concat(nil)(newIterator(4));
  const right = concat(newIterator(4))(nil);
  const expected = [0,1,2,3,4];
  assert.isTrue(arrayEq(expected)([...right]));
  assert.is(arrayEq(expected)([...left]),  true);
});

testSuite.add("test left/right associativity: concat", assert => {
  const left  = concat(concat(newIterator(2))(newIterator(1)))(newIterator(3));
  const right = concat(newIterator(2))(concat(newIterator(1))(newIterator(3)));
  const expected = [0,1,2,0,1,0,1,2,3];
  assert.isTrue(arrayEq(expected)([...right]));
  assert.is(arrayEq(expected)([...left]),  true);
});

testSuite.add("test concat with infinity: concat", assert => {
  let called  = false;
  let counter = 0;

  const endless                = Iterator(0, i => i + 1, _ => false);
  const iteratorWithSideEffect = Iterator(false, _ => called = true, _ => false);
  const concatenated           = concat(endless)(iteratorWithSideEffect);

  for (const _ of concatenated) {
    if (counter++ > 10) break; // consume a few elements
  }
  assert.is(called, false);
});

testSuite.add("test empty: concat", assert => {
  const concatenated = concat(nil)(nil);
  assert.is(arrayEq([])([...concatenated]),  true);
});

testSuite.run();
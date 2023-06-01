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

testSuite.add("test purity: concat - both sub iterators untouched.", assert => {
  // Given
  const it1 = newIterator(4);
  const it2 = newIterator(2);
  const concatIterator = concat(it1)(it2);

  // When
  for (const _ of concatIterator) { /* Exhausting */ }

  // Then
  assert.isTrue(arrayEq([0,1,2,3,4])([...it1]));
  assert.isTrue(arrayEq([0,1,2])    ([...it2]));
});

testSuite.add("test left/right identity: concat", assert => {
  // Given
  const base = newIterator(4);

  // When
  const left =  concat(nil)(base);
  const right = concat(base)(nil);

  // Then
  const expected = [0,1,2,3,4];
  assert.isTrue(arrayEq(expected)([...right]));
  assert.is(arrayEq(expected)([...left]),  true);
});

testSuite.add("test left/right associativity: concat", assert => {
  // When
  const left  = concat(concat(newIterator(2))(newIterator(1)))(newIterator(3));
  const right = concat(newIterator(2))(concat(newIterator(1))(newIterator(3)));

  // Then
  const expected = [0,1,2,0,1,0,1,2,3];
  assert.isTrue(arrayEq(expected)([...right]));
  assert.is(arrayEq(expected)([...left]),  true);
});

testSuite.add("test concat with infinity: concat", assert => {
  // Given
  let called  = false;
  let counter = 0;

  const endless                = Iterator(0, i => i + 1, _ => false);
  const iteratorWithSideEffect = Iterator(false, _ => called = true, _ => false);
  const concatenated           = concat(endless)(iteratorWithSideEffect);

  // When
  for (const _ of concatenated) {
    if (counter++ > 10) break; // consume a few elements
  }

  // Then
  assert.is(called, false);
});

testSuite.add("test empty: concat", assert => {
  // When
  const concatenated = concat(nil)(nil);

  // Then
  assert.is(arrayEq([])([...concatenated]),  true);
});

testSuite.run();
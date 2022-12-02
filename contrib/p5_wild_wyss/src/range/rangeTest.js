import { Range } from "./range.js"
import {TestSuite} from "../../../../docs/src/kolibri/util/test.js";

const rangeSuite = TestSuite("Range");


rangeSuite.add("test typical case for of", assert => {
  const result = [];
  for(const value of Range(1)){
    result.push(value);
  }
  assert.is(result.length, 2);
});

rangeSuite.add("test typical case spread", assert => {
  const result = [...Range(2)];
  assert.is(result.length, 3);
});

rangeSuite.add("test typical case deconstruction", assert => {
  const [zero, one, two] = Range(2);
  assert.is(zero, 0);
  assert.is(one,  1);
  assert.is(two,  2);
});

rangeSuite.add("test typical case deconstruction", assert => {
  const result = Array.from(/** @type ArrayLike */ Range(3));
  assert.is(result.length, 4);
});

const testRange = (from, to, step, range, assert) => {

  for (let expected = from; expected <= to; expected += step) {

    const { done, value } = range[Symbol.iterator]().next();
    assert.is(value, expected);
    assert.isTrue(!done)
  }
  assert.isTrue(range[Symbol.iterator]().next().done)
};

const testRangeNegativeStepSize = (from, to, step, range, assert) => {
  for (let expected = from; expected >= to; expected += step) {
    const { done, value } = range[Symbol.iterator]().next();
    assert.is(value, expected);
    assert.isTrue(!done)
  }
  assert.isTrue(range[Symbol.iterator]().next().done)
};

rangeSuite.add("test simple Range(2,3)", assert =>
  testRange(2, 3, 1, Range(2, 3), assert));

rangeSuite.add("test simple Range(3,2,1)", assert => {
  testRange(2, 3, 1, Range(3,2,1), assert)
});

rangeSuite.add("test break Range(7)", assert => {
  const range = Range(7);
  const result = [];

  // noinspection LoopStatementThatDoesntLoopJS
  for (const value of range) {
    result.push(value);
    break;
  }
  assert.is(result.length, 1);
  assert.is(result[0], 0);
});

rangeSuite.add("test double break", assert => {
  const range = Range(7);
  const result = [];

  // noinspection LoopStatementThatDoesntLoopJS
  for (const value of range) {
    result.push(value);
    break;
  }


  // noinspection LoopStatementThatDoesntLoopJS
  for (const value of range) {
    result.push(value);
    break;
  }

  assert.is(result.length, 2);
  assert.is(result[0], 0);
  assert.is(result[1], 1);
});

rangeSuite.add("test use range twice", assert => {
  const range = Range(0);

  const [zero] = range;
  assert.is(zero, 0);

  const [repeat] = range;
  assert.is(repeat, undefined)
});

rangeSuite.add("test continue and break", assert => {
  for (const value of Range(Number.MAX_VALUE)) {
    if(4 > value) continue; // dropWhile value < 4
    if(4 < value) break;    // take(1)
    assert.is(value, 4);
  }
});

rangeSuite.add("test running out of range", assert => {
  const range = Range(2);

  for (const _ of range) { /** Range gets exhausted. */ }

  assert.is(range[Symbol.iterator]().next().done, true);
  assert.is(range[Symbol.iterator]().next().done, true);
});

rangeSuite.add("test negative Range(4, 6,- 2)", assert =>
  testRangeNegativeStepSize(6, 4, -2, Range(4, 6, -2), assert));

rangeSuite.add("test negative Range(6, 4, -2)", assert =>
  testRangeNegativeStepSize(6, 2, -2, Range(6, 2, -2), assert));

rangeSuite.add("test negative Range(0, -2, -1)", assert =>
  testRangeNegativeStepSize(0, -2, -1, Range(0, -2, -1), assert));

rangeSuite.add("test negative Range(-12, -2, -2)", assert =>
  testRangeNegativeStepSize(-2, -12, -2, Range(-12, -2, -2), assert));

// all combinations
rangeSuite.add("test of all combinations", assert => {
  testRange(0, 5, 1, Range(0, 5, 1), assert);
  testRange(0, 5, 1, Range(5, 0, 1), assert);

  testRange(-5, 5, 1, Range(-5, 5, 1), assert);
  testRange(-5, 5, 1, Range(5, -5, 1), assert);

  testRange(-5, 0, 1, Range(-5, 0, 1), assert);
  testRange(-5, 0, 1, Range(0, -5, 1), assert);

  testRangeNegativeStepSize(5, 0, -1, Range(0, 5, -1), assert);
  testRangeNegativeStepSize(5, 0, -1, Range(5, 0, -1), assert);

  testRangeNegativeStepSize(5, -5, -1, Range(-5, 5, -1), assert);
  testRangeNegativeStepSize(5, -5, -1, Range(5, -5, -1), assert);

  testRangeNegativeStepSize(0, -5, -1, Range(-5, 0, -1), assert);
  testRangeNegativeStepSize(0, -5, -1, Range(0, -5, -1), assert);
});

rangeSuite.run();

// negRange.forEach(console.log); // forEach does not exist on JS Iterator until now
// negRange.forEach(console.log); // never shown
// range.dropWhile( value => value < 5 ) -> 5... rest
// range.takeWhile( value => value < 5 ) -> start ... 4
// range.filter( value => value % 2 === 0)
// alternative names for filter:
// range.retainAll( value => value % 2 === 0)
// range.select( value => value % 2 === 0)
// range.reject( value => value % 2 === 0)
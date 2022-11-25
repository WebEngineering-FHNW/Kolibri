import { Range } from "./range.js"
import {TestSuite} from "../../../../docs/src/kolibri/util/test.js";

const loggerSuite = TestSuite("Range");


loggerSuite.add("test typical case for of", assert => {
  const result = [];
  for(const value of Range(1)){
    result.push(value);
  }
  assert.is(result.length, 2);
});

loggerSuite.add("test typical case spread", assert => {
  const result = [...Range(2)];
  assert.is(result.length, 3);
});

loggerSuite.add("test typical case deconstruction", assert => {
  const [zero, one, two] = Range(2);
  assert.is(zero, 0);
  assert.is(one,  1);
  assert.is(two,  2);
});

loggerSuite.add("test typical case deconstruction", assert => {
  const result = Array.from(Range(3));
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

loggerSuite.add("test simple Range(2,3)", assert =>
  testRange(2, 3, 1, Range(2, 3), assert));

loggerSuite.add("test simple Range(3,2,1)", assert => {
  testRange(2, 3, 1, Range(3,2,1), assert)
});

loggerSuite.add("test break Range(7)", assert => {
  const range = Range(7);
  const result = [];

  for (const value of range) {
    result.push(value);
    break;
  }
  assert.is(result.length, 1);
  assert.is(result[0], 0);
});

loggerSuite.add("test double break", assert => {
  const range = Range(7);
  const result = [];

  for (const value of range) { // TODO: range.drop(1)
    result.push(value); // wenn das nicht da wäre
    break;
  }

  for (const value of range) { // TODO: range.take(1)
    result.push(value);
    break;
  }

  assert.is(result.length, 2);
  assert.is(result[0], 0);
  assert.is(result[1], 1);
});

loggerSuite.add("test use range twice", assert => {
  const range = Range(0);

  const [zero] = range;
  assert.is(zero, 0);

  const [repeat] = range;
  assert.is(repeat, undefined)
});

loggerSuite.add("test continue and break", assert => {
  for (const value of Range(Number.MAX_VALUE)) {
    if(4 > value) continue; // dropWhile value < 4
    if(4 < value) break;    // take(1)
    assert.is(value, 4);
  }
});

loggerSuite.add("test negative Range(4, 6,- 2)", assert =>
  testRangeNegativeStepSize(6, 4, -2, Range(4, 6, -2), assert));

loggerSuite.add("test negative Range(6, 4, -2)", assert =>
  testRangeNegativeStepSize(6, 2, -2, Range(6, 2, -2), assert));

loggerSuite.add("test negative Range(0, -2, -1)", assert =>
  testRangeNegativeStepSize(0, -2, -1, Range(0, -2, -1), assert));

loggerSuite.add("test negative Range(-12, -2, -2)", assert =>
  testRangeNegativeStepSize(-2, -12, -2, Range(-12, -2, -2), assert));

loggerSuite.run();

// negRange.forEach(console.log); // forEach does not exist on JS Iterator until now
// negRange.forEach(console.log); // never shown
// range.dropWhile( value => value < 5 ) -> 5... rest
// range.takeWhile( value => value < 5 ) -> start ... 4
// range.filter( value => value % 2 === 0)
// alternative names for filter:
// range.retainAll( value => value % 2 === 0)
// range.select( value => value % 2 === 0)
// range.reject( value => value % 2 === 0)
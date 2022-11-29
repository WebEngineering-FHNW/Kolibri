import {TestSuite} from "../../../../docs/src/kolibri/util/test.js";
import {Range} from "./range.js";

const loggerSuite = TestSuite("Iterator Functions");

const assertRangeIsEmpty = (range, assert) => {
  const [undef] = range;
  assert.is(undef, undefined);
};

// test for dropWhile
loggerSuite.add("test simple dropWhile", assert => {
  const range = Range(10).dropWhile(value => value < 3);
  assert.is(range[Symbol.iterator]().next().value, 3);
});

loggerSuite.add("test double dropWhile", assert => {
  const range = Range(10)
    .dropWhile(value => 3 > value)
    .dropWhile(value => 4 > value);

  assert.is(range[Symbol.iterator]().next().value, 4);
});

loggerSuite.add("test dropWhile running out of range", assert => {
  const range = Range(10).dropWhile(_value => true);

  assertRangeIsEmpty(range, assert);
});

// tests for drop
loggerSuite.add("test simple drop", assert => {
  const range = Range(10).drop(3);

  const [ next ] = range;
  assert.is(next, 3);
});

loggerSuite.add("test simple drop", assert => {
  const range = Range(10).drop(20);

  assertRangeIsEmpty(range, assert);
});

// tests for takeWhile
loggerSuite.add("test simple takeWhile", assert => {
  const range = Range(4).takeWhile(value => 2 > value);
  assert.is(range[Symbol.iterator]().next().value, 0);
  assert.is(range[Symbol.iterator]().next().value, 1);
});

loggerSuite.add("", assert => {
  const originalRange   = Range(4);
  const restrictedRange = originalRange.takeWhile(value => 2 > value);
  assert.is(originalRange, restrictedRange);
});

// TODO: Range to string

// tests for take
loggerSuite.add("test simple take", assert => {
  const range = Range(10).take(5);
  let counter = 0;
  for(const element of range){
    assert.is(element, counter++);
  }
  // check if range only contains 5 elements
  assert.is(range[Symbol.iterator]().next().done, true);
  assert.is(counter, 5);
});

// tests for forEach
loggerSuite.add("test simple take", assert => {
  const range = Range(10);
  const result = [];
  range.forEach(el => result.push(el));
  let i = 0;
  for(const elem of range){
    assert.is(elem, result[i++]);
  }
});

loggerSuite.run();

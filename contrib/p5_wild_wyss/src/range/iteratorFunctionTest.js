import {TestSuite} from "../../../../docs/src/kolibri/util/test.js";
import {Range} from "./range.js";

const loggerSuite = TestSuite("Iterator Functions");

// test for dropWhile
loggerSuite.add("test simple dropWhile", assert => {
  let range = Range(10).dropWhile(value => value < 3);
  assert.is(range[Symbol.iterator]().next().value, 3);
});

loggerSuite.add("test double dropWhile", assert => {
  let range = Range(10)
      .dropWhile(value => value < 3)
      .dropWhile(value => value < 4);

  assert.is(range[Symbol.iterator]().next().value, 4);
});

loggerSuite.add("test dropWhile running out of range", assert => {
  let range = Range(10).dropWhile(_value => true)

  assert.is(range[Symbol.iterator]().next().value, 10);
});

// tests for drop
loggerSuite.add("test simple drop", assert => {
  let range = Range(10).drop(3);

  assert.is(range[Symbol.iterator]().next().value, 3);
});

loggerSuite.add("test simple drop", assert => {
  let range = Range(10).drop(20);

  assert.is(range[Symbol.iterator]().next().value, 10);
});

// tests for takeWhile
loggerSuite.add("test simple takeWhile", assert => {
  let range = Range(4).takeWhile(value => value < 2);
  assert.is(range[Symbol.iterator]().next().value, 0);
  assert.is(range[Symbol.iterator]().next().value, 1);
});

// test for take
loggerSuite.add("test simple take", assert => {
  let range = Range(10).take(5);
  let counter = 0;
  for(const element of range){
    assert.is(element, counter++);
  }
  // check if range only contains 5 elements
  assert.is(range[Symbol.iterator]().next().value, 5);
});

loggerSuite.run();

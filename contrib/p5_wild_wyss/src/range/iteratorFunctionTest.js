import {TestSuite} from "../../../../docs/src/kolibri/util/test.js";
import {Range} from "./range.js";

const loggerSuite = TestSuite("Iterator Functions");

// test for dropWhile
loggerSuite.add("test simple dropWhile", assert => {
  const range = Range(10);

  range.dropWhile(value => value < 3);
  assert.is(range[Symbol.iterator]().next().value, 3);
});

loggerSuite.add("test double dropWhile", assert => {
  const range = Range(10);

  range.dropWhile(value => value < 3)
       .dropWhile(value => value < 4);

  assert.is(range[Symbol.iterator]().next().value, 4);
});

loggerSuite.add("test dropWhile running out of range", assert => {
  const range = Range(10);

  range.dropWhile(_value => true)

  assert.is(range[Symbol.iterator]().next().value, 10);
});

// tests for drop
loggerSuite.add("test simple drop", assert => {
  const range = Range(10);

  range.drop(3);

  assert.is(range[Symbol.iterator]().next().value, 3);
});

loggerSuite.add("test simple drop", assert => {
  const range = Range(10);

  range.drop(20);

  assert.is(range[Symbol.iterator]().next().value, 10);
});


loggerSuite.run();

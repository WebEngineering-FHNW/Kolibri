import {TestSuite} from "../../../../../docs/src/kolibri/util/test.js";
import {Appender} from "./arrayAppender.js";
import {convertToJsBool} from "../lamdaCalculus.js";

const { debug, getValue, reset } = Appender();

const loggerSuite = TestSuite("Array Appender");

loggerSuite.add("test add debug value to array appender", assert => {
  const result = debug("debug");
  assert.is(convertToJsBool(result), true );
  assert.is(getValue()[0], "debug");
  reset();
});

loggerSuite.add("test add two values to array appender", assert => {
  const result1 = debug("first");
  const result2 = debug("second");
  assert.is(convertToJsBool(result1), true );
  assert.is(convertToJsBool(result2), true );
  assert.is(getValue()[0], "first");
  assert.is(getValue()[1], "second");
  assert.is(getValue().length, 2);
  reset();
});

loggerSuite.add("test reset array appender", assert => {
  const result1 = debug("first");
  assert.is(convertToJsBool(result1), true );
  assert.is(getValue()[0], "first");
  reset();
  assert.isTrue(0 === getValue().length);
});

loggerSuite.run();

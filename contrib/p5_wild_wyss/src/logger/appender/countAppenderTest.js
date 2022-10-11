import {TestSuite} from "../../../../../docs/src/kolibri/util/test.js";
import {Appender} from "./countAppender.js";
import {convertToJsBool} from "../lamdaCalculus.js";

const { debug, getValue, reset } = Appender();

const loggerSuite = TestSuite("Count Appender");

loggerSuite.add("test add debug value to count appender", assert => {
  const result = debug("debug");
  assert.is(convertToJsBool(result), true );
  assert.is(getValue().debug, 1);
  reset();
});

loggerSuite.add("test add two values to string appender", assert => {
  const result1 = debug("first");
  const result2 = debug("second");
  assert.is(convertToJsBool(result1), true );
  assert.is(convertToJsBool(result2), true );
  assert.is(getValue().debug, 2);
  reset();
});

loggerSuite.add("test reset string appender", assert => {
  const result1 = debug("first");
  assert.is(convertToJsBool(result1), true );
  assert.is(getValue().debug, 1);
  reset();
  assert.isTrue(0 === getValue().debug );
});

loggerSuite.run();

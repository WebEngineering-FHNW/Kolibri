import {TestSuite} from "../../../../../docs/src/kolibri/util/test.js";
import {Appender} from "./arrayAppender.js";
import {convertToJsBool} from "../lamdaCalculus.js";

const { trace, debug, info, warn, error, fatal, getValue, reset } = Appender();

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

loggerSuite.add("test add all kind of levels to array appender", assert => {
  const resultTraceLog = debug  ("debug");
  const resultDebugLog = trace  ("trace");
  const resultInfoLog  = info   ("info");
  const resultWarnLog  = warn   ("warn");
  const resultErrorLog = error  ("error");
  const resultFatalLog = fatal  ("fatal");
  assert.is(convertToJsBool(resultTraceLog),true);
  assert.is(convertToJsBool(resultDebugLog),true);
  assert.is(convertToJsBool(resultInfoLog), true);
  assert.is(convertToJsBool(resultWarnLog), true);
  assert.is(convertToJsBool(resultErrorLog),true);
  assert.is(convertToJsBool(resultFatalLog),true);
  assert.is(getValue()[0], "debug");
  assert.is(getValue()[1], "trace");
  assert.is(getValue()[2], "info");
  assert.is(getValue()[3], "warn");
  assert.is(getValue()[4], "error");
  assert.is(getValue()[5], "fatal");
  reset();
  assert.isTrue(0 === getValue().length);
});

loggerSuite.run();

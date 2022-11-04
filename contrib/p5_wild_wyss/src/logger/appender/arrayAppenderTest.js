import {TestSuite} from "../../../../../docs/src/kolibri/util/test.js";
import {Appender} from "./arrayAppender.js";
import {convertToJsBool, True, False, id} from "../lamdaCalculus.js";

const { trace, debug, info, warn, error, fatal, getValue, reset } = Appender();

const loggerSuite = TestSuite("Array Appender");

loggerSuite.add("test add debug value to array appender", assert => {
  const result = debug("debug");
  assert.is(result, True);
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


loggerSuite.add("test default appender overflow implementation", assert =>{
  const { trace, getValue, reset } = Appender(1);
  const result = trace("Tobias Wyss");
  assert.is(getValue().length, 1);
  assert.is(result, True);
  const result2 = trace("Tobias Wyss");
  assert.is(getValue().length, 1);
  assert.is(result2, True);
  reset();
});

loggerSuite.add("test custom limit implementation", assert =>{
  const msg1 = "Tobias Wyss";
  const msg2 = "Andri Wild";
  let value = [];
  const onLimitReached = array => {
    value = array;
    return [];
  };
  const { trace, reset } = Appender(1, onLimitReached);
  trace(msg1);
  trace(msg2);
  assert.is(value.length, 1);
  assert.is(getValue()[0], msg2);
  reset();
});

loggerSuite.add(
  "test appender should not add log messages if the array reached the limit and has not been cleared up",
    assert => {
  const { trace, getValue, reset } = Appender(0, id);
  const result = trace("Tobias Wyss");

  assert.is(result, False);
  assert.is(getValue().length, 0);
  reset();
});

loggerSuite.run();
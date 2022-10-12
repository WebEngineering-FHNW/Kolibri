import {TestSuite} from "../../../../../docs/src/kolibri/util/test.js";
import {Appender} from "./stringAppender.js";
import {convertToJsBool} from "../lamdaCalculus.js";

const { trace, debug, info, warn, error, fatal, getValue, reset } = Appender();

const loggerSuite = TestSuite("String Appender");

loggerSuite.add("test add debug value to string appender", assert => {
  const result = debug("debug");
  assert.is(convertToJsBool(result), true );
  assert.is(getValue(), "debug");
  reset();
});

loggerSuite.add("test add two values to string appender", assert => {
  const result1 = debug("A");
  const result2 = debug("B");
  assert.is(convertToJsBool(result1), true );
  assert.is(convertToJsBool(result2), true );
  assert.is(getValue(""), "AB");
  reset();
});

loggerSuite.add("test reset string appender", assert => {
  const result1 = debug("first");
  assert.is(convertToJsBool(result1), true );
  assert.is(getValue(""), "first");
  reset();
  assert.isTrue("" === String(getValue("")));
});

loggerSuite.add("test concatenate strings with a custom delimiter", assert => {
  const result1 = debug("first");
  const result2 = debug("second");
  assert.is(convertToJsBool(result1), true );
  assert.is(convertToJsBool(result2), true );
  assert.is(getValue(" <-> "), "first <-> second");
  reset();
  assert.isTrue("" === String(getValue("")));
});

loggerSuite.add("test add all kind of levels to string appender", assert => {
  const traceLogResult  = trace("trace");
  const debugLogResult  = debug("debug");
  const infoLogResult   = info("info");
  const warnLogResult   = warn("warn");
  const errorLogResult  = error("error");
  const fatalLogResult  = fatal("fatal");
  assert.is(convertToJsBool(traceLogResult),  true);
  assert.is(convertToJsBool(debugLogResult),  true);
  assert.is(convertToJsBool(infoLogResult),   true);
  assert.is(convertToJsBool(warnLogResult),   true);
  assert.is(convertToJsBool(errorLogResult),  true);
  assert.is(convertToJsBool(fatalLogResult),  true);
  assert.is(getValue("-"),  "trace-debug-info-warn-error-fatal");
  reset();
});

loggerSuite.run();

import {TestSuite} from "../../../../../docs/src/kolibri/util/test.js";
import {Appender} from "./countAppender.js";
import {convertToJsBool} from "../lamdaCalculus.js";

const { trace, debug, info, warn, error, fatal, getValue, reset } = Appender();

const loggerSuite = TestSuite("Count Appender");

loggerSuite.add("test add debug value to count appender", assert => {
  const result = debug("debug");
  assert.is(convertToJsBool(result), true );
  assert.is(getValue().debug, 1);
  reset();
});

loggerSuite.add("test add two values to count appender", assert => {
  const result1 = debug("first");
  const result2 = debug("second");
  assert.is(convertToJsBool(result1), true );
  assert.is(convertToJsBool(result2), true );
  assert.is(getValue().debug, 2);
  reset();
});

loggerSuite.add("test reset count appender", assert => {
  const result1 = debug("first");
  assert.is(convertToJsBool(result1), true );
  assert.is(getValue().debug, 1);
  reset();
  assert.isTrue(0 === getValue().debug );
});

loggerSuite.add("test add all kind of levels to count appender", assert => {
  const traceResult  = trace("trace");
  const debugResult  = debug("debug");
  const infoResult   = info("info");
  const warnResult   = warn("warn");
  const errorResult  = error("error");
  const fatalResult  = fatal("fatal");
  assert.is(convertToJsBool(traceResult),  true);
  assert.is(convertToJsBool(debugResult),  true);
  assert.is(convertToJsBool(infoResult),   true);
  assert.is(convertToJsBool(warnResult),   true);
  assert.is(convertToJsBool(errorResult),  true);
  assert.is(convertToJsBool(fatalResult),  true);
  assert.is(getValue().trace,  1);
  assert.is(getValue().debug,  1);
  assert.is(getValue().info,   1);
  assert.is(getValue().warn,   1);
  assert.is(getValue().error,  1);
  assert.is(getValue().fatal,  1);
  reset();
  assert.isTrue(0 === getValue().trace);
  assert.isTrue(0 === getValue().debug);
  assert.isTrue(0 === getValue().info);
  assert.isTrue(0 === getValue().warn);
  assert.isTrue(0 === getValue().error);
  assert.isTrue(0 === getValue().fatal);
});

loggerSuite.run();

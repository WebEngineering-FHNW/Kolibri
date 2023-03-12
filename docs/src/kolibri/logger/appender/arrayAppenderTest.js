import {TestSuite} from "../../util/test.js";
import {Appender} from "./arrayAppender.js";
import {id, T}    from "../../lambda/church.js";

const { trace, debug, info, warn, error, fatal, getValue, reset } = Appender();

reset(); // clears the state of the appender

const msg1 = "Tobias Wyss";
const msg2 = "Andri Wild";

const arrayAppenderSuite = TestSuite("Array Appender");

arrayAppenderSuite.add("test add debug value to array appender", assert => {
  const result = debug("debug");
  assert.is(result, T);
  assert.is(getValue()[0], "debug");
  reset();
});

arrayAppenderSuite.add("test add two values to array appender", assert => {
  const result1 = debug("first");
  const result2 = debug("second");
  assert.is(result1, T);
  assert.is(result2, T);
  assert.is(getValue()[0], "first");
  assert.is(getValue()[1], "second");
  assert.is(getValue().length, 2);
  reset();
});

arrayAppenderSuite.add("test reset array appender", assert => {
  const result1 = debug("first");
  assert.is(result1, T);
  assert.is(getValue()[0], "first");
  reset();
  assert.isTrue(0 === getValue().length);
});

arrayAppenderSuite.add("test add all kind of levels to array appender", assert => {
  const resultTraceLog  = debug("debug");
  const resultDebugLog  = trace("trace");
  const resultInfoLog   = info("info");
  const resultWarnLog   = warn("warn");
  const resultErrorLog  = error("error");
  const resultFatalLog  = fatal("fatal");
  assert.is(resultTraceLog, T);
  assert.is(resultDebugLog, T);
  assert.is(resultInfoLog, T);
  assert.is(resultWarnLog, T);
  assert.is(resultErrorLog, T);
  assert.is(resultFatalLog, T);
  assert.is(getValue()[0], "debug");
  assert.is(getValue()[1], "trace");
  assert.is(getValue()[2], "info");
  assert.is(getValue()[3], "warn");
  assert.is(getValue()[4], "error");
  assert.is(getValue()[5], "fatal");
  reset();
  assert.isTrue(0 === getValue().length);
});


arrayAppenderSuite.add("test default appender overflow implementation", assert => {
  // limit will be lifted to at least 2
  const {trace, getValue, reset} = Appender(1);
  const result = trace(msg1);
  assert.is(getValue().length, 1);
  assert.is(result, T);
  const result2 = trace(msg1);
  assert.is(getValue().length, 2);
  assert.is(result2, T);

  // should trigger cache eviction & delete first element
  const result3 = trace(msg2);
  assert.is(getValue().length, 1);
  assert.is(getValue()[0], msg2);
  assert.is(result3, T);
  reset();
});

arrayAppenderSuite.add("test custom limit implementation", assert => {
  let value = [];
  const onLimitReached = array => {
    value = array;
    return [];
  };
  const {trace, reset} = Appender(1, onLimitReached);
  trace(msg1);
  trace(msg1);
  trace(msg2);
  assert.is(value.length, 2);
  assert.is(getValue()[0], msg2);
  assert.is(getValue().length, 1);
  reset();
});

arrayAppenderSuite.add(
  "test appender should fallback to default eviction strategy, if array reaches limit and has not been cleaned up.",
  assert => {
    const {trace, getValue, reset} = Appender(2, id);
    trace(msg1);
    trace(msg1);

    // should trigger default eviction strategy on next log statement
    trace(msg2);
    assert.is(getValue().length, 2);
    assert.isTrue(getValue()[0].startsWith("LOG ERROR:"));
    assert.is(getValue()[1], msg2);
    reset();
  });

arrayAppenderSuite.run();

import { TestSuite }       from "../../util/test.js";
import { ConsoleAppender } from "./consoleAppender.js";
import { T }               from "../../lambda/church.js";

const { trace, debug, info, warn, error, fatal } = ConsoleAppender();

const consoleAppenderSuite = TestSuite("logger/Console Appender");

consoleAppenderSuite.add("test add all kind of levels to console appender", assert => {
  const resultInfo   = info  ("info: expected log output from console appender: trace, debug, warn, error, fatal");
  const resultTrace  = trace ("trace (expected)");
  const resultDebug  = debug ("debug (expected)");
  const resultWarn   = warn  ("warn  (expected)");
  const resultError  = error ("error (expected)");
  const resultFatal  = fatal ("fatal (expected)");
  assert.is(resultTrace, T);
  assert.is(resultDebug, T);
  assert.is(resultInfo,  T);
  assert.is(resultWarn,  T);
  assert.is(resultError, T);
  assert.is(resultFatal, T);
});

consoleAppenderSuite.run();

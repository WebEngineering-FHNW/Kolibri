import {TestSuite} from "../../util/test.js";
import {Appender}  from "./consoleAppender.js";

const { trace, debug, info, warn, error, fatal } = Appender();

const consoleAppenderSuite = TestSuite("Console Appender");

consoleAppenderSuite.add("test add all kind of levels to console appender", assert => {
  const resultTrace  = trace ("trace");
  const resultDebug  = debug ("debug");
  const resultInfo   = info  ("info");
  const resultWarn   = warn  ("warn");
  const resultError  = error ("error");
  const resultFatal  = fatal ("fatal");
  assert.is(resultTrace, T);
  assert.is(resultDebug, T);
  assert.is(resultInfo, T);
  assert.is(resultWarn, T);
  assert.is(resultError, T);
  assert.is(resultFatal, T);
});

consoleAppenderSuite.run();

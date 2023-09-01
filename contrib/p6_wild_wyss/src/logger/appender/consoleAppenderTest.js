import { TestSuite }  from "../../test/test.js";
import { Appender }   from "./consoleAppender.js";
import { True }       from "../lamdaCalculus.js";

const { trace, debug, info, warn, error, fatal } = Appender();

const consoleAppenderSuite = TestSuite("Console Appender");

consoleAppenderSuite.add("test add all kind of levels to console appender", assert => {
  const resultTrace  = trace ("trace");
  const resultDebug  = debug ("debug");
  const resultInfo   = info  ("info");
  const resultWarn   = warn  ("warn");
  const resultError  = error ("error");
  const resultFatal  = fatal ("fatal");
  assert.is(resultTrace, True);
  assert.is(resultDebug, True);
  assert.is(resultInfo,  True);
  assert.is(resultWarn,  True);
  assert.is(resultError, True);
  assert.is(resultFatal, True);
});

consoleAppenderSuite.run();

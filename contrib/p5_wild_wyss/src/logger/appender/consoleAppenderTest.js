import {TestSuite} from "../../../../../docs/src/kolibri/util/test.js";
import {Appender} from "./consoleAppender.js";
import {convertToJsBool} from "../lamdaCalculus.js";

const { trace, debug, info, warn, error, fatal } = Appender();

const loggerSuite = TestSuite("Console Appender");

loggerSuite.add("test add all kind of levels to console appender", assert => {
  const resultTrace  = trace("trace");
  const resultDebug  = debug("debug");
  const resultInfo   = info("info");
  const resultWarn   = warn("warn");
  const resultError  = error("error");
  const resultFatal  = fatal("fatal");
  assert.is(convertToJsBool(resultTrace),  true);
  assert.is(convertToJsBool(resultDebug),  true);
  assert.is(convertToJsBool(resultInfo),   true);
  assert.is(convertToJsBool(resultWarn),   true);
  assert.is(convertToJsBool(resultError),  true);
  assert.is(convertToJsBool(resultFatal),  true);
});

loggerSuite.run();

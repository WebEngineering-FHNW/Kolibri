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
  assert.isTrue(convertToJsBool(resultTrace));
  assert.isTrue(convertToJsBool(resultDebug));
  assert.isTrue(convertToJsBool(resultInfo));
  assert.isTrue(convertToJsBool(resultWarn));
  assert.isTrue(convertToJsBool(resultError));
  assert.isTrue(convertToJsBool(resultFatal));
});

loggerSuite.run();

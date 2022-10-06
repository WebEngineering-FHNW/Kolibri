import {TestSuite} from "../../../../../docs/src/kolibri/util/test.js";
import {debugLogger, LOG_DEBUG, LOG_NOTHING, LOG_TRACE, LOG_WARN} from "../logger.js";
import {id} from "../../../../p6_brodwolf_andermatt/src/lambda-calculus-library/lambda-calculus.js"

const formatter = _ => id;

const loggerSuite = TestSuite("Appender");
loggerSuite.add("test simple logging", assert => {
  let realMsg = '';
  const write = msg => {
    realMsg = msg
  };
  console.log("TEST")
  const logMessage = 'hello world';
  const debug = debugLogger(() => LOG_DEBUG)(write)(formatter);
  debug(logMessage);

  assert.is(realMsg, 'hello world');
});

loggerSuite.run();

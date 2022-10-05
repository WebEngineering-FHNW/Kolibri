import {TestSuite} from "../../../../docs/src/kolibri/util/test.js";
import {debugLogger, LOG_DEBUG, LOG_NOTHING, LOG_TRACE, LOG_WARN} from "./logger.js";
import {id} from "../../../p6_brodwolf_andermatt/src/lambda-calculus-library/lambda-calculus.js"

const formatter = _ => id;

const loggerSuite = TestSuite("Logger");
loggerSuite.add("test simple logging", assert => {
  let realMsg = '';
  const write = msg => {
    realMsg = msg
  };
  const logMessage = 'hello world';
  const debug = debugLogger(() => LOG_DEBUG)(write)(formatter);
  debug(logMessage);

  assert.is(realMsg, 'hello world');
});

loggerSuite.add("test enabling logging", assert => {
  let logLevel = LOG_NOTHING;
  let realMsg = '';
  const logMessage = 'hello world';

  const write = msg => realMsg = msg;
  const debug = debugLogger(() => logLevel)(write)(formatter);

  // logging should be disabled
  debug(logMessage);
  assert.is(realMsg, '');

  // logging should be enabled
  logLevel = LOG_DEBUG;
  debug(logMessage);
  assert.is(realMsg, logMessage);
});

loggerSuite.add("test disabling logging", assert => {
  let logLevel = LOG_DEBUG;
  let realMsg = '';
  const logMessage = 'hello world';

  const write = msg => realMsg = msg;
  const debug = debugLogger(() => logLevel)(write)(formatter);

  // logging should be enabled
  debug(logMessage);
  assert.is(realMsg, logMessage);

  // logging should be disabled
  logLevel = LOG_NOTHING;
  realMsg = '';
  debug(logMessage);
  assert.is(realMsg, '');
});

loggerSuite.add("log lower logging level, should log", assert => {
  const logLevel = LOG_TRACE;
  let realMsg = '';
  const logMessage = 'hello world';
  const debug = debugLogger(() => logLevel)(msg => realMsg = msg)(formatter);

  // loglevel debug should also be logged, when LOG_TRACE is enabled
  debug(logMessage);
  assert.is(realMsg, logMessage);
});

loggerSuite.add("log higher logging level, should not log", assert => {
  const logLevel = LOG_WARN;
  let realMsg = '';
  const logMessage = 'hello world';
  const debug = debugLogger(() => logLevel)(msg => realMsg = msg)(formatter);

  // loglevel debug should not log when LOG_WARN is enabled
  debug(logMessage);
  assert.is(realMsg, '');
});

loggerSuite.run();

import {TestSuite} from "../../../../docs/src/kolibri/util/test.js";
import {DebugLogger, LOG_DEBUG, LOG_NOTHING, LOG_TRACE, LOG_WARN} from "../../src/logger/logger.js";

const loggerSuite = TestSuite("Logger");

loggerSuite.add("test simple logging", assert => {
  let realMsg = '';
  const write = msg => realMsg = msg;
  const logMessage = 'hello world';
  const debug = DebugLogger(() => LOG_DEBUG)(write);
  debug(logMessage);
  assert.is(realMsg, 'DEBUG: hello world');
});

loggerSuite.add("test enabling logging", assert => {
  let logLevel = LOG_NOTHING;
  let realMsg = '';
  const logMessage = 'hello world';

  const write = msg => realMsg = msg;
  const debug = DebugLogger(() => logLevel)(write);

  // logging should be disabled
  debug(logMessage);
  assert.is(realMsg, '');

  // logging should be enabled
  logLevel = LOG_DEBUG;
  debug(logMessage);
  assert.is(realMsg, "DEBUG: " +logMessage);
});

loggerSuite.add("test disabling logging", assert => {
  let logLevel = LOG_DEBUG;
  let realMsg = '';
  const logMessage = 'hello world';

  const write = msg => realMsg = msg;
  const debug = DebugLogger(() => logLevel)(write);

  // logging should be enabled
  debug(logMessage);
  assert.is(realMsg, "DEBUG: " + logMessage);

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
  const debug = DebugLogger(() => logLevel)(msg => realMsg = msg);

  // loglevel debug should also be logged, when LOG_TRACE is enabled
  debug(logMessage);
  assert.is(realMsg, "DEBUG: " + logMessage);
});

loggerSuite.add("log higher logging level, should not log", assert => {
  const logLevel = LOG_WARN;
  let realMsg = '';
  const logMessage = 'hello world';
  const debug = DebugLogger(() => logLevel)(msg => realMsg = msg);

  // loglevel debug should not log when LOG_WARN is enabled
  debug(logMessage);
  assert.is(realMsg, '');
});

loggerSuite.run();

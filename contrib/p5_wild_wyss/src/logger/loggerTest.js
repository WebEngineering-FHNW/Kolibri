import { TestSuite }                  from "../../../../docs/src/kolibri/util/test.js";
import { id, lazy, True, False }      from "./lamdaCalculus.js";
import { Appender }                   from "./appender/arrayAppender.js";
import { Appender as CountAppender }  from "./appender/countAppender.js";
import {
  debugLogger,
  LOG_DEBUG,
  LOG_NOTHING,
  LOG_TRACE,
  LOG_WARN,
  setGlobalContext,
  setLoggingLevel,
} from "./logger.js";

const logMessage  = "hello world";
setGlobalContext("ch.fhnw.test");

const beforeStart = () => {
  const appender    = Appender();
  appender.reset();
  setGlobalContext("ch.fhnw.test");
  setLoggingLevel(LOG_DEBUG);
  const getActiveAppender = () => [appender]
  return { getActiveAppender, appender }
};

const loggerSuite = TestSuite("Logger");

loggerSuite.add("test simple logging", assert => {
  const { getActiveAppender, appender } = beforeStart();
  setLoggingLevel(LOG_DEBUG);
  const debug = debugLogger(getActiveAppender)("ch.fhnw.test")(_context => _level => id);
  const result = debug(logMessage);

  assert.is(result, True);
  assert.is(appender.getValue()[0], logMessage);
});

loggerSuite.add("test enabling logging", assert => {
  const { getActiveAppender, appender } = beforeStart();
  setLoggingLevel(LOG_NOTHING);
  const debug = debugLogger(getActiveAppender)("ch.fhnw.test")(_context => _level => id);

  // logging should be disabled
  const result1 = debug(logMessage);
  assert.is(appender.getValue().length, 0);
  assert.is(result1, False);

  // logging should be enabled
  setLoggingLevel(LOG_DEBUG);
  const result2 = debug(logMessage);
  assert.is(result2, True);
  assert.is(appender.getValue()[0], logMessage);
});

loggerSuite.add("test disabling logging", assert => {
  const { appender, getActiveAppender} = beforeStart();
  setLoggingLevel(LOG_DEBUG);
  const debug = debugLogger(getActiveAppender)("ch.fhnw.test")(_context => _level => id);

  // logging should be enabled
  const result1 = debug(logMessage);
  assert.is(appender.getValue()[0], logMessage);
  assert.is(result1, True);

  // logging should be disabled
  setLoggingLevel(LOG_NOTHING);
  appender.reset();
  const result2 = debug(logMessage);
  assert.is(result2, False);
  assert.is(appender.getValue().length, 0);
});

loggerSuite.add("log lower logging level, should log", assert => {
  const { appender, getActiveAppender } = beforeStart();

  setLoggingLevel(LOG_TRACE);
  const debug = debugLogger(getActiveAppender)("ch.fhnw.test")(_context => _level => id);

  // loglevel debug should also be logged, when LOG_TRACE is enabled
  const result = debug(logMessage);
  assert.is(result, True);
  assert.is(appender.getValue()[0], logMessage);
});

loggerSuite.add("log higher logging level, should not log", assert => {
  const { appender, getActiveAppender } = beforeStart();

  setLoggingLevel(LOG_WARN);
  const debug = debugLogger(getActiveAppender)("ch.fhnw.test")(_context => _level => id);

  // loglevel debug should not log when LOG_WARN is enabled
  const result = debug(logMessage);
  assert.is(result, False);
  assert.is(appender.getValue().length, 0);
});

loggerSuite.add("test debug tag formatted log message", assert => {
  const { appender, getActiveAppender } = beforeStart();
  const levelFormatter = _ => lvl => msg => `[${lvl}] ${msg}`;

  setLoggingLevel(LOG_DEBUG);
  const debug = debugLogger(getActiveAppender)("ch.fhnw.test")(levelFormatter);

  const result = debug(logMessage);
  assert.is(result, True);
  assert.is(appender.getValue()[0], `[DEBUG] ${logMessage}`);
});

loggerSuite.add("test context tag formatted log message", assert => {
  const { appender, getActiveAppender } = beforeStart();
  const levelFormatter = ctx => _ => msg => `${ctx}: ${msg}`;
  setLoggingLevel(LOG_DEBUG);
  const context = "ch.fhnw.test";
  const debug = debugLogger(getActiveAppender)("ch.fhnw.test")(levelFormatter);

  const result = debug(logMessage);
  assert.is(result, True);
  assert.is(appender.getValue()[0], `${context}: ${logMessage}`);
});

loggerSuite.add("test context, logger should not log", assert => {
  const { appender, getActiveAppender } = beforeStart();
  setLoggingLevel(LOG_DEBUG);
  setGlobalContext("ch.fhnw.test")
  const debug = debugLogger(getActiveAppender)("ch.fhnw")(_context => _level => id);

  const result = debug(logMessage);
  assert.is(result, False);
  assert.is(appender.getValue().length, 0);
});

loggerSuite.add("test context, logger should log", assert => {
  const { appender, getActiveAppender } = beforeStart();
  setLoggingLevel(LOG_DEBUG);
  const debug = debugLogger(getActiveAppender)("ch.fhnw.test.specific.tag")(_context => _level => id);

  const result = debug(logMessage);
  assert.is(result, True);
  assert.is(appender.getValue()[0], logMessage);
});

loggerSuite.add("test lazy evaluation, logger should log", assert => {
  const { appender, getActiveAppender } = beforeStart();

  setLoggingLevel(LOG_DEBUG);
  const debug = debugLogger(getActiveAppender)("ch.fhnw.test")(_context => _level => id);

  const result = debug(lazy(logMessage));
  assert.is(result, True);
  assert.is(appender.getValue()[0], logMessage);
});

loggerSuite.add("test lazy evaluation, logger should not log and function should not be evaluated", assert => {
  const { appender, getActiveAppender } = beforeStart();

  setLoggingLevel(LOG_NOTHING);
  const debug = debugLogger(getActiveAppender)("ch.fhnw.test")(_context => _level => id);

  const result = debug(lazy(logMessage));
  assert.is(result, False);
  assert.is(appender.getValue().length, 0);
});

loggerSuite.add("test log to multiple appender", assert => {
  const { appender }      = beforeStart();
  const countAppender     = CountAppender();
  const getActiveAppender = () => [appender, countAppender];

  const debug = debugLogger(getActiveAppender)("ch.fhnw.test")(_context => _level => id);

  const result = debug(logMessage);
  assert.is(result, True);
  assert.is(appender.getValue()[0], logMessage);
  assert.is(countAppender.getValue().debug, 1);
});

loggerSuite.run();

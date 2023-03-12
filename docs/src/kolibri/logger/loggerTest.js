import {TestSuite}      from "../util/test.js";
import {F, id, T}       from "../lambda/church.js";
import {Appender as ArrayAppender } from "./appender/arrayAppender.js";
import {Appender as CountAppender } from "./appender/countAppender.js";
import {
  addToAppenderList,
  debugLogger,
  LOG_DEBUG,
  LOG_NOTHING,
  LOG_TRACE,
  LOG_WARN,
  removeFromAppenderList,
  setLoggingContext,
  setLoggingLevel,
  setMessageFormatter,
  messageFormatter,
}                                  from "./logger.js";

const logMessage  = "log message from loggerTest.js";

const beforeStart = () => {
  const appender = ArrayAppender();
  appender.reset();
  setLoggingContext("ch.fhnw.test");
  setLoggingLevel(LOG_DEBUG);
  addToAppenderList(appender);
  return { appender }
};

const loggerSuite = TestSuite("Logger");

loggerSuite.add("test simple logging", assert => {
  const { appender } = beforeStart();
  setLoggingLevel(LOG_DEBUG);
  const debug = debugLogger("ch.fhnw.test");
  const result = debug(logMessage);

  assert.is(result, T);
  assert.is(appender.getValue()[0], logMessage);
});

loggerSuite.add("test enabling logging", assert => {
  const { appender } = beforeStart();
  setLoggingLevel(LOG_NOTHING);
  const debug = debugLogger("ch.fhnw.test");

  // logging should be disabled
  const result1 = debug(logMessage);
  assert.is(appender.getValue().length, 0);
  assert.is(result1, F);

  // logging should be enabled
  setLoggingLevel(LOG_DEBUG);
  const result2 = debug(logMessage);
  assert.is(result2, T);
  assert.is(appender.getValue()[0], logMessage);
});

loggerSuite.add("test disabling logging", assert => {
  const { appender } = beforeStart();
  setLoggingLevel(LOG_DEBUG);
  const debug = debugLogger("ch.fhnw.test");

  // logging should be enabled
  const result1 = debug(logMessage);
  assert.is(appender.getValue()[0], logMessage);
  assert.is(result1, T);

  // logging should be disabled
  setLoggingLevel(LOG_NOTHING);
  appender.reset();
  const result2 = debug(logMessage);
  assert.is(result2, F);
  assert.is(appender.getValue().length, 0);
});

loggerSuite.add("log lower logging level, should log", assert => {
  const { appender } = beforeStart();

  setLoggingLevel(LOG_TRACE);
  const debug = debugLogger("ch.fhnw.test");

  // loglevel debug should also be logged, when LOG_TRACE is enabled
  const result = debug(logMessage);
  assert.is(result, T);
  assert.is(appender.getValue()[0], logMessage);
});

loggerSuite.add("log higher logging level, should not log", assert => {
  const { appender } = beforeStart();

  setLoggingLevel(LOG_WARN);
  const debug = debugLogger("ch.fhnw.test");

  // loglevel debug should not log when LOG_WARN is enabled
  const result = debug(logMessage);
  assert.is(result, F);
  assert.is(appender.getValue().length, 0);
});

loggerSuite.add("test debug tag formatted log message", assert => {
  const { appender } = beforeStart();
  const levelFormatter = _ => lvl => msg => `[${lvl}] ${msg}`;
  setMessageFormatter(levelFormatter);
  setLoggingLevel(LOG_DEBUG);
  const debug = debugLogger("ch.fhnw.test");

  const result = debug(logMessage);
  assert.is(result, T);
  assert.is(appender.getValue()[0], `[DEBUG] ${logMessage}`);
  setMessageFormatter(_c => _l => id);
});

loggerSuite.add("test context tag formatted log message", assert => {
  const { appender } = beforeStart();
  const levelFormatter = ctx => _ => msg => `${ctx}: ${msg}`;
  setMessageFormatter(levelFormatter);
  setLoggingLevel(LOG_DEBUG);
  const context = "ch.fhnw.test";
  const debug = debugLogger("ch.fhnw.test");

  const result = debug(logMessage);
  assert.is(result, T);
  assert.is(appender.getValue()[0], `${context}: ${logMessage}`);
  setMessageFormatter(_c => _l => id);
});

loggerSuite.add("test context, logger should not log", assert => {
  const { appender } = beforeStart();
  setLoggingLevel(LOG_DEBUG);
  setLoggingContext("ch.fhnw.test");
  const debug = debugLogger("ch.fhnw");

  const result = debug(logMessage);
  assert.is(result, F);
  assert.is(appender.getValue().length, 0);
});

loggerSuite.add("test context, logger should log", assert => {
  const { appender } = beforeStart();
  setLoggingLevel(LOG_DEBUG);
  const debug = debugLogger("ch.fhnw.test.specific.tag");

  const result = debug(logMessage);
  assert.is(result, T);
  assert.is(appender.getValue()[0], logMessage);
});

loggerSuite.add("test lazy evaluation, logger should log", assert => {
  const { appender } = beforeStart();

  setLoggingLevel(LOG_DEBUG);
  const debug = debugLogger("ch.fhnw.test");

  const result = debug( _=> logMessage);
  assert.is(result, T);
  assert.is(appender.getValue()[0], logMessage);
});

loggerSuite.add("test lazy evaluation, error in lazy eval", assert => {
  const { appender } = beforeStart();

  setLoggingLevel(LOG_DEBUG);
  const debug = debugLogger("ch.fhnw.test");

  const result = debug( _=> {
    throw new Error("error in lazy eval");
  });
  assert.is(result, F);
  assert.is(appender.getValue()[0], `Error: cannot evaluate log message!`);
});

loggerSuite.add("test error in message formatting code", assert => {
  const { appender } = beforeStart();
  const badFormatter = ctx => lvl => msg => { throw new Error("error in message formatting code");};
  const oldFormatter = messageFormatter;
  setMessageFormatter(badFormatter);

  setLoggingLevel(LOG_DEBUG);
  const debug = debugLogger("ch.fhnw.test");
  const result = debug( logMessage);
  assert.is(result, F);
  assert.is(appender.getValue()[0], "Error: cannot format log message!");

  setMessageFormatter(oldFormatter);
});

loggerSuite.add("test lazy evaluation, logger should not log and function should not be evaluated", assert => {
  const { appender } = beforeStart();

  setLoggingLevel(LOG_NOTHING);
  const debug = debugLogger("ch.fhnw.test");

  const result = debug( _=> logMessage);
  assert.is(result, F);
  assert.is(appender.getValue().length, 0);
});

loggerSuite.add("test log to multiple appender", assert => {
  const { appender }      = beforeStart();
  const countAppender     = CountAppender();
  addToAppenderList(countAppender);

  const debug = debugLogger("ch.fhnw.test");

  const result = debug(logMessage);
  assert.is(result, T);
  assert.is(appender.getValue()[0], logMessage);
  assert.is(countAppender.getValue().debug, 1);
  countAppender.reset();
  removeFromAppenderList(countAppender);
});

loggerSuite.add("test change appender after creating the logger", assert => {
  const { appender }      = beforeStart();
  const countAppender     = CountAppender();

  const debug = debugLogger("ch.fhnw.test");
  let result = debug(logMessage);
  assert.is(result, T);
  assert.is(appender.getValue()[0], logMessage);
  assert.is(countAppender.getValue().debug, 0);

  // add a new appender to the appender list after creating the logger
  addToAppenderList(countAppender);
  result = debug(logMessage);
  assert.is(result, T);
  assert.is(appender.getValue()[1], logMessage);
  assert.is(countAppender.getValue().debug, 1);

  countAppender.reset();
  removeFromAppenderList(countAppender);
});

loggerSuite.run();

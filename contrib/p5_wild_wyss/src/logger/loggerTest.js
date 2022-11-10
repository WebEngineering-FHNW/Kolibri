import { TestSuite }                  from "../../../../docs/src/kolibri/util/test.js";
import { convertToJsBool, id, lazy }  from "./lamdaCalculus.js";
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

setGlobalContext("ch.fhnw.test");

const beforeStart = () => {
  const logMessage  = 'hello world';
  const appender    = Appender();
  appender.reset();
  setGlobalContext("ch.fhnw.test");
  setLoggingLevel(LOG_DEBUG);
  const getActiveAppender = () => [appender]
  return { logMessage, getActiveAppender, appender }
};

const loggerSuite = TestSuite("Logger");

loggerSuite.add("test simple logging", assert => {
  const { logMessage, getActiveAppender, appender } = beforeStart();
  setLoggingLevel(LOG_DEBUG);
  const debug = debugLogger(getActiveAppender)("ch.fhnw.test")(_ => _ => id);
  const result = debug(logMessage);

  assert.isTrue(convertToJsBool(result));
  assert.is(appender.getValue()[0], 'hello world');
});

loggerSuite.add("test enabling logging", assert => {
  const { logMessage, getActiveAppender, appender } = beforeStart();
  setLoggingLevel(LOG_NOTHING);
  const debug = debugLogger(getActiveAppender)("ch.fhnw.test")(_ => _ => id);

  // logging should be disabled
  const result1 = debug(logMessage);
  assert.is(appender.getValue().length, 0);
  assert.isTrue(!convertToJsBool(result1));

  // logging should be enabled
  setLoggingLevel(LOG_DEBUG);
  const result2 = debug(logMessage);
  assert.isTrue(convertToJsBool(result2));
  assert.is(appender.getValue()[0], logMessage);
});

loggerSuite.add("test disabling logging", assert => {
  const {logMessage, appender, getActiveAppender} = beforeStart();
  setLoggingLevel(LOG_DEBUG);
  const debug = debugLogger(getActiveAppender)("ch.fhnw.test")(_ => _ => id);

  // logging should be enabled
  const result1 = debug(logMessage);
  assert.is(appender.getValue()[0], logMessage);
  assert.isTrue(convertToJsBool(result1));

  // logging should be disabled
  setLoggingLevel(LOG_NOTHING);
  appender.reset();
  const result2 = debug(logMessage);
  assert.isTrue(!convertToJsBool(result2));
  assert.is(appender.getValue().length, 0);
});

loggerSuite.add("log lower logging level, should log", assert => {
  const { logMessage, appender, getActiveAppender } = beforeStart();

  setLoggingLevel(LOG_TRACE);
  const debug = debugLogger(getActiveAppender)("ch.fhnw.test")(_ => _ => id);

  // loglevel debug should also be logged, when LOG_TRACE is enabled
  const result = debug(logMessage);
  assert.isTrue(convertToJsBool(result));
  assert.is(appender.getValue()[0], logMessage);
});

loggerSuite.add("log higher logging level, should not log", assert => {
  const { logMessage, appender, getActiveAppender } = beforeStart();

  setLoggingLevel(LOG_WARN);
  const debug = debugLogger(getActiveAppender)("ch.fhnw.test")(_ => _ => id);

  // loglevel debug should not log when LOG_WARN is enabled
  const result = debug(logMessage);
  assert.isTrue(!convertToJsBool(result));
  assert.is(appender.getValue().length, 0);
});

loggerSuite.add("test debug tag formatted log message", assert => {
  const { logMessage, appender, getActiveAppender } = beforeStart();
  const levelFormatter = _ => lvl => msg => `[${lvl}] ${msg}`;

  setLoggingLevel(LOG_DEBUG);
  const debug = debugLogger(getActiveAppender)("ch.fhnw.test")(levelFormatter);

  const result = debug(logMessage);
  assert.isTrue(convertToJsBool(result));
  assert.is(appender.getValue()[0], "[DEBUG] hello world");
});

loggerSuite.add("test context tag formatted log message", assert => {
  const { logMessage, appender, getActiveAppender } = beforeStart();
  const levelFormatter = ctx => _ => msg => `${ctx}: ${msg}`;
  setLoggingLevel(LOG_DEBUG);
  const context = "ch.fhnw.test";
  const debug = debugLogger(getActiveAppender)("ch.fhnw.test")(levelFormatter);

  const result = debug(logMessage);
  assert.isTrue(convertToJsBool(result));
  assert.is(appender.getValue()[0], `${context}: hello world`);
});

loggerSuite.add("test context, logger should not log", assert => {
  const { logMessage, appender, getActiveAppender } = beforeStart();
  setLoggingLevel(LOG_DEBUG);
  setGlobalContext("ch.fhnw.test")
  const debug = debugLogger(getActiveAppender)("ch.fhnw")(_ => _ => id);

  const result = debug(logMessage);
  assert.isTrue(!convertToJsBool(result));
  assert.is(appender.getValue().length, 0);
});

loggerSuite.add("test context, logger should log", assert => {
  const {logMessage, appender, getActiveAppender} = beforeStart();
  setLoggingLevel(LOG_DEBUG);
  const debug = debugLogger(getActiveAppender)("ch.fhnw.test.specific.tag")(_ => _2 => id);

  const result = debug(logMessage);
  assert.isTrue(convertToJsBool(result));
  assert.is(appender.getValue()[0], 'hello world');
});

loggerSuite.add("test lazy evaluation, logger should log", assert => {
  const { appender, getActiveAppender} = beforeStart();

  setLoggingLevel(LOG_DEBUG);
  const debug = debugLogger(getActiveAppender)("ch.fhnw.test")(() => () => id);

  const result = debug(lazy("hello world"));
  assert.isTrue(convertToJsBool(result));
  assert.is(appender.getValue()[0], 'hello world');
});

loggerSuite.add("test lazy evaluation, logger should not log and function should not be evaluated", assert => {
  const { appender, getActiveAppender} = beforeStart();

  setLoggingLevel(LOG_NOTHING);
  const debug = debugLogger(getActiveAppender)("ch.fhnw.test")(_ => _ => id);

  const result = debug(lazy("hello world"));
  assert.isTrue(!convertToJsBool(result));
  assert.is(appender.getValue().length, 0);
});

loggerSuite.add("test log to multiple appender", assert => {
  const { appender } = beforeStart();
  const countAppender = CountAppender();
  const getActiveAppender = () => [appender, countAppender];

  const debug = debugLogger(getActiveAppender)("ch.fhnw.test")(_ => _ => id);

  const result = debug("Tobias Wyss");
  assert.isTrue(convertToJsBool(result));
  assert.is(appender.getValue().length, 1);
  assert.is(countAppender.getValue().debug, 1);
});

loggerSuite.run();

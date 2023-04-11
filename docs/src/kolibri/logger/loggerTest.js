import {TestSuite}                  from "../util/test.js";
import {Appender as ArrayAppender } from "./appender/arrayAppender.js";
import {Appender as CountAppender } from "./appender/countAppender.js";
import {
  debugLogger,
}                                  from "./logger.js";
import {
  LOG_DEBUG,
  LOG_NOTHING,
  LOG_TRACE,
  LOG_WARN,
}                                  from "./logLevel.js";

import {
  addToAppenderList,
  removeFromAppenderList,
  setLoggingContext,
  setLoggingLevel,
  setMessageFormatter,
  getMessageFormatter,
  getLoggingLevel,
  getLoggingContext,
} from "./logging.js";

const logMessage  = "log message from loggerTest.js";

/*
This might also be useful as a general way of resetting the log config after use.
 */
const withDebugTestArrayAppender = codeUnderTest => {
  const level     = getLoggingLevel();
  const context   = getLoggingContext();
  const formatter = getMessageFormatter();
  const appender  = ArrayAppender();
  try {
    appender.reset();
    setLoggingContext("ch.fhnw.test");
    setLoggingLevel(LOG_DEBUG);
    addToAppenderList(appender);
    codeUnderTest(appender);
  } catch (e) {
    console.error(e, "logging test failed!");
  } finally {
    setLoggingLevel(level);
    setLoggingContext(context);
    setMessageFormatter(formatter);
    removeFromAppenderList(appender);
  }
};

const loggerSuite = TestSuite("Logger");

loggerSuite.add("simple logging", assert =>
    withDebugTestArrayAppender(appender => {
      const debug  = debugLogger("ch.fhnw.test");
      const result = debug(logMessage);

      assert.is(result, true);
      assert.is(appender.getValue()[0], logMessage);
    }));

loggerSuite.add("disabling logging", assert =>
    withDebugTestArrayAppender(appender => {
      setLoggingLevel(LOG_NOTHING);
      const debug = debugLogger("ch.fhnw.test");

      // logging should be disabled
      const result1 = debug(logMessage);
      assert.is(appender.getValue().length, 0);
      assert.is(result1, false);

      // logging should be enabled
      setLoggingLevel(LOG_DEBUG);
      const result2 = debug(logMessage);
      assert.is(result2, true);
      assert.is(appender.getValue()[0], logMessage);
    }));

loggerSuite.add("test disabling logging", assert =>
    withDebugTestArrayAppender(appender => {
      setLoggingLevel(LOG_DEBUG);
      const debug = debugLogger("ch.fhnw.test");

      // logging should be enabled
      const result1 = debug(logMessage);
      assert.is(appender.getValue()[0], logMessage);
      assert.is(result1, true);

      // logging should be disabled
      setLoggingLevel(LOG_NOTHING);
      appender.reset();
      const result2 = debug(logMessage);
      assert.is(result2, false);
      assert.is(appender.getValue().length, 0);
    }));

loggerSuite.add("log lower logging level, should log", assert =>
    withDebugTestArrayAppender(appender => {
      setLoggingLevel(LOG_TRACE);
      const debug = debugLogger("ch.fhnw.test");

      // loglevel debug should also be logged, when LOG_TRACE is enabled
      const result = debug(logMessage);
      assert.is(result, true);
      assert.is(appender.getValue()[0], logMessage);
    }));

loggerSuite.add("log higher logging level, should not log", assert =>
    withDebugTestArrayAppender(appender => {
      setLoggingLevel(LOG_WARN);
      const debug = debugLogger("ch.fhnw.test");

      // loglevel debug should not log when LOG_WARN is enabled
      const result = debug(logMessage);
      assert.is(result, false);
      assert.is(appender.getValue().length, 0);
    }));

loggerSuite.add("test debug tag formatted log message", assert =>
    withDebugTestArrayAppender(appender => {
      const levelFormatter = _ => lvl => msg => `[${lvl}] ${msg}`;
      setMessageFormatter(levelFormatter);
      setLoggingLevel(LOG_DEBUG);
      const debug = debugLogger("ch.fhnw.test");

      const result = debug(logMessage);
      assert.is(result, true);
      assert.is(appender.getValue()[0], `[DEBUG] ${logMessage}`);
    }));

loggerSuite.add("test context tag formatted log message", assert =>
    withDebugTestArrayAppender(appender => {
      const levelFormatter = ctx => _ => msg => `${ctx}: ${msg}`;
      setMessageFormatter(levelFormatter);
      setLoggingLevel(LOG_DEBUG);
      const context = "ch.fhnw.test";
      const debug   = debugLogger("ch.fhnw.test");

      const result = debug(logMessage);
      assert.is(result, true);
      assert.is(appender.getValue()[0], `${context}: ${logMessage}`);
    }));

loggerSuite.add("test context, logger should not log", assert =>
    withDebugTestArrayAppender(appender => {
      setLoggingLevel(LOG_DEBUG);
      setLoggingContext("ch.fhnw.test");
      const debug = debugLogger("ch.fhnw");

      const result = debug(logMessage);
      assert.is(result, false);
      assert.is(appender.getValue().length, 0);
    }));

loggerSuite.add("test context, logger should log", assert =>
    withDebugTestArrayAppender(appender => {
      setLoggingLevel(LOG_DEBUG);
      const debug = debugLogger("ch.fhnw.test.specific.tag");

      const result = debug(logMessage);
      assert.is(result, true);
      assert.is(appender.getValue()[0], logMessage);
    }));

loggerSuite.add("test lazy evaluation, logger should log", assert =>
    withDebugTestArrayAppender(appender => {
      setLoggingLevel(LOG_DEBUG);
      const debug = debugLogger("ch.fhnw.test");

      const result = debug(_ => logMessage);
      assert.is(result, true);
      assert.is(appender.getValue()[0], logMessage);
    }));

loggerSuite.add("test lazy evaluation, error in lazy eval", assert =>
    withDebugTestArrayAppender(appender => {
      setLoggingLevel(LOG_DEBUG);
      const debug = debugLogger("ch.fhnw.test");

      const result = debug(_ => {
        throw new Error("error in lazy eval");
      });
      assert.is(result, false);
      assert.is(appender.getValue()[0].startsWith(`Error: cannot evaluate log message`), true);
    }));

loggerSuite.add("test error in message formatting code", assert =>
    withDebugTestArrayAppender(appender => {
      const badFormatter = _ctx => _lvl => _msg => {
        throw new Error("error in message formatting code");
      };
      setMessageFormatter(badFormatter);

      setLoggingLevel(LOG_DEBUG);
      const debug  = debugLogger("ch.fhnw.test");
      const result = debug(logMessage);
      assert.is(result, false);
      assert.is(appender.getValue()[0].startsWith(`Error: cannot format log message`), true);

    }));

loggerSuite.add("test lazy evaluation, logger should not log and function should not be evaluated", assert =>
    withDebugTestArrayAppender(appender => {
      setLoggingLevel(LOG_NOTHING);
      const debug = debugLogger("ch.fhnw.test");

      const result = debug(_ => logMessage);
      assert.is(result, false);
      assert.is(appender.getValue().length, 0);
    }));

loggerSuite.add("test log to multiple appender", assert =>
    withDebugTestArrayAppender(appender => {
      const countAppender = CountAppender();
      addToAppenderList(countAppender);

      const debug = debugLogger("ch.fhnw.test");

      const result = debug(logMessage);
      assert.is(result, true);
      assert.is(appender.getValue()[0], logMessage);
      assert.is(countAppender.getValue().debug, 1);
      countAppender.reset();
      removeFromAppenderList(countAppender);
    }));

loggerSuite.add("test change appender after creating the logger", assert =>
    withDebugTestArrayAppender(appender => {
      const countAppender = CountAppender();

      const debug = debugLogger("ch.fhnw.test");
      let result  = debug(logMessage);
      assert.is(result, true);
      assert.is(appender.getValue()[0], logMessage);
      assert.is(countAppender.getValue().debug, 0);

      // add a new appender to the appender list after creating the logger
      addToAppenderList(countAppender);
      result = debug(logMessage);
      assert.is(result, true);
      assert.is(appender.getValue()[1], logMessage);
      assert.is(countAppender.getValue().debug, 1);

      countAppender.reset();
      removeFromAppenderList(countAppender);
    }));

loggerSuite.run();

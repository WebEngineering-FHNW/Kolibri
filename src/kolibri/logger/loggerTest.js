import { TestSuite, withAppender }                     from "../util/test.js";
import { ArrayAppender }                               from "./appender/arrayAppender.js";
import { CountAppender }                               from "./appender/countAppender.js";
import { LoggerFactory }                               from "./loggerFactory.js";
import { Just }                                        from "../stdlib.js";
import { debugLogger }                                 from "./logger.js";
import { LOG_DEBUG, LOG_NOTHING, LOG_TRACE, LOG_WARN } from "./logLevel.js";

import {
    addToAppenderList,
    getGlobalMessageFormatter,
    getLoggingContext,
    getLoggingLevel,
    removeFromAppenderList,
    setGlobalMessageFormatter,
    setLoggingContext,
    setLoggingLevel,
}                                 from "./logging.js";
import {LOG_CONTEXT_KOLIBRI_TEST} from "./logConstants.js";

export { withDebugTestArrayAppender }

const logMessage  = "log message from loggerTest.js";

/**
 * Test helper function that places the code under test into a
 * logging environment that allows to inspect whether that code
 * logs correctly. Restores the logging environment after use.
 * @type { (codeUnderTest: ConsumerType<void> ) => void }
 */
const withDebugTestArrayAppender = codeUnderTest => {
  const level     = getLoggingLevel();
  const context   = getLoggingContext();
  const formatter = getGlobalMessageFormatter();
  const appender  = ArrayAppender();
  try {
    appender.reset();
    setGlobalMessageFormatter(_ => _ => msg => msg);
    setLoggingContext(LOG_CONTEXT_KOLIBRI_TEST);
    setLoggingLevel(LOG_DEBUG);
    addToAppenderList(appender);
    codeUnderTest(appender);
  } catch (e) {
    console.error(e, "logging test failed!");
  } finally {
    setLoggingLevel(level);
    setLoggingContext(context);
    setGlobalMessageFormatter(formatter);
    removeFromAppenderList(appender);
  }
};

const loggerSuite = TestSuite("logger/Logger");

loggerSuite.add("simple logging", assert =>
    withDebugTestArrayAppender(appender => {
        const debug  = debugLogger(LOG_CONTEXT_KOLIBRI_TEST);
        const result = debug(logMessage);

        assert.is(result, true);
        assert.is(appender.getValue()[0], logMessage);
    }));

loggerSuite.add("disabling logging", assert =>
    withDebugTestArrayAppender(appender => {
        setLoggingLevel(LOG_NOTHING);
        const debug = debugLogger(LOG_CONTEXT_KOLIBRI_TEST);

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
        const debug = debugLogger(LOG_CONTEXT_KOLIBRI_TEST);

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
        const debug = debugLogger(LOG_CONTEXT_KOLIBRI_TEST);

        // loglevel debug should also be logged, when LOG_TRACE is enabled
        const result = debug(logMessage);
        assert.is(result, true);
        assert.is(appender.getValue()[0], logMessage);
    }));

loggerSuite.add("log higher logging level, should not log", assert =>
    withDebugTestArrayAppender(appender => {
        setLoggingLevel(LOG_WARN);
        const debug = debugLogger(LOG_CONTEXT_KOLIBRI_TEST);

        // loglevel debug should not log when LOG_WARN is enabled
        const result = debug(logMessage);
        assert.is(result, false);
        assert.is(appender.getValue().length, 0);
    }));
loggerSuite.add("test debug tag formatted log message", assert =>
    withDebugTestArrayAppender(appender => {
        const levelFormatter = _ => lvl => msg => `[${lvl}] ${msg}`;
        setGlobalMessageFormatter(levelFormatter);
        setLoggingLevel(LOG_DEBUG);
        const debug = debugLogger(LOG_CONTEXT_KOLIBRI_TEST);

        const result = debug(logMessage);
        assert.is(result, true);
        assert.is(appender.getValue()[0], `[DEBUG] ${logMessage}`);
    }));

loggerSuite.add("test context tag formatted log message", assert =>
    withDebugTestArrayAppender(appender => {
        const levelFormatter = ctx => _ => msg => `${ctx}: ${msg}`;
        setGlobalMessageFormatter(levelFormatter);
        setLoggingLevel(LOG_DEBUG);
        const context = LOG_CONTEXT_KOLIBRI_TEST;
        const debug   = debugLogger(LOG_CONTEXT_KOLIBRI_TEST);

        const result = debug(logMessage);
        assert.is(result, true);
        assert.is(appender.getValue()[0], `${context}: ${logMessage}`);
    }));

loggerSuite.add("test context, logger should not log", assert =>
    withDebugTestArrayAppender(appender => {
        setLoggingLevel(LOG_DEBUG);
        setLoggingContext(LOG_CONTEXT_KOLIBRI_TEST);
        const debug = debugLogger("ch.fhnw");

        const result = debug(logMessage);
        assert.is(result, false);
        assert.is(appender.getValue().length, 0);
    }));

loggerSuite.add("test context, logger should log", assert =>
    withDebugTestArrayAppender(appender => {
        setLoggingLevel(LOG_DEBUG);
        const debug = debugLogger(LOG_CONTEXT_KOLIBRI_TEST + ".specific.tag");

        const result = debug(logMessage);
        assert.is(result, true);
        assert.is(appender.getValue()[0], logMessage);
    }));

loggerSuite.add("test lazy evaluation, logger should log", assert =>
    withDebugTestArrayAppender(appender => {
        setLoggingLevel(LOG_DEBUG);
        const debug = debugLogger(LOG_CONTEXT_KOLIBRI_TEST);

        const result = debug(_ => logMessage);
        assert.is(result, true);
        assert.is(appender.getValue()[0], logMessage);
    }));

loggerSuite.add("test lazy evaluation, error in lazy eval", assert =>
    withDebugTestArrayAppender(appender => {
        setLoggingLevel(LOG_DEBUG);
        const debug = debugLogger(LOG_CONTEXT_KOLIBRI_TEST);

        const result = debug(_ => {
            throw new Error("error in lazy eval");
        });
        assert.is(result, false);
        assert.is(appender.getValue()[0].toString().startsWith(`Error: cannot evaluate log message`), true);
    }));

loggerSuite.add("test error in message formatting code", assert =>
    withDebugTestArrayAppender(appender => {
        const badFormatter = _ctx => _lvl => _msg => {
            throw new Error("error in message formatting code");
        };
        setGlobalMessageFormatter(badFormatter);

        setLoggingLevel(LOG_DEBUG);
        const debug  = debugLogger(LOG_CONTEXT_KOLIBRI_TEST);
        const result = debug(logMessage);
        assert.is(result, false);
        assert.is(appender.getValue()[0].startsWith(`Error: cannot format log message`), true);

    }));

loggerSuite.add("test lazy evaluation, logger should not log and function should not be evaluated", assert =>
    withDebugTestArrayAppender(appender => {
        setLoggingLevel(LOG_NOTHING);
        const debug = debugLogger(LOG_CONTEXT_KOLIBRI_TEST);

        const result = debug(_ => logMessage);
        assert.is(result, false);
        assert.is(appender.getValue().length, 0);
    }));

loggerSuite.add("test log to multiple appender", assert =>
    withDebugTestArrayAppender(appender => {
        const countAppender = CountAppender();
        addToAppenderList(countAppender);

        const debug = debugLogger(LOG_CONTEXT_KOLIBRI_TEST);

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

        const debug = debugLogger(LOG_CONTEXT_KOLIBRI_TEST);
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

loggerSuite.add("test common usage", assert =>
    withDebugTestArrayAppender(appender => {
        setLoggingLevel(LOG_NOTHING);             // we do not actually log but only show how to write the code

        const log = LoggerFactory("no.such.context");
        log.error("an error");

        assert.is(appender.getValue().length, 0);
    }));

loggerSuite.add("test with formatting Appender", assert => {
    const arrayAppender = ArrayAppender();
    const formattingFn  = _context => _lvl => msg => msg + " formatted";
    arrayAppender.setFormatter(Just(formattingFn));
    withAppender(arrayAppender, LOG_CONTEXT_KOLIBRI_TEST, LOG_DEBUG)(() => {
        const debug = debugLogger(LOG_CONTEXT_KOLIBRI_TEST);
        debug(logMessage);
        assert.is(arrayAppender.getValue()[0], logMessage + " formatted");
    });
});

loggerSuite.run();

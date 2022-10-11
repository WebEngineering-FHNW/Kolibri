import {TestSuite} from "../../../../docs/src/kolibri/util/test.js";
import {debugLogger, LOG_DEBUG, LOG_NOTHING, LOG_TRACE, LOG_WARN, setGlobalContext} from "./logger.js";
import {convertToJsBool, id, lazy, True} from "./lamdaCalculus.js";

setGlobalContext("ch.fhnw.test");

const beforeStart = () => {
  const logMessage = 'hello world';
  let realMsg = '';
  const write = msg => {
    realMsg = msg;
    return True;
  };
  const getRealMsg = () => realMsg;
  const resetRealMsg = () => realMsg = '';
  return {logMessage, getRealMsg, resetRealMsg, write  }
};

const loggerSuite = TestSuite("Logger");

loggerSuite.add("test simple logging", assert => {
  const {logMessage, getRealMsg, write} = beforeStart();
  const debug = debugLogger("ch.fhnw.test")(() => LOG_DEBUG)(write)(_ => id);
  const result = debug(logMessage);

  assert.isTrue(convertToJsBool(result));
  assert.is(getRealMsg(), 'hello world');
});

loggerSuite.add("test enabling logging", assert => {
  const {logMessage, getRealMsg, write} = beforeStart();
  let logLevel = LOG_NOTHING;
  const debug = debugLogger("ch.fhnw.test")(() => logLevel)(write)(_ => id);

  // logging should be disabled
  const result1 = debug(logMessage);
  assert.is(getRealMsg(), '');
  assert.isTrue(!convertToJsBool(result1));

  // logging should be enabled
  logLevel = LOG_DEBUG;
  const result2 = debug(logMessage);
  assert.isTrue(convertToJsBool(result2));
  assert.is(getRealMsg(), logMessage);
});

loggerSuite.add("test disabling logging", assert => {
  const {logMessage, getRealMsg, resetRealMsg, write} = beforeStart();
  let logLevel = LOG_DEBUG;

  const debug = debugLogger("ch.fhnw.test")(() => logLevel)(write)(_ => id);

  // logging should be enabled
  const result1 = debug(logMessage);
  assert.is(getRealMsg(), logMessage);
  assert.isTrue(convertToJsBool(result1));

  // logging should be disabled
  logLevel = LOG_NOTHING;
  resetRealMsg();
  const result2 = debug(logMessage);
  assert.isTrue(!convertToJsBool(result2));
  assert.is(getRealMsg(), '');
});

loggerSuite.add("log lower logging level, should log", assert => {
  const {logMessage, getRealMsg, write} = beforeStart();

  const logLevel = LOG_TRACE;
  const debug = debugLogger("ch.fhnw.test")(() => logLevel)(write)(_ => id);

  // loglevel debug should also be logged, when LOG_TRACE is enabled
  const result = debug(logMessage);
  assert.isTrue(convertToJsBool(result));
  assert.is(getRealMsg(), logMessage);
});

loggerSuite.add("log higher logging level, should not log", assert => {
  const {logMessage, getRealMsg, write} = beforeStart();
  const logLevel = LOG_WARN;
  const debug = debugLogger("ch.fhnw.test")(() => logLevel)(write)(_ => id);

  // loglevel debug should not log when LOG_WARN is enabled
  const result = debug(logMessage);
  assert.isTrue(!convertToJsBool(result));
  assert.is(getRealMsg(), '');
});

loggerSuite.add("test debug tag formatted log message", assert => {
  const {logMessage, getRealMsg, write} = beforeStart();
  const levelFormatter = lvl => msg => `[${lvl}] ${msg}`;
  const logLevel = LOG_DEBUG;

  const debug = debugLogger("ch.fhnw.test")(() => logLevel)(write)(levelFormatter);

  const result = debug(logMessage);
  assert.isTrue(convertToJsBool(result));
  assert.is(getRealMsg(), '[DEBUG] hello world');
});

loggerSuite.add("test context, logger should not log", assert => {
  const {logMessage, getRealMsg, write} = beforeStart();
  const logLevel = LOG_DEBUG;
  const debug = debugLogger("ch.fhnw")(() => logLevel)(write)(_ => id);

  const result = debug(logMessage);
  assert.isTrue(!convertToJsBool(result));
  assert.is(getRealMsg(), '');
});

loggerSuite.add("test context, logger should log", assert => {
  const {logMessage, getRealMsg, write} = beforeStart();
  const logLevel = LOG_DEBUG;
  const debug = debugLogger("ch.fhnw.test.specific.tag")(() => logLevel)(write)(_ => id);

  const result = debug(logMessage);
  assert.isTrue(convertToJsBool(result));
  assert.is(getRealMsg(), 'hello world');
});

loggerSuite.add("test lazy evaluation", assert => {
  const {logMessage, getRealMsg, write} = beforeStart();
  const logLevel = LOG_NOTHING;

  const debug = debugLogger("ch.fhnw.test")(() => logLevel)(write)(_ => id);

  const complexCalculation = () => 'Such a big workload';
  const result = debug(complexCalculation);

  assert.isTrue(convertToJsBool(result));
  assert.is(getRealMsg(), 'Such a big workload');



});


loggerSuite.run();

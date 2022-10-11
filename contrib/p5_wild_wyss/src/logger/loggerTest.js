import {TestSuite} from "../../../../docs/src/kolibri/util/test.js";
import {debugLogger, LOG_DEBUG, LOG_NOTHING, LOG_TRACE, LOG_WARN} from "./logger.js";
import {id, True} from "../../../p6_brodwolf_andermatt/src/lambda-calculus-library/lambda-calculus.js"

const formatter = _ => id;

const loggerSuite = TestSuite("Logger");
loggerSuite.add("test simple logging", assert => {
  let realMsg = '';
  const write = msg => {
    realMsg = msg;
    return True;
  };
  const logMessage = 'hello world';
  const debug = debugLogger(() => LOG_DEBUG)(write)(formatter);
  const result = debug(logMessage);

  assert.isTrue(convertToJsBool(result));
  assert.is(realMsg, 'hello world');
});

loggerSuite.add("test enabling logging", assert => {
  let logLevel = LOG_NOTHING;
  let realMsg = '';
  const logMessage = 'hello world';

  const write = msg => {
    realMsg = msg;
    return True;
  };
  const debug = debugLogger(() => logLevel)(write)(formatter);

  // logging should be disabled
  const result1 = debug(logMessage);
  assert.is(realMsg, '');
  assert.isTrue(!convertToJsBool(result1));

  // logging should be enabled
  logLevel = LOG_DEBUG;
  const result2 = debug(logMessage);
  assert.isTrue(convertToJsBool(result2));
  assert.is(realMsg, logMessage);
});

loggerSuite.add("test disabling logging", assert => {
  let logLevel = LOG_DEBUG;
  let realMsg = '';
  const logMessage = 'hello world';

  const write = msg => {
    realMsg = msg;
    return True;
  };

  const debug = debugLogger(() => logLevel)(write)(formatter);

  // logging should be enabled
  const result1 = debug(logMessage);
  assert.is(realMsg, logMessage);
  assert.isTrue(convertToJsBool(result1));


  // logging should be disabled
  logLevel = LOG_NOTHING;
  realMsg = '';
  const result2 = debug(logMessage);
  assert.isTrue(!convertToJsBool(result2));
  assert.is(realMsg, '');
});

loggerSuite.add("log lower logging level, should log", assert => {
  const logLevel = LOG_TRACE;
  let realMsg = '';
  const logMessage = 'hello world';

  const write = msg => {
    realMsg = msg;
    return True;
  };

  const debug = debugLogger(() => logLevel)(write)(formatter);

  // loglevel debug should also be logged, when LOG_TRACE is enabled
  const result = debug(logMessage);
  assert.isTrue(convertToJsBool(result));
  assert.is(realMsg, logMessage);
});

loggerSuite.add("log higher logging level, should not log", assert => {
  const logLevel = LOG_WARN;
  let realMsg = '';
  const logMessage = 'hello world';

  const write = msg => {
    realMsg = msg;
    return True;
  };

  const debug = debugLogger(() => logLevel)(write)(formatter);

  // loglevel debug should not log when LOG_WARN is enabled
  const result = debug(logMessage);
  assert.isTrue(!convertToJsBool(result));
  assert.is(realMsg, '');
});

const levelFormatter = lvl => msg => {
  return `[${lvl}] ${msg}`;
};

loggerSuite.add("test debug tag formatted log message", assert => {
  const logLevel = LOG_DEBUG;
  let realMsg = '';
  const logMessage = 'hello world';
  const write = msg => {
    realMsg = msg;
    return True;
  };
  const debug = debugLogger(() => logLevel)(write)(levelFormatter);

  const result = debug(logMessage);
  assert.isTrue(convertToJsBool(result));
  assert.is(realMsg, '[DEBUG] hello world');
});

loggerSuite.run();

import {TestSuite} from "../../../../docs/src/kolibri/util/test.js";
import {Logger, enableLogger, disableLogger} from "../../src/logger/logger.js";

const loggerSuite = TestSuite("Logger");

loggerSuite.add("test logger default state", assert => {
  let realMsg = '';
  const write = msg => realMsg = msg;
  const logMessage = 'hello world';
  const log = Logger(write);
  log(logMessage);
  assert.is(realMsg, '');
});

loggerSuite.add("test simple logging", assert => {
  let realMsg = '';
  const write = msg => realMsg = msg;
  const logMessage = 'hello world';
  const log = Logger(write);
  enableLogger();
  log(logMessage);
  assert.is(realMsg, logMessage);
});

loggerSuite.add("test enabling logging", assert => {
  disableLogger();
  let realMsg = '';
  const write = msg => {
    realMsg = msg;
  };

  const logMessage = 'hello world';
  const log = Logger(write);
  // logging should be disbaled
  log(logMessage);
  assert.is(realMsg, '');
  enableLogger();
  log(logMessage);
  assert.is(realMsg, logMessage);
});

loggerSuite.add("test disabling logging", assert => {
  disableLogger();
  let realMsg = '';
  const write = msg => {
    realMsg = msg;
  };
  const logMessage = 'hello world';
  const log = Logger(write);
  // logging should be disbaled
  log(logMessage);
  assert.is(realMsg, '');
});

loggerSuite.run();

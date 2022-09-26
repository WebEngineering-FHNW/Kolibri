import {TestSuite} from "../../../../docs/src/kolibri/util/test.js";
import {Logger} from "../../src/logger/logger.js";

const loggerSuite = TestSuite("Logger");

loggerSuite.add("test simple logging", assert => {
  let realMsg = '';
  const write = msg => realMsg = msg;
  const logMessage = 'hello world';
  const log = Logger(() => true)(write);
  log(logMessage);
  assert.is(realMsg, 'hello world');
});

loggerSuite.add("test enabling logging", assert => {
  let loggerEnabled = false;
  let realMsg = '';
  const logMessage = 'hello world';

  const write = msg => realMsg = msg;
  const log = Logger(() => loggerEnabled)(write);

  // logging should be disabled
  log(logMessage);
  assert.is(realMsg, '');

  // logging should be enabled
  loggerEnabled = true;
  log(logMessage);
  assert.is(realMsg, logMessage);
});

loggerSuite.add("test disabling logging", assert => {
  let loggerEnabled = true;
  let realMsg = '';
  const logMessage = 'hello world';

  const write = msg => realMsg = msg;
  const log = Logger(() => loggerEnabled)(write);

  // logging should be enabled
  log(logMessage);
  assert.is(realMsg, logMessage);

  // logging should be disabled
  loggerEnabled = false;
  realMsg = '';
  log(logMessage)(loggerEnabled);
  assert.is(realMsg, '');
});

loggerSuite.run();

import {TestSuite} from "../../../../../docs/src/kolibri/util/test.js";
import {debugLogger, LOG_DEBUG} from "../logger.js";
import {convertToJsBool, id} from "../lamdaCalculus.js";


const loggerSuite = TestSuite("LogUiController");

loggerSuite.add("test simple logging", assert => {
  assert.is(true, true);
});


loggerSuite.run();
import { TestSuite }           from "../../util/test.js";
import { LoggingUiController } from "./loggingUiController.js";
import {
  toString,
  LOG_INFO, LOG_DEBUG,
}                              from "../logLevel.js";
import {
  getLoggingContext,
  getLoggingLevel, setLoggingContext,
  setLoggingLevel,
} from "../logging.js";

const logUiControllerSuite = TestSuite("LogUiController");

logUiControllerSuite.add("test binding log level as text", assert => {

  const logUiController = LoggingUiController();
  const oldLoggingLevel = getLoggingLevel();
  assert.is(oldLoggingLevel, LOG_INFO);
  assert.is(logUiController.loggingLevelController.getValue(), toString(oldLoggingLevel));

  logUiController.loggingLevelController.setValue(toString(LOG_DEBUG));
  assert.is(getLoggingLevel(), LOG_DEBUG);

  setLoggingLevel(oldLoggingLevel);
  assert.is(getLoggingLevel(), oldLoggingLevel);
  assert.is(logUiController.loggingLevelController.getValue(), toString(oldLoggingLevel));
});

logUiControllerSuite.add("test binding log context as text", assert => {

  const logUiController   = LoggingUiController();
  const oldLoggingContext = getLoggingContext();
  assert.is(oldLoggingContext, "");
  assert.is(logUiController.loggingContextController.getValue(), oldLoggingContext);

  const newLoggingContext = oldLoggingContext + ".test";
  logUiController.loggingContextController.setValue(newLoggingContext);
  assert.is(getLoggingContext(), newLoggingContext);

  setLoggingContext(oldLoggingContext);
  assert.is(getLoggingContext(), oldLoggingContext);
  assert.is(logUiController.loggingContextController.getValue(), oldLoggingContext);
});

logUiControllerSuite.run();

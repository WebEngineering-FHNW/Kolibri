import { TestSuite }        from "../../util/test.js";
import { LogUiController }  from "./logUiController.js";
import {
  toString,
  LOG_INFO, LOG_DEBUG,
} from "../logLevel.js";
import {
  getLoggingLevel,
  setLoggingLevel,
} from "../logging.js";

const logUiControllerSuite = TestSuite("LogUiController");

logUiControllerSuite.add("test setting log level as text", assert => {

  const logUiController = LogUiController();
  const oldLoggingLevel = getLoggingLevel();
  assert.is(oldLoggingLevel, LOG_INFO);

  logUiController.loggingLevelController.setValue(toString(LOG_DEBUG));
  assert.is(getLoggingLevel(), LOG_DEBUG);

  setLoggingLevel(oldLoggingLevel);
});

logUiControllerSuite.run();

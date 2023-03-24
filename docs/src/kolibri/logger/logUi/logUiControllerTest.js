import { TestSuite }        from "../../util/test.js";
import { LogUiController }  from "./logUiController.js";
import {
  getLoggingLevel,
  setLoggingLevel,
  name,
  LOG_INFO, LOG_DEBUG,
} from "../logger.js";

const logUiControllerSuite = TestSuite("LogUiController");

logUiControllerSuite.add("test setting log level as text", assert => {

  const logUiController = LogUiController();
  const oldLoggingLevel = getLoggingLevel();
  assert.is(oldLoggingLevel, LOG_DEBUG);  // todo dk: adapt as soon as the default logging level is changed

  logUiController.loggingLevelController.setValue(LOG_INFO(name));
  assert.is(getLoggingLevel(), LOG_INFO);

  setLoggingLevel(oldLoggingLevel);
});

logUiControllerSuite.run();

import { snd }              from "../lamdaCalculus.js";
import { pop }              from "../../../../p6_brodwolf_andermatt/src/stack/stack.js";
import { Appender }         from "../appender/observableAppender.js";
import { TestSuite }        from "../../test/test.js";
import { LogUiModel }       from "./logUiModel.js";
import { LogUiController }  from "./logUiController.js";
import {
  getLoggingLevel,
  LOG_DEBUG,
  setLoggingLevel,
} from "../logger.js";

/**
 *
 * @return {
 *    {
 *      controller: LogUiControllerType,
 *      appender: AppenderType<IObservable<stack>>,
 *      model: LogUiModelType
 *    }
 *  }
 */
const beforeStart = () => {
  const controller = LogUiController();
  const appender = Appender();
  appender.reset(); // clear the state of the appender since it is a singleton
  return { controller, appender, model: LogUiModel() };
};

/**
 *
 * @param   { LogUiControllerType } controller
 * @return  { * }
 */
const cleanUp = controller => {
  setLoggingLevel(LOG_DEBUG);
  controller.resetLogMessages();
};

const logUiControllerSuite = TestSuite("LogUiController");

logUiControllerSuite.add("test flip log level", assert => {
  const { model, controller } = beforeStart();
  const levelsBeforeSwitch = model.getAvailableLogLevels();

  let levelsAfterSwitch = [];

  const activeLogLevelListener = levels => levelsAfterSwitch = levels;

  controller.onChangeActiveLogLevel(activeLogLevelListener);
  controller.flipLogLevel(levelsBeforeSwitch[0]);
  assert.isTrue(!levelsAfterSwitch[0](snd));
  controller.flipLogLevel(levelsBeforeSwitch[0]);
  assert.isTrue(levelsAfterSwitch[0](snd));

  cleanUp(controller);
});

logUiControllerSuite.add("test on new log message", assert => {
  const { controller, appender } = beforeStart();
  const logMessage = "Tobias Wyss";

  let message = "";
  const listener = stack => {
    message = pop(stack)(snd);
  };

  controller.onMessagesChange(listener);
  appender.debug(logMessage);
  assert.is(message(snd), logMessage);

  cleanUp(controller);
});

logUiControllerSuite.add("test filter message by text", assert => {
  const { controller, appender } = beforeStart();

  const logMessage1 = "Tobias Wyss";
  const logMessage2 = "Andri Wild";

  let message = "";
  const listener = stack => {
    // gets the top element from stack
    message = pop(stack)(snd);
  };

  controller.setTextFilter("Wyss");
  controller.onMessagesChange(listener);

  appender.debug(logMessage1);
  assert.is(message(snd), logMessage1);
  // following message should not be on top of stack, since it does not match the text filter
  appender.debug(logMessage2);
  assert.is(message(snd), logMessage1);

  // Both messages match the text filter, the 2nd message should be on top of the stack
  controller.setTextFilter("W");
  assert.is(message(snd), logMessage2);

  cleanUp(controller);
});

logUiControllerSuite.add("test filter message by log level", assert => {
  const { model, controller, appender } = beforeStart();

  const logMessage1 = "Tobias Wyss";
  const logMessage2 = "Andri Wild";

  let message = "";
  const listener = stack => {
    // gets the top element from stack
    message = pop(stack)(snd);
  };

  const debugLevel = model.getAvailableLogLevels()[1];
  controller.flipLogLevel(debugLevel);
  controller.onMessagesChange(listener);

  appender.warn (logMessage1);
  // following message should not be on top of stack, since it has been logged on debug,  which is deactivated
  appender.debug(logMessage2);
  assert.is(message(snd), logMessage1);
  controller.flipLogLevel(debugLevel);
  // Now debug level is enabled again, so the pos logged message should be on top of the stack
  assert.is(message(snd), logMessage2);

  cleanUp(controller);
});

logUiControllerSuite.add("test set global logging level by string", assert => {
  const { controller } = beforeStart();

  let loggingLevel = "DEBUG";
  controller.setLoggingLevelByString(loggingLevel);
  let currentLoggingLevel = getLoggingLevel();
  assert.is(loggingLevel, currentLoggingLevel(snd));

  loggingLevel = "ERROR";
  controller.setLoggingLevelByString(loggingLevel);
  currentLoggingLevel = getLoggingLevel();
  assert.is(loggingLevel, currentLoggingLevel(snd));

  cleanUp(controller);
});

logUiControllerSuite.run();
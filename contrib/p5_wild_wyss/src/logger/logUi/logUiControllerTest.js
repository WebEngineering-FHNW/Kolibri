import { TestSuite }        from "../../../../../docs/src/kolibri/util/test.js";
import { LogUiModel }       from "./logUiModel.js";
import { Appender }         from "../appender/observableAppender.js";
import { LogUiController }  from "./logUiController.js";
import { pop }              from "../../../../p6_brodwolf_andermatt/src/stack/stack.js";
import { snd }              from "../lamdaCalculus.js";

/**
 *
 * @return {{controller: LogUiControllerType, model: LogUiModelType, appender: AppenderType<IObservable<stack>>}}
 */
const beforeStart = () => {
  const appender = Appender();
  const model = LogUiModel(appender);
  const controller = LogUiController(model);
  return {model, controller, appender};
};

/**
 *
 * @param { LogUiControllerType } controller
 * @return {*}
 */
const cleanUp = controller => controller.resetLogMessages();

const loggerSuite = TestSuite("LogUiController");

loggerSuite.add("test flip log level", assert => {
  const {model, controller} = beforeStart();
  const levelsBeforeSwitch = model.getAvailableLogLevels();

  controller.flipLogLevel(levelsBeforeSwitch[0]);
  assert.is(levelsBeforeSwitch[0](snd), true);
  const levelsAfterSwitch = model.getAvailableLogLevels();
  assert.is(levelsAfterSwitch[0](snd), false);

  cleanUp(controller);
});

loggerSuite.add("test on new log message", assert => {

  const {controller, appender} = beforeStart();

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

loggerSuite.add("test filter message by text", assert => {

  const {controller, appender} = beforeStart();

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

loggerSuite.add("test filter message by log level", assert => {

  const {model, controller, appender} = beforeStart();

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
  // Now debug level is enabled again, so the last logged message should be on top of the stack
  assert.is(message(snd), logMessage2);

  cleanUp(controller);
});

loggerSuite.run();
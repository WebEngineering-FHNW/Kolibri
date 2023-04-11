import { Appender as CountAppender }            from "../appender/countAppender.js";
import { Appender as ObservableAppender }       from "../appender/observableAppender.js";
import {
  getLoggingLevel,
  setLoggingLevel,
  getLoggingContext,
  setLoggingContext,
  addToAppenderList
}                                               from "../logging.js";
import {toString, fromString}                   from "../logLevel.js";
import { SimpleInputController }                from "../../projector/simpleForm/simpleInputController.js";

export { LogUiController }
/**
 * @typedef LogUiControllerType
 * @property { SimpleInputControllerType<String> } loggingContextController
 * @property { SimpleInputControllerType<String> } loggingLevelController
 * @property { SimpleInputControllerType<String> } lastLogMessageController
 */

/**
 * Processes the actions from the user interface and manages the model.
 * It allows the view to bind against the model.
 * @return { LogUiControllerType }
 * @constructor
 * @impure It adds an observable appender to the list of appenders.
 */
const LogUiController = () => {

  const loggingContextController = SimpleInputController({
    value:  getLoggingContext(),
    label:  "Logging Context",
    name:   "loggingContext",
    type:   "text",
  });

  const loggingLevelController = SimpleInputController({
    value:  toString(getLoggingLevel()),
    label:  "Logging Level",
    name:   "loggingLevel",
    type:   "text", // well, it's a select, but we don't have a select controller yet
  });
  // when the string of the context changes, we need to update the global logging context
  loggingContextController.onValueChanged(contextStr => setLoggingContext(contextStr));

  const lastLogMessageController = SimpleInputController({
    value:  "no message, yet",
    label:  "Last Log Message",
    name:   "lastLogMessage",
    type:   "text",
  });
  const observableAppender = ObservableAppender
    ( CountAppender() )
    ( (level, msg) => lastLogMessageController.setValue(msg));

  addToAppenderList(observableAppender);

  const setLoggingLevelByString = levelStr => {
    fromString(levelStr)
      (msg   => { throw new Error(msg); })
      (level => setLoggingLevel(level));
  };
  // when the logging level string changes, we need to set the global logging level
  loggingLevelController.onValueChanged(setLoggingLevelByString);

  return {
    loggingContextController,
    loggingLevelController,
    lastLogMessageController,
  }
};


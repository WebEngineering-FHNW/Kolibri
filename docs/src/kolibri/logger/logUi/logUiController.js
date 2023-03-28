import { Appender as CountAppender }              from "../appender/countAppender.js";
import { Appender as ObservableAppender }                            from "../appender/observableAppender.js";
import {addToAppenderList, getLoggingContext, getLoggingLevel, name} from "../logger.js";
import {
  LOG_DEBUG,
  LOG_ERROR,
  LOG_FATAL,
  LOG_INFO, LOG_NOTHING,
  LOG_TRACE,
  LOG_WARN,
  setLoggingContext,
  setLoggingLevel
}                                                                    from "../logger.js";
import {SimpleInputController} from "../../projector/simpleForm/simpleInputController.js";

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
    value:  getLoggingLevel()(name),
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
    switch (levelStr) {
      case LOG_TRACE  (name):  setLoggingLevel(LOG_TRACE  ); break;
      case LOG_DEBUG  (name):  setLoggingLevel(LOG_DEBUG  ); break;
      case LOG_INFO   (name):  setLoggingLevel(LOG_INFO   ); break;
      case LOG_WARN   (name):  setLoggingLevel(LOG_WARN   ); break;
      case LOG_ERROR  (name):  setLoggingLevel(LOG_ERROR  ); break;
      case LOG_FATAL  (name):  setLoggingLevel(LOG_FATAL  ); break;
      case LOG_NOTHING(name):  setLoggingLevel(LOG_NOTHING); break;
      default: throw new Error(`Unknown logging level: ${levelStr}`);
    }
  };
  // when the logging level string changes, we need to set the global logging level
  loggingLevelController.onValueChanged(setLoggingLevelByString);

  return {
    loggingContextController,
    loggingLevelController,
    lastLogMessageController,
  }
};


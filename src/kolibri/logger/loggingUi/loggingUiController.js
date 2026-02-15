import { CountAppender }         from "../appender/countAppender.js";
import { ObservableAppender }    from "../appender/observableAppender.js";
import {
  getLoggingLevel,
  setLoggingLevel,
  onLoggingLevelChanged,
  getLoggingContext,
  setLoggingContext,
  onLoggingContextChanged,
  addToAppenderList, removeFromAppenderList
}                                from "../logging.js";
import { toString, fromString }  from "../logLevel.js";
import { SimpleInputController } from "../../projector/simpleForm/simpleInputController.js";

export {LoggingUiController};

/**
 * @typedef LoggingUiControllerType
 * @property { SimpleInputControllerType<String> } loggingContextController
 * @property { SimpleInputControllerType<String> } loggingLevelController
 * @property { SimpleInputControllerType<String> } lastLogMessageController
 * @property { () => void }                        cleanup - make sure no more log messages are processed
 */

/**
 * Processes the actions from the user interface and manages the model.
 * It allows the view to bind against the model.
 * @return { LoggingUiControllerType }
 * @constructor
 * @impure It adds an observable appender to the list of appenders.
 */
const LoggingUiController = () => {

    const setLoggingLevelByString = levelStr =>
        fromString(levelStr)
        (msg => {
            throw new Error(msg);
        })
        (level => setLoggingLevel(level));

    const loggingLevelController = SimpleInputController({
       value: toString(getLoggingLevel()),
       label: "Logging Level",
       name:  "loggingLevel",
       type:  "text", // we treat the logging level as a string in the presentation layer
    });
    // presentation binding: when the logging level string changes, we need to set the global logging level
    loggingLevelController.onValueChanged(setLoggingLevelByString);
    // domain binding: when the global logging level changes, we need to update the string of the logging level
    onLoggingLevelChanged(level => loggingLevelController.setValue(toString(level)));

    const loggingContextController = SimpleInputController({
       value: getLoggingContext(),
       label: "Logging Context",
       name:  "loggingContext",
       type:  "text",
    });
    // presentation binding: when the string of the context changes, we need to update the global logging context
    loggingContextController.onValueChanged(contextStr => setLoggingContext(contextStr));
    // domain binding: when the global logging context changes, we need to update the string of the logging context
    onLoggingContextChanged(context => loggingContextController.setValue(context));

    const lastLogMessageController = SimpleInputController({
       value: "no message, yet",
       label: "Last Log Message",
       name:  "lastLogMessage",
       type:  "text",
    });
    const observableAppender       = ObservableAppender
    (CountAppender())
    ((level, msg) => lastLogMessageController.setValue(msg));

    addToAppenderList(observableAppender);

    const cleanup = () => removeFromAppenderList(observableAppender);

    return {
        loggingLevelController,
        loggingContextController,
        lastLogMessageController,
        cleanup,
    };
};


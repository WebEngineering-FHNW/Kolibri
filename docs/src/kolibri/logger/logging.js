import { id }                         from "../lambda/church.js";
import { Observable, ObservableList } from "../observable.js";
import { LOG_INFO }                   from "./logLevel.js";

export {
  getLoggingLevel,
  setLoggingLevel,
  onLoggingLevelChanged,

  getLoggingContext,
  setLoggingContext,
  onLoggingContextChanged,

  getMessageFormatter,
  setMessageFormatter,
  onMessageFormatterChanged,

  getAppenderList,
  addToAppenderList,
  removeFromAppenderList,
  onAppenderAdded,
  onAppenderRemoved,
}

//                                                                -- logging level --

/**
 * This is a singleton state.
 * The currently active logging level.
 * Only messages from loggers whose have at least this log level are logged.
 * Default log level is {@link LOG_INFO}.
 * @type { IObservable<LogLevelType> }
 * @private
 */
const loggingLevelObs = Observable(LOG_INFO);

/**
 * This function can be used to set the logging level for the logging framework.
 * Only messages whose have at least the set log level are logged.
 * @param { LogLevelChoice } newLoggingLevel
 * @example
 * setLoggingLevel(LOG_DEBUG);
 */
const setLoggingLevel = loggingLevelObs.setValue;

/**
 * Getter for the loggingLevel.
 * @return { LogLevelType } - the currently active logging level
 */
const getLoggingLevel = loggingLevelObs.getValue;

/**
 * What to do when the logging level changes.
 * @impure
 * @type { (cb:ValueChangeCallback<LogLevelType>) => void }
 */
const onLoggingLevelChanged = loggingLevelObs.onChange;

//                                                                -- logging context --

/**
 * This is a singleton state.
 * The currently active logging context.
 * Only loggers whose context have this prefix are logged.
 * @type { IObservable<LogContextType> }
 * @private
 */
const loggingContextObs = Observable("");

/**
 * This function can be used to define a logging context for the logging framework.
 * Messages will only be logged, if the logger context is more specific than the logging context.
 * @param { LogContextType } newLoggingContext - the newly set context to log
 * @example
 * setLoggingContext("ch.fhnw");
 * // logging context is now set to "ch.fhnw"
 * // loggers with the context "ch.fhnw*" will be logged, all other messages will be ignored.
 */
const setLoggingContext = loggingContextObs.setValue;

// noinspection JSUnusedGlobalSymbols
/**
 * Getter for the logging context.
 * @return { LogContextType } - the current logging context
 */
const getLoggingContext = loggingContextObs.getValue;

/**
 * What to do when the logging context changes.
 * @impure
 * @type { (cb:ValueChangeCallback<LogContextType>) => void }
 */
const onLoggingContextChanged = loggingContextObs.onChange;

//                                                                -- logging message formatter --

/**
 * The formatting function used in this logging environment.
 * @type { IObservable<FormatLogMessage> }
 * @private
 */
const messageFormatterObs = Observable(_context => _logLevel => id);

/**
 * This function can be used to specify a custom function to format the log message.
 * When it is set, it will be applied to each log message before it gets logged.
 * @param { FormatLogMessage } formattingFunction
 * @example
 * const formatLogMsg = context => logLevel => logMessage => {
 *   const date = new Date().toISOString();
 *   return `[${logLevel}]\t${date} ${context}: ${logMessage}`;
 * }
 * setMessageFormatter(formatLogMsg);
 */
const setMessageFormatter = messageFormatterObs.setValue;

/**
 * Returns the current formatting function. Can be useful to store and reset after change.
 * @type { () => FormatLogMessage }
 */
const getMessageFormatter = messageFormatterObs.getValue;

/**
 * What to do when the log formatting function changes.
 * @impure
 * @type { (cb:ValueChangeCallback<FormatLogMessage>) => void }
 */
const onMessageFormatterChanged = messageFormatterObs.onChange;

//                                                                -- logging appender list --

/**
 * This is a singleton state.
 * @private
 * @type { Array<AppenderType> }
 */
const appenders = [];

/**
 * This is a singleton state.
 * The currently active {@link AppenderType AppenderType's}.
 * @type { IObservableList<AppenderType> }
 * @private
 */
const appenderListObs = ObservableList(appenders);

/**
 * @type { () => Array<AppenderType> }
 */
const getAppenderList = () => appenders;

/**
 * Adds one or multiple {@link AppenderType AppenderType's} to the appender list.
 * @param { ...AppenderType } newAppender
 */
const addToAppenderList = (...newAppender) => newAppender.forEach(app => appenderListObs.add(app));

/**
 * Removes a given {@link AppenderType} from the current appender list.
 * @impure
 * @param   { AppenderType } appender
 */
const removeFromAppenderList = appenderListObs.del;

/**
 * @impure
 * @type { (cb: ConsumerType<AppenderType>) => void }
 */
const onAppenderAdded   = appenderListObs.onAdd;

/**
 * @impure
 * @type { (cb: ConsumerType<AppenderType>) => void }
 */
const onAppenderRemoved = appenderListObs.onDel;


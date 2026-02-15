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

  getGlobalMessageFormatter,
  setGlobalMessageFormatter,
  onGlobalMessageFormatterChanged,

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
const loggingLevelObs = /** @type { IObservable<LogLevelType> } */ Observable(LOG_INFO);

/**
 * This function can be used to set the logging level for the logging framework.
 * Only messages whose have at least the set log level are logged.
 * @param { LogLevelType } newLoggingLevel
 * @example
 * setLoggingLevel(LOG_DEBUG);
 */
const setLoggingLevel  = loggingLevelObs.setValue;

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
 * @type { IObservable<LogMessageFormatterType> }
 * @private
 */
const globalMessageFormatterObs = Observable(_context => _logLevel => id);

/**
 * This function can be used to specify a global formatting function for log messages.
 * Appenders are free to use this global function (maybe as a default or as a fallback)
 * or to use their own, specific formatting functions.
 * @impure **Warning:** this is global mutable state and can have far-reaching effects on log formatting.
 * @param { LogMessageFormatterType } formattingFunction
 * @example
 * const formatLogMsg = context => logLevel => logMessage => {
 *   const date = new Date().toISOString();
 *   return `[${logLevel}]\t${date} ${context}: ${logMessage}`;
 * }
 * setGlobalMessageFormatter(formatLogMsg);
 */
const setGlobalMessageFormatter = globalMessageFormatterObs.setValue;

/**
 * Returns the currently used global formatting function.
 * @impure **Warning:** different values by come at different times.
 * @type { () => LogMessageFormatterType }
 */
const getGlobalMessageFormatter = globalMessageFormatterObs.getValue;

/**
 * What to do when the log formatting function changes.
 * @impure will typically change the side effects of logging.
 * @type { (cb:ValueChangeCallback<LogMessageFormatterType>) => void }
 */
const onGlobalMessageFormatterChanged = globalMessageFormatterObs.onChange;

//                                                                -- logging appender list --

/**
 * This is a singleton state.
 * @private
 * @type { Array<AppenderType> }
 */
const appenders = [];

/**
 * This is a singleton state.
 * The currently active {@link AppenderType}.
 * @type { IObservableList<AppenderType> }
 * @private
 */
const appenderListObs = ObservableList(appenders);

/**
 * @type { () => Array<AppenderType> }
 */
const getAppenderList = () => appenders;

/**
 * Adds one or multiple {@link AppenderType}s to the appender list.
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


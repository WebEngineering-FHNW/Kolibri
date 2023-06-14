import { Pair, snd, fst } from "../../../../docs/src/kolibri/stdlib.js"
import {
  id, n0, n1, n2, n3, n4, n5, n9,
  LazyIf, Else, Then, and, leq,
  False, True,
  toChurchBoolean,
} from "./lamdaCalculus.js";

import { removeItem } from "../../../../docs/src/kolibri/util/arrayFunctions.js";

export {
  LOG_TRACE,
  LOG_DEBUG,
  LOG_INFO,
  LOG_WARN,
  LOG_ERROR,
  LOG_FATAL,
  LOG_NOTHING,
  traceLogger,
  debugLogger,
  infoLogger,
  warnLogger,
  errorLogger,
  fatalLogger,
  setLoggingContext,
  getLoggingContext,
  setLoggingLevel,
  getLoggingLevel,
  addToAppenderList,
  removeFromAppenderList,
  getAppenderList,
  setMessageFormatter
}

/**
 * Yields a custom configured log function.
 * Processes all log-actions which have a {@link LogLevelType} equals or beneath
 * the {@link LogLevelType} returned by the function "loggingLevel".
 *
 * Furthermore, each log statement has a context. The log message will only be logged, if the loggingContext
 * (set with {@link setLoggingContext}) has the same prefix as the log message's context.
 *
 * The result of the callback function {@link FormatLogMessage} will be logged using the given {@link AppendCallback AppendCallback's}.
 *
 * What's the difference between loggerLevel vs loggingLevel:
 * loggerLevel is the level of the respective logger
 * loggingLevel is the level at which logging is currently taking place.
 *
 * @function
 * @pure if the {@link AppendCallback AppendCallback's} in the appender list and the parameter msgFormatter of type {@link FormatLogMessage} are pure.
 * @type    {
 *               (loggerLevel:      LogLevelType)
 *            => (loggerContext:    String)
 *            => (msg:              LogMeType)
 *            => churchBoolean
 *          }
 * @private
 * @example
 * const log = logger(LOG_DEBUG)("ch.fhnw");
 * log("Andri Wild");
 * // logs "Andri Wild" to console
 */
const logger = loggerLevel => loggerContext => msg =>
  LazyIf(
      messageShouldBeLogged(loggerLevel)(loggerContext)
  )
  (Then(() =>
        appenderList
            .map(appender => {
              const levelName = loggerLevel(snd);
              const levelCallback = appender[levelName.toLowerCase()];
              return levelCallback(formatMsg(loggerContext)(levelName)(evaluateMessage(msg)))
            })
            .reduce((acc, cur) => and(acc)(cur), True)) // every() for array of churchBooleans
  )
  (Else(() => False));

/**
 * Decides if a message fulfills the conditions to be logged.
 * @function
 * @type { (loggerLevel: LogLevelType) => (context: String) => churchBoolean }
 * @private
 */
const messageShouldBeLogged = loggerLevel => context =>
  and (logLevelActivated(loggerLevel))
      (contextActivated (context)    );

/**
 * Returns {@link True} if the first {@link LogLevelType} parameter is smaller than the second {@link LogLevelType} parameter.
 * @function
 * @type { (loggerLevel: LogLevelType) => churchBoolean }
 * @private
 */
const logLevelActivated = loggerLevel => leq(loggingLevel(fst))(loggerLevel(fst));

/**
 * Returns {@link True} if the {@link loggingContext} is a prefix of the given {@link String} parameter.
 * @function
 * @param   { String } context
 * @returns  { churchBoolean }
 * @private
 */
const contextActivated = context => toChurchBoolean(context.startsWith(loggingContext));

/**
 * if the param "msg" is a function, it's result will be returned.
 * Otherwise, the parameter itself will be returned.
 * @param   { !LogMeType} msg - the message to evaluate
 * @returns { String } the evaluated message
 * @private
 */
const evaluateMessage = msg => msg instanceof Function ? msg() : msg;

/**
 * The logging level "trace"
 * @returns { LogLevelType }
 */
const LOG_TRACE = Pair(n0)("TRACE");

/**
 * The logging level "debug"
 * @returns { LogLevelType }
 */
const LOG_DEBUG = Pair(n1)("DEBUG");

/**
 * The logging level "info"
 * @returns { LogLevelType }
 */
const LOG_INFO = Pair(n2)("INFO");

/**
 * The logging level "warn"
 * @returns { LogLevelType }
 */
const LOG_WARN = Pair(n3)("WARN");

/**
 * The logging level "error"
 * @returns { LogLevelType }
 */
const LOG_ERROR = Pair(n4)("ERROR");

/**
 * The logging level "fatal"
 * @returns { LogLevelType }
 */
const LOG_FATAL = Pair(n5)("FATAL");

/**
 * The logging level "nothing".
 * Disables the logging level completely.
 * @returns { LogLevelType }
 */
const LOG_NOTHING = Pair(n9)("NOTHING");

/**
 * Creates a new logger at log level {@link LOG_TRACE}.
 * @example
 * const trace = traceLogger("ch.fhnw")(_context => _level => id);
 * trace("a message to log to console");
 * // writes "a message to log to console" to the console
 */
const traceLogger =  logger(LOG_TRACE);

/**
 * Creates a new logger at log level {@link LOG_DEBUG}.
 * @example
 * const debug = debugLogger("ch.fhnw")(_context => _level => id);
 * debug("a message to log to console");
 * // writes "a message to log to console" to the console
 */
const debugLogger =  logger(LOG_DEBUG);

/**
 * Creates a new logger at log level {@link LOG_INFO}.
 * @example
 * const debug = infoLogger("ch.fhnw")(_context => _level => id);
 * debug("a message to log to console");
 * // writes "a message to log to console" to the console
 */
const infoLogger = logger(LOG_INFO);

/**
 * Creates a new logger at log level {@link LOG_WARN}.
 * @example
 * const warn = warnLogger("ch.fhnw")(_context => _level => id);
 * warn("a message to log to console");
 * // writes "a message to log to console" to the console
 */
const warnLogger = logger(LOG_WARN);

/**
 * Creates a new logger at log level {@link LOG_ERROR}.
 * @example
 * const error = errorLogger("ch.fhnw")(_context => _level => id);
 * error("a message to log to console");
 * // writes "a message to log to console" to the console
 */
const errorLogger = logger(LOG_ERROR);

/**
 * Creates a new logger at log level {@link LOG_FATAL}.
 * @example
 * const fatal = fatalLogger("ch.fhnw")(_context => _level => id);
 * fatal("a message to log to console");
 * // writes "a message to log to console" to the console
 */
const fatalLogger = logger(LOG_FATAL);

/**
 * This is a state.
 * The currently active {@link AppenderType AppenderType's}.
 * @type { AppenderType[] }
 */
const appenderList = [];

/**
 * Adds one or multiple {@link AppenderType AppenderType's} to the appender list.
 * @param newAppender
 */
const addToAppenderList = (...newAppender) => newAppender.forEach(app => appenderList.push(app));

/**
 * Removes a given {@link AppenderType} from the current appender list.
 *
 * @param   { AppenderType   } item
 * @returns { AppenderType[] }
 */
const removeFromAppenderList = item => {
  // correct type is not recognized here.
  return /** @type { AppenderType[] }*/ [...removeItem(appenderList)(item)];
};

/**
 * Returns a copy of the current appender list.
 * @return { AppenderType[] }
 */
const getAppenderList = () => [...appenderList];

/**
 * This is a state.
 * The currently activated logging context.
 * Only messages whose context have this prefix are logged.
 * @type { String }
 * @private
 */
let loggingContext = "";

/**
 * This function can be used to define a logging context for the logging framework.
 * Messages will only be logged, if the logger context is more specific than the logging context.
 * @param { String } context - the newly set context to log
 * @example
 * setLoggingContext("ch.fhnw");
 * // logging context is now set to "ch.fhnw"
 * // messages with the context "ch.fhnw*" will be logged, all other messages will be ignored.
 */
const setLoggingContext = context => loggingContext = context;

// noinspection JSUnusedGlobalSymbols
/**
 * Getter for the logging context.
 * @return { String } - the current logging context
 */
const getLoggingContext = () => loggingContext;

/**
 * This is a state.
 * The currently activated logging level.
 * Only messages whose have at least this log level are logged.
 * Default log level is {@link LOG_DEBUG}.
 * @type { LogLevelType }
 * @private
 */
let loggingLevel = LOG_DEBUG;

/**
 * This function can be used to set the logging level for the logging framework.
 * Only messages whose have at least the set log level are logged.
 * @param { LogLevelType } level
 * @example
 * setLoggingLevel(LOG_DEBUG);
 */
const setLoggingLevel = level => loggingLevel = level;

/**
 * Getter for the loggingLevel.
 * @return { LogLevelType } - the current logging level
 */
const getLoggingLevel = () => loggingLevel;

/**
 * The formatting function used in this logging environment.
 * @type { FormatLogMessage }
 */
let formatMsg = _context => _logLevel => id;

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
const setMessageFormatter = formattingFunction =>
  formatMsg = formattingFunction;
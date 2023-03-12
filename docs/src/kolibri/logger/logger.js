import { fst, Pair, snd, and, id, T, F, churchBool, LazyIf }  from "../lambda/church.js";
import { leq, n0, n1, n2, n3, n4, n5, n9, }                   from "../lambda/churchNumbers.js";

import {removeItem} from "../util/arrayFunctions.js";

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
 * Getter for the church numeral value of a log level.
 * @private
 */
const levelNum = fst;

/**
 * Getter for the name of a log level.
 * @private
 */
const name = snd;

/**
 * Yields a configured log function called "logger".
 * Processes all log actions, which have a {@link LogLevelType} equals or beneath
 * the {@link LogLevelType} returned by the function "loggingLevel".
 *
 * Furthermore, each log statement has a context, see {@link LogContextType}.
 * The log message will only be logged, if the loggingContext
 * (set with {@link setLoggingContext}) is a prefix of the logger context.
 *
 * The result of the callback function {@link FormatLogMessage}
 * will be logged using the given {@link AppendCallback AppendCallback's}.
 *
 * What's the difference between "logger" and "logging" and "log"?
 *
 * Every abstraction (level, context, etc.) that starts with "logger"
 * applies to the _use_ of the log facility in application code.
 *
 * Every abstraction (level, context, etc.) the starts with "logging"
 * applies to the current state or _configuration_ of the log facility that
 * determines which log statements should currently appear.
 *
 * The word "log" is used when the abstraction can be used for both, the logger and the logging
 *
 * @function
 * @pure if the {@link AppendCallback AppendCallback's} in the appender list and the parameter msgFormatter of type {@link FormatLogMessage} are pure.
 * @type    {
 *               (loggerLevel:      LogLevelChoice)
 *            => (loggerContext:    LogContextType)
 *            => (msg:              LogMeType)
 *            => ChurchBooleanType
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
  ( _=>
        appenderList
            .map(appender => {
              const  levelName     = loggerLevel(name);
              const  levelCallback = appender[levelName.toLowerCase()];
              return levelCallback(formatMsg(loggerContext)(levelName)(evaluateMessage(msg)))
            })
            .reduce((acc, cur) => and(acc)(cur), T) // every() for array of churchBooleans
  )
  ( _=> F);

/**
 * Decides if a logger fulfills the conditions to be logged.
 * @function
 * @type { (loggerLevel: LogLevelType) => (loggerContext: LogContextType) => ChurchBooleanType }
 * @private
 */
const messageShouldBeLogged = loggerLevel => loggerContext =>
  and (logLevelActivated(loggerLevel)   )
      (contextActivated (loggerContext) );

/**
 * Returns {@link T} if the current logging level is less than or equal to the logger level.
 * @function
 * @type { (loggerLevel: LogLevelChoice) => ChurchBooleanType }
 * @private
 */
const logLevelActivated = loggerLevel => leq (loggingLevel(levelNum)) (loggerLevel(levelNum));

/**
 * Returns {@link T} if the {@link loggingContext} is a prefix of the logger context.
 * @function
 * @param   { LogContextType } loggerContext
 * @return  { ChurchBooleanType }
 * @private
 */
const contextActivated = loggerContext => churchBool(loggerContext.startsWith(loggingContext));

/**
 * if the param "msg" is a function, it's result will be returned.
 * Otherwise, the parameter itself will be returned.
 * This allows for both eager and lazy log messages.
 * @param   { !LogMeType } msg - the message to evaluate
 * @returns { String } the evaluated message
 * @private
 */
const evaluateMessage = msg => msg instanceof Function ? msg() : msg;

/**
 * @typedef {PairType<ChurchNumberType, String>} LogLevelType
 */

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
 * @typedef { LOG_TRACE, LOG_DEBUG, LOG_INFO, LOG_WARN, LOG_ERROR, LOG_FATAL, LOG_NOTHING} LogLevelChoice
 */

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
 * @type { Array<AppenderType> }
 */
const appenderList = [];

/**
 * Adds one or multiple {@link AppenderType AppenderType's} to the appender list.
 * @param { ...AppenderType } newAppender
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
 * The currently active logging context.
 * Only loggers whose context have this prefix are logged.
 * @type { LogContextType }
 * @private
 */
let loggingContext = "";

/**
 * This function can be used to define a logging context for the logging framework.
 * Messages will only be logged, if the logger context is more specific than the logging context.
 * @param { LogContextType } newLoggingContext - the newly set context to log
 * @example
 * setLoggingContext("ch.fhnw");
 * // logging context is now set to "ch.fhnw"
 * // loggers with the context "ch.fhnw*" will be logged, all other messages will be ignored.
 */
const setLoggingContext = newLoggingContext => loggingContext = newLoggingContext;

// noinspection JSUnusedGlobalSymbols
/**
 * Getter for the logging context.
 * @return { LogContextType } - the current logging context
 */
const getLoggingContext = () => loggingContext;

/**
 * This is a state.
 * The currently active logging level.
 * Only messages from loggers whose have at least this log level are logged.
 * Default log level is {@link LOG_DEBUG}.
 * @type { LogLevelType }
 * @private
 */
let loggingLevel = LOG_DEBUG;

/**
 * This function can be used to set the logging level for the logging framework.
 * Only messages whose have at least the set log level are logged.
 * @param { LogLevelChoice } newLoggingLevel
 * @example
 * setLoggingLevel(LOG_DEBUG);
 */
const setLoggingLevel = newLoggingLevel => loggingLevel = newLoggingLevel;

/**
 * Getter for the loggingLevel.
 * @return { LogLevelChoice } - the currently active logging level
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

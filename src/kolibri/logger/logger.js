import {id}                                                                                 from "../lambda/church.js";
import {getAppenderList, getLoggingContext, getLoggingLevel, getGlobalMessageFormatter}     from "./logging.js";
import {contains, toString, LOG_DEBUG, LOG_ERROR, LOG_FATAL, LOG_INFO, LOG_TRACE, LOG_WARN} from "./logLevel.js";


export {
  traceLogger,
  debugLogger,
  infoLogger,
  warnLogger,
  errorLogger,
  fatalLogger,
}

/**
 * Yields a configured log function called "logger".
 * Processes all log actions, which have a {@link LogLevelType} equals or beneath
 * the {@link LogLevelType} returned by the function "loggingLevel".
 *
 * Furthermore, each log statement has a context, see {@link LogContextType}.
 * The log message will only be logged, if the loggingContext
 * (set with {@link setLoggingContext}) is a prefix of the logger context.
 *
 * The result of the callback function {@link LogMessageFormatterType}
 * will be logged using the given {@link AppendCallback}.
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
 * @pure if the {@link AppendCallback} in the appender list and the parameter msgFormatter of type {@link LogMessageFormatterType} are pure.
 * @type    {
 *               (loggerLevel:      LogLevelType)
 *            => (loggerContext:    LogContextType)
 *            => (msg:              LogMeType)
 *            => Boolean
 *          }
 * @private
 * @example
 * const log = logger(LOG_DEBUG)("ch.fhnw");
 * log("Andri Wild");
 * // logs "Andri Wild" to console
 */
const logger = loggerLevel => loggerContext => msg =>
  messageShouldBeLogged(loggerLevel)(loggerContext)
  ? getAppenderList()
      .map(appender => {
          const levelName      = toString(loggerLevel);
          const levelCallback  = appender[levelName.toLowerCase()];
          let success          = true;
          let evaluatedMessage = "Error: cannot evaluate log message: '" + msg + "'!";
          try {
              evaluatedMessage = evaluateMessage(msg);                                    // message eval can fail
          } catch (e) {
              success = false;
          }
          let formattedMessage = "Error: cannot format log message! '" + evaluatedMessage + "'!";
          try {
              const formatter = appender.getFormatter()       // Maybe<LogMessageFormatterType>
                   ( _ => getGlobalMessageFormatter() )       // use global formatter if no specific formatter is set
                   ( id );                                    // use appender-specific formatter if set
              formattedMessage = formatter (loggerContext) (levelName) (evaluatedMessage); // formatting can fail
          } catch (e) {
              success = false;
          }
          // because of evaluation order, a possible eval or formatting error message will be logged
          // at the current level, context, and appender and will thus be visible. See test case.
          return levelCallback(formattedMessage) && success;
      })
      .every(id) // all appenders must succeed
  : false ;

/**
 * Decides if a logger fulfills the conditions to be logged.
 * @type { (loggerLevel: LogLevelType) => (loggerContext: LogContextType) => Boolean }
 * @private
 */
const messageShouldBeLogged = loggerLevel => loggerContext =>
  logLevelActivated(loggerLevel) && contextActivated (loggerContext) ;

/**
 * Returns whether the loggerLevel will log under the current loggingLevel.
 * @type { (loggerLevel: LogLevelType) => Boolean }
 * @private
 */
const logLevelActivated = loggerLevel => contains(getLoggingLevel(), loggerLevel);

/**
 * Returns true if the {@link getLoggingContext} is a prefix of the logger context.
 * @type   { (loggerContext: LogContextType) => Boolean }
 * @private
 */
const contextActivated = loggerContext => loggerContext.startsWith(getLoggingContext());

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

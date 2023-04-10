import { and, T, F, churchBool, LazyIf }                          from "../lambda/church.js";
import { leq}                                       from "../lambda/churchNumbers.js";
import {getAppenderList, getLoggingContext, getLoggingLevel, getMessageFormatter} from "./logging.js";
import {levelNum, name, LOG_DEBUG, LOG_ERROR, LOG_FATAL, LOG_INFO, LOG_TRACE, LOG_WARN} from "./logLevel.js";


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
        getAppenderList()
            .map(appender => {
              const  levelName     = loggerLevel(name);
              const  levelCallback = appender[levelName.toLowerCase()]; // todo dk: why the appender by level name?
              let    success = T;
              let    evaluatedMessage = "Error: cannot evaluate log message!";
              try {
                evaluatedMessage = evaluateMessage(msg);                                    // message eval can fail
              } catch (e) {
                success = F;
              }
              let formattedMessage = "Error: cannot format log message!";
              try {
                  formattedMessage = getMessageFormatter()(loggerContext)(levelName)(evaluatedMessage); // formatting can fail
              } catch (e) {
                  success = F;
              }
              // because of eager evaluation, a possible eval or formatting error message will be logged
              // at the current level, context, and appender and will thus be visible. See test case.
              return and (success) (levelCallback(formattedMessage)) ;
            })
            .reduce((acc, cur) => and (acc) (cur), /** @type {ChurchBooleanType }*/ T) // every() for array of churchBooleans
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
const logLevelActivated = loggerLevel => leq (getLoggingLevel()(levelNum)) (loggerLevel(levelNum));

/**
 * Returns {@link T} if the {@link getLoggingContext} is a prefix of the logger context.
 * @function
 * @param   { LogContextType } loggerContext
 * @return  { ChurchBooleanType }
 * @private
 */
const contextActivated = loggerContext => churchBool(loggerContext.startsWith(getLoggingContext()));

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

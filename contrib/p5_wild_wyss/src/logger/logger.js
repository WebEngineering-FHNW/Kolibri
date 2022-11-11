import { Pair, snd, fst } from "../../../../docs/src/kolibri/stdlib.js"
import {
  n0, n1, n2, n3, n4, n5, n9,
  LazyIf, Else, Then, and, leq,
  False, True,
  toChurchBoolean,
} from "./lamdaCalculus.js";

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
  setGlobalContext,
  getGlobalContext,
  setLoggingLevel,
  getLoggingLevel,
}

/**
 * Yields a custom configured log function.
 * Processes all log-actions which have a {@link LogLevelType} equals or beneath
 * the {@link LogLevelType} returned by the function "loggingLevel".
 *
 * Furthermore, each log statement has a context. The log message will only be logged, if the globalContext
 * (set with {@link setGlobalContext}) has the same prefix as the log message's context.
 *
 * The result of the callback function {@link MsgFormatType} will be logged using the given {@link AppendCallback AppendCallbacks}.
 *
 * What's the difference between loggerLevel vs loggingLevel:
 * loggerLevel is the level of the respective logger
 * loggingLevel is the level at which logging is currently taking place.
 *
 * @function
 * @pure if the parameters "appender" of type {@link AppendCallback[]} and msgFormatter of type {@link MsgFormatType} are pure.
 * @type    {
 *               (loggerLevel:      LogLevelType)
 *            => (appendCallbacks:     AppendCallback[])
 *            => (context:          String)
 *            => (formatMsg:        MsgFormatType)
 *            => (msg:              LogMeType)
 *            => churchBoolean
 *          }
 * @private
 * @example
 * const log = logger(LOG_DEBUG)(() => [Appender()])("ch.fhnw")(_context => _level => id);
 * log("Andri Wild");
 * // logs "Andri Wild" to console
 */
const logger = loggerLevel => appendCallbacks => context => formatMsg => msg =>
LazyIf(
      messageShouldBeLogged(loggerLevel)(context)
    )
    (Then(() =>
      appendCallbacks
        .map(     append      => append(formatMsg(context)(loggerLevel(snd))(evaluateMessage(msg))))
        .reduce(  (acc, cur)  => and(acc)(cur), True))
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
 * Returns {@link True} if the {@link globalContext} is a prefix of the given {@link String} parameter.
 * @function
 * @param   { String } context
 * @return  { churchBoolean }
 * @private
 */
const contextActivated = context => toChurchBoolean(context.startsWith(globalContext));

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
 * const trace = traceLogger(() => [Appender()])("ch.fhnw")(_context => _level => id);
 * trace("a message to log to console");
 * // writes "a message to log to console" to the console
 */
const traceLogger = (activeAppenderCallback) =>
    logger(LOG_TRACE)(activeAppenderCallback().map(app => app.trace));

/**
 * Creates a new logger at log level {@link LOG_DEBUG}.
 * @example
 * const debug = debugLogger(() => [Appender()])("ch.fhnw")(_context => _level => id);
 * debug("a message to log to console");
 * // writes "a message to log to console" to the console
 */
const debugLogger = (activeAppenderCallback) =>
    logger(LOG_DEBUG)(activeAppenderCallback().map(app => app.debug));

/**
 * Creates a new logger at log level {@link LOG_INFO}.
 * @example
 * const debug = debugLogger(() => [Appender()])("ch.fhnw")(_context => _level => id);
 * debug("a message to log to console");
 * // writes "a message to log to console" to the console
 */
const infoLogger = (activeAppenderCallback) =>
    logger(LOG_INFO)(activeAppenderCallback().map(app => app.info));

/**
 * Creates a new logger at log level {@link LOG_WARN}.
 * @example
 * const warn = warnLogger(() => [Appender()])("ch.fhnw")(_context => _level => id);
 * warn("a message to log to console");
 * // writes "a message to log to console" to the console
 */
const warnLogger = (activeAppenderCallback) =>
    logger(LOG_WARN)(activeAppenderCallback().map(app => app.warn));

/**
 * Creates a new logger at log level {@link LOG_ERROR}.
 * @example
 * const error = errorLogger(() => [Appender()])("ch.fhnw")(_context => _level => id);
 * error("a message to log to console");
 * // writes "a message to log to console" to the console
 */
const errorLogger = (activeAppenderCallback) =>
    logger(LOG_ERROR)(activeAppenderCallback().map(app => app.error));

/**
 * Creates a new logger at log level {@link LOG_FATAL}.
 * @example
 * const fatal = fatalLogger(() => [Appender()])("ch.fhnw")(_context => _level => id);
 * fatal("a message to log to console");
 * // writes "a message to log to console" to the console
 */
const fatalLogger = (activeAppenderCallback) =>
    logger(LOG_FATAL)(activeAppenderCallback().map(app => app.fatal));

/**
 * This is a state.
 * The currently activated log context.
 * Only messages whose context have this prefix are logged.
 * @type { String }
 * @private
 */
let globalContext = "";

/**
 * This function can be used to define a global context for the logging framework.
 * Messages will only be logged, if the current context is more specific than the global context.
 * @param { String } context - the newly set context to log
 * @example
 * setGlobalContext("ch.fhnw");
 * // global logger context is now set to "ch.fhnw"
 * // messages with the context "ch.fhnw*" will be logged, all other messages will be ignored.
 */
const setGlobalContext = context => globalContext = context;

/**
 * Getter for the global Context.
 * @return { String } - the current global context
 */
const getGlobalContext = () => globalContext;

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
 * This function can be used to set the global logging level for the logging framework.
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
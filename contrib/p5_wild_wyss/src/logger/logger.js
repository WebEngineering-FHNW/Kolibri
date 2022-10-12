import {False, toChurchBoolean} from "./lamdaCalculus.js";
import {
  and,
  Else,
  fst,
  LazyIf,
  pair,
  snd,
  Then
} from "../../../p6_brodwolf_andermatt/src/lambda-calculus-library/lambda-calculus.js";
import {leq, n0, n9, succ} from "../../../p6_brodwolf_andermatt/src/lambda-calculus-library/church-numerals.js";

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
}

/**
 * This is a state.
 * The currently activated log context.
 * Only messages whose context have this prefix are logged.
 * @type {string}
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
 * Yields a custom configured log function.
 * Processes all log-actions which have a {@link LogLevelType} equals or beneath
 * the {@link LogLevelType} returned by the function "activeLogLevel".
 *
 * Furthermore, each log statement has a context. The log message will only be logged, if the globalContext
 * (set with {@link setGlobalContext}) has the same prefix as the log message's context.
 *
 * The result of the callback function {@link MsgFormatType} will be logged using the given {@link append}.
 *
 * @function
 * @pure if the parameters "callback" of type {@link append} and msgFormatter of type {@link MsgFormatType} are pure.
 * @type    { (LogLevelType) => (String) => (activeLogLevel) => (append) => (MsgFormatType) => (LogMeType) => churchBoolean }
 * @private
 * @example
 * const log = logger(LOG_DEBUG)("ch.fhnw")(() => LOG_DEBUG)(console.log)(_ => id);
 * log("Andri Wild");
 * // logs "Andri Wild" to console
 */
const logger = levelOfLogger => context => activeLogLevel => callback => msgFormatter => msg =>
  LazyIf(and(logLevelActivated(activeLogLevel)(levelOfLogger))(contextActivated(context)))
    (Then(() => callback(msgFormatter(levelOfLogger(snd))(msg instanceof Function ? msg() : msg))))
    (Else(() => False));

/**
 * Returns {@link True} if the first {@link LogLevelType} parameter is smaller than the second {@link LogLevelType} parameter.
 * @function
 * @type { (LogLevelType) => (LogLevelType) => churchBoolean}
 * @private
 */
const logLevelActivated = activeLogLevel => levelOfLogger => leq(activeLogLevel()(fst))(levelOfLogger(fst));

/**
 * Returns {@link True} if the {@link globalContext} is a prefix of the given {@link String} parameter.
 * @function
 * @param { String } context
 * @return { churchBoolean }
 * @private
 */
const contextActivated = context => toChurchBoolean(context.startsWith(globalContext));

/**
 * The logging level "trace"
 * @returns { LogLevelType }
 */
const LOG_TRACE = pair(n0)("TRACE");

/**
 * The logging level "debug"
 * @returns { LogLevelType }
 */
const LOG_DEBUG = pair(succ(LOG_TRACE(fst)))("DEBUG");

/**
 * The logging level "info"
 * @returns { LogLevelType }
 */
const LOG_INFO = pair(succ(LOG_DEBUG(fst)))("INFO");

/**
 * The logging level "warn"
 * @returns { LogLevelType }
 */
const LOG_WARN = pair(succ(LOG_INFO(fst)))("WARN");

/**
 * The logging level "error"
 * @returns { LogLevelType }
 */
const LOG_ERROR = pair(succ(LOG_WARN(fst)))("ERROR");

/**
 * The logging level "fatal"
 * @returns { LogLevelType }
 */
const LOG_FATAL = pair(succ(LOG_ERROR(fst)))("FATAL");

/**
 * The logging level "nothing".
 * Disables the logging level completely.
 * @returns { LogLevelType }
 */
const LOG_NOTHING = pair(n9)("");

/**
 * Creates a new logger at log level {@link LOG_TRACE}.
 * @example
 * const trace = traceLogger("ch.fhnw")(() => LOG_TRACE)(console.log)(_ => id);
 * trace("a message to log to console");
 * // writes "a message to log to console" to the console
 */
const traceLogger = logger(LOG_TRACE);

/**
 * Creates a new logger at log level {@link LOG_DEBUG}.
 * @example
 * const debug = debugLogger("ch.fhnw")(() => LOG_DEBUG)(console.log)(_ => id);
 * debug("a message to log to console");
 * // writes "a message to log to console" to the console
 */
const debugLogger = logger(LOG_DEBUG);

/**
 * Creates a new logger at log level {@link LOG_INFO}.
 * @example
 * const debug = debugLogger("ch.fhnw")(() => LOG_INFO)(console.log)(_ => id);
 * debug("a message to log to console");
 * // writes "a message to log to console" to the console
 */
const infoLogger = logger(LOG_INFO);

/**
 * Creates a new logger at log level {@link LOG_WARN}.
 * @example
 * const warn = warnLogger("ch.fhnw")(() => LOG_WARN)(console.log)(_ => id);
 * warn("a message to log to console");
 * // writes "a message to log to console" to the console
 */
const warnLogger = logger(LOG_WARN);

/**
 * Creates a new logger at log level {@link LOG_ERROR}.
 * @example
 * const error = errorLogger("ch.fhnw")(() => LOG_ERROR)(console.log)(_ => id);
 * error("a message to log to console");
 * // writes "a message to log to console" to the console
 */
const errorLogger = logger(LOG_ERROR);

/**
 * Creates a new logger at log level {@link LOG_FATAL}.
 * @example
 * const fatal = fatalLogger("ch.fhnw")(() => LOG_FATAL)(console.log)(_ => id);
 * fatal("a message to log to console");
 * // writes "a message to log to console" to the console
 */
const fatalLogger = logger(LOG_FATAL);

import {Pair, snd, fst} from "../../../../docs/src/kolibri/stdlib.js"
import {n0, n1, n2, n3, n4, n5, n9, LazyIf, Else, Then, and, False, toChurchBoolean, leq} from "./lamdaCalculus.js";

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
 * @pure if the parameters "append" of type {@link append} and msgFormatter of type {@link MsgFormatType} are pure.
 * @type    { (LogLevelType) => (String) => (activeLogLevel) => (append) => (MsgFormatType) => (LogMeType) => churchBoolean }
 * @private
 * @example
 * const log = logger(LOG_DEBUG)("ch.fhnw")(() => LOG_DEBUG)(console.log)(_ => id);
 * log("Andri Wild");
 * // logs "Andri Wild" to console
 */
const logger = levelOfLogger => context => activeLogLevel => append => formatMsg => msg =>
  LazyIf(
      messageShouldBeLogged(activeLogLevel)(levelOfLogger)(context)
    )
    (Then(() =>
      append(formatMsg(context)(levelOfLogger(snd))(evaluateMessage(msg))))
    )
    (Else(() => False));

/**
 * Decides if a message fulfills the conditions to be logged.
 * @function
 * @type { (LogLevelType) => (LogLevelType) => (String) => churchBoolean }
 * @private
 */
const messageShouldBeLogged = activeLogLevel =>levelOfLogger => context =>
  and
  (logLevelActivated(activeLogLevel)(levelOfLogger))
  (contextActivated(context));

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
 * if the param "msg" is a function, it's result will be returned.
 * Otherwise, the parameter itself will be returned.
 * @param { !LogMeType} msg - the message to evaluate
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
const LOG_NOTHING = Pair(n9)("");

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

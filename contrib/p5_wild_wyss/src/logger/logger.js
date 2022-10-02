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
  warnLogger,
  errorLogger,
  fatalLogger
}

import {
  Else,
  False,
  fst,
  LazyIf,
  pair,
  snd,
  Then,
} from "../../../p6_brodwolf_andermatt/src/lambda-calculus-library/lambda-calculus.js";
import {leq, n0, n9, succ} from "../../../p6_brodwolf_andermatt/src/lambda-calculus-library/church-numerals.js";

/**
 * @callback AppendType
 * @param { !String } message
 * @return { churchBoolean }
 */

/**
 * EXTERNAL CODE: sdtlib.js l-Nr.:121
 * A function that selects between two arguments that are given in curried style.
 * Only needed internally for the sake of proper JsDoc.
 * @template a
 * @template b
 * @callback pairSelector
 * @pure
 * @type     { (x:a) => (y:b) => (a|b)}
 */

/**
 * The logger function yields a custom configured log function.
 *
 * @template a
 * @template b
 * @template c
 * @template d
 * @template e
 * @haskell (a -> b -> c|d) -> (a -> b -> c|d) -> (c -> e) -> c -> e
 * @haskell (K|KI -> String|churchNumber) -> (K|KI -> String|churchNumber) -> (String -> churchBoolean) -> String -> churchBoolean
 * @pure if function callback is pure
 * @type    { (pairSelector ) => (pairSelector) => (AppendType) => (s:String) => void }
 * @example
 * const log = logger(msg => console.log(msg));
 * log("action")(true);
 */
const logger = levelOfLogger => activeLogLevel => callback => msg => {
  LazyIf(leq(activeLogLevel()(fst))(levelOfLogger(fst)))
  (Then(() => callback(levelOfLogger(snd) + ": " + msg)))
  (Else(() => False));
};

/**
 * A logging function that logs the given message.
 * @typedef logger
 * @param { !string } msg - the message to log
 * @returns { void }
 */

/**
 * Defines log levels
 * @typedef { (x:a) => (y:b) => (s:pairSelector) => (a|b) } LogLevel
 * */

/**
 * The logging level "trace"
 * @return { LogLevel }
 */

const LOG_TRACE = pair(n0)("TRACE");

/**
 * The logging level "debug"
 * @returns { LogLevel }
 */
const LOG_DEBUG = pair(succ(LOG_TRACE(fst)))("DEBUG");

/**
 * The logging level "info"
 * @returns { LogLevel }
 */
const LOG_INFO = pair(succ(LOG_DEBUG(fst)))("INFO");

/**
 * The logging level "warn"
 * @returns { LogLevel }
 */
const LOG_WARN = pair(succ(LOG_INFO(fst)))("WARN");

/**
 * The logging level "error"
 * @returns { LogLevel }
 */
const LOG_ERROR = pair(succ(LOG_WARN(fst)))("ERROR");

/**
 * The logging level "fatal"
 * @returns { LogLevel }
 */
const LOG_FATAL = pair(succ(LOG_ERROR(fst)))("FATAL");

/**
 * The logging level "nothing".
 * Disables the logging level completely.
 * @returns { LogLevel }
 */
const LOG_NOTHING = pair(n9)("");


/**
 * Creates a new logger at log level "LOG_TRACE"
 * @param {!((msg: string) => void)} loggingCallback - whenever a new message is logged, this function gets called
 * @returns { logger }
 * @example
 * const trace = traceLogger(console.log);
 * trace("a message to log to console");
 */
const traceLogger = logger(LOG_TRACE);

/**
 * Creates a new logger at log level "LOG_DEBUG"
 * @param {!((msg: string) => void)} loggingCallback - whenever a new message is logged, this function gets called
 * @returns { logger }
 * @example
 * const debug = debugLogger(console.log);
 * debug("a message to log to console");
 */
const debugLogger = logger(LOG_DEBUG);

/**
 * Creates a new logger at log level "LOG_WARN"
 * @param {!((msg: string) => void)} loggingCallback - whenever a new message is logged, this function gets called
 * @returns { logger }
 * @example
 * const warn = warnLogger(console.log);
 * warn("a message to log to console");
 */
const warnLogger = logger(LOG_WARN);

/**
 * Creates a new logger at log level "LOG_ERROR"
 * @param {!((msg: string) => void)} loggingCallback - whenever a new message is logged, this function gets called
 * @returns { logger }
 * @example
 * const error = errorLogger(console.log);
 * error("a message to log to console");
 */
const errorLogger = logger(LOG_ERROR);

/**
 * Creates a new logger at log level "LOG_FATAL"
 * @param {!((msg: string) => void)} loggingCallback - whenever a new message is logged, this function gets called
 * @returns { logger }
 * @example
 * const fatal = fatalLogger(console.log);
 * fatal("a message to log to console");
 */
const fatalLogger = logger(LOG_FATAL);



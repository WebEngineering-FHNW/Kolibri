export {
  LOG_TRACE,
  LOG_DEBUG,
  LOG_INFO,
  LOG_WARN,
  LOG_ERROR,
  LOG_FATAL,
  LOG_NOTHING,
  TraceLogger,
  DebugLogger,
  WarnLogger,
  ErrorLogger,
  FatalLogger
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
 * @template a
 * @template b
 * @callback levelOfLogger
 * @pure
 * @type     { (x:a) => (y:b) => (a|b)}
 */

/**
 * @template a
 * @template b
 * @callback activeLogLevel
 * @pure
 * @type     { (x:a) => (y:b) => (a|b)}
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
 * @template a
 * @template b
 * @callback levelSelector
 * @pure
 * @type     { (pairSelector) => (a|b)}
 */
/**
 * The Logger function yields a custom configured log function.
 *
 * @template a
 * @template b
 * @template c
 * @template d
 * @template e
 * @haskell (a -> b -> c|d) -> (a -> b -> c|d) -> (c -> e) -> c -> e
 * @haskell (K|KI -> String|churchNumber) -> (K|KI -> String|churchNumber) -> (String -> churchBoolean) -> String -> churchBoolean
 * @pure if function callback is pure
 * @type    { (levelSelector ) => (levelSelector) => (f:functionCtoE<c,e>) => (s:String) => e }
 * @example
 * const log = Logger(msg => console.log(msg));
 * log("action")(true);
 */
const Logger = levelOfLogger => activeLogLevel => callback => msg => {
  LazyIf(leq(activeLogLevel()(fst))(levelOfLogger(fst)))
  (Then(() => callback(levelOfLogger(snd) + ": " + msg)))
  (Else(() => False));
};

/**
 * A logging function that logs the given message.
 * @typedef Logger
 * @param { !string } msg - the message to log
 * @returns { void }
 */

/**
 * Defines log levels
 * @typedef  {pair(churchNumber)(String)} LogLevel
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
 * Creates a new Logger at log level "LOG_TRACE"
 * @param {!((msg: string) => void)} loggingCallback - whenever a new message is logged, this function gets called
 * @returns { Logger }
 * @example
 * const trace = TraceLogger(console.log);
 * trace("a message to log to console");
 */
const TraceLogger = Logger(LOG_TRACE);

/**
 * Creates a new Logger at log level "LOG_DEBUG"
 * @param {!((msg: string) => void)} loggingCallback - whenever a new message is logged, this function gets called
 * @returns { Logger }
 * @example
 * const debug = DebugLogger(console.log);
 * debug("a message to log to console");
 */
const DebugLogger = Logger(LOG_DEBUG);

/**
 * Creates a new Logger at log level "LOG_WARN"
 * @param {!((msg: string) => void)} loggingCallback - whenever a new message is logged, this function gets called
 * @returns { Logger }
 * @example
 * const warn = WarnLogger(console.log);
 * warn("a message to log to console");
 */
const WarnLogger = Logger(LOG_WARN);

/**
 * Creates a new Logger at log level "LOG_ERROR"
 * @param {!((msg: string) => void)} loggingCallback - whenever a new message is logged, this function gets called
 * @returns { Logger }
 * @example
 * const error = ErrorLogger(console.log);
 * error("a message to log to console");
 */
const ErrorLogger = Logger(LOG_ERROR);

/**
 * Creates a new Logger at log level "LOG_FATAL"
 * @param {!((msg: string) => void)} loggingCallback - whenever a new message is logged, this function gets called
 * @returns { Logger }
 * @example
 * const fatal = FatalLogger(console.log);
 * fatal("a message to log to console");
 */
const FatalLogger = Logger(LOG_FATAL);



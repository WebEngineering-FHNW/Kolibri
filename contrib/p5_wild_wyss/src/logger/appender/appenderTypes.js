/**
 * Provides log functions for a specific appender
 * @interface
 * @typedef AppenderType
 * @param { MsgFormatter } formatter - a function to format the log message before logging.
 * @property { LogType } trace
 * @property { LogType } debug
 * @property { LogType } info
 * @property { LogType } warn
 * @property { LogType } error
 * @property { LogType } fatal
 * @property { (LogLevel) => LogLevel } setActiveLogLevel
 */

/**
 * Logs the given message.
 * @typedef LogType
 * @param { String } message
 * @returns { churchBoolean }
 */

/**
 * @callback Consumer
 * @param String
 * @returns void
 *
 */
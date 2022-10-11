/**
 * Provides log functions for a specific appender
 * @interface
 * @typedef AppenderType
 * @property { LogType } trace
 * @property { LogType } debug
 * @property { LogType } info
 * @property { LogType } warn
 * @property { LogType } error
 * @property { LogType } fatal
 * @property { () => String } getValue
 */

/**
 * Logs the given message.
 * @typedef LogType
 * @param { LogMe } message
 * @returns { churchBoolean }
 */

/**
 * @callback Consumer
 * @param String
 * @returns void
 *
 */
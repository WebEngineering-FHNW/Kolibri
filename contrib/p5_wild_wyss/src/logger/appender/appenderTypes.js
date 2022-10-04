/**
 * @interface
 * @typedef AppenderType
 * @property { LogType } trace
 * @property { LogType } debug
 * @property { LogType } info
 * @property { LogType } warn
 * @property { LogType } error
 * @property { LogType } fatal
 * @property { (LogLevel) => LogLevel } setActiveLogLevel
 */


/**
 * @typedef LogType
 * @param { String } message
 * @returns { churchBoolean }
 */
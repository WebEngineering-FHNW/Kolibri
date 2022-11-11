/**
 * @typedef LogLevelFilterType
 * @type { (pairSelector) => LogLevelType | boolean }
 */

/**
 * @typedef LogUiModelType
 * @property { function(Consumer<>): void }   onChangeActiveLogLevel
 * @property { (LogLevelFilterType) => void } setActiveLogLevel
 * @property { () => [LogLevelFilterType] }   getAvailableLogLevels
 * @property { (Consumer) => void }           onTextFilterChange
 * @property { (String) => void }             setTextFilter
 * @property { () => String }                 getTextFilter
 * @property { (Consumer) => void }           onMessagesChange
 * @property { (Consumer) => void }           onNewLogMessage
 * @property { () => IObservable<stack> }     resetLogMessages
 * @property { (Consumer) => void }           filterAndNotify
 */

/**
 * @typedef LogUiControllerType
 * @property { function(Consumer<>): void }   onChangeActiveLogLevel
 * @property { (Consumer) => void }           onMessagesChange
 * @property { () => IObservable<stack> }     resetLogMessages
 * @property { (Consumer) => void }           onTextFilterChange
 * @property { (String) => void }             setTextFilter
 * @property { () => String }                 getTextFilter
 * @property { (String) => void }             setGlobalContext
 * @property { (String) => void }             setLoggingLevelByString
 * @property { (LogLevelFilterType) => void } flipLogLevel
 */

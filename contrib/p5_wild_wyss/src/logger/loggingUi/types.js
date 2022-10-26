/**
 * @typedef LogLevelFilterType
 * @type { (pairSelector) => LogLevelType | boolean }
 */

/**
 * @typedef LogUiModelType
 * @property { (Consumer) => void }           onChangeActiveLogLevel
 * @property { (LogLevelFilterType) => void } setActiveLogLevel
 * @property { () => [LogLevelFilterType] }   getAvailableLogLevels
 * @property { (Consumer) => void }           onTextFilterChange
 * @property { (String) => void }             setTextFilter
 * @property { () => String }                 getTextFilter
 * @property { (Consumer) => void }           onMessagesChange
 * @property { (Consumer) => void }           onNewLogMessage
 * @property { (Consumer) => void }           filterAndNotify
 */

/**
 * @typedef LogUiController
 * @property { (Consumer) => void }           onChangeActiveLogLevel
 * @property { (Consumer) => void }           onMessagesChange
 * @property { (Consumer) => void }           onTextFilterChange
 * @property { (String) => void }             setTextFilter
 * @property { (String) => void }             setGlobalContext
 * @property { (LogLevelFilterType) => void } flipLogLevel
 */

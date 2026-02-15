import { T }       from "../../lambda/church.js";
import { Nothing } from "../../lambda/maybe.js";

export {CountAppender};

/**
 * Provides an appender that logs to the console how many log messages have been issued on the various levels.
 * @returns { AppenderType<StatisticType> }
 * @constructor
 */
const CountAppender = () => {
    let formatter      = Nothing; // per default, we do not use a specific formatter.
    const getFormatter = () => formatter;
    const setFormatter = newFormatter => formatter = newFormatter;

    /**
     * @typedef { {warn: Number, trace: Number, debug: Number, error: Number, info: Number, fatal: Number} } StatisticType
     */

    /**
     * @type { StatisticType }
     */
    let statistic = {trace: 0, debug: 0, info: 0, warn: 0, error: 0, fatal: 0};

    /**
     * Resets the values of all level to zero.
     * @return { StatisticType }
     */
    const reset = () => {
        statistic = {trace: 0, debug: 0, info: 0, warn: 0, error: 0, fatal: 0};
        return statistic;
    };

    /**
     * Returns an object with summarized counter values.
     * @returns { StatisticType }
     */
    const getValue = () => statistic;

    /**
     * @type { (String) => (callback:ConsumerType<String>) => (String) => ChurchBooleanType }
     */
    const appenderCallback = type => callback => msg => {
        statistic[type] = statistic[type] + 1;
        callback(` (${statistic[type]}) ` + msg);
        return /** @type {ChurchBooleanType} */T;
    };

    /**
     * the function to append trace logs in this application
     * @type { AppendCallback }
     */
    const trace = appenderCallback("trace")(console.trace);

    /**
     * the function to append debug logs in this application
     * @type { AppendCallback }
     */
    const debug = appenderCallback("debug")(console.debug);

    /**
     * the function to append info logs in this application
     * @type { AppendCallback }
     */
    const info = appenderCallback("info")(console.info);

    /**
     * the function to append warn logs in this application
     * @type { AppendCallback }
     */
    const warn = appenderCallback("warn")(console.warn);

    /**
     * the function to append error logs in this application
     * @type { AppendCallback }
     */
    const error = appenderCallback("error")(console.error);

    /**
     * the function to append fatal logs in this application
     * @type { AppendCallback }
     */
    const fatal = appenderCallback("fatal")(console.error);

    return {
        trace,
        debug,
        info,
        warn,
        error,
        fatal,
        getValue,
        reset,
        getFormatter,
        setFormatter
    };
};


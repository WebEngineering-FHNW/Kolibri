/**
 * @module util/testUI-support
 * Helper to update the test UI report while the tests are running
 */
import {total, failed}                      from "./test.js";
import {versionInfo}                        from "../version.js";
import {LOG_CONTEXT_KOLIBRI_TEST}           from "../logger/logConstants.js";
import {setLoggingContext, setLoggingLevel} from "../logger/logging.js";
import {LOG_ERROR}                          from "../logger/logLevel.js";

// users might want to change this temporarily to see logs from the domain or a lower log level
setLoggingContext(LOG_CONTEXT_KOLIBRI_TEST);
setLoggingLevel(LOG_ERROR);

total.onChange( value => document.getElementById('grossTotal').textContent = "" + value + " tests done.");
failed.onChange( value => {
    const classes = document.getElementById('out').classList;
    value
        ? classes.add('failed')
        : classes.remove('failed');
});

document.querySelector("footer").textContent = "Built with Kolibri " + versionInfo;

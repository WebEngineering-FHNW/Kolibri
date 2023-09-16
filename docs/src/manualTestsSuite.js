/**
 * @module manualTestsSuite
 * These are tests that we don't want to run all the time but only occasionally because they
 * take extra time, clutter the console, or need manual inspection of the result.
 */
import { total }       from "./kolibri/util/test.js";
import { versionInfo } from "./kolibri/version.js";

import "./kolibri/sequence/performanceTest.js"     // time dependent
import "./kolibri/logger/appender/consoleAppenderTest.js"; // writes to console
import "./kolibri/logger/appender/countAppenderTest.js";   // writes to console
import "./kolibri/logger/loggingUi/loggingUiControllerTest.js"; // messen up the output when tests fail. keep last.

total.onChange( value => document.getElementById('grossTotal').textContent = "" + value + " tests done.");

document.querySelector("footer").textContent = "Built with Kolibri " + versionInfo;

import "../src/logger/loggerTest.js";
import "../src/logger/appender/arrayAppenderTest.js"
import "../src/logger/appender/countAppenderTest.js"
import "../src/logger/appender/consoleAppenderTest.js"
import "../src/logger/appender/observableAppenderTest.js"
import "../src/logger/logUi/logUiControllerTest.js"

import { total } from "../../../docs/src/kolibri/util/test.js";
import { versionInfo } from "../../../docs/src/kolibri/version.js";


total.onChange( value => document.getElementById('grossTotal').textContent = "" + value + " tests done.");

document.querySelector("footer").textContent = "Built with Kolibri " + versionInfo;

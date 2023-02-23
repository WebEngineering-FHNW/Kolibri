import { total } from "../../docs/src/kolibri/util/test.js";
import { versionInfo } from "../../docs/src/kolibri/version.js";

// logger
import "./src/logger/loggerTest.js";
import "./src/logger/appender/arrayAppenderTest.js"
import "./src/logger/appender/countAppenderTest.js"
import "./src/logger/appender/consoleAppenderTest.js"
import "./src/logger/appender/observableAppenderTest.js"
import "./src/logger/logUi/logUiControllerTest.js"

// iterator
import "./src/iterator/iteratorTest.js"

// range
import "./src/range/rangeTest.js"
import "./src/range/iteratorFunctionTest.js"

// focusring
import "./src/focusring/focusRingTest.js"


total.onChange( value => document.getElementById('grossTotal').textContent = "" + value + " tests done.");

document.querySelector("footer").textContent = "Built with Kolibri " + versionInfo;

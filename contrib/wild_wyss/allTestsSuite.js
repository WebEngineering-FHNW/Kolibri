import { total } from "./src/test/test.js";
import { versionInfo } from "../../docs/src/kolibri/version.js";

// logger
import "./src/logger/loggerTest.js";
import "./src/logger/appender/arrayAppenderTest.js";
import "./src/logger/appender/countAppenderTest.js";
import "./src/logger/appender/consoleAppenderTest.js";
import "./src/logger/appender/observableAppenderTest.js";
import "./src/logger/logUi/logUiControllerTest.js";

// sequence
import "./src/sequence/constructors/constructorTest.js";
import "./src/sequence/operators/operatorsTest.js";
import "./src/sequence/terminalOperations/terminalOperationsTest.js";
import "./src/sequence/sequenceBuilderTest.js";

// range
import "./src/range/rangeTest.js";

// focus ring
import "./src/focusring/focusRingTest.js";

// stdlib
import "./src/stdlib/stdlibTest.js";
import "./src/stdlib/maybeTest.js";
import "./src/stdlib/pairTest.js";

// jinq
import "./src/json/jsonMonadTest.js"
import "./src/jinq/jinqTest.js";
import {nil} from "./src/sequence/constructors/nil/nil.js";

total.onChange(value => document.getElementById('grossTotal').textContent = "" + value + " tests done.");

document.querySelector("footer").textContent = "Built with Kolibri " + versionInfo;

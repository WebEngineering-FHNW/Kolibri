import { total } from "./src/test/test.js";
import { versionInfo } from "../../docs/src/kolibri/version.js";

// logger
// import "./src/logger/loggerTest.js";
// import "./src/logger/appender/arrayAppenderTest.js";
// import "./src/logger/appender/countAppenderTest.js";
// import "./src/logger/appender/consoleAppenderTest.js";
// import "./src/logger/appender/observableAppenderTest.js";
// import "./src/logger/logUi/logUiControllerTest.js";
//
// // iterator
// import "./src/iterator/constructors/constructorsTest.js";
// import "./src/iterator/operators/operatorsTest.js";
// import "./src/iterator/terminalOperations/terminalOperationsTest.js";
// import "./src/iterator/iteratorBuilderTest.js";
// import "./src/iterator/constructors/constructorsTestTabled.js";
//
//
// // range
// import "./src/range/rangeTest.js";
//
// // focusring
// import "./src/focusring/focusRingTest.js";
//
// // stdlib
// import "./src/stdlib/stdlibTest.js";
import "./src/iterator/operators/bind/bindTest.js";
import "./src/iterator/operators/concat/concatTest.js";
import "./src/iterator/operators/cons/consTest.js";
import "./src/iterator/operators/cycle/cycleTest.js";
import "./src/iterator/operators/drop/dropTest.js";
import "./src/iterator/operators/dropWhile/dropWhileTest.js";
import "./src/iterator/operators/map/mapTest.js";
import "./src/iterator/operators/mconcat/mconcatTest.js";
import "./src/iterator/operators/pipe/pipeTest.js";
import "./src/iterator/operators/rejectAll/rejectAllTest.js";
import "./src/iterator/operators/retainAll/retainAllTest.js";
import "./src/iterator/operators/reverse/reverseTest.js";
import "./src/iterator/operators/take/takeTest.js";
import "./src/iterator/operators/takeWhile/takeWhileTest.js";
import "./src/iterator/operators/zip/zipTest.js";
import "./src/iterator/operators/zipWith/zipWithTest.js";
// import "./src/iterator/util/testingTable.js";
import {imp} from "../../docs/src/kolibri/lambda/church.js";

total.onChange(value => document.getElementById('grossTotal').textContent = "" + value + " tests done.");

document.querySelector("footer").textContent = "Built with Kolibri " + versionInfo;

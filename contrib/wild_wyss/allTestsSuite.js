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
// import "./src/iterator/operators/bind/bindTest.js";
// import "./src/iterator/operators/concat/concatTest.js";
// import "./src/iterator/operators/cons/consTest.js";
// import "./src/iterator/operators/cycle/cycleTest.js";
// import "./src/iterator/operators/drop/dropTest.js";
// import "./src/iterator/operators/dropWhile/dropWhileTest.js";
// import "./src/iterator/operators/map/mapTest.js";
// import "./src/iterator/operators/mconcat/mconcatTest.js";
// import "./src/iterator/operators/pipe/pipeTest.js";
// import "./src/iterator/operators/rejectAll/rejectAllTest.js";
// import "./src/iterator/operators/retainAll/retainAllTest.js";
// import "./src/iterator/operators/reverse/reverseTest.js";
// import "./src/iterator/operators/take/takeTest.js";
// import "./src/iterator/operators/takeWhile/takeWhileTest.js";
// import "./src/iterator/operators/zip/zipTest.js";
// import "./src/iterator/operators/zipWith/zipWithTest.js";

// import "./src/iterator/constructors/angleIterator/angleIteratorTest.js";
// import "./src/iterator/constructors/arrayIterator/arrayIteratorTest.js";
// import "./src/iterator/constructors/iterator/iteratorTest.js";
// import "./src/iterator/constructors/nil/nilTest.js";
// import "./src/iterator/constructors/primeNumberIterator/primeNumberIteratorTest.js";
// import "./src/iterator/constructors/pureIterator/pureIteratorTest.js";
// import "./src/iterator/constructors/repeat/repeatTest.js";
// import "./src/iterator/constructors/replicate/replicateTest.js";
// import "./src/iterator/constructors/squareNumberIterator/squareNumberIteratorTest.js";
// import "./src/iterator/constructors/stackIterator/stackIteratorTest.js";
// import "./src/iterator/constructors/tupleIterator/tupleIteratorTest.js";
// import "./src/iterator/constructors/fibonacciIterator/fibonacciIteratorTest.js";
// import "./src/iterator/util/testingTable.js";


import "./src/iterator/terminalOperations/eq/eqTest.js";
import "./src/iterator/terminalOperations/forEach/forEachTest.js";
import "./src/iterator/terminalOperations/head/headTest.js";
import "./src/iterator/terminalOperations/isEmpty/isEmptyTest.js";
import "./src/iterator/terminalOperations/reduce/reduceTest.js";
import "./src/iterator/terminalOperations/uncons/unconsTest.js";

total.onChange(value => document.getElementById('grossTotal').textContent = "" + value + " tests done.");

document.querySelector("footer").textContent = "Built with Kolibri " + versionInfo;

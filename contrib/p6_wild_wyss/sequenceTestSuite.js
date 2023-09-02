import { total }       from "./src/test/test.js";
import { versionInfo } from "../../docs/src/kolibri/version.js";


// sequence
import "./src/sequence/constructors/constructorTest.js";
import "./src/sequence/operators/operatorsTest.js";
import "./src/sequence/terminalOperations/terminalOperationsTest.js";
import "./src/sequence/sequenceBuilderTest.js";
import "./src/sequence/util/sequenceUtil/sequencePrototypeTest.js"

// focus ring
import "./src/focusring/focusRingTest.js";

// stdlib
import "./src/stdlib/stdlibTest.js";
import "./src/stdlib/maybeTest.js";
import "./src/stdlib/pairTest.js";

// jinq
import "./src/json/jsonMonadTest.js"
import "./src/jinq/jinqTest.js";

total.onChange(value => document.getElementById('grossTotal').textContent = "" + value + " tests done.");

document.querySelector("footer").textContent = "Built with Kolibri " + versionInfo;

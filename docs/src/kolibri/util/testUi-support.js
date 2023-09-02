/**
 * @module util/testUI-support
 * Helper to update the test UI report while the tests are running
 */
import { total }       from "./test.js";
import { versionInfo } from "../version.js";

total.onChange( value => document.getElementById('grossTotal').textContent = "" + value + " tests done.");

document.querySelector("footer").textContent = "Built with Kolibri " + versionInfo;

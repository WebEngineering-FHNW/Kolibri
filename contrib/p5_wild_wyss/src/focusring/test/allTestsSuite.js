import { total } from "../../../../../docs/src/kolibri/util/test.js";
import { versionInfo } from "../../../../../docs/src/kolibri/version.js";

import "../focusRingTest.js"

total.onChange( value => document.getElementById('grossTotal').textContent = "" + value + " tests done.");

document.querySelector("footer").textContent = "Built with Kolibri " + versionInfo;

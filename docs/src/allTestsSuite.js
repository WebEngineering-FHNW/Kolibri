
import { total }      from "./kolibri/util/test.js";
import { versionInfo} from "./kolibri/version.js";

import '../src/examples/allExampleTestsSuite.js';
import '../src/kolibri/allKolibriTestsSuite.js';

total.onChange( value => document.getElementById('grossTotal').textContent = "" + value + " tests done.")

document.querySelector("footer").textContent = "Built with Kolibri " + versionInfo;

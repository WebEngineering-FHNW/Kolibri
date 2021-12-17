
import { total }      from "./kolibri/util/test.js";
import { versionInfo} from "./kolibri/version.js";

import '../src/kolibri/allKolibriTestsSuite.js';


document.getElementById('grossTotal').textContent = "" + total + " tests done.";

document.querySelector("footer").textContent = "Built with Kolibri " + versionInfo;

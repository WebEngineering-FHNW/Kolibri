
import { project, total } from "./util/test.js";
import { versionInfo} from "./version.js";

import './allKolibriTestsSuite.js';

total.onChange( value => document.getElementById('grossTotal').textContent = "" + value + " tests done.");

//document.querySelector("footer").textContent = "Built with Kolibri " + versionInfo;

document.querySelector('#out').append(...project().children);

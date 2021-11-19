
import { total } from "./kolibri/util/test.js";

import '../src/kolibri/allKolibriTestsSuite.js';


document.getElementById('grossTotal').textContent = "" + total + " Tests";

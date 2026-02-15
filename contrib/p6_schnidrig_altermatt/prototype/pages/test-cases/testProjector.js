import '../../kolibri/allKolibriTestsSuite.js';
import { total, project } from "../../kolibri/util/test.js";
import { versionInfo } from "../../kolibri/version.js";

export { TestProjector }

const TestProjector = () => {
    total.onChange( value => document.getElementById('grossTotal').textContent = "" + value + " tests done.");
    //document.querySelector("footer").textContent = "Built with Kolibri " + versionInfo;
    return project();
};


import {total} from "../../../test/test.js";
import {versionInfo} from "../../../../../../docs/src/kolibri/version.js";


import "./tictactoeTest.js";

total.onChange(value => document.getElementById('grossTotal').textContent = "" + value + " tests done.");

document.querySelector("footer").textContent = "Built with Kolibri " + versionInfo;

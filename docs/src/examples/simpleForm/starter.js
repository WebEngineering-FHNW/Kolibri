import { projectForm, FORM_CSS }                     from "../../kolibri/projector/simpleForm/simpleFormProjector.js"
import { SimpleFormController }                      from "../../kolibri/projector/simpleForm/simpleFormController.js"
import { CHECKBOX, NUMBER, TEXT, COLOR, DATE, TIME } from "../../kolibri/util/dom.js";

export { start } // exported for testing purposes

const start = () => {
    const formStructure = [
        {value: "Text",       label: "Text",   name: "text",   type: TEXT     },
        {value: 0,            label: "Number", name: "number", type: NUMBER   },
        {value: "1968-04-19", label: "Date",   name: "date",   type: DATE     },
        {value: 12 * 60 + 15, label: "Time",   name: "time",   type: TIME     },
        {value: false,        label: "Check",  name: "check",  type: CHECKBOX },
        {value: "",           label: "Color",  name: "color",  type: COLOR    }
    ];
    const controller = SimpleFormController(formStructure);
    return projectForm(controller);
}

// keep document-specific info out of the start function such that it is easier to test without
// side-effecting the execution environment
const formHolder = document.getElementById("form-holder");
if (null != formHolder) { // there is no such element when called via test case
    document.querySelector("head style").textContent += FORM_CSS;
    formHolder.append(...start());
}

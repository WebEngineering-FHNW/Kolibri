import { projectForm, FORM_CSS } from "./formProjector.js"
import { FormController }        from "./formController.js"

document.querySelector("head style").textContent += FORM_CSS;

const formHolder = document.getElementById("form-holder");

const form = [
    {
        value:  "Some Value",
        label:  "Some Label",
        name:   "some",
        type:   "text",
    }, {
        value:  0,
        label:  "Other Label",
        name:   "other",
        type:   "number",
    }, {
        value:  "",
        label:  "Check",
        name:   "check",
        type:   "checkbox",
    }, {
        value:  "12:15",
        label:  "Time",
        name:   "time",
        type:   "time",
    }, {
        value:  "1968-04-19",
        label:  "Date",
        name:   "date",
        type:   "date",
    }, {
        value:  "",
        label:  "Color",
        name:   "color",
        type:   "color",
    }
];

const controller = FormController(form);

projectForm(controller, formHolder);

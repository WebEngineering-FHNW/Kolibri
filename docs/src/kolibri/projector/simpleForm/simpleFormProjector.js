/**
 * @module projector/simpleForm/simpleFormProjector
 *
 * Following the projector pattern, this module exports projection functions
 * ({@link projectInput} and {@link projectForm}) that create respective views
 * and bind underlying models.
 * Following classical MVC, the binding is available solely through a controller.
 *
 * Projectors are _compositional_. Projecting a form means projecting multiple inputs.
 *
 * Projectors are interchangeable. Any two projectors that export the same functions
 * can be used in place of each other. This can provide a totally different "look & feel"
 * to the application while all business logic and their test cases remain untouched.
 */

import { dom }  from "../../util/dom.js";

export { projectInput, projectForm, FORM_CSS }

/**
 * String that must be unique in CSS classes and DOM id prefixes throughout the application.
 * @private
 * @type {string}
 */
const FORM_CLASS_NAME = "kolibri-simpleForm";

/**
 * Internal mutable singleton state to produce unique id values for the label-input pairs.
 * @private
 * @type {number}
 */
let counter = 0;

/**
 * Projection function that creates a view for input purposes, binds the information that is available through
 * the inputController, and returns the generated views.
 * @constructor
 * @impure since calling the controller functions changes underlying models. The DOM remains unchanged.
 * @param  { !SimpleInputControllerType } inputController
 * @return { Array<Element> }
 * @example
 * const [labelElement, inputElement] = projectInput(controller);
 */
const projectInput = inputController => {
    const id = FORM_CLASS_NAME + "-id-" + (counter++);
    // create view
    const [labelElement, inputElement] = dom(`
        <label for="${id}"></label>
        <input type="${inputController.getType()}" id="${id}">
    `);

    // view and data binding can depend on the type
    if (inputController.getType() === "time") { // "hh:mm" in the vies vs minutes since midnight in the model
        inputElement.onchange = _ => inputController.setValue(timeStringToMinutes(inputElement.value));
        inputController.onValueChanged(val => inputElement.value = totalMinutesToTimeString(val));
    } else
    if (inputController.getType() === "checkbox") { // "checked" attribute vs boolean in model
        inputElement.onchange = _ => inputController.setValue(inputElement.checked);
        inputController.onValueChanged(val => inputElement.checked = val);
    } else {
        inputElement.onchange = _ => inputController.setValue(inputElement.value);
        inputController.onValueChanged(val => inputElement.value = val);
    }

    inputController.onLabelChanged (label => {
        labelElement.textContent = label;
        inputElement.setAttribute("title", label);
    });
    inputController.onNameChanged  (name  => inputElement.setAttribute("name", name));
    inputController.onValidChanged (valid => inputElement.setCustomValidity(valid ? "" : "invalid"));

    return [labelElement, inputElement];
}

/**
 * Helper function to convert time from string representation into number (minutes since midnight)
 * @private
 * @pure
 * @param  { !String } timeString - format "hh:mm"
 * @return { Number }
 */
const timeStringToMinutes = timeString => {
    if( ! /\d\d:\d\d/.test(timeString)) return 0 ; // if we cannot parse the string to a time, assume 00:00
    const [hour, minute]  = timeString.split(":").map(Number);
    return hour * 60 + minute;
}

/**
 * Helper function to convert time from number (minutes since midnight) representation to "hh:mm" string.
 * @private
 * @pure
 * @param  { !Number } totalMinutes
 * @return { String } - format "hh:mm"
 */
const totalMinutesToTimeString = totalMinutes => {
    const hour   = (totalMinutes / 60) | 0; // div
    const minute = totalMinutes % 60;
    return String(hour).padStart(2, "0") + ":" + String(minute).padStart(2, "0");
}

/**
 * Projection function that creates a form view for input purposes with as many inputs as the formController
 * contains inputControllers, binds the information and returns the generated form view in an array.
 * Even though not strictly necessary, the return value is an array for the sake of consistency amoung
 * all view-generating functions.
 * @constructor
 * @impure since calling the controller functions changes underlying models. The DOM remains unchanged.
 * @param  { !SimpleFormControllerType } formController
 * @return { Array<Element> }
 * @example
 * const [form] = projectForm(controller);
 */
const projectForm = formController => {
    // create view
    const [form] = dom(`
		<form>
			<fieldset class="${FORM_CLASS_NAME}">
			</fieldset>
		</form>
    `);
    const fieldset = form.children[0];

    formController.forEach(inputController => fieldset.append(...projectInput(inputController)));

    return [form];
}

const FORM_CSS = `
    fieldset.${FORM_CLASS_NAME} {        
        padding: 2em;
        display: grid;
        grid-template-columns: max-content max-content;
        grid-row-gap:   .5em;
        grid-column-gap: 2em;        
    }
`;

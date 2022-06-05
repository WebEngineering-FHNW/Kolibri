/**
 * @module projector/simpleForm/simpleInputProjector
 *
 * Following the projector pattern, this module exports projection functions
 * ({@link projectChangeInput} and {@link projectInstantInput}) that create respective views
 * and bind underlying models.
 * Following classical MVC, the binding is available solely through a controller.
 *
 * Projectors are _compositional_. Projecting a form means projecting multiple inputs.
 *
 * Projectors are interchangeable. Any two projectors that export the same functions
 * can be used in place of each other. This can provide a totally different "look & feel"
 * to the application while all business logic and their test cases remain untouched.
 */

import {
    CHANGE, dom, INPUT, TIME, CHECKBOX
}                                  from "../../util/dom.js";
import { timeStringToMinutes,
         totalMinutesToTimeString} from "../projectorUtils.js";

export { projectInstantInput, projectChangeInput }

/**
 * Internal mutable singleton state to produce unique id values for the label-input pairs.
 * @private
 * @type { Number }
 */
let counter = 0;

/**
 * Projection function that creates a view for input purposes, binds the information that is available through
 * the inputController, and returns the generated views.
 * @typedef { (formClassName:!String, inputController:!SimpleInputControllerType<T>)
 *               => [HTMLLabelElement, HTMLInputElement]
 *          } InputProjector<T>
 * @template T
 * @impure since calling the controller functions changes underlying models. The DOM remains unchanged.
 */

/**
 * Implementation for the exported {@link projectInstantInput} and {@link projectChangeInput} function.
 * @private
 * @type { (eventType:EventTypeString) => InputProjector<T> }
 * @template T
 */
const projectInput =
        eventType =>
        (formClassName, inputController) => {
    if( ! inputController) {
        console.error("no inputController in input projector."); // be defensive
        return;
    }
    const id = formClassName + "-id-" + (counter++);
    // create view
    const elements = dom(`
        <label for="${id}"></label>
        <span  data-id="${id}">
            <input type="${inputController.getType()}" id="${id}">
            <span aria-hidden="true"></span>
        </span>
    `);
    /** @type {HTMLLabelElement} */ const labelElement = elements[0]; // only for the sake of type casting, otherwise...
    /** @type {HTMLSpanElement}  */ const spanElement  = elements[1]; // only for the sake of type casting, otherwise...
    /** @type {HTMLInputElement} */ const inputElement = spanElement.firstElementChild; // ... we would use array deconstruction

    // view and data binding can depend on the type
    if (inputController.getType() === TIME) { // "hh:mm" in the vies vs minutes since midnight in the model
        inputElement.addEventListener(eventType, _ => inputController.setValue(timeStringToMinutes(inputElement.value)));
        inputController.onValueChanged(val => inputElement.value = totalMinutesToTimeString(val));
    } else
    if (inputController.getType() === CHECKBOX) { // "checked" attribute vs boolean in model
        inputElement.addEventListener(eventType, _ => inputController.setValue(inputElement.checked));
        inputController.onValueChanged(val => inputElement.checked = val);
    } else {
        inputElement.addEventListener(eventType, _ => inputController.setValue(inputElement.value));
        inputController.onValueChanged(val => inputElement.value = val);
    }

    inputController.onLabelChanged (label => {
        labelElement.textContent = label;
        inputElement.setAttribute("title", label);
    });
    inputController.onNameChanged  (name  => inputElement.setAttribute("name", name || id));
    inputController.onValidChanged (valid => inputElement.setCustomValidity(valid ? "" : "invalid"));

    inputController.onEditableChanged(isEditable => isEditable
        ? inputElement.removeAttribute("readonly")
        : inputElement.setAttribute("readonly", "on"));

    return /** @type { [HTMLLabelElement, HTMLInputElement] } */ elements;
};

/**
 * An {@link InputProjector} that binds the input on value change.
 * Depending on the control and how the browser handles it, this might require a user action to confirm the
 * finalization of the value change like pressing the enter key or leaving the input field.
 * @constant
 * @template T
 * @type { InputProjector<T> }
 * @example
 * const [labelElement, spanElement] = projectChangeInput(controller);
 */
const projectChangeInput  = projectInput(CHANGE);

/**
 * An {@link InputProjector} that binds the input on any change instantly.
 * Depending on the control and how the browser handles it, this might result in each keystroke in a
 * text field leading to instant update of the underlying model.
 * @constant
 * @template T
 * @type { InputProjector<T> }
 * @example
 * const [labelElement, spanElement] = projectInstantInput(controller);
 */
const projectInstantInput = projectInput(INPUT);

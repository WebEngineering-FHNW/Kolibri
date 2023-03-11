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

import {CHANGE, dom, INPUT, TIME, CHECKBOX}               from "../../util/dom.js";
import { timeStringToMinutes, totalMinutesToTimeString}   from "../projectorUtils.js";

export { projectInstantInput, projectChangeInput, projectDebounceInput }

/**
 * Internal mutable singleton state to produce unique id values for the label-input pairs.
 * @private
 * @type { Number }
 */
let counter = 0;

/**
 * Projection function that creates a view for input purposes, binds the information that is available through
 * the inputController, and returns the generated views.
 * @typedef { (formClassName:!String, inputController:!SimpleInputControllerType<_T_>, timeout:?Number)
 *               => [HTMLLabelElement, HTMLInputElement]
 *          } InputProjector<_T_>
 * @template _T_
 * @impure since calling the controller functions changes underlying models. The DOM remains unchanged.
 */

/**
 * Implementation for the exported {@link projectInstantInput} and {@link projectChangeInput} function.
 * @private
 * @type { (eventType:EventTypeString) => InputProjector<_T_> }
 * @template _T_
 */
const projectInput = (eventType) => (formClassName, inputController, timeout = 0) => {
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
        inputElement.addEventListener(eventType, _ =>
            inputController.setValue(/** @type { * } */ timeStringToMinutes(inputElement.value))
        );
        inputController.onValueChanged(val => inputElement.value = totalMinutesToTimeString(/** @type { * } */ val));
    } else
    if (inputController.getType() === CHECKBOX) { // "checked" attribute vs boolean in model
        inputElement.addEventListener(eventType, _ => inputController.setValue(/** @type { * } */ inputElement.checked));
        inputController.onValueChanged(val => inputElement.checked = /** @type { * } */ val);
    } else {
        if(timeout !== 0) {
            let timeoutId;
            inputElement.addEventListener(eventType, _event => {
                if(timeoutId !== undefined) clearTimeout(timeoutId);
                timeoutId = setTimeout( _timestamp =>
                    inputController.setValue(/** @type { * } */ inputElement.value),
                    timeout
                );
            });
        } else {
            inputElement.addEventListener(eventType, _ => inputController.setValue(/** @type { * } */ inputElement.value));
        }
        inputController.onValueChanged(val => inputElement.value = /** @type { * } */ val);
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
 * @template _T_
 * @type { InputProjector<_T_> }
 * @example
 * const [labelElement, spanElement] = projectChangeInput(controller);
 */
const projectChangeInput  = projectInput(CHANGE);

/**
 * An {@link InputProjector} that binds the input on any change instantly.
 * Depending on the control and how the browser handles it, this might result in each keystroke in a
 * text field leading to instant update of the underlying model.
 * @constant
 * @template _T_
 * @type { InputProjector<_T_> }
 * @example
 * const [labelElement, spanElement] = projectInstantInput(controller);
 */
const projectInstantInput = projectInput(INPUT);

/**
 * An {@link InputProjector} that binds the input on any change with a given delay in milliseconds such that
 * a quick succession of keystrokes is not interpreted as input until there is some quiet time.
 * Each keystroke triggers the defined timeout. If the timeout is still pending while a key is pressed,
 * it is reset and starts from the beginning. After the timeout expires, the underlying model is updated.
 * @constant
 * @template _T_
 * @type { InputProjector<_T_> }
 * @example
 * const [labelElement, spanElement] = projectDebounceInput(controller, 200);
 */
const projectDebounceInput = projectInput(INPUT);

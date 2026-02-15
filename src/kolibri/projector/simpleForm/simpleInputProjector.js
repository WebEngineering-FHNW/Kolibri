/**
 * @module projector/simpleForm/simpleInputProjector
 *
 * Following the projector pattern, this module exports an implementation of the {@link IInputProjector}
 * interface with projection functions
 * that create respective views and bind underlying models.
 * Following classical MVC, the binding is available solely through a controller.
 *
 * Projectors are _compositional_. Projecting a form means projecting multiple inputs.
 *
 * Projectors are interchangeable. Any two projectors that export the same functions
 * can be used in place of each other. This can provide a totally different "look & feel"
 * to the application while all business logic and their test cases remain untouched.
 */

import { CHANGE, dom, select, INPUT, TIME, CHECKBOX }    from "../../util/dom.js";
import { timeStringToMinutes, totalMinutesToTimeString } from "../projectorUtils.js";

export { InputProjector }

/**
 * @private
 * Internal mutable singleton state to produce unique id values for the label-input pairs.
 * @type { Number }
 */
let counter = 0;

/**
 * @private
 * Implementation for the exported projection functions. Configured via curried parameters.
 * @type { <_T_> (timeout: Number) => (eventType: EventTypeString) => InputProjectionType<_T_> }
 */
const projectInput = (timeout) => (eventType) =>
    (inputController, formCssClassName) => {
    if( ! inputController) {
        console.error("no inputController in input projector."); // be defensive
        return;
    }
    const id = formCssClassName + "-id-" + (counter++);
    // Create view.
    // The input element sits in a span that allows identification and css reference for
    // the span that serves as the invalidation marker. See kolibri-base.css for details.
    const elements = dom(`
        <label for="${id}"></label>
        <span  data-id="${id}" class="popover_anchor" style="anchor-name: --anchor-${id};">
            <input type="${inputController.getType()}" id="${id}">
            <span class="invalidation_marker" aria-hidden="true"></span>
            <span class="popover_tooltip" popover style="position-anchor: --anchor-${id};" ></span>
        </span>
    `);
    /** @type {HTMLLabelElement} */ const labelElement      = elements[0]; // only for the sake of type casting, otherwise...
    /** @type {HTMLSpanElement}  */ const spanElement       = elements[1]; // only for the sake of type casting, otherwise...
    /** @type {HTMLInputElement} */ const inputElement      = spanElement.firstElementChild; // ... we would use array deconstruction
    /** @type {HTMLSpanElement}  */ const [popoverElement]  = select(spanElement, "[popover]"); // the element that pops

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
        // standard binding for all remaining types, esp. TEXT and NUMBER.
        if(timeout !== 0) { // we need debounce behavior
            let timeoutId;
            inputElement.addEventListener(eventType, _event => {
                if(timeoutId !== undefined) clearTimeout(timeoutId); // debounce time is already running - stop that one
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

    inputController.onLabelChanged (  label => {
        labelElement.textContent = label;
        inputController.setTooltip(label);
    });
    inputController.onNameChanged  (name  => inputElement.setAttribute("name", name || id));
    inputController.onValidChanged (valid => inputElement.setCustomValidity(valid ? "" : "invalid"));

    inputController.onEditableChanged(isEditable => isEditable
        ? inputElement.removeAttribute("readonly")
        : inputElement.setAttribute("readonly", "on"));

    inputController.onTooltipChanged( text => {
        popoverElement.innerHTML = text;                            // think about textContent or HTML
        const hide  = _e => popoverElement.hidePopover();
        const show  = _e => popoverElement.showPopover();
        spanElement .removeEventListener("mouseenter",  show);      // avoid duplicate listeners
        spanElement .removeEventListener("mouseleave",  hide);
        labelElement.removeEventListener("click",       show);
        inputElement.removeEventListener("input",       hide);
        document.removeEventListener("touchstart",      hide);
        if (text && text.length > 0  ) {
            spanElement .addEventListener("mouseenter", show);
            spanElement .addEventListener("mouseleave", hide);
            labelElement.addEventListener("click",      show);
            inputElement.addEventListener("input",      hide);
            document    .addEventListener("touchstart", hide);
        }
    });

    return /** @type { [HTMLLabelElement, HTMLInputElement] } */ elements;
};

/**
 * @template _T_
 * @type { ChangeInputProjectionType<_T_> }
 * @example
 * const [labelElement, spanElement] = projectChangeInput(controller);
 */
const projectChangeInput = projectInput(0)(CHANGE);

/**
 * @template _T_
 * @type { InstantInputProjectionType<_T_> }
 * @example
 * const [labelElement, spanElement] = projectInstantInput(controller);
 */
const projectInstantInput = projectInput(0)(INPUT);

/**
 * @template _T_
 * @type { DebounceInputProjectionType<_T_> }
 * @example
 * // waits for a quiet time of 200 ms before updating
 * const [label, input] = projectDebounceInput(200)(controller, "Wyss");
 */
const projectDebounceInput = (quietTimeMs) => projectInput(quietTimeMs)(INPUT);

/**
 * Namespace object for the {@link IInputProjector} functions.
 * @type { IInputProjector }
 */
const InputProjector = {
    projectInstantInput,
    projectChangeInput,
    projectDebounceInput
};

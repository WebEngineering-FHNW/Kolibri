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

import { CHANGE, dom, select, INPUT, TIME, CHECKBOX, RANGE }       from "../../util/dom.js";
import { timeStringToMinutes, totalMinutesToTimeString }           from "../projectorUtils.js";
import { ICON_CHRISTMAS_TREE }                                     from "../../../customize/icons.js";
import { icon }                                                    from "../../style/icon.js";

export { InputProjector, SIMPLE_INPUT_RANGE_SLIDER_CSS  }

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
    const id = `${formCssClassName}-id-${counter++}`;

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

    if(inputController.getType() === RANGE) {
        inputElement.classList.add('kolibri-range-slider'); //TODO Discuss with Dierk if this is the right way to handle this

        // Set the max attribute for the slider
        inputElement.setAttribute('max', '100'); //TODO Discuss with Dierk if updating simpleInputController with max value is needed
        inputElement.setAttribute('min', '0');   //TODO Discuss with Dierk if updating simpleInputController with min value is needed
        inputElement.setAttribute('step', '1');  //TODO Discuss with Dierk if updating simpleInputController with value is needed


        // Event handling: Update slider value and gradient on input change
        inputElement.addEventListener(eventType, (event) => {
            inputController.setValue( /** @type { range } */ event.target.value);  // Todo - Aks Dierk if type range is correct?
            // Calculate the fill percentage
            const percentage = `${(event.target.value / inputElement.max) * 100}%`;
            // Update the CSS variable on the slider/input element
            inputElement.style.setProperty('--slider-fill', percentage);
        });

        // Controller bindings
        inputController.onValueChanged((value) => {
            const percentage = `${(value / inputElement.max) * 100}%`;
            // Update the CSS variable on the slider/input element
            inputElement.style.setProperty('--slider-fill', percentage);
        });

    }


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
        popoverElement.prepend(...icon(ICON_CHRISTMAS_TREE));
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




// Todo - Is INPUT_RANGE_CSS_CLASS_NAME needed here? Discuss with the @Direk König how to handle this in a better way.
/**
 * String that must be unique in CSS classes and DOM id prefixes throughout the application.
 * @private
 * @type {string}
 */
const INPUT_RANGE_CSS_CLASS_NAME = "kolibri-range-slider";


/**
 * CSS snippet to append to the head style when using the form projector.
 * @type { String }
 * @example
 * document.querySelector("head style").textContent += SIMPLE_INPUT_RANGE_SLIDER_CSS;
 */

// Todo - Add/Merge those CSS variables to the main CSS Style Sheet
const SIMPLE_INPUT_RANGE_SLIDER_CSS = `

input[type="range"] {
    width               : var(--slider-width);
    height              : var(--slider-height);
    border-radius       : 50%;
    outline             : none;
    appearance          : none;
    -webkit-appearance  : none;
    cursor              : pointer;
    position            : relative;
}

input[type="range"]::-webkit-slider-runnable-track {
    height           : var(--track-height);
    border-radius    : calc(var(--track-height) / 2);
    background       : linear-gradient(
                        to right,
                        var(--track-fill-color) var(--slider-fill),
                        var(--track-empty-color) var(--slider-fill)
    );              
}

 input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance  : none;
    width               : var(--thumb-size);
    height              : var(--thumb-size);
    background          : var(--thumb-color);
    border-radius       : 50%;
    border              : var(--thumb-border) solid var(--thumb-border-color);
    cursor              : pointer;
    position            : relative;
    top                 : calc((var(--track-height) - var(--thumb-size)) / 2);
    transition          : transform 0.3s ease-in-out;
    box-shadow          : 0 0 16px var(--thumb-glow-color), 
                          0 0 32px var(--thumb-outer-glow-color);
    animation           : pulseGlow var(--animation-duration) ease-in-out infinite;
}

input[type="range"]:hover::-webkit-slider-thumb {
    transform        : scale(var(--thumb-hover-scale));
    box-shadow       : 0 0 16px var(--thumb-glow-color), 
                       0 0 32px var(--thumb-outer-glow-color);
}

input[type="range"]::-moz-range-track {
    height           : var(--track-height);
    border-radius    : calc(var(--track-height) / 2);
    background       : linear-gradient(
        to right,
        var(--track-fill-color) var(--slider-fill),
        var(--track-empty-color) var(--slider-fill)
    );
}

input[type="range"]::-moz-range-thumb {
    width            : var(--thumb-size);
    height           : var(--thumb-size);
    background       : var(--thumb-color);
    border-radius    : 50%;
    cursor           : pointer;
}

@keyframes pulseGlow {
    0%, 100% {
        box-shadow : 
            0 0 16px var(--thumb-glow-color), 
            0 0 32px var(--thumb-outer-glow-color);
    }
    50% {
        box-shadow : 
            0 0 24px var(--thumb-glow-color), 
            0 0 48px var(--thumb-outer-glow-color);
    }
}
    
  
`;
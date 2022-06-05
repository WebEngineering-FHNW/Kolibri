// noinspection JSUnusedGlobalSymbols

/**
 * @module util/dom
 * Helper functions to work with the DOM.
 */
export {
    dom, fireEvent, fireChangeEvent,
    CLICK, INPUT, CHANGE,
    TEXT, TIME, DATE, CHECKBOX, NUMBER, COLOR
}

/**
 * Create DOM objects from an HTML string.
 * @param  { String } innerString - The string representation of the inner HTML that will be returned as an HTML collection.
 * @return { HTMLCollection }
 * @pure
 * @example
 * const [label, input] = dom(`
 *      <label for="myId">
 *      <input type="text" id="myId" name="myName" value="myValue">
 * `);
 */
const dom = innerString => {
    const holder = document.createElement("DIV");
    holder.innerHTML = innerString;
    return holder.children;
};

/**
 * @typedef {'change'|'input'|'click'} EventTypeString
 * Feel free to extend this type with new unique type strings as needed for other DOM events.
 */

/** @type EventTypeString */ const CHANGE  = "change";
/** @type EventTypeString */ const INPUT   = "input";
/** @type EventTypeString */ const CLICK   = "click";

/**
 * When a user interacts with an HTML element in the browser, various events might be fired. For example, typing text
 * in a text field fires the "input" event. But when changing the "value" of this text field via JS, the event is not
 * fired and thus any existing "input listeners" on the text field are not notified.
 * This function fires the event and notifies all listeners just as if the user had done the change in the browser.
 * It is particularly useful for testing.
 * @param { HTMLElement } element - The "target" element that fires the event.
 * @param { EventTypeString } eventTypeString - String representation of the {@link Event} to be fired.
 * @return void
 * @impure
 * @example
 * fireEvent(input, CHANGE);
 */
const fireEvent = (element, eventTypeString) => {
    const event = new Event(eventTypeString);
    element.dispatchEvent(event);
};

/**
 * Convenience function for {@link fireEvent} function with value "change".
 * @param { HTMLElement } element - The "target" element that fires the event.
 */
const fireChangeEvent = element => fireEvent(element, CHANGE);


/** @typedef { "text"|"number"|"checkbox"|"time"|"date"|"color" } InputTypeString */

/** @type InputTypeString */ const TEXT     = "text";
/** @type InputTypeString */ const NUMBER   = "number";
/** @type InputTypeString */ const CHECKBOX = "checkbox";
/** @type InputTypeString */ const TIME     = "time";
/** @type InputTypeString */ const DATE     = "date";
/** @type InputTypeString */ const COLOR    = "color";

import { LoggerFactory }            from "../logger/loggerFactory.js";
import { LOG_CONTEXT_KOLIBRI_BASE } from "../logger/logConstants.js";
import { removeItem }               from "../util/arrayFunctions.js";

export { Observable }

let warn = undefined;
/** @private */
function checkWarning(list) {
    if (list.length > 100) {
        if (!warn) {
            warn = LoggerFactory(LOG_CONTEXT_KOLIBRI_BASE + ".observable").warn;
        }
        warn(`Beware of memory leak. ${list.length} listeners.`);
    }
}

/**
 * @template _T_
 * @typedef { (newValue:_T_, oldValue: ?_T_, selfRemove: ?ConsumerType<void>) => void } ValueChangeCallback
 * This is a specialized {@link ConsumerType} with an optional second value.
 * The "oldValue" contains the value before the change.
 * The "selfRemove" is an optional function with the side effect that the current listener can use to
 * remove itself from the list of listeners.
 * @example
 * obs.onChange( (_val, _old, removeMe) => removeMe() );
 */

/**
 * IObservable<_T_> is the interface from the GoF Observable design pattern.
 * In this variant, we allow to register many observers but do not provide means to unregister.
 * Observers are not garbage-collected before the observable itself is collected.
 * IObservables are intended to be used with the concept of "stable binding", i.e. with
 * listeners that do not change after setup.
 * @typedef IObservable<_T_>
 * @template _T_
 * @impure   Observables change their inner state (value) and maintain a list of observers that changes over time.    
 * @property { ()  => _T_ }   getValue - a function that returns the current value
 * @property { (_T_) => void} setValue - a function that sets a new value, calling all registered {@link ValueChangeCallback}s
 * @property { (cb: ValueChangeCallback<_T_>) => void } onChange -
 *              a function that registers an {@link ValueChangeCallback} that will be called whenever the value changes.
 *              Immediately called back on registration.
 */

/**
 * Constructor for an IObservable<_T_>.
 * @pure
 * @template _T_
 * @param    {!_T_} value      - the initial value to set. Mandatory.
 * @returns  { IObservable<_T_> }
 * @constructor
 * @example
 * const obs = Observable("");
 * obs.onChange(val => console.log(val));
 * obs.setValue("some other value"); // will be logged
 */
function Observable(value) {
    const listeners      = [];
    const removeListener = listener => removeItem(listeners)(listener);
    const noop           = () => undefined;
    return {
        onChange: callback => {
            checkWarning(listeners);
            listeners.push(callback);
            callback(value, value, noop);
        },
        getValue: () => value,
        setValue: newValue => {
            if (value === newValue) return;
            const oldValue    = value;
            value             = newValue;
            const safeIterate = [...listeners]; // shallow copy as we might change the listeners array while iterating
            safeIterate.forEach( listener => {
                if (value === newValue) { // pre-ordered listeners might have changed this and thus the callback no longer applies
                    listener(value, oldValue, () => removeListener(listener));
                }
            });
        }
    };
}

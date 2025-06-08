import { LoggerFactory }            from "../logger/loggerFactory.js";
import { LOG_CONTEXT_KOLIBRI_BASE } from "../logger/logConstants.js";
import "../util/array.js";

export { ObservableList}

let warn = undefined;
/** @private */
function checkWarning(list) {
    if (list.length > 100) {
        if (!warn) {
            warn = LoggerFactory(LOG_CONTEXT_KOLIBRI_BASE + ".observableList").warn;
        }
        warn(`Beware of memory leak. ${list.length} listeners.`);
    }
}

/**
 * IObservableList<_T_> is the interface for lists that can be observed for add or delete operations.
 * In this variant, we allow registering and unregistering many observers.
 * Observers that are still registered are not garbage collected before the observable list itself is collected.
 * @typedef IObservableList
 * @template _T_
 * @impure   Observables change their inner decorated list and maintain two lists of observers that changes over time.  
 * @property { (cb:ConsumerType<_T_>) => void }  onAdd - register an observer that is called whenever an item is added.
 * @property { (cb:ConsumerType<_T_>) => void }  onDel -
 * register an observer that is called whenever an item is deleted.
 * The observer callback gets passed an optional second argument that allows to remove itself -
 * just like {@link removeDeleteListener} following the same strategy as {@link ValueChangeCallback}.
 * @property { (_T_) => void }  add - add an item to the observable list and notify the observers. Modifies the list.
 * @property { (_T_) => void }  del - delete an item to the observable list and notify the observers. Modifies the list.
 * @property { (cb:ConsumerType<_T_>) => void }  removeAddListener - unregister the "add" observer
 * @property { (cb:ConsumerType<_T_>) => void }  removeDeleteListener - unregister the "delete" observer
 * @property { () => Number }                    count   - current length of the inner list.
 * @property { (cb:ConsumingPredicateType<_T_>) => Number }  countIf - number of items in the list that satisfy the given predicate.
 */

/**
 * Constructor for an IObservableList<_T_>.
 * @pure
 * @template _T_
 * @param {!Array<_T_>} list - the inner list that is to be decorated with observability. Mandatory. See also GoF decorator pattern.
 * @returns IObservableList<_T_>
 * @constructor
 * @example
 * const list = ObservableList( [] );
 * list.onAdd( item => console.log(item));
 * list.add(1);
 */
function ObservableList(list) {
    const addListeners         = [];
    const delListeners         = [];
    const removeAddListener    = addListener => addListeners.removeItem(addListener);
    const removeDeleteListener = delListener => delListeners.removeItem(delListener);

    return {
        onAdd:   listener => {
            checkWarning(addListeners);
            addListeners.push(listener);
        },
        onDel:   listener => {
            checkWarning(delListeners);
            delListeners.push(listener);
        },
        add:     item => {
            list.push(item);
            addListeners.forEach(listener => listener(item));
        },
        del:     item => {
            list.removeItem(item);
            const safeIterate = [...delListeners]; // shallow copy as we might change the listeners array while iterating
            safeIterate.forEach(listener => listener(item, () => removeDeleteListener(listener)));
        },
        removeAddListener,
        removeDeleteListener,
        count:   ()   => list.length,
        countIf: pred => list.reduce((sum, item) => pred(item) ? sum + 1 : sum, 0)
    };
}

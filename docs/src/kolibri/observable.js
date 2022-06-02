
import "./util/array.js"

export {Observable, ObservableList}

/**
 * @callback onValueChangeCallback<T>
 * @template T
 * @impure   this callback usually modifies the MVC view
 * @param    {T} newValue   - the new value that is set by the change
 * @param    {T} [oldValue] - the old value before the change. Can optionally be used by the callback.
 * @return   void
 */

/**
 * IObservable<T> is the interface from the GoF Observable design pattern.
 * In this variant, we allow to register many observers but do not provide means to unregister.
 * Observers are not garbage-collected before the observable itself is collected.
 * IObservables are intended to be used with the concept of "stable binding", i.e. with
 * listeners that do not change after setup.
 * @typedef IObservable<T>
 * @template T
 * @impure   Observables change their inner state (value) and maintain a list of observers that changes over time.    
 * @property { ()  => T }   getValue - a function that returns the current value
 * @property { (T) => void} setValue - a function that sets a new value, calling all registered {@link onValueChangeCallback}s
 * @property { (callback: onValueChangeCallback<T>) => void } onChange -
 *              a function that registers an {@link onValueChangeCallback} that will be called whenever the value changes.
 *              Immediately called back on registration.
 */

/**
 * Constructor for an IObservable<T>.
 * @pure
 * @template T
 * @param    {!T} value      - the initial value to set. Mandatory.
 * @returns  { IObservable<T> }
 * @constructor
 * @example
 * const obs = Observable("");
 * obs.onChange(val => console.log(val));
 * obs.setValue("some other value");
 */
const Observable = value => {
    const listeners = [];
    return {
        onChange: callback => {
            listeners.push(callback);
            callback(value, value);
        },
        getValue: ()       => value,
        setValue: newValue => {
            if (value === newValue) return;
            const oldValue = value;
            value = newValue;
            listeners.forEach(callback => {
                if (value === newValue) { // pre-ordered listeners might have changed this and thus the callback no longer applies
                    callback(value, oldValue);
                }
            });
        }
    }
};


/**
 * @callback observableListCallback
 * @template T
 * @impure   this callback usually modifies the MVC view
 * @param {T} item - the item that has been added to or removed from the {@link IObservableList<T> }
 * @return void
 */

/**
 * @callback predicateCallback
 * @template T
 * @param {T} item - an item that is stored in the {@link IObservableList<T> }
 * @return boolean
 */

/**
 * IObservableList<T> is the interface for lists that can be observed for add or delete operations.
 * In this variant, we allow registering and unregistering many observers.
 * Observers that are still registered are not garbage collected before the observable list itself is collected.
 * @typedef IObservableList
 * @template T
 * @impure   Observables change their inner decorated list and maintain two lists of observers that changes over time.  
 * @property { (observableListCallback) => void }  onAdd - register an observer that is called whenever an item is added.
 * @property { (observableListCallback) => void }  onDel - register an observer that is called whenever an item is added.
 * @property { (T) => void }  add - add an item to the observable list and notify the observers. Modifies the list.
 * @property { (T) => void }  del - delete an item to the observable list and notify the observers. Modifies the list.
 * @property { (observableListCallback) => void }  removeAddListener - unregister the "add" observer
 * @property { (observableListCallback) => void }  removeDeleteListener - unregister the "delete" observer
 * @property { () => number }  count - current length of the inner list.
 * @property { (predicateCallback) => number }  countIf - number of items in the list that satisfy the given predicate.
 */

/**
 * Constructor for an IObservableList<T>.
 * @pure
 * @template T
 * @param {!Array<T>} list - the inner list that is to be decorated with observability. Mandatory. See also GoF decorator pattern.
 * @returns IObservableList<T>
 * @constructor
 * @example
 * const list = ObservableList( [] );
 * list.onAdd( item => console.log(item));
 * list.add(1);
 */
const ObservableList = list => {
    const addListeners = [];
    const delListeners = [];
    const removeAddListener    = addListener => addListeners.removeItem(addListener);
    const removeDeleteListener = delListener => delListeners.removeItem(delListener);

    return {
        onAdd: listener => addListeners.push(listener),
        onDel: listener => delListeners.push(listener),
        add: item => {
            list.push(item);
            addListeners.forEach( listener => listener(item))
        },
        del: item => {
            list.removeItem(item);
            const safeIterate = [...delListeners]; // shallow copy as we might change the listeners array while iterating
            safeIterate.forEach( listener => listener(item, () => removeDeleteListener(listener) ));
        },
        removeAddListener,
        removeDeleteListener,
        count:   ()   => list.length,
        countIf: pred => list.reduce( (sum, item) => pred(item) ? sum + 1 : sum, 0)
    }
};

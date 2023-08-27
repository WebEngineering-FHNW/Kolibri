/**
 * @module dataflow - a dataflow abstraction that is not based on concurrency but on laziness and
 * can be used in an asynchronous fashion.
 */


/**
 * @callback createValueCallback
 * @template _T_
 * @type { () => _T_ }
 */
/**
 * A dataflow abstraction that takes a function that specifies how to create a value and returns a
 * function that returns that value. The callback will be only called when needed and not more than once.
 * In other contexts known as "lazy" or "thunk".
 * @template _T_
 * @param { !createValueCallback } createValue - will be called when needed and not more than once. Mandatory.
 * @return { () => _T_ }
 * @constructor
 * @example
 *     const x = DataFlowVariable(() => y() + 1);
 *     const y = DataFlowVariable(() => 1);
 *     x() === 2
 */
const DataFlowVariable = createValue => {
    let value = undefined;
    return () => {
        if (value !== undefined) { return value }
        value = createValue();
        return value;
    }
};

/**
 * @callback onResolveCallback
 * @impure   sets the surrounding {@link Promise} to the "resolved" state.
 * @type { () => void }
 */
/**
 * @typedef { (onResolveCallback) => void } Task
 * @impure  can produce arbitrary side effects and must use the {@link onResolveCallback} to signal completion.
 */
/**
 * @typedef  { object } SchedulerType
 * @property { (Task) => void } add   - schedule the task for execution.
 *                                      The {@link Task} must call its {@link onResolveCallback} when finished.
 * @property { Function }       addOk - convenience function that adds the {@link Task} for execution
 *                                      and calls "ok" {@link onResolveCallback} after execution no matter what.
 */
/**
 * Constructing a new {@link SchedulerType } where {@link Task}s can be added for asynchronous but sequence-preserving
 * execution. That means that even though the scheduled tasks can run asynchronously, it is still guaranteed that
 * when first task A and then task B is added, tasks B will not be started before task A has finished.
 * Note that this scheduler has no timeout facility and an async {@link Task} that never calls its
 * {@link onResolveCallback} will stall any further task execution.
 * @return { SchedulerType }
 * @constructor
 * @example
 *     const scheduler = Scheduler();
 *     scheduler.add( ok => {
 *         setTimeout( _ => {
 *             console.log("A");
 *             ok();
 *         }, 100);
 *     });
 *     scheduler.addOk ( () => console.log("B"));
 *     // log contains first A, then B
 */
const Scheduler = () => {
    let inProcess = false;
    const tasks = [];
    function process() {
        if (inProcess) return;
        if (tasks.length === 0) return;
        inProcess = true;
        const task = tasks.pop();
        const prom = new Promise( ok => task(ok) );
        prom.then( _ => {
            inProcess = false;
            process();
        });
    }
    function add(task) {
        tasks.unshift(task);
        process();
    }
    return {
        add:   add,
        addOk: task => add( ok => { task(); ok(); }) // convenience
    }
};/**
 * @module util/arrayFunctions
 * Utility module for array-dependent functions.
 */


/**
 * A function that compares two arrays for equality by checking that they are of the same length and
 * all elements are pairwise equal with respect to the "===" operator. Arguments are given in curried style.
 * Arguments must not be null/undefined and must be of type {@link Array}.
 * @template T
 * @pure
 * @complexity O(n)
 * @haskell  [a] -> [a] -> bool
 * @function arrayEq
 * @type    { (arrayA:!Array<T>) => (arrayB:!Array<T>) => boolean }
 * @param   { !Array<T>} arrayA - the first array. Mandatory.
 * @returns { (arrayB:!Array<T>) => boolean}
 * @example
 * arrayEq ([])  ([])  === true;
 * arrayEq ([1]) ([2]) === false;
 */
const arrayEq = arrayA => arrayB =>
    arrayA.length === arrayB.length && arrayA.every( (it, idx) => it === arrayB[idx]);

/**
 * From the {@link array}, remove the item at position "index". The arguments are given in curried style.
 * The index must be >= 0 and < `array.length` or nothing is removed and an empty array is returned.
 * @impure Since the given array is modified.
 * @function removeAt
 * @template T
 * @type    { (array:!Array<T>) => (index:!number) => Array<T> }
 * @param   { !Array<T>} array - the array to remove from. Mandatory.
 * @returns { (index:!number) => Array<T> } - finally, the removed element is returned in a singleton array, or an empty array in case nothing was removed, see {@link splice}
 * @example
 * const array = [1,2,3];
 * removeAt(array)(0);
 * arrayEq(array)([2,3]);
 */
const removeAt = array => index => array.splice(index, 1);

/**
 * From the {@link array}, remove the "item". The arguments are given in curried style.
 * In case that the item occurs multiple times in the array, only the first occurrence is removed.
 * @impure Since the given array is modified.
 * @function removeItem
 * @template T
 * @type    { (array:!Array<T>) => (item:!T) => Array<T> }
 * @param   { !Array<T>} array - the array to remove from. Mandatory.
 * @returns { (item:!T) => Array<T> } - finally, the removed element is returned in a singleton array or an empty array in case nothing was removed, see {@link splice}
 * @example
 * const array = ["a","b","c"];
 * removeItem(array)("b");
 * arrayEq(array)(["a","c"]);
 */
const removeItem = array => item => {
    const i = array.indexOf(item);
    if (i >= 0) {
        return removeAt(array)(i);
    }
    return [];
};

/**
 * @typedef { <_T_> (!Number) => _T_ } TimesCallback<_T_>
 */

/**
 * A function that executes the optional {@link TimesCallback} "soMany" times, assembles the results and returns them in an
 * {@link array} of length "soMany". The arguments are given in curried style.
 * If no callback is given, the unaltered index is returned. Indexes go from 0 to soMany-1.
 * @impure if the callback is impure
 * @haskell  Int -> (Int -> a) -> [a]
 * @function times
 * @type    { <_T_> (soMany: !Number) => (cb: ?TimesCallback) => Array<_T_> }
 * soMany - how often to execute the callback. Negative values will be treated like 0. Mandatory.
 * @throws  { TypeError } - if soMany is given as a String but does not represent a number
 * @example
 * times(3)(i => console.log(i)); // logs 0, 1, 2
 * times(5)(x=>x*x); // returns [0, 1, 4, 9, 16]
 */
const times = soMany => (callback) => {
    const number = Number(soMany.valueOf());
    if (isNaN(number)) {
        throw new TypeError("Object '" + soMany + "' is not a valid number.");
    }
    return Array.from({length: number}, (it, idx) => callback ? callback(idx) : idx);
};

/**
 * @typedef { <_T_> (!_T_, index: ?Number) => Number } SumCallback<_T_>
 */

/**
 * A function that sums up all items from an {@link array} by applying the {@link SumCallback} to each item before adding up.
 * The arguments are given in curried style.
 * @impure   if the callback is impure
 * @haskell  Num n => [a] -> (a -> n) -> n
 * @type    { <_T_> (array:!Array<_T_>) => (cb:  ProducerType<Number> | ?SumCallback<_T_>) => Number }
 * @example
 * sum([1,2,3])()     === 1 + 2 + 3;
 * sum(["1"])(Number) === 1;
 */
const sum = array => (callback = Number) => {
    const cb = /** @type {ProducerType<Number> | ?SumCallback} */ callback;
    return array.reduce( (acc, cur, idx) => acc + cb(cur, idx), 0);
};/**
 * @module util/array
 * Augmenting the {@link Array}, {@link String}, and {@link Number} prototypes with functions from the arrayFunctions module.
 * These functions live in their own module such that users of the library can keep their code clean
 * from prototype modifications if they prefer to do so.
 */


/**
 * See {@link arrayEq}.
 * @template _T_
 * @param  { Array<_T_> } array
 * @return { Boolean  }
 * @example
 * [1].eq([1]); // true
 */
Array.prototype.eq = function(array) { return arrayEq(this)(array);};

/**
 * See {@link removeAt}.
 * @template _T_
 * @impure Modifies the array instance.
 * @param  { Number } index
 * @return { Array<_T_> }
 * @example
 * [1,2,3].removeAt(0);
 */
Array.prototype.removeAt = function(index){ return removeAt(this)(index); };

/**
 * See {@link removeItem}.
 * @template _T_
 * @impure Modifies the array instance.
 * @param  { _T_ } item
 * @return { Array<_T_> }
 * @example
 * ["a","b","c"].removeItem("b");
 */
Array.prototype.removeItem = function(item){ return removeItem(this)(item); };

/**
 * See {@link times}.
 * @template _T_
 * @param  { ?TimesCallback } callback
 * @return { Array<_T_> }
 * @example
 * "10".times(it => console.log(it));
 */
String.prototype.times = function(callback = undefined){ return times(this)(callback); };

/**
 * See {@link times}.
 * @template _T_
 * @param  { ?TimesCallback } callback
 * @return { Array<_T_> }
 * @example
 * (5).times(x => x * x); // [0, 1, 4, 9, 16]
 */
Number.prototype.times = function(callback= undefined){ return times(this)(callback); };

/**
 * See {@link sum}.
 * @param  { ?SumCallback } callback
 * @return { Number }
 * @example
 * [1,2,3].sum();     // 6
 * ["1"].sum(Number); // 1
 */
Array.prototype.sum = function(callback = undefined){ return sum(this)(callback); };/**
 * @typedef { <_T_> (newValue:_T_, oldValue: ?_T_) => void } ValueChangeCallback<_T_>
 * This is a specialized {@link ConsumerType} with an optional second value.
 * The "oldValue" contains the value before the change.
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
 * IObservableList<_T_> is the interface for lists that can be observed for add or delete operations.
 * In this variant, we allow registering and unregistering many observers.
 * Observers that are still registered are not garbage collected before the observable list itself is collected.
 * @typedef IObservableList
 * @template _T_
 * @impure   Observables change their inner decorated list and maintain two lists of observers that changes over time.  
 * @property { (cb:ConsumerType<_T_>) => void }  onAdd - register an observer that is called whenever an item is added.
 * @property { (cb:ConsumerType<_T_>) => void }  onDel - register an observer that is called whenever an item is added.
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
            addListeners.forEach( listener => listener(item));
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
};/**
 * @module stdtypes
 * The js doc definitions of the types that are most commonly used.
 */

/**
 * @typedef { <_T_> (...x) => _T_ } ProducerType<_T_>
 * A function that takes arbitrary arguments (possibly none) and produces a value of type _T_.
 */

/**
 * @typedef { <_T_> (_T_) => void } ConsumerType<_T_>
 * A function that consumes a value of type _T_ and returns nothing.
 */

/**
 * @typedef { <_T_> (_T_) => Boolean } ConsumingPredicateType<_T_>
 * A function that consumes a value of type _T_ and returns a Boolean.
 */

/**
 * @typedef { <_T_>  (_T_) => _T_ } UnaryOperatorType<_T_>
 * A unary operator on _T_.
 *//**
 * @module projector/projectorUtils
 * Helper functions for use in projectors.
 */

/**
 * Helper function to convert time from string representation into number (minutes since midnight).
 * If the string cannot be parsed, 00:00 is assumed.
 * @pure
 * @param  { !String } timeString - format "hh:mm"
 * @return { Number }
 */
const timeStringToMinutes = timeString => {
    if( ! /\d\d:\d\d/.test(timeString)) return 0 ; // if we cannot parse the string to a time, assume 00:00
    const [hour, minute]  = timeString.split(":").map(Number);
    return hour * 60 + minute;
};

/**
 * Helper function to convert time from number (minutes since midnight) representation to "hh:mm" string.
 * @pure
 * @param  { !Number } totalMinutes
 * @return { String } - format "hh:mm"
 */
const totalMinutesToTimeString = totalMinutes => {
    const hour   = (totalMinutes / 60) | 0; // div
    const minute = totalMinutes % 60;
    return String(hour).padStart(2, "0") + ":" + String(minute).padStart(2, "0");
};/**
 * Projection function that creates a view for input purposes, binds the information that is available through
 * the inputController, and returns the generated views.

 * @typedef { <_T_>
 *     (inputController: !SimpleInputControllerType<_T_>, formCssClassName: !String )
 *      => [HTMLLabelElement, HTMLInputElement]
 *     } InputProjectionType
 * @impure since calling the controller functions changes underlying models. The DOM remains unchanged.
 * @note   in the future we might want to depend on a more general controller than SimpleInputControllerType.
 */

/**
 * An {@link InputProjectionType} that binds the input on value change.
 * Depending on the control and how the browser handles it, this might require a user action to confirm the
 * finalization of the value change like pressing the enter key or leaving the input field.
 * The signature is the same as for {@link InstantInputProjectionType} but the meaning is different.
 * @template _T_
 * @typedef { InputProjectionType<_T_> } ChangeInputProjectionType
 */

/**
 * An {@link InputProjectionType} that binds the input on any change instantly.
 * Depending on the control and how the browser handles it, this might result in each keystroke in a
 * text field leading to instant update of the underlying model.
 * The signature is the same as for {@link ChangeInputProjectionType} but the meaning is different.
 * @template _T_
 * @typedef { InputProjectionType<_T_> } InstantInputProjectionType
 */

/**
 * A constructor for an {@link InputProjectionType} that binds the input on any change with a given delay in milliseconds such that
 * a quick succession of keystrokes is not interpreted as input until there is some quiet time.
 * Each keystroke triggers the defined timeout. If the timeout is still pending while a key is pressed,
 * it is reset and starts from the beginning. After the timeout expires, the underlying model is updated.
 * @typedef { <_T_> (quietTimeMs: !Number) => InputProjectionType<_T_> } DebounceInputProjectionType
 */

/**
 * Interface for {@link InputProjectionType}s.
 * @typedef IInputProjector
 * @property { ChangeInputProjectionType   } projectChangeInput
 * @property { InstantInputProjectionType  } projectInstantInput
 * @property { DebounceInputProjectionType } projectDebounceInput
 *//**
 * @module lambda/church
 * Church encoding of the lambda calculus in JavaScript
 * to the extent that we need it in Kolibri.
 * Recommended reading: https://en.wikipedia.org/wiki/Church_encoding .
 * Recommended watching: https://www.youtube.com/watch?v=6BnVo7EHO_8&t=1032s .
 */


/**
 * Identity function, aka "I" in the SKI calculus or "Ibis" (or "Idiot") in the Smullyan bird metaphors.
 * The function is pure and runs in O(1). Function calls can be inlined.
 * @haskell  a -> a
 * @pure
 * @type  { <_T_> (_T_) => _T_ }
 * @example 
 * id(1) === 1
 */
const id = x => x;

/**
 * Constant function that captures and caches the argument and makes it available like a "getter".
 * Aka "konst", "fst" (the first of two curried parameters),
 * "K" in the SKI calculus, or "Kestrel" in the Smullyan bird metaphors.
 * @haskell  a -> b -> a
 * @pure
 * @type     { <_T_> (x:_T_) => (...y) => _T_ }
 * @example
 * c(1)(undefined) === 1;
 * const getExpr = c(expr);
 * // expression might change here but even if it does, the cached value will be returned
 * getExpr() === expr;
 */
const c = x => () => x;

/** The first of two curried arguments, identical to {@link c} (see there for more info).
 * Often used to pick the first element of a {@link Pair}.
 * @type     { <_T_> (x:_T_) => (...y) => _T_ }
 * @example
 * const point = Pair(1)(2);
 * point(fst) === 1;
 */
const fst = c;

/**
 * A Function that returns the second of two curried arguments.
 * "KI" in the SKI calculus, or "Kite" in the Smullyan bird metaphors.
 * It can be seen as a cached getter for the id function: {@link c}({@link id})
 * Often used to pick the first element of a {@link Pair}.
 * @haskell  b -> a -> a
 * @pure
 * @type     { <_T_> (...x) => (y:_T_) => _T_ }
 * @example
 * snd(undefined)(1) === 1;
 * const point = Pair(1)(2);
 * point(snd) === 2;
 */
const snd = (_=undefined) => y => y;

// --------- ADT section ---------

// private ADT implementation details ---------------------

/** @private */
const TupleCtor = n => values =>
    n === 0                                            // we have curried all ctor args, now
        ? Object.seal(selector => selector(values))    // return a function that waits for the selector
        : value =>                                     // there are still values to be curried
          TupleCtor (n - 1) ([...values, value]);      // return the ctor for the remaining args

/** @private */
const ChoiceCtor = position => n => choices =>
    n === 0                                                      // we have curried all ctor args, now
        ? Object.seal(choices[position] (choices[0]) )           // we call the chosen function with the ctor argument
        : choice =>                                              // there are still choices to be curried
          ChoiceCtor (position) (n - 1) ([...choices, choice]);  // return the ctor for the remaining args

// end of private section, publicly exported constructors follow

/**
 * An n-Tuple stores n different values, which can be retrieved by accessor functions.
 * It is the most general form of a Product Type. Tuples are immutable. Values are accessed in O(1).
 * Since no indexes are managed by the user, there are no out-of-bounds errors.
 * @pure
 * @param  {!Number} n - the cardinality, i.e. Tuple(n) can store n values. Mandatory. Must be > 0 or an error is thrown.
 * @return {Array<Function>} - an array where the first item is a constructor, follow by n accessor functions
 * @constructor
 * @example
 * const [Triple, one, two, three] = Tuple(3);
 * const triple = Triple(1)(2)(3);
 * triple(two) === 2;
 */
const Tuple = n => {
    if (n < 1) throw new Error("Tuple must have first argument n > 0");
    return [
        TupleCtor (n) ([]), // ctor curries all values and then waits for the selector
        // every selector is a function that picks the value from the curried ctor at the same position
        ...Array.from( {length:n}, (it, idx) => values => values[idx] )
    ];
};

/**
 * A Choice selects between n distinct values, each of which can only be accessed if a
 * handling function is provided for each possible value. One cannot forget to handle edge cases.
 * It is the most general form of a CoProduct aka Sum Type. Choices are immutable.
 * @pure
 * @param {!Number} n - the cardinality, i.e. number of possible choices. Mandatory. Must be > 0 or an error is thrown.
 * @return {Array<Function>} - an array of n choice constructors
 * @constructor
 * @example
 * const [Bad, Good, Unknown] = Choice(3);
 * const guessWhat = Good(1);
 * guessWhat
 *      (_ => console.error("this is bad")) // handle Bad case
 *      (x => x)                            // handle Good case
 *      (_ => 0);                           // Unknown -> default value
 */
const Choice = n => { // number of constructors
    if (n < 1) throw new Error("Choice must have first argument n > 0");
    return Array.from( {length:n}, (it, idx) => ChoiceCtor (idx + 1) (n + 1) ([]) ) ; // n constructors with n curried args
};

// end of private ADT implementation details

/**
 * A callback function that selects between two arguments that are given in curried style.
 * Only needed internally for the sake of proper JsDoc.
 * @callback PairSelectorType
 * @pure
 * @type { <_T_, _U_> (x:_T_) => (y:_U_) => ( _T_ | _U_ ) }
 */
/**
 * @typedef PairType
 * @type {  <_T_, _U_>  (x: _T_) => (y: _U_) => (s: PairSelectorType<_T_, _U_>) => ( _T_ | _U_ ) }
 */
/**
 * A Pair is a {@link Tuple}(2) with a smaller and specialized implementation.
 * Access functions are {@link fst} and {@link snd}. Pairs are immutable.
 * "V" in the SKI calculus, or "Vireo" in the Smullyan bird metaphors.
 * @haskell a -> b -> (a -> b -> a|b) -> a|b
 * @pure    if the selector function is pure, which it usually is
 * @type    PairType
 * @constructor
 * @example
 * const dierk = Pair("Dierk")("König");
 * dierk(fst) === "Dierk");
 * dierk(snd) === "König");
 */
const Pair = x => y => selector => selector(x)(y);


/*
 * The Either types.
 * @haskell Either a b
 */

/**
 * A generic function from whatever type "a" to whatever "b".
 * Only needed internally for the sake of proper JsDoc.
 * @typedef  FunctionAtoBType
 * @pure     supposed to be pure
 * @type     { <_T_, _U_> (x:_T_) => _U_ }
 */

/**
 * Type of the {@link Left} constructor after being bound to a value x of type _T_.
 * @typedef LeftXType
 * @type    { <_T_, _U_>  (f:FunctionAtoBType<_T_, _U_>) => (g:*) => _U_ }
 */

/**
 * The Left constructor of an Either type. An "Either" is either {@link Left} or {@link Right}.
 * It is constructed with a value of type "a" and waits for two more functions f and g
 * as curried arguments.
 * When both are given, f(x) is called.
 * The Left case of an Either type is usually (but not necessarily so) an error case.
 * Left values are immutable.
 * @haskell a -> (a -> b) -> c -> b
 * @pure    if FunctionAtoBType is pure
 * @type    { <_T_, _U_>  (x:_T_) =>  LeftXType<_T_, _U_> }
 * @example
 * const withFoo = (null == foo) ? Left("could not find foo") : Right(foo);
 * withFoo
 *      (msg => console.error(msg))      // handle left case
 *      (x   => doSomethingWithFoo(x));  // handle right case
 */

const Left  = x => f => _g => f(x);

/**
 * Type of the {@link Right} constructor after being bound to a value x of type _T_.
 * @typedef RightXType
 * @type     { <_T_, _U_>  (f:*)  => (f:FunctionAtoBType<_T_, _U_>) => _U_ }
 */

/**
 * The Right constructor of an Either type. An "Either" is either {@link Left} or {@link Right}.
 * It is constructed with a value of type "b" and waits for two more functions f and g
 * as curried arguments.
 * When both are given, g(x) is called.
 * The Right case of an Either type is usually (but not necessarily so) the good case.
 * Right values are immutable.
 * @haskell a -> c -> (a -> b) -> b
 * @pure    if FunctionAtoBType is pure
 * @type    { <_T_, _U_>  (x:_T_) =>  RightXType<_T_, _U_> }
 * @example
 * const withFoo = (null == foo) ? Left("could not find foo") : Right(foo);
 * withFoo
 *      (msg => console.error(msg))
 *      (x   => doSomethingWithFoo(x));
 */
const Right = x => _f => g => g(x);

/**
 * @typedef { LeftXType<_T_,_U_> | RightXType<_T_,_U_> } EitherType
 * @template _T_
 * @template _U_
 * @pure
 */

/**
 * Type of the {@link Nothing} constructor after _not_ being bound to anny value.
 * @typedef NothingXType
 * @type    { <_T_, _U_>  (f:FunctionAtoBType<_T_, _U_>)  => (g:*) => _U_ }
 */
/**
 * Nothing is the error case of the Maybe type. A "Maybe a" can be either Nothing or "{@link Just} a".
 * Nothing is immutable. Nothing is a singleton.
 * Nothing is used to get around missing null/undefined checks.
 * @haskell Nothing :: Maybe a
 * @pure
 * @type    { <_T_, _U_>  (f:FunctionAtoBType<_T_, _U_>)  => (g:*) => _U_ }
 * 
 * @example
 * const mayFoo = (null == foo) ? Nothing : Just(foo);
 * mayFoo
 *      (_   => console.error("cannot find foo"))
 *      (x   => doSomethingWithFoo(x));
 */
const Nothing = Left (undefined);

/**
 * Type of the {@link Just} constructor after being bound to a value x of type _T_.
 * @typedef JustXType
 * @type    { <_T_, _U_>  (f:*)  => (f:FunctionAtoBType<_T_, _U_>) => _U_ }
 */

/**
 * Just is the success case of the Maybe type. A "Maybe a" can be either {@link Nothing} or "Just a".
 * Just values are immutable.
 * Just is used to get around missing null/undefined checks.
 * @haskell Just a :: Maybe a
 * @pure
 * @type    { <_T_, _U_>  (x:_T_) =>  (f:*)  => (f:FunctionAtoBType<_T_, _U_>) => _U_ }
 * @example
 * const mayFoo = (null == foo) ? Nothing : Just(foo);
 * mayFoo
 *      (_   => console.error("cannot find foo"))
 *      (x   => doSomethingWithFoo(x));
 */
const Just = Right;

/**
 * @typedef { NothingXType<_T_, _U_> | JustXType<_T_, _U_> } MaybeType
 * @template _T_
 * @template _U_
 * @pure
 */

/** function application, beta reduction
 * @haskell (a -> b) -> a -> b
 * @pure if f is pure
 * @type { <_T_, _U_> (f: FunctionAtoBType<_T_, _U_>) => (x: _T_) => _U_ }
 * @example
 * beta(id)(42) === 42;
 */
const beta = f => x => f(x);

/** An alternative name for the {@link c} function. */
const konst = c;

/** 
 * Flipping the sequence of two curried-style arguments.
 * Sometimes used to prepare for later eta reduction or make for more convenient use of f 
 * when the x argument is a lengthy in-line expression.
 * @haskell (a -> b -> c) -> b -> a -> c
 * @type { <_T_, _U_, _V_> (f: (_T_) => (_U_) => _V_) => (_U_) => (_T_) => _V_ }
 */
const flip = f => x => y => f(y)(x);

/** An alternative name for the {@link snd} function. */
const kite = snd;

/** Composition of two functions, aka Bluebird (B) in the Smullyan bird metaphors.
 * @haskell (b -> c) -> (a -> b) -> a -> c
 * @type { <_T_, _U_, _V_> (f: FunctionAtoBType<_U_, _V_>) => (g: FunctionAtoBType<_T_, _U_>) => (x: _T_) => _V_ }
 */
const cmp = f => g => x => f(g(x));

/** 
 * Composition of two functions f and g where g takes two arguments in curried style,
 * also known as Blackbird (BB) in the Smullyan bird metaphors.
 */
const cmp2 = f => g => x => y => f(g(x)(y));

// ---- boolean logic

/**
 * True is the success case of the Boolean type. 
 */
const T   = fst;
/**
 * False is the error case of the Boolean type. 
 */
const F   = snd;

/**
 * A boolean value (True or False) in the Church encoding.
 * @typedef { T | F } ChurchBooleanType
 */

/**
 * Negating a boolean value.
 * @type { (x:ChurchBooleanType) => ChurchBooleanType }
 */
const not = x => x(F)(T);

/** 
 * The "and" operation for boolean values.
 * @type { (x:ChurchBooleanType) => (y:ChurchBooleanType) => ChurchBooleanType }
 */
const and = x => y => x(y)(x);

/**
 * The "or" operation for boolean values.
 * @type { (x:ChurchBooleanType) => (y:ChurchBooleanType) => ChurchBooleanType }
 */
const or = x => x(x);

/**
 * The boolean equivalence operation.
 * @type { (x:ChurchBooleanType) => (y:ChurchBooleanType) => ChurchBooleanType }
 */
const beq = x => y => x(y)(not(y));

/**
 * The boolean exclusive-or operation.
 * @type { (x:ChurchBooleanType) => (y:ChurchBooleanType) => ChurchBooleanType }
 */
const xor = x => y => cmp2 (not) (beq) (x) (y) ; // we cannot eta reduce since that messes up the jsDoc type inference

/**
 * The boolean implication operation.
 * @type { (x:ChurchBooleanType) => (y:ChurchBooleanType) => ChurchBooleanType }
 */
const imp = x => flip(x) (not(x)) ;

/**
 * Convert a boolean lambda expression to a javascript boolean value.
 * @type { (b:ChurchBooleanType) => Boolean }
 */
const jsBool = b => b(true)(false);

/**
 * Convert a javascript boolean value to a boolean lambda expression.
 * @type { (jsB:Boolean) => ChurchBooleanType }
 */
const churchBool = jsB => /** @type {ChurchBooleanType} */ jsB ? T : F;

/**
 * LazyIf makes a church boolean useful in an If-Then-Else construct where unlike the standard
 * JavaScript strict evaluation strategy the 'then' and 'else' cases are not evaluated eagerly but lazily.
 * To this end, the 'then' and 'else' cases must be wrapped in anonymous producer functions.
 * In other words:
 * LazyIf acts like a church boolean where we know that the result will be a function that we call without arguments.
 *
 * @type { <_T_>
 *     (ChurchBooleanType)
 *     => (f:FunctionAtoBType<undefined, _T_>)
 *     => (g:FunctionAtoBType<undefined, _T_>)
 *     => _T_
 *     }
 * @example
 * LazyIf( eq(n1)(n1) )
 *   ( _=> "same"     )
 *   ( _=> "not same" )
 */
const LazyIf = condition => thenFunction => elseFunction => ( condition(thenFunction)(elseFunction) )();

/**
 * Calling the function f recursively.
 * @type { <_T_> (f: (_T_) => _T_) => _T_ }
 */
const rec = f => f ( n => rec(f)(n)  ) ;

/**
 * @callback HandleLeftCallback
 * @type { <_T_,_U_,_V_> (l:LeftXType<_T_,_U_>) => _V_ }
 */
/**
 * @callback HandleRightCallback
 * @type { <_T_,_U_,_V_> (r:RightXType<_T_,_U_>) => _V_ }
 */
/**
 * Apply the f or g handling function to the Either value.
 * @type  { <_T_,_U_,_V_> (e:EitherType<_T_,_U_>) => (hl:HandleLeftCallback<_T_,_U_>) => (hr:HandleRightCallback<_T_,_U_>) => _V_ }
 */
const either = e => f => g => e(f)(g);

/**
 * @callback HandleNothingCallback
 * @type { <_T_,_U_> (n:NothingXType<_T_,_U_>) => _U_ }
 */
/**
 * @callback HandleJustCallback
 * @type { <_T_,_U_> (j:JustXType<_T_,_U_>) => _U_ }
 */
/**
 * Apply the f or g handling function to the Maybe value depending on whether it is a Just or a Nothing.
 * @type  { <_T_,_V_> (m:MaybeType<_T_,_V_>) => (hn:HandleNothingCallback<_T_,_V_>) => (hj:HandleJustCallback<_T_,_V_>) => _V_ }
 */
const maybe = m => f => g => m(f)(g);

/**
 * Take a function of two arguments and return a function of one argument that returns a function of one argument,
 * i.e. a function of two arguments in curried style.
 * @haskell curry :: ((a,b)->c) -> a -> b -> c
 * @type { <_T_,_U_,_V_> (f:FunctionAtoBType<_T_,FunctionAtoBType<_U_,_V_>>) => FunctionAtoBType<_T_,FunctionAtoBType<_U_,_V_>> }
 */
const curry = f => x => y => f(x,y);

// uncurry :: ( a -> b -> c) -> ((a,b) -> c)
/**
 * Take af function of two arguments in curried style and return a function of two arguments.
 * @type { <_T_,_U_,_V_> (f:FunctionAtoBType<_T_,FunctionAtoBType<_U_,_V_>>) => FunctionAtoBType<_T_,_U_,_V_> }
 */
const uncurry = f => (x,y) => f(x)(y);/**
 * @module stdlib
 * Kolibri standard library with functions and data structures that are most commonly used.
 * The stdlib has no dependencies.
 * It only delegates to other modules where the actual implementation is implemented and tested.
 */



// to do
// Eq typeclass, symmetry, reflexivity
// booleanEq, pairEq, tupleEq, eitherEq, choiceEq, maybeEq, arrayEq

// functor typeclass, associativity (if pure), left and right identity
// pairMap, tupleMap, eitherMap (only Right), choiceMap (n functions), maybeMap

// Num? Ord? Monoid? Monad?
/**
 * @module presentationModel
 * Implementation of the Presentation Model Pattern with Attributes that can be managed in a ModelWorld.
 */

/**
 * @typedef {'value'|'valid'|'editable'|'label'|'name'|'type'} ObservableTypeString
 * Feel free to extend this type with new unique type strings as needed for your application.
 */

/** @type ObservableTypeString */ const VALUE    = "value";
/** @type ObservableTypeString */ const VALID    = "valid";
/** @type ObservableTypeString */ const EDITABLE = "editable";
/** @type ObservableTypeString */ const LABEL    = "label";
/** @type ObservableTypeString */ const NAME     = "name";
/** @type ObservableTypeString */ const TYPE     = "type"; // HTML input types: text, number, checkbox, etc.

/**
 * Convenience function to read the current state of the attribute's VALUE observable for the given attribute.
 * @template _T_
 * @param {AttributeType<String>} attribute
 * @return _T_
 */
const valueOf = attribute => attribute.getObs(VALUE).getValue();

/**
 * @typedef { Object<String, AttributeType> } PresentationModel
 */

/**
 * Creates Presentation Model with Attributes for each attribute name with {@link VALUE} and {@link LABEL} observables.
 * @param  { Array<String> } attributeNames - to be used as keys in the returned {@link PresentationModel}.
 * @return { PresentationModel }
 * @constructor
 * @example
 * const pm = presentationModelFromAttributeNames(["firstname", "lastname"]);
*/
const presentationModelFromAttributeNames = attributeNames => {
    const result = Object.create(null);                 // make sure that we have no prototype
    attributeNames.forEach ( attributeName => {
        const attribute = Attribute(undefined);
        attribute.getObs(LABEL).setValue(attributeName); // default: use the attribute name as the label
        result[attributeName] = attribute;
    });
    return /** @type PresentationModel */result;
};

/**
 * @typedef ModelWorldType
 * @template _T_
 * @property { ( getQualifier:function():String, name:ObservableTypeString, observable: IObservable<_T_> ) => void } update -
 *              update the value of the named observableType for all attributes that have the same qualifier.
 *              Add the respective observable if it not yet known.
 * @property { (qualifier:String, newQualifier:String, observables:Object<String, IObservable<_T_>>) => void} updateQualifier -
 *              handle the change when an attribute changes its qualifier such that all respective
 *              internal indexes need to be updated, their values are updated, and nullish newQualifier leads to removal.
 * @property { (qualifier:String) => _T_} readQualifierValue
 */

/**
 * @private constructs the private, single Model World
 * @return { ModelWorldType }
 * @constructor
 */
const ModelWorld = () => {

    const data = {}; // key -> array of observables

    const readQualifierValue = qualifier => {
        const observables = data[qualifier + "." + VALUE];
        if (null == observables) { return undefined; }
        return observables[0].getValue(); // there are no empty arrays
    };

    // handle the change of a value
    const update = (getQualifier, name, observable) => {
        const qualifier = getQualifier(); // lazy get
        if (null == qualifier) { return; }
        const key = qualifier + "." + name; // example: "Person.4711.firstname" "VALID" -> "Person.4711.firstname.VALID"
        const candidates = data[key];
        if (null == candidates) {
            data[key] = [observable]; // nothing to notify
            return;
        }
        let found = false;
        candidates.forEach ( candidate => {
           if (candidate === observable) {
               found = true;
           } else {
               candidate.setValue(observable.getValue());
           }
        });
        if (! found) {
            candidates.push(observable); // lazy init: we should have been in the list
        }
    };
    // handle the change of a qualifier
    const updateQualifier = (qualifier, newQualifier, observables) => {
        for (const name in observables) {
            const observable = observables[name];
            if (null != qualifier) {                    // remove qualifier from old candidates
                const oldKey = qualifier + "." + name;
                const oldCandidates = data[oldKey];
                const foundIndex = oldCandidates.indexOf(observable);
                if (foundIndex > -1) {
                    oldCandidates.splice(foundIndex, 1);
                }
                if (oldCandidates.length === 0) {       // delete empty candidates here
                    delete data[oldKey];
                }
            }
            if (null != newQualifier){                  // add to new candidates
                const newKey = newQualifier + "." + name;
                let newCandidates = data[newKey];
                if (null == newCandidates) {
                    data[newKey]  = [];
                    newCandidates = [];
                }
                if (newCandidates.length > 0) {         // there are existing observables that's values we need to take over
                    observable.setValue(newCandidates[0].getValue());
                }
                newCandidates.push(observable);
            }
        }
    };
    return { update, updateQualifier, readQualifierValue }
};

/**
 * @private single instance, not exported, this is currently a secret of this module
 */
const modelWorld = ModelWorld();

const readQualifierValue = modelWorld.readQualifierValue; // specific export

/**
 * Convenience constructor of an {@link Attribute} that builds its initial value from already existing qualified values (if any)
 * instead of overriding possibly existing qualified values with the constructor value.
 * @constructor
 * @template _T_
 * @param { String } qualifier - mandatory. Nullish values make no sense here since one can use {@link Attribute}.
 * @return { AttributeType<_T_> }
 * @impure since it changes the ModelWorld.
 * @example
 * const firstNameAttr = QualifiedAttribute("Person.4711.firstname"); // attr is set to existing values, if any.
 */
const QualifiedAttribute = qualifier => Attribute(readQualifierValue(qualifier), qualifier);

/**
 * @callback Converter
 * @template _T_
 * @param    { * } value - the raw value that is to be converted
 * @return   { _T_ }     - the converted value
 * @example
 * dateAttribute.setConverter( date => date.toISOString() ); // external: Date, internal: String
 */

/**
 * @callback Validator
 * @template _T_
 * @param    { _T_ } value
 * @return   { Boolean } - whether the given value is considered valid.
 * @example
 * dateAttribute.setValidator( date => date > Date.now()); // only future dates are considered valid
 */

/**
 * @typedef  AttributeType
 * @template _T_
 * @property { (name:ObservableTypeString, initValue:*=null) => IObservable} getObs - returns the {@link IObservable}
 *              for the given name and creates a new one if needed with the optional initValue.
 *              The initValue is of type _T_ for the VALUE observable can be different for others, e.g. the
 *              VALID observable is of type Boolean.
 * @property { (name:ObservableTypeString) =>  Boolean } hasObs - true if an {@link Observable}
 *              for the given name has already been created, false otherwise.
 * @property { (value:*) => void } setConvertedValue - sets the value for the {@link VALUE} observable
 *              after piping the value through the optional converter. The value is not of type _T_ since
 *              the converter might convert any type to _T_.
 * @property { (converter:!Converter) => void } setConverter - use specialized converter, default is {@link id},
 *              converters are not allowed to be nullish.
 *              There can only ever be at most one converter on an attribute.
 * @property { (validator:?Validator) => void } setValidator - use specialized Validator, default is null.
 *              There can only ever be at most one validator on an attribute.
 * @property { (newQualifier:?String) => void } setQualifier - setting the qualifier can have a wide-ranging impact since
 *              the ModelWorld keeps all attributes with the same qualifier synchronized. Any non-nullish qualifier
 *              adds/keeps the attribute to the ModelWorld, any nullish qualifier removes the attribute from
 *              the ModelWorld.
 * @property { function(): ?String } getQualifier - the optional qualifier
 */
/**
 * Constructor that creates a new attribute with a value and an optional qualifier.
 * @template _T_
 * @param  { _T_ }     value       - the initial value
 * @param  { String? } qualifier   - the optional qualifier. If provided and non-nullish it will put the attribute
 *          in the ModelWorld and all existing attributes with the same qualifier will be updated to the initial value.
 *          In case that the automatic update is to be omitted, consider using {@link QualifiedAttribute}.
 * @return { AttributeType<_T_> }
 * @constructor
 * @impure since it changes the ModelWorld in case of a given non-nullish qualifier.
 * @example
 * const firstNameAttr = Attribute("Dierk", "Person.4711.firstname");
 */
const Attribute = (value, qualifier) => {

    /** @type {Object.< String, IObservable >} */
    const observables = {};

    const getQualifier = () => qualifier;
    const setQualifier = newQualifier => {
        const oldQualifier = qualifier;     // store for use in updateQualifier, since that needs the value to properly unregister
        qualifier = newQualifier;           // since updateQualifier sets the qualifier and calls the attribute back to read it, it must have the new value
        modelWorld.updateQualifier(oldQualifier, qualifier, observables);
    };

    const hasObs = name => observables.hasOwnProperty(name);

    const makeObservable = (name, initValue) => {

        const observable = Observable(initValue); // we might observe more types than just _T_, for example VALID: Boolean

        // noinspection JSValidateTypes // issue with _T_ as generic parameter for the observed value and other observed types
        observables[name] = observable;
        // noinspection JSCheckFunctionSignatures
        observable.onChange( _ => modelWorld.update(getQualifier, name, observable) );
        return observable;
    };

    const getObs = (name, initValue = null) =>
        hasObs(name)
            ? observables[name]
            : makeObservable(name, initValue);

    getObs(VALUE, value); // initialize the value at least

    let   convert           = id ;
    const setConverter      = converter => {
        convert = converter;
        setConvertedValue(getObs(VALUE).getValue());
    };
    const setConvertedValue = val => getObs(VALUE).setValue(convert(val));

    let validator        = undefined;  // the current validator in use, might change over time
    let validateListener = undefined;  // the "validate" listener on the attribute, lazily initialized
    const setValidator = newValidator => {
        validator = newValidator;
        if (! validateListener && validator) {
            validateListener = val => getObs(VALID).setValue(validator ? validator(val) : true);
            getObs(VALUE).onChange( validateListener );
        }
    };

    return { getObs, hasObs, setValidator, setConverter, setConvertedValue, getQualifier, setQualifier }
};// noinspection JSUnusedGlobalSymbols


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
/** @type InputTypeString */ const COLOR    = "color";/**
 * @typedef { object } InputAttributes
 * @template _T_
 * @property { !_T_ } value      - mandatory value, will become the input value, defaults to undefined
 * @property { ?String } label - optional label, defaults to undefined
 * @property { ?String } name  - optional name that reflects the name attribute of an input element, used in forms
 * @property { ?InputTypeString } type - optional type, allowed values are
 *              the values of the HTML Input element's "type" attribute. Defaults to "text".
 */

/**
 * Create a presentation model for the purpose of being used to bind against a single HTML Input in
 * combinations with its pairing Label element.
 * For a single input, it only needs one attribute.
 * @constructor
 * @template _T_
 * @param  { InputAttributes<_T_> }
 * @return { AttributeType<_T_> }
 * @example
 *     const model = SimpleInputModel({
         value:  "Dierk",
         label:  "First Name",
         name:   "firstname",
         type:   "text",
     });
 */
const SimpleInputModel = ({value, label, name, type= TEXT}) => {
    const singleAttr = Attribute(value);
    singleAttr.getObs(TYPE)    .setValue(type);
    singleAttr.getObs(EDITABLE).setValue(true);
    singleAttr.getObs(VALID)   .setValue(true);
    if (null != label) singleAttr.getObs(LABEL).setValue(label);
    if (null != name ) singleAttr.getObs(NAME) .setValue(name);


    return /** AttributeType<_T_> */ singleAttr;
};/**
 * @typedef { object } SimpleInputControllerType
 * @template _T_
 * @property { ()  => _T_ }                 getValue
 * @property { (_T_) => void }              setValue
 * @property { ()  => String}               getType
 * @property { (valid: !Boolean) => void }  setValid
 * @property { (converter: Converter<_T_>)        => void } setConverter
 * @property { (cb: ValueChangeCallback<String>)  => void } onLabelChanged
 * @property { (cb: ValueChangeCallback<Boolean>) => void } onValidChanged
 * @property { (cb: ValueChangeCallback<_T_>)     => void } onValueChanged
 * @property { (cb: ValueChangeCallback<String>)  => void } onNameChanged
 * @property { (cb: ValueChangeCallback<Boolean>) => void } onEditableChanged
 */

/**
 * The SimpleInputController gives access to a {@link SimpleInputModel} but in a limited fashion.
 * It does not expose the underlying {@link Attribute} but only those functions that a user of this
 * controller needs to see.
 * While controllers might contain business logic, this basic controller does not contain any.
 * @constructor
 * @template _T_
 * @param  { InputAttributes } args
 * @return { SimpleInputControllerType<_T_> }
 * @example
 *     const controller = SimpleInputController({
         value:  "Dierk",
         label:  "First Name",
         name:   "firstname",
         type:   "text",
     });
 */
const SimpleInputController = args => SimpleAttributeInputController(SimpleInputModel(args));

const SimpleAttributeInputController = attribute => ( {
    setValue:          attribute.setConvertedValue,
    getValue:          attribute.getObs(VALUE).getValue,
    setValid:          attribute.getObs(VALID).setValue,
    getType:           attribute.getObs(TYPE).getValue,
    onValueChanged:    attribute.getObs(VALUE).onChange,
    onValidChanged:    attribute.getObs(VALID).onChange,
    onLabelChanged:    attribute.getObs(LABEL).onChange,
    onNameChanged:     attribute.getObs(NAME).onChange,
    onEditableChanged: attribute.getObs(EDITABLE).onChange,
    setConverter:      attribute.setConverter,
} );/**
 * @typedef { Array<SimpleInputControllerType> } SimpleFormControllerType
 */

/**
 * The SimpleFormController creates as many instances of {@link SimpleInputController} as needed for
 * the inputs that are specified in the inputAttributesArray.
 * Note that controllers are compositional by means of function (ctor) composition.
 * @constructor
 * @param  { Array<InputAttributes> } inputAttributesArray - Specification of the form to create and bind.
 * @return { SimpleFormControllerType }
 * @example
 *     const controller = SimpleFormController([
           { value: "Dierk", type: "text"   },
           { value: 0,       type: "number" },
       ]);
 */
const SimpleFormController = inputAttributesArray => {
    // noinspection UnnecessaryLocalVariableJS
    const inputControllers = inputAttributesArray.map(SimpleInputController);
    // set up any business rules (we do not have any, yet)
    return inputControllers ;
};// noinspection JSUnusedLocalSymbols


/**
 * Css string value for the given color. We keep values as HSL to allow easier manipulation.
 * @param hue   - 0 to 360 degrees on the color wheel, where 0 is red, then yellow, green, cyan, blue, magenta.
 * @param sat   - saturation 0 to 100, where 0 is greyscale.
 * @param light - lightness, 0 is black and 100 is white.
 * @return {`hsl(${string}, ${string}%, ${string}%)`}
 * @example
 * const fireTruckRed = hsl(0, 100, 50);
 */
const hsl  = (hue, sat, light)        => `hsl(${hue}, ${sat}%, ${light}%)`;

/**
 * Css string value for the given color. We keep values as HSL to allow easier manipulation.
 * @param hue   - 0 to 360 degrees on the color wheel, where 0 is red, then yellow, green, cyan, blue, magenta.
 * @param sat   - saturation 0 to 100, where 0 is greyscale.
 * @param light - lightness, 0 is black and 100 is white.
 * @param alpha - between 0 and 1, where 0 is fully transparent and 1 is opaque.
 * @return {`hsl(${string}, ${string}%, ${string}%, ${string})`}
 * @example
 * const paleRose = hsla(0, 100, 50, 0.3);
 */
const hsla = (hue, sat, light, alpha) => `hsl(${hue}, ${sat}%, ${light}%, ${alpha})`;

const accentColor  = hsl(322, 73, 52);
const okColor      = hsl(104, 89, 28);
const neutralColor = hsl(  0,  0, 74);
const selectColor  = hsl( 46, 90, 84);

const outputColorValues = [256, 82, 55];
const outputColor = hsl (...outputColorValues);
const shadowColor = hsla(...outputColorValues, 0.2);

const shadowCss = `        
      0 4px  8px 0 ${shadowColor}, 
      0 6px 20px 0 ${shadowColor};
`;

// -- All colors according to Design File in Figma --

/* --- purple --- */
const purple800     = hsl(263, 100, 25);
const purple700     = hsl(262, 100, 35);
const purple600     = hsl(263, 87,  47);
const purple500     = hsl(263, 100, 50);
const purple400     = hsl(263, 100, 59);
const purple300     = hsl(259, 100, 74);
const purple200     = hsl(241, 91,  87);
const purple100     = hsl(237, 90,  96);

/* --- lavender --- */
const lavender800   = hsl(281, 100, 17);
const lavender700   = hsl(277, 100, 34);
const lavender600   = hsl(275,  85, 51);
const lavender500   = hsl(275, 100, 60);
const lavender400   = hsl(267, 100, 73);
const lavender300   = hsl(262, 100, 77);
const lavender200   = hsl(252, 100, 86);
const lavender100   = hsl(217, 100, 95);

/* --- blue --- */
const blue800       = hsl(241, 100, 25);
const blue700       = hsl(241,  76, 38);
const blue600       = hsl(241, 100, 39);
const blue500       = hsl(241, 100, 55);
const blue400       = hsl(241, 100, 71);
const blue300       = hsl(232, 100, 65);
const blue200       = hsl(223, 100, 86);
const blue100       = hsl(242, 100, 95);

/* --- green --- */
const green800      = hsl(122,  85, 18);
const green700      = hsl(120,  90, 24);
const green600      = hsl(120, 100, 30);
const green500      = hsl(116,  88, 39);
const green400      = hsl(107,  91, 66);
const green300      = hsl(103,  88, 75);
const green200      = hsl( 99, 100, 84);
const green100      = hsl( 93,  69, 92);

/* --- yellow --- */
const yellow800     = hsl(40,  51, 19);
const yellow700     = hsl(40,  52, 31);
const yellow600     = hsl(40, 100, 29);
const yellow500     = hsl(40,  92, 54);
const yellow400     = hsl(41, 100, 66);
const yellow300     = hsl(41, 100, 78);
const yellow200     = hsl(41, 100, 84);
const yellow100     = hsl(41, 100, 94);

/* --- pink --- */
const pink900       = hsl(339, 100, 31);
const pink800       = hsl(321, 100, 29);
const pink700       = hsl(328, 100, 37);
const pink600       = hsl(330, 100, 42);
const pink500       = hsl(326, 100, 59);
const pink400       = hsl(334, 100, 50);
const pink300       = hsl(326, 100, 59);
const pink200       = hsl(316, 100, 84);
const pink100       = hsl(309, 100, 96);

/* --- monochrome --- */
const black         = hsl(240,  15,  9);
const body          = hsl(247,  15, 35);
const label         = hsl(235,  14, 50);
const placeholder   = hsl(234,  18, 68);
const bgDark        = hsl(249,  23, 18);
const line          = hsl(233,  27, 88);
const bgLight       = hsl(231,  28, 95);
const white         = hsl(240,  45, 98);

/* --- transparent - dark --- */
const black95       = hsla(...black, 0.95);
const black75       = hsla(...black, 0.75);
const black65       = hsla(...black, 0.65);
const black40       = hsla(...black, 0.40);
const black25       = hsla(...black, 0.25);
const black10       = hsla(...black, 0.10);

/* --- transparent - white --- */
const white95       = hsla(...white, 0.95);
const white75       = hsla(...white, 0.75);
const white65       = hsla(...white, 0.65);
const white40       = hsla(...white, 0.40);
const white25       = hsla(...white, 0.25);
const white10       = hsla(...white, 0.10);

/* --- primary --- */
const primaryDark       = purple700;
const primaryAccent     = purple500;
const primaryLight      = purple200;
const primaryBg         = purple100;


/* --- secondary --- */
const secondaryDark     = blue800;
const secondaryAccent   = blue500;
const secondaryLight    = blue200;
const secondaryBg       = blue100;


/* --- success --- */
const successDark       = green800;
const successAccent     = green500;
const successLight      = green200;
const successBg         = green100;


/* --- warning --- */
const warningDark       = yellow600;
const warningAccent     = yellow500;
const warningLight      = yellow200;
const warningBg         = yellow100;


/* --- danger --- */
const dangerDark        = pink900;
const dangerAccent      = pink500;
const dangerLight       = pink200;
const dangerBg          = pink100;/**
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

    inputController.onLabelChanged (  label => {
        labelElement.textContent = /** @type {String} */ label;
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
const projectInstantInput$1 = projectInput(0)(INPUT);

/**
 * @template _T_
 * @type { DebounceInputProjectionType<_T_> }
 * @example
 * // waits for a quiet time of 200 ms before updating
 * const [label, input] = projectDebounceInput(200)(controller, "Wyss");
 */
const projectDebounceInput$1 = (quietTimeMs) => projectInput(quietTimeMs)(INPUT);

/**
 * Namespace object for the {@link IInputProjector} functions.
 * @type { IInputProjector }
 */
const InputProjector = {
    projectInstantInput: projectInstantInput$1,
    projectChangeInput,
    projectDebounceInput: projectDebounceInput$1
};/**
 * @module projector/simpleForm/simpleFormProjector
 *
 * Following the projector pattern, this module exports the projection function
 * {@link projectForm} that create respective views (and style)
 * and bind underlying models.
 * Following classical MVC, the binding is available solely through a controller.
 *
 * Projectors are _compositional_. Projecting a form means projecting multiple inputs.
 *
 * Projectors are interchangeable. Any two projectors that export the same functions
 * can be used in place of each other. This can provide a totally different "look & feel"
 * to the application while all business logic and their test cases remain untouched.
 */


/**
 * String that must be unique in CSS classes and DOM id prefixes throughout the application.
 * @private
 * @type {string}
 */
const FORM_CLASS_NAME = "kolibri-simpleForm";

/**
 * Projection function that creates a form view for input purposes with as many inputs as the formController
 * contains inputControllers, binds the information and returns the generated form view in an array.
 * Even though not strictly necessary, the return value is an array for the sake of consistency among
 * all view-generating functions.
 * @constructor
 * @impure since calling the controller functions changes underlying models. The DOM remains unchanged.
 * @param  { !SimpleFormControllerType } formController
 * @return { [HTMLFormElement] } - singleton array with form element
 * @example
 * const [form] = projectForm(controller);
 */
const projectForm = formController => {
    // create view
    const elements = dom(`
		<form>
			<fieldset class="${FORM_CLASS_NAME}">
			</fieldset>
		</form>
    `);
    /** @type { HTMLFormElement } */ const form = elements[0];
    const fieldset = form.children[0];

    formController.forEach( inputController =>
       fieldset.append(...InputProjector.projectChangeInput(inputController, FORM_CLASS_NAME)));

    return [form];
};

/**
 * CSS snippet to append to the head style when using the form projector.
 * @type { String }
 * @example
 * document.querySelector("head style").textContent += FORM_CSS;
 */
const FORM_CSS = `
    fieldset.${FORM_CLASS_NAME} {        
        padding: 2em;
        display: grid;
        grid-template-columns: max-content max-content;
        grid-row-gap:   .5em;
        grid-column-gap: 2em;     
        border-style:    none;
        box-shadow:      ${shadowCss}                          
    }
`;/**
 * @module logger/appender/arrayAppender
 * Provides an {@link AppenderType} that stores all log messages in an array.
 * Since many log messages might be generated, we need a strategy to evict old log messages.
 */


const MAX_ARRAY_ELEMENTS    = Number.MAX_SAFE_INTEGER - 1;
const MIN_ARRAY_LENGTH      = 2;
const OVERFLOW_LOG_MESSAGE  =
  "LOG ERROR: Despite running the chosen eviction strategy, the array was full! The first third of the log messages have been deleted!";

/**
 * @type { CacheEvictionStrategyType }
 * @pure
 */
const DEFAULT_CACHE_EVICTION_STRATEGY  = cache => {
  const oneThirdIndex = Math.round(cache.length / 3);
  // if oneThird is smaller than the minimum of the array length, slice the whole array.
  const deleteUntilIndex = oneThirdIndex > MIN_ARRAY_LENGTH ? oneThirdIndex: MIN_ARRAY_LENGTH;
  return cache.slice(deleteUntilIndex);
};

/**
 * Logs all log messages to an array.
 * Use {@link getValue} to get the latest array content
 * and use {@link reset} to clear the array.
 * @param { Number                    } limit           - the max amount of log messages to keep.
 * @param { CacheEvictionStrategyType } cacheEvictionStrategy  - This function is called, as soon as the
 *      defined limit of log messages is reached. You obtain the current appender
 *      value. Return a new value which will be used as the new value of this appender.
 *      If this parameter is not set, then all log messages until now will be discarded.
 * @returns {AppenderType<Array<String>>}
 */
const Appender$3 = (limit = MAX_ARRAY_ELEMENTS, cacheEvictionStrategy = DEFAULT_CACHE_EVICTION_STRATEGY) => {
  const calculatedLimit = MIN_ARRAY_LENGTH < limit ? limit: MIN_ARRAY_LENGTH;
  return {
    /**
     * the function to append trace logs in this application
     * @type { AppendCallback }
     */
    trace: appenderCallback$2(calculatedLimit)(cacheEvictionStrategy),
    /**
     * the function to append debug logs in this application
     * @type { AppendCallback }
     */
    debug: appenderCallback$2(calculatedLimit)(cacheEvictionStrategy),
    /**
     * the function to append info logs in this application
     * @type { AppendCallback }
     */
    info: appenderCallback$2(calculatedLimit)(cacheEvictionStrategy),
    /**
     * the function to append warn logs in this application
     * @type { AppendCallback }
     */
    warn: appenderCallback$2(calculatedLimit)(cacheEvictionStrategy),
    /**
     * the function to append error logs in this application
     * @type { AppendCallback }
     */
    error: appenderCallback$2(calculatedLimit)(cacheEvictionStrategy),
    /**
     * the function to append fatal logs in this application
     * @type { AppendCallback }
     */
    fatal: appenderCallback$2(calculatedLimit)(cacheEvictionStrategy),
    getValue: getValue$1,
    reset: reset$1,
  };
};

/**
 * Collects all log messages by storing them in the array.
 * @private
 * @type {Array<String>}
 */
let appenderArray = [];

/**
 * Clears the current appender array.
 * @returns {Array} - the last value before clearing
 */
const reset$1 = () => {
  const currentAppenderArray  = appenderArray;
  appenderArray               = [];
  return currentAppenderArray;
};

/**
 * @returns {Array<String>} - The current value of the appender string
 */
const getValue$1 = () => appenderArray;

/**
 * Appends the next log message to the array.
 * @private
 * @param limit
 * @type  {
 *          (limit:          Number) =>
 *          (onOverflow:     CacheEvictionStrategyType) =>
 *          (msg:            LogMeType) =>
 *          ChurchBooleanType
 *        }
 */
const appenderCallback$2 = limit => onOverflow => msg =>
  LazyIf(full(limit))
    // if the array is full, call the overflow function and add the new value afterward.
    (() => append(msg)(limit)(onOverflow))
    // in any other case just append the new message.
    (() => append(msg)(limit)(    id    ));

/**
 * Returns {@link T} if the appender array length hits the limit.
 * @param { Number } limit
 * @returns ChurchBooleanType
 * @private
 */
const full = limit => churchBool(limit <= appenderArray.length);



/**
 * Appends the given message to the array.
 * If the array length equals the param limit, the array cache will be evicted using the defined eviction strategy.
 * @private
 * @type  {
 *          (msg: !LogMeType) =>
 *          (limit: !Number) =>
 *          (evictionStrategy: !CacheEvictionStrategyType) =>
 *          ChurchBooleanType
 *        }
 */
const append = msg => limit => evictionStrategy => {
  // evict the array using the given evictionStrategy
  appenderArray =  /** @type {Array<String>} */ evictionStrategy(appenderArray);
  LazyIf(full(limit))
    (() => {
      // if array is full, despite using the set eviction strategy, use the default eviction strategy to make space.
      appenderArray = /** @type {Array<String>} */DEFAULT_CACHE_EVICTION_STRATEGY(appenderArray);
      appenderArray.push(OVERFLOW_LOG_MESSAGE);
      appenderArray.push(msg);
    })
    (() => appenderArray.push(msg));
  return /** @type {ChurchBooleanType} */ T;
};/**
 * Log levels can be compared for equality by instance identity.
 * See also {@link contains},{@link toString},{@link fromString}.
 * @pure
 * @immutable
 * @typedef { PairSelectorType<Number, String> } LogLevelType
 */

/**
 * @typedef { LOG_TRACE | LOG_DEBUG | LOG_INFO | LOG_WARN | LOG_ERROR | LOG_FATAL | LOG_NOTHING } LogLevelChoice
 */

/**
 * Alias for the use of the {@link Pair} constructor as a {@link LogLevelType}.
 * @type { PairType<Number, String> }
 * @private
 */
const LogLevel = Pair;

/**
 * Getter for the numeric value of a log level.
 * @private
 */
const levelNum = fst;

/**
 * Getter for the name of a log level.
 * @private
 */
const name$1 = snd;

/**
 * @type { LogLevelType }
 */
const LOG_TRACE = LogLevel(0)("TRACE");

/**
 * @type { LogLevelType }
 */
const LOG_DEBUG = LogLevel(1)("DEBUG");

/**
 * @type { LogLevelType }
 */
const LOG_INFO = LogLevel(2)("INFO");

/**
 * @type { LogLevelType }
 */
const LOG_WARN = LogLevel(3)("WARN");

/**
 * @type { LogLevelType }
 */
const LOG_ERROR = LogLevel(4)("ERROR");

/**
 * @type { LogLevelType }
 */
const LOG_FATAL = LogLevel(5)("FATAL");

/**
 * @type { LogLevelType }
 */
const LOG_NOTHING = LogLevel(6)("NOTHING");

/**
 * @type { Array<LogLevelType> }
 */
const ALL_LOG_LEVELS = [
  LOG_TRACE,
  LOG_DEBUG,
  LOG_INFO,
  LOG_WARN,
  LOG_ERROR,
  LOG_FATAL,
  LOG_NOTHING,
];

/**
 * Whether the logger will log at the current logging level.
 * @type { (loggingLevel: LogLevelType, loggerLevel: LogLevelType) => Boolean }
 */
const contains = (loggingLevel, loggerLevel) => loggerLevel(levelNum) >= loggingLevel(levelNum);

/**
 * @type { (logLevel: LogLevelType) => String }
 */
const toString = logLevel => logLevel(name$1);

/**
 * @type { (str: String) => EitherType<String, LogLevelType> }
 */
const fromString = str => {
  const level = ALL_LOG_LEVELS.find(logLevel => logLevel(name$1) === str);
  return level
    ? Right(level)
    : Left(`Unknown log level: "${str}"`);
};/**
 * @module logger/observableAppender
 * The observable Appender is a decorator for other {@link AppenderType}s that notifies a listener about new log messages or
 * other interesting events.
 */

/**
 * @typedef { (logLevel: LogLevelType, msg: ?String) => void } AppendListenerType
 * A log level of value {@link LOG_NOTHING} indicates that nothing has been logged, e.g. in a "reset".
 */

/**
 * The observable Appender is a decorator for other {@link AppenderType}s
 * that notifies a listener about log events that have been delegated to the decorated appender.
 * @constructor
 * @type {  <_T_>
 *     (appender: AppenderType<_T_>) =>
 *     (listener: AppendListenerType) =>
 *     AppenderType<_T_>
 * }
 */
const Appender$2 = appender => listener => (
  /** @type {AppenderType} */ {
    trace:  arg => { const x = appender.trace(arg); listener(LOG_TRACE, arg); return x },
    debug:  arg => { const x = appender.debug(arg); listener(LOG_DEBUG, arg); return x },
    info:   arg => { const x = appender.info (arg); listener(LOG_INFO , arg); return x },
    warn:   arg => { const x = appender.warn (arg); listener(LOG_WARN , arg); return x },
    error:  arg => { const x = appender.error(arg); listener(LOG_ERROR, arg); return x },
    fatal:  arg => { const x = appender.fatal(arg); listener(LOG_FATAL, arg); return x },
    reset:  ()  => { const x = appender.reset();  listener(LOG_NOTHING); return x }, // we notify via log nothing to indicate the reset
    getValue: appender.getValue
  });/**
 * Provides an appender that logs to the console how many log messages have been issued on the various levels.
 * @returns { AppenderType<StatisticType> }
 * @constructor
 */
const Appender$1 = () => ({
  trace: trace$1,
  debug: debug$1,
  info: info$1,
  warn: warn$1,
  error: error$1,
  fatal: fatal$1,
  getValue,
  reset,
});

/**
 * @typedef { {warn: Number, trace: Number, debug: Number, error: Number, info: Number, fatal: Number} } StatisticType
 */

/**
 * @type { StatisticType }
 */
let statistic = { trace: 0, debug: 0, info: 0, warn: 0, error: 0, fatal: 0};

/**
 * Resets the values of all level to zero.
 * @return { StatisticType }
 */
const reset = () => {
  statistic = { trace: 0, debug: 0, info: 0, warn: 0, error: 0, fatal: 0 };
  return statistic
};

/**
 * Returns an object with summarized counter values.
 * @returns { StatisticType }
 */
const getValue = () => statistic;

/**
 * @type { (String) => (callback:ConsumerType<String>) => (String) => ChurchBooleanType }
 */
const appenderCallback$1 = type => callback => msg => {
  statistic[type] = statistic[type] + 1;
  callback(` (${statistic[type]}) ` + msg);
  return /** @type {ChurchBooleanType} */T;
};

/**
 * the function to append trace logs in this application
 * @type { AppendCallback }
 */
const trace$1 = appenderCallback$1("trace")(console.trace);

/**
 * the function to append debug logs in this application
 * @type { AppendCallback }
 */
const debug$1 = appenderCallback$1("debug")(console.debug);

/**
 * the function to append info logs in this application
 * @type { AppendCallback }
 */
const info$1 = appenderCallback$1("info")(console.info);

/**
 * the function to append warn logs in this application
 * @type { AppendCallback }
 */
const warn$1 = appenderCallback$1("warn")(console.warn);

/**
 * the function to append error logs in this application
 * @type { AppendCallback }
 */
const error$1 = appenderCallback$1("error")(console.error);

/**
 * the function to append fatal logs in this application
 * @type { AppendCallback }
 */
const fatal$1 = appenderCallback$1("fatal")(console.error);/**
 * Provides console appender.
 * Using this appender you are able to log to the console.
 * @returns { AppenderType<void> }
 * @constructor
 */
const Appender = () => ({
  trace,
  debug,
  info,
  warn,
  error,
  fatal,
  getValue: () => { /* Nothing to do */ },
  reset:    () => { /* Nothing to do */ }
});

/**
 * @type { (AppendCallback) => (String) => ChurchBooleanType }
 */
const appenderCallback = callback => msg => {
  callback(msg);
  return /** @type {ChurchBooleanType} */ T; // logging a string to the console cannot fail
};

/**
 * the function to append trace logs in this application
 * @type { AppendCallback }
 */
const trace = appenderCallback(console.trace);

/**
 * the function to append debug logs in this application
 * @type { AppendCallback }
 */
const debug = appenderCallback(console.debug);

/**
 * the function to append debug logs in this application
 * @type { AppendCallback }
 */
const info = appenderCallback(console.info);

/**
 * the function to append warn logs in this application
 * @type { AppendCallback }
 */
const warn = appenderCallback(console.warn);

/**
 * the function to append error logs in this application
 * @type { AppendCallback }
 */
const error = appenderCallback(console.error);

/**
 * the function to append fatal logs in this application
 * @type { AppendCallback }
 */
const fatal = appenderCallback(console.error);/**
 * This files contains all non-private types of the Kolibri's logging framework.
 * CONVENTION: All @typedef have the suffix "Type".
 */

// typedefs

/**
 * @typedef { String } LogContextType
 * The LogContextType is a {@link String} that has a special meaning for both,
 * the logger (setting the context for which the log will appear) and
 * the logging (setting the filter for which logs currently appear).
 * Logs will appear if the logging context is a prefix of the logger context.
 */

/**
 * LogMe is something that can be logged.
 * It represents a log message.
 * To log a simple message, just use a {@link String}.
 * If the log message is based on some calculations, you should consider to use a {@link ProducerType},
 * because the message can be lazily evaluated.
 * @typedef {String | ProducerType<String>} LogMeType
 */

/**
 * Provides appender for loglevel types  "trace", "debug", "info", "warn", "error" & "fatal".
 * Some appender may have a result, that can be collected using the getValue function.
 * @typedef { object } AppenderType
 * @template _ValueType_
 * @property { AppendCallback } trace - Defines the appending strategy for the {@link LOG_TRACE}-level messages.
 * @property { AppendCallback } debug - Defines the appending strategy for the {@link LOG_DEBUG}-level messages.
 * @property { AppendCallback } info  - Defines the appending strategy for the {@link LOG_INFO}-level messages.
 * @property { AppendCallback } warn  - Defines the appending strategy for the {@link LOG_WARN}-level messages.
 * @property { AppendCallback } error - Defines the appending strategy for the {@link LOG_ERROR}-level messages.
 * @property { AppendCallback } fatal - Defines the appending strategy for the {@link LOG_FATAL}-level messages.
 * @property { function(String=): _ValueType_} getValue - Some appender may produce a result, that can be collected using getValue.
 * @property { function(): _ValueType_ } reset - Clean up the appender result. The next call of getValue returns the default value.
 */

/**
 * An object which consists of functions of type {@link Log}.
 * @typedef LoggerType
 * @property { Log } trace  - a function which logs a {@link LogMeType} on level {@link LOG_TRACE}
 * @property { Log } debug  - a function which logs a {@link LogMeType} on level {@link LOG_DEBUG}
 * @property { Log } info   - a function which logs a {@link LogMeType} on level {@link LOG_INFO}
 * @property { Log } warn   - a function which logs a {@link LogMeType} on level {@link LOG_WARN}
 * @property { Log } error  - a function which logs a {@link LogMeType} on level {@link LOG_ERROR}
 * @property { Log } fatal  - a function which logs a {@link LogMeType} on level {@link LOG_FATAL}
 */

// callbacks

/**
 * A function that takes logging arguments and creates a formatted string.
 * @callback FormatLogMessage
 * @function
 * @pure
 * @type { (context: String) => (logLevel: String) => (logMessage: String) => String}
 */

/**
 * Logs a given message.
 * @callback Log
 * @param { LogMeType }
 * @returns { ChurchBooleanType } - {@link T} if the logging was successful
 *
 */

/**
 * The currently active logging level for this application.
 * @callback PrioritySupplier
 * @return { LogLevelType }
 */

/**
 * @typedef { UnaryOperatorType<Array<String>> } CacheEvictionStrategyType
 */

/**
 * A callback which appends log messages in a desired way.
 * If the message has been appended successfully, {@link T} is returned.
 * @callback AppendCallback
 * @param { !String } message - appender work on a string, any lazy evaluation has to be done before
 * @impure since appending a message always has side effects.
 * @returns { ChurchBooleanType }
 * @example
 * const append = msg => {
 *  console.log(msg);
 *  return T;
 * }
 *///                                                                -- logging level --

/**
 * This is a singleton state.
 * The currently active logging level.
 * Only messages from loggers whose have at least this log level are logged.
 * Default log level is {@link LOG_INFO}.
 * @type { IObservable<LogLevelType> }
 * @private
 */
const loggingLevelObs = Observable(LOG_INFO);

/**
 * This function can be used to set the logging level for the logging framework.
 * Only messages whose have at least the set log level are logged.
 * @param { LogLevelChoice } newLoggingLevel
 * @example
 * setLoggingLevel(LOG_DEBUG);
 */
const setLoggingLevel = loggingLevelObs.setValue;

/**
 * Getter for the loggingLevel.
 * @return { LogLevelType } - the currently active logging level
 */
const getLoggingLevel = loggingLevelObs.getValue;

/**
 * What to do when the logging level changes.
 * @impure
 * @type { (cb:ValueChangeCallback<LogLevelType>) => void }
 */
const onLoggingLevelChanged = loggingLevelObs.onChange;

//                                                                -- logging context --

/**
 * This is a singleton state.
 * The currently active logging context.
 * Only loggers whose context have this prefix are logged.
 * @type { IObservable<LogContextType> }
 * @private
 */
const loggingContextObs = Observable("");

/**
 * This function can be used to define a logging context for the logging framework.
 * Messages will only be logged, if the logger context is more specific than the logging context.
 * @param { LogContextType } newLoggingContext - the newly set context to log
 * @example
 * setLoggingContext("ch.fhnw");
 * // logging context is now set to "ch.fhnw"
 * // loggers with the context "ch.fhnw*" will be logged, all other messages will be ignored.
 */
const setLoggingContext = loggingContextObs.setValue;

// noinspection JSUnusedGlobalSymbols
/**
 * Getter for the logging context.
 * @return { LogContextType } - the current logging context
 */
const getLoggingContext = loggingContextObs.getValue;

/**
 * What to do when the logging context changes.
 * @impure
 * @type { (cb:ValueChangeCallback<LogContextType>) => void }
 */
const onLoggingContextChanged = loggingContextObs.onChange;

//                                                                -- logging message formatter --

/**
 * The formatting function used in this logging environment.
 * @type { IObservable<FormatLogMessage> }
 * @private
 */
const messageFormatterObs = Observable(_context => _logLevel => id);

/**
 * This function can be used to specify a custom function to format the log message.
 * When it is set, it will be applied to each log message before it gets logged.
 * @param { FormatLogMessage } formattingFunction
 * @example
 * const formatLogMsg = context => logLevel => logMessage => {
 *   const date = new Date().toISOString();
 *   return `[${logLevel}]\t${date} ${context}: ${logMessage}`;
 * }
 * setMessageFormatter(formatLogMsg);
 */
const setMessageFormatter = messageFormatterObs.setValue;

/**
 * Returns the current formatting function. Can be useful to store and reset after change.
 * @type { () => FormatLogMessage }
 */
const getMessageFormatter = messageFormatterObs.getValue;

/**
 * What to do when the log formatting function changes.
 * @impure
 * @type { (cb:ValueChangeCallback<FormatLogMessage>) => void }
 */
const onMessageFormatterChanged = messageFormatterObs.onChange;

//                                                                -- logging appender list --

/**
 * This is a singleton state.
 * @private
 * @type { Array<AppenderType> }
 */
const appenders = [];

/**
 * This is a singleton state.
 * The currently active {@link AppenderType}.
 * @type { IObservableList<AppenderType> }
 * @private
 */
const appenderListObs = ObservableList(appenders);

/**
 * @type { () => Array<AppenderType> }
 */
const getAppenderList = () => appenders;

/**
 * Adds one or multiple {@link AppenderType AppenderType's} to the appender list.
 * @param { ...AppenderType } newAppender
 */
const addToAppenderList = (...newAppender) => newAppender.forEach(app => appenderListObs.add(app));

/**
 * Removes a given {@link AppenderType} from the current appender list.
 * @impure
 * @param   { AppenderType } appender
 */
const removeFromAppenderList = appenderListObs.del;

/**
 * @impure
 * @type { (cb: ConsumerType<AppenderType>) => void }
 */
const onAppenderAdded   = appenderListObs.onAdd;

/**
 * @impure
 * @type { (cb: ConsumerType<AppenderType>) => void }
 */
const onAppenderRemoved = appenderListObs.onDel;/**
 * Yields a configured log function called "logger".
 * Processes all log actions, which have a {@link LogLevelType} equals or beneath
 * the {@link LogLevelType} returned by the function "loggingLevel".
 *
 * Furthermore, each log statement has a context, see {@link LogContextType}.
 * The log message will only be logged, if the loggingContext
 * (set with {@link setLoggingContext}) is a prefix of the logger context.
 *
 * The result of the callback function {@link FormatLogMessage}
 * will be logged using the given {@link AppendCallback}.
 *
 * What's the difference between "logger" and "logging" and "log"?
 *
 * Every abstraction (level, context, etc.) that starts with "logger"
 * applies to the _use_ of the log facility in application code.
 *
 * Every abstraction (level, context, etc.) the starts with "logging"
 * applies to the current state or _configuration_ of the log facility that
 * determines which log statements should currently appear.
 *
 * The word "log" is used when the abstraction can be used for both, the logger and the logging
 *
 * @function
 * @pure if the {@link AppendCallback} in the appender list and the parameter msgFormatter of type {@link FormatLogMessage} are pure.
 * @type    {
 *               (loggerLevel:      LogLevelChoice)
 *            => (loggerContext:    LogContextType)
 *            => (msg:              LogMeType)
 *            => Boolean
 *          }
 * @private
 * @example
 * const log = logger(LOG_DEBUG)("ch.fhnw");
 * log("Andri Wild");
 * // logs "Andri Wild" to console
 */
const logger = loggerLevel => loggerContext => msg =>
  messageShouldBeLogged(loggerLevel)(loggerContext)
  ? getAppenderList()
      .map(appender => {
          const levelName      = toString(loggerLevel);
          const levelCallback  = appender[levelName.toLowerCase()];
          let success          = true;
          let evaluatedMessage = "Error: cannot evaluate log message: '" + msg + "'!";
          try {
              evaluatedMessage = evaluateMessage(msg);                                    // message eval can fail
          } catch (e) {
              success = false;
          }
          let formattedMessage = "Error: cannot format log message! '" + evaluatedMessage + "'!";
          try {
              formattedMessage = getMessageFormatter()(loggerContext)(levelName)(evaluatedMessage); // formatting can fail
          } catch (e) {
              success = false;
          }
          // because of evaluation order, a possible eval or formatting error message will be logged
          // at the current level, context, and appender and will thus be visible. See test case.
          return levelCallback(formattedMessage) && success;
      })
      .every(id) // all appenders must succeed
  : false ;

/**
 * Decides if a logger fulfills the conditions to be logged.
 * @type { (loggerLevel: LogLevelType) => (loggerContext: LogContextType) => Boolean }
 * @private
 */
const messageShouldBeLogged = loggerLevel => loggerContext =>
  logLevelActivated(loggerLevel) && contextActivated (loggerContext) ;

/**
 * Returns whether the loggerLevel will log under the current loggingLevel.
 * @type { (loggerLevel: LogLevelChoice) => Boolean }
 * @private
 */
const logLevelActivated = loggerLevel => contains(getLoggingLevel(), loggerLevel);

/**
 * Returns true if the {@link getLoggingContext} is a prefix of the logger context.
 * @type   { (loggerContext: LogContextType) => Boolean }
 * @private
 */
const contextActivated = loggerContext => loggerContext.startsWith(getLoggingContext());

/**
 * if the param "msg" is a function, it's result will be returned.
 * Otherwise, the parameter itself will be returned.
 * This allows for both eager and lazy log messages.
 * @param   { !LogMeType } msg - the message to evaluate
 * @returns { String } the evaluated message
 * @private
 */
const evaluateMessage = msg => msg instanceof Function ? msg() : msg;

/**
 * Creates a new logger at log level {@link LOG_TRACE}.
 * @example
 * const trace = traceLogger("ch.fhnw")(_context => _level => id);
 * trace("a message to log to console");
 * // writes "a message to log to console" to the console
 */
const traceLogger =  logger(LOG_TRACE);

/**
 * Creates a new logger at log level {@link LOG_DEBUG}.
 * @example
 * const debug = debugLogger("ch.fhnw")(_context => _level => id);
 * debug("a message to log to console");
 * // writes "a message to log to console" to the console
 */
const debugLogger =  logger(LOG_DEBUG);

/**
 * Creates a new logger at log level {@link LOG_INFO}.
 * @example
 * const debug = infoLogger("ch.fhnw")(_context => _level => id);
 * debug("a message to log to console");
 * // writes "a message to log to console" to the console
 */
const infoLogger = logger(LOG_INFO);

/**
 * Creates a new logger at log level {@link LOG_WARN}.
 * @example
 * const warn = warnLogger("ch.fhnw")(_context => _level => id);
 * warn("a message to log to console");
 * // writes "a message to log to console" to the console
 */
const warnLogger = logger(LOG_WARN);

/**
 * Creates a new logger at log level {@link LOG_ERROR}.
 * @example
 * const error = errorLogger("ch.fhnw")(_context => _level => id);
 * error("a message to log to console");
 * // writes "a message to log to console" to the console
 */
const errorLogger = logger(LOG_ERROR);

/**
 * Creates a new logger at log level {@link LOG_FATAL}.
 * @example
 * const fatal = fatalLogger("ch.fhnw")(_context => _level => id);
 * fatal("a message to log to console");
 * // writes "a message to log to console" to the console
 */
const fatalLogger = logger(LOG_FATAL);/**
 * @module logger/loggerFactory
 * Public convenience API for creating loggers.
 */

/**
 * Constructs a logger for each log level using the given context.
 * @param { LogContextType } context
 * @returns { LoggerType }
 * @constructor
 * @example
 * const { trace, debug } = LoggerFactory("ch.fhnw");
 * trace("Tobias Wyss") // a log message appended on the loglevel {@link LOG_TRACE}
 * debug("Andri Wild")  // a log message appended on the loglevel {@link LOG_DEBUG}
 */
const LoggerFactory = context => /** @type { LoggerType } */({
      trace:  traceLogger(context),
      debug:  debugLogger(context),
      info:   infoLogger (context),
      warn:   warnLogger (context),
      error:  errorLogger(context),
      fatal:  fatalLogger(context),
});/**
 * Make basic logging controls available in the browser console
 * by putting them in the window object.
 * @example
 * // usually in your starter.js
 * import "../kolibri/logger/loggingSupport.js"
 */

window["LOG_TRACE"  ] = LOG_TRACE  ;
window["LOG_DEBUG"  ] = LOG_DEBUG  ;
window["LOG_INFO"   ] = LOG_INFO   ;
window["LOG_WARN"   ] = LOG_WARN   ;
window["LOG_ERROR"  ] = LOG_ERROR  ;
window["LOG_FATAL"  ] = LOG_FATAL  ;
window["LOG_NOTHING"] = LOG_NOTHING;

window["setLoggingLevel"  ] = setLoggingLevel  ;
window["setLoggingContext"] = setLoggingContext;let idPostfix = 0; // makes sure we have unique ids in case of many such controls

/**
 * Projects a select to change the global logging level.
 * This is a specialized projector that might later be generalized into a projector that
 * allows choosing from an arbitrary list of values.
 *
 * @param   { SimpleInputControllerType<String> }  loggingLevelController
 * @return  { [HTMLLabelElement, HTMLSelectElement] } - Label & Select Element
 */
const projectLoggingChoice = loggingLevelController => {
  const id = `loggingLevels-${idPostfix++}`;
  const [label, select] = dom(`
          <label for="${id}"></label>
          <select name="levels" id="${id}">
            <option value="${toString(LOG_TRACE)}"  > ${toString(LOG_TRACE)}  </option>
            <option value="${toString(LOG_DEBUG)}"  > ${toString(LOG_DEBUG)}  </option>
            <option value="${toString(LOG_INFO)}"   > ${toString(LOG_INFO)}   </option>
            <option value="${toString(LOG_WARN)}"   > ${toString(LOG_WARN)}   </option>
            <option value="${toString(LOG_ERROR)}"  > ${toString(LOG_ERROR)}  </option>
            <option value="${toString(LOG_FATAL)}"  > ${toString(LOG_FATAL)}  </option>
            <option value="${toString(LOG_NOTHING)}"> ${toString(LOG_NOTHING)}</option>
          </select> 
  `);

  // data binding
  loggingLevelController.onValueChanged(levelStr => select.value = levelStr);
  loggingLevelController.onLabelChanged(labelStr => label.textContent = /** @type { String } */ labelStr);

  // view binding
  select.onchange = _event => loggingLevelController.setValue(select.value);

  return /** @type { [HTMLLabelElement, HTMLSelectElement] } */ [label, select];
};/**
 * @typedef LoggingUiControllerType
 * @property { SimpleInputControllerType<String> } loggingContextController
 * @property { SimpleInputControllerType<String> } loggingLevelController
 * @property { SimpleInputControllerType<String> } lastLogMessageController
 */

/**
 * Processes the actions from the user interface and manages the model.
 * It allows the view to bind against the model.
 * @return { LoggingUiControllerType }
 * @constructor
 * @impure It adds an observable appender to the list of appenders.
 */
const LoggingUiController = () => {

  const setLoggingLevelByString = levelStr =>
    fromString(levelStr)
      (msg   => { throw new Error(msg); })
      (level => setLoggingLevel(level));

  const loggingLevelController = SimpleInputController({
    value:  toString(getLoggingLevel()),
    label:  "Logging Level",
    name:   "loggingLevel",
    type:   "text", // we treat the logging level as a string in the presentation layer
  });
  // presentation binding: when the logging level string changes, we need to set the global logging level
  loggingLevelController.onValueChanged(setLoggingLevelByString);
  // domain binding: when the global logging level changes, we need to update the string of the logging level
  onLoggingLevelChanged(level => loggingLevelController.setValue(toString(level)));

  const loggingContextController = SimpleInputController({
    value:  getLoggingContext(),
    label:  "Logging Context",
    name:   "loggingContext",
    type:   "text",
  });
  // presentation binding: when the string of the context changes, we need to update the global logging context
  loggingContextController.onValueChanged(contextStr => setLoggingContext(contextStr));
  // domain binding: when the global logging context changes, we need to update the string of the logging context
  onLoggingContextChanged(context => loggingContextController.setValue(context));

  const lastLogMessageController = SimpleInputController({
    value:  "no message, yet",
    label:  "Last Log Message",
    name:   "lastLogMessage",
    type:   "text",
  });
  const observableAppender = Appender$2
    ( Appender$1() )
    ( (level, msg) => lastLogMessageController.setValue(msg));

  addToAppenderList(observableAppender);



  return {
    loggingLevelController,
    loggingContextController,
    lastLogMessageController,
  }
};const {projectDebounceInput, projectInstantInput} = InputProjector;

/**
 * Creates the log ui as a div and binds the level, context, and message controllers.
 * @param { LoggingUiControllerType }   logUiController
 * @return { Array<HTMLDivElement> }
 * @impure adds the style element to the document head
 */
const projectLoggingUi = logUiController => {

  const [configSection] = /** @type { Array<HTMLDivElement> } */ dom(`
    <div class="logging-ui-config"></div>
  `);

  configSection.append(...projectDebounceInput(200)(logUiController.loggingContextController, "context"));
  configSection.append(...projectLoggingChoice(     logUiController.loggingLevelController));
  configSection.append(...projectInstantInput(      logUiController.lastLogMessageController, "lastLogMessage"));

  return [configSection];
};

const LOGGING_UI_CSS = `
  .logging-ui-config {
      padding:                2rem;
      display:                grid;
      grid-template-columns:  auto 1fr;
      grid-gap:               1em 2em;
      box-shadow:             ${shadowCss},
  }
  .logging-ui-config input {
      width: 100%;
  }
`;/**
 * @module util/test
 * The test "framework", exports the Suite function plus a total of how many assertions have been tested
 */

/**
 * The running total of executed test assertions.
 * @impure the reference does not change, but the contained value. Listeners will produce side effects like DOM changes.
 * @type { IObservable<Number> }
 */
const total = Observable(0);

/** @type { (Number) => void } */
const addToTotal = num => total.setValue( num + total.getValue());

/** @typedef equalityCheckFunction
 * @template _T_
 * @function
 * @param { _T_ } actual
 * @param { _T_ } expected
 * @return void
 * */

/**
 * @typedef  { Object }  AssertType
 * @property { Array<String> }         messages - stores all assertions messages, one for each entry in "results"
 * @property { Array<Boolean> }        results  - stores all assertion results
 * @property { (Boolean)  => void }    isTrue   - assert that expression is true, side effects "results" and "messages"
 * @property { equalityCheckFunction } is       - assert that two expressions are equal,
 *                                                side effects "results" and "messages", and
 *                                                logs an error to the console incl. stack trace in case of failure.
 */

/**
 * A newly created Assert object is passed into the {@link test} callback function where it is used to
 * assert test results against expectations and keep track of the results for later reporting.
 * Follows GoF "Collecting Parameter Pattern".
 * @return { AssertType }
 * @constructor
 * @impure assembles test results.
 */
const Assert = () => {
    /** @type Array<Boolean> */ const results  = []; // [Bool], true if test passed, false otherwise
    /** @type Array<String> */  const messages = [];
    return {
        results,
        messages,
        isTrue: testResult => {
            let message = "";
            if (!testResult) {
                console.error("test failed");
                message = "not true";
            }
            results.push(testResult);
            messages.push(message);
        },
        is: (actual, expected) => {
            const testResult = actual === expected;
            let message = "";
            if (!testResult) {
                message = "Got '"+ actual +"', expected '" + expected +"'";
                console.error(message);
            }
            results.push(testResult);
            messages.push(message);
        }
    }
};

/**
 * @private data type to capture the test to-be-run. A triple of ctor and two getter functions.
 */
const [Test, name, logic] = Tuple(2);

/**
 * @callback TestCallback
 * @param { AssertType } assert
 */

/**
 * Creates a new assert object, passes it into the callback for execution, and reports the result.
 * Follows Smalltalk Best Practice Patterns: "Method Around Pattern".
 * @param { String } name - name of the test. Should be unique inside the {@link TestSuite}.
 * @param { TestCallback } callback
 * @private
 */
const test = (name, callback) => {
    const assert = Assert();
    callback(assert);
    report(name, assert.results, assert.messages);
};

/**
 * @callback AsyncTestCallback
 * @param    { AssertType } assert
 * @return   { Promise }
 */
/**
 * Testing async logic requires the testing facility to do out-of-order reporting.
 * These tests do not live in a suite but are run separately.
 * @param { String } name - name for the test report
 * @param { AsyncTestCallback } asyncCallback - test logic that returns a promise such that reporting can wait for completion
 */
const asyncTest = (name, asyncCallback) => {
    const assert = Assert();
    asyncCallback(assert) // returns a promise
        .catch( _ => {
            assert.results.unshift(false);
            assert.messages.unshift(name + " promise rejected");
        })
        .finally ( _ => {
            report(name, assert.results, assert.messages);
            addToTotal(assert.results.length);
        });
};

/**
 * @typedef { Object } TestSuiteType
 * @property { (testName:String, callback:TestCallback) => void } test - running a test function for this suite
 * @property { (testName:String, callback:TestCallback) => void } add  - adding a test function for later execution
 * @property {                                       () => void } run - running and reporting the suite
 */
/**
 * Tests are organised in test suites that contain test functions. These functions are added before the suite
 * itself is "run", which in turn executes the tests and reports the results.
 * @param  { String } suiteName
 * @return { TestSuiteType }
 * @constructor
 * @example
 * const suite = TestSuite("mySuite");
 * suite.add("myName", assert => {
 *     assert.is(true, true);
 *  });
 *  suite.run();
 */
const TestSuite = suiteName => {
    const tests = []; // [Test]
    return {
        test: (testName, callback) => test(suiteName + "-"+ testName, callback),
        add:  (testName, callback) => tests.push(Test (testName) (callback)),
        run:  () => {
            const suiteAssert = Assert();
            tests.forEach( test => test(logic) (suiteAssert) );
            addToTotal(suiteAssert.results.length);
            if (suiteAssert.results.every( id )) { // whole suite was ok, report whole suite
                report(suiteName, suiteAssert.results, suiteAssert.messages);
            } else { // some test in suite failed, rerun tests for better error indication
                tests.forEach( testInfo => test( testInfo(name), testInfo(logic) ) );
            }
        }
    };
};

/**
 * If all test results are ok, report a summary. Otherwise, report the individual tests.
 * @param { String }         origin
 * @param { Array<Boolean> } results
 * @param { Array<String> }  messages
 * @private
 */
const report = (origin, results, messages) => {
    const okStyle     = `style="color: ${okColor};"`;
    const failedStyle = `style="color: ${accentColor};"`;

    if ( results.every( elem => elem) ) {
        write (`
            <!--suppress ALL -->
            <div>${results.length}</div>
            <div>tests in </div> 
            <div>${origin}</div>
            <div ${okStyle}">ok</div> 
        `);
        return;
    }
    write(`
            <!--suppress ALL -->
            <div></div>
            <div>tests in </div> 
            <div>${origin}</div>
            <div ${failedStyle}>failed</div> 
    `);
    results.forEach((result, idx) => {
        if (result) return;
        write(`
                <!--suppress ALL -->
                <div></div>
                <div>assertion </div> 
                <div ${failedStyle}>#${idx+1}: ${messages[idx]}</div>
                <div ${failedStyle}>failed</div> 
        `);
    });
};

/**
 * Write the formatted test results in the holding report HTML page.
 * @param { !String } html - HTML string of the to-be-appended DOM
 * @private
 */
const write = html => out.append(...dom(html));const release     = "0.2.6";

const dateStamp   = "2023-04-12 T 17:22:20 MESZ";

const versionInfo = release + " at " + dateStamp;

const stamp       = () => Math.random().toString(36).slice(2).padEnd(11,"X").slice(0,11);

/**
 * A constant random string of 22 lowercase characters/digits, probability: 1 of 36 ** 22 > 1.7e+34,
 * generated at construction time.
 * The typical use case is to identify the client in a team application / multi-user environment
 * such that value changes can be properly attributed and conflicts can be avoided.
 * @type { String }
 */
const clientId    = stamp() + stamp();/**
 * @module lambda/ski
 * The SKI combinators for the church encoding of lambda calculus wrt the Smullyan bird names.
 * Recommended reading: https://en.wikipedia.org/wiki/SKI_combinator_calculus,
 * https://www.angelfire.com/tx4/cus/combinator/birds.html.
 * Graham Hutton: https://www.youtube.com/watch?v=9T8A89jgeTI
 */


/**
 * Identity, Ibis, I.
 * See {@link id}.
 */
const I = id ;

/**
 * Mockingbird, M, \f.ff , self-application of f.
 * Is also SII and the boolean "or" operator.
 * Basis for the Y combinator.
 * @type {function(function): function}
 */
const M = f => f(f);  // beta(f)(f)

/**
 * Kestrel, K, c, konst, fst, \x. \y. x .
 * See also {@link c}.
 */
const K = c;

/**
 * Cardinal, C, flip, \fxy.fyx .
 * It also is the boolean "not" operator.
 * See also {@link flip}.
 */
const C = flip;

/**
 * Kite, KI, snd, kite, \x. \y. y .
 * See also {@link snd}.
 */
const KI  = snd;

/**
 * Bluebird B, function composition, cmp,  \fg.S(Kf)g .
 * Also: multiplication for church numerals.
 */
const B = cmp;

/**
 * Blackbird BB, function composition with two curried args, cmp2,  \fg.S(Kf)g .
 * Used for the boolean "xor" operator.
 * See also {@link cmp2}.
 */
const BB = cmp2;

/**
 * Starling, S, \abc.ac(bc) .
 * One of the SKI "atoms".
 * Identity can be written as S(K)(K).
 */
const S = f => g => x => f(x)(g(x));

// The Y combinator appears only as a comment here, because it is of little use in a strict language.
// Y combinator: \f. (\x.f(x x)) (\x.f(x x))
// Y = f => ( x => f(x(x)) )  ( x => f(x(x)) )
// Y is a fixed point for every f: Y(f) == Y(Y(f))
// \f. M(\x. f(Mx))
// f => M(x => f(M(x)))

/**
 * Z combinator, \f. M(\x. f(\v. Mxv)) .
 * The replacement for the Y combinator in a strict language to capture recursion and looping.
 */
const Z = f => M(x => f(v => M(x)(v) ));

// noinspection GrazieInspection
/**
 * Thrush combinator, Th, CI (Cardinal after Identity),  \af.fa .
 */
const Th = f => g => g(f);

/**
 * Vireo combinator, V, Pair, \abf.fab .
 * See also {@link Pair}.
 */
const V = Pair;/**
 * @module lambda/churchNumbers
 * Peano numbers in the church encoding and their operations.
 */


/**
 * Peano numbers in the church encoding.
 * The number n is also immediately an n-loop over its function argument.
 * @typedef { (f:FunctionAtoBType<ChurchNumberType,ChurchNumberType>) => (x:ChurchNumberType) => ChurchNumberType } ChurchNumberType
 */

/**
 * The zero number in the church encoding.
 * @type { ChurchNumberType }
 */
const n0 = _f => x => x;
/**
 * The one number in the church encoding.
 * @type { ChurchNumberType }
 */
const n1 = f => x => f(x);
/**
 * The two number in the church encoding.
 * @type { ChurchNumberType }
 */
const n2 = f => x => f(f(x));
/**
 * The three number in the church encoding.
 * @type { ChurchNumberType }
 */
const n3 = f => x => f(f(f(x)));
/** @type { ChurchNumberType } */

/**
 * The successor function for the church encoding of numbers.
 * @type { (n:ChurchNumberType) => ChurchNumberType }
 */
const succ = n => ( f => cmp(f) (n(f)) );

/**
 * The number four in the church encoding.
 * @type {ChurchNumberType}
 */
const n4 = succ(n3);
/**
 * The number five in the church encoding.
 * @type {ChurchNumberType}
 */
const n5 = succ(n4);
/**
 * The number six in the church encoding.
 * @type {ChurchNumberType}
 */
const n6 = succ(n5);
/**
 * The number seven in the church encoding.
 * @type {ChurchNumberType}
 */
const n7 = succ(n6);
/**
 * The number eight in the church encoding.
 * @type {ChurchNumberType}
 */
const n8 = succ(n7);
/**
 * The number nine in the church encoding.
 * @type {ChurchNumberType}
 */
const n9 = succ(n8);

/**
 * The plus operation on peano numbers in the church encoding.
 * @type { (ChurchNumberType) => (ChurchNumberType) => ChurchNumberType }
 */
const plus = cn1 => cn2 => cn2(succ)(cn1)  ;

/**
 * The multiplication operation on peano numbers in the church encoding.
 * @type { (ChurchNumberType) => (ChurchNumberType) => ChurchNumberType }
 */
const mult = cmp;

/**
 * The power operation on peano numbers in the church encoding.
 * @type { (ChurchNumberType) => (ChurchNumberType) => ChurchNumberType }
 */
const pow = cn1 => cn2 => cn2 (cn1) ;

/**
 * The is-zero check on peano numbers in the church encoding.
 * @type { (ChurchNumberType) => ChurchBooleanType }
 */
const isZero = cn => /** @type { ChurchBooleanType } **/ cn (c(F)) (T); // We need a cast since we don't return a church numeral.

/**
 * Convert a js number to a church numeral.
 * Only works for non-negative integral numbers.
 * @type { (n:Number) => ChurchNumberType }
 */
const churchNum = n => n === 0 ? n0 : succ(churchNum(n - 1));

/**
 * Convert a church numeral to a js number.
 * @type { (ChurchNumberType) => Number }
 */
const jsNum = cn => /** @type { Number } */ cn (n => n+1) (0); // We need a cast since we don't return a church numeral.

/**
 * phi combinator. Used internally for minus of church numbers.
 * Creates a new pair, replace first value with the second and increase the second value
 * @private
 * @type { (p:PairType<ChurchNumberType, ChurchNumberType>) => Pair<ChurchNumberType, ChurchNumberType> }
 */
const phi = p => Pair(p(snd))(succ(p(snd)));

/**
 * "less-than-or-equal-to" with church numbers
 * @type { (n:ChurchNumberType) => (k:ChurchNumberType) => ChurchBooleanType }
 */
const leq = n => k => isZero(minus(n)(k));

/**
 * "equal-to" with church numbers.
 * @type { (n:ChurchNumberType) => (k:ChurchNumberType) => ChurchBooleanType }
 */
const eq = n => k => and(leq(n)(k))(leq(k)(n));

/**
 * Predecessor of a church number. Opposite of succ.
 * Minimum is zero. Is needed for "minus".
 * @type { (n:ChurchNumberType) => ChurchNumberType }
 */
const pred = n => n(phi)(Pair(n0)(n0))(fst);

/**
 * Subtraction with two Church-Numbers
 * @type { (n:ChurchNumberType) => (k:ChurchNumberType) => ChurchNumberType }
 */
const minus = n => k => k(pred)(n);/**
 * Representing the client of an HTTP request.
 * @param { !String } url - the url to fetch as a string. Mandatory.
 * @param { "GET"|"PUT"|"POST"|"DELETE"|"HEAD"|"OPTION" } method - HTTP request method, default: "GET"
 * @param { ?Object} data - payload data for PUT or POST requests, will be converted to JSON
 * @return { Promise<JSON> } a promise that is either
 *          rejected with an error code because the fetch failed or
 *          resolved with the JSON payload being parsed.
 * @example
   client(URL)
   .then( data => {
       console.log(data.firstname); // work with data
   })
   .catch( err => console.error(err));
 */
const client = (url, method = 'GET', data = null) => {
    const request = {
        method:      method,             // *GET, POST, PUT, DELETE, etc.
        mode:        'same-origin',      // no-cors, *cors, same-origin
        cache:       'no-cache',         // no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin',      // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json', // 'application/x-www-form-urlencoded'
        },
        redirect:    'follow',             // manual, *follow, error
        referrer:    'no-referrer',        // no-referrer, *client
    };
    if (null != data) {
        request.body = JSON.stringify(data);
    }
    return fetch(url, request)
        .then(resp => {                             // fetch API cares for the general error handling
            if (Number(resp.status) === 204) {
                console.log("got special", 204);    // special: Grails returns this on successful DELETE
                return Promise.resolve("ok");
            }
            if (resp.ok) {
                return resp.json()
            }
            if (Number(resp.status) < 400) {
                console.log("status", resp.status);
                return resp.text();
            }
            return Promise.reject(resp.status);
        })
};// production classes for bundling and statistics, without tests or examples
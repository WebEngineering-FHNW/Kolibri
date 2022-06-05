/**
 * @module stdlib
 * Kolibri standard library with functions and data structures that are most commonly used.
 * The stdlib has no dependencies.
 */

/**
 * Identity function, aka "I" in the SKI calculus or "Ibis" (or "Idiot") in the Smullyan bird metaphors.
 * The function is pure and runs in O(1). Function calls can be inlined.
 * @template a
 * @haskell  a -> a
 * @pure
 * @param    {a} x
 * @returns  {a} the parameter x unchanged.
 * @example
 * id(1) === 1
 */
const id = x => x;

/**
 * Constant function that captures and caches the argument and makes it available like a "getter".
 * Aka "konst", "fst" (the first of two curried parameters),
 * "K" in the SKI calculus, or "Kestrel" in the Smullyan bird metaphors.
 * @template a
 * @template b
 * @haskell  a -> b -> a
 * @pure
 * @type     { (x:a) => (...b) => a}
 * @example
 * c(1)(undefined) === 1;
 * const getExpr = c(expr);
 * // expression might change here
 * getExpr() === expr;
 */
const c = x => () => x;

/**
 * A Function that returns the second of two curried arguments.
 * "KI" in the SKI calculus, or "Kite" in the Smullyan bird metaphors.
 * It can be seen as a cached getter for the id function: {@link c}({@link id})
 * @template a
 * @template b
 * @haskell  b -> a -> a
 * @pure
 * @type     { (_:?b) => (y:a) => a}
 * @example
 * snd(undefined)(1) === 1;
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
 * @param  {!number} n - the cardinality, i.e. Tuple(n) can store n values. Mandatory. Must be > 0 or an error is thrown.
 * @return {Array<function>} - an array where the first item is a constructor, follow by n accessor functions
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
 * @param {!number} n - the cardinality, i.e. number of possible choices. Mandatory. Must be > 0 or an error is thrown.
 * @return {Array<function>} - an array of n choice constructors
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

/**
 * A function that selects between two arguments that are given in curried style.
 * Only needed internally for the sake of proper JsDoc.
 * @template a
 * @template b
 * @callback pairSelector
 * @pure
 * @type     { (x:a) => (y:b) => (a|b)}
 */
/**
 * A Pair is a {@link Tuple}(2) with a smaller and specialized implementation.
 * Access functions are {@link fst} and {@link snd}. Pairs are immutable.
 * "V" in the SKI calculus, or "Vireo" in the Smullyan bird metaphors.
 * @template a
 * @template b
 * @haskell a -> b -> (a -> b -> a|b) -> a|b
 * @pure    if the selector function is pure, which is usually is
 * @type    { (x:a) => (y:b) => (s:pairSelector) => (a|b) }
 * @constructor
 * @example
 * const dierk = Pair("Dierk")("König");
 * dierk(fst) === "Dierk");
 * dierk(snd) === "König");
 */
const Pair = x => y => selector => selector(x)(y);

/**
 * Select the first of two curried arguments for the use with {@link Pair}s.
 * An alternative name for {@link c}:
 * @template a
 * @template b
 * @haskell  a -> b -> a
 * @pure
 * @type     { (x:a) => (y:b) => a}
 * @example
 * fst(1)(undefined) === 1;
 */
const fst = c;

/*
 * The Either types.
 * @haskell Either a b
 */

/**
 * A general function from whatever "a" to whatever "b".
 * Only needed internally for the sake of proper JsDoc.
 * @template a
 * @template b
 * @typedef  functionAtoB<a,b>
 * @pure     supposed to be pure
 * @type     { (x:a) => b }
 */
/**
 * The Left constructor of an Either type. An "Either" is either {@link Left} or {@link Right}.
 * It is constructed with a value of type {@link a} and waits for two more functions f and g
 * as curried arguments.
 * When both are given, f(x) is called.
 * The Left case of an Either type is usually (but not necessarily so) an error case.
 * Left values are immutable.
 * @template a
 * @template b
 * @haskell a -> (a -> b) -> c -> b
 * @pure    if functionAtoB is pure
 * @type    { (x:a) =>  (f:functionAtoB<a,b>)  => (y:*) => b }
 * @example
 * const withFoo = (null == foo) ? Left("could not find foo") : Right(foo);
 * withFoo
 *      (msg => console.error(msg))      // handle left case
 *      (x   => doSomethingWithFoo(x));  // handle right case
 */

const Left  = x => f => _ => f(x);

/**
 * The Right constructor of an Either type. An "Either" is either {@link Left} or {@link Right}.
 * It is constructed with a value of type {@link b} and waits for two more functions f and g
 * as curried arguments.
 * When both are given, g(x) is called.
 * The Right case of an Either type is usually (but not necessarily so) the good case.
 * Right values are immutable.
 * @template a
 * @template b
 * @haskell a -> c -> (a -> b) -> b
 * @pure    if functionAtoB is pure
 * @type    { (x:a) => (y:*) => (f:functionAtoB<a,b>) => b }
 * @example
 * const withFoo = (null == foo) ? Left("could not find foo") : Right(foo);
 * withFoo
 *      (msg => console.error(msg))
 *      (x   => doSomethingWithFoo(x));
 */
const Right = x => _ => g => g(x);

/**
 * Nothing is the error case of the Maybe type. A "Maybe a" can be either Nothing or "{@link Just} a".
 * Nothing is immutable. Nothing is a singleton.
 * Nothing is used to get around missing null/undefined checks.
 * @template a
 * @template b
 * @haskell Nothing :: Maybe a
 * @pure
 * @type    { (f:functionAtoB<a,b>)  => (y:*) => b }
 * @example
 * const mayFoo = (null == foo) ? Nothing : Just(foo);
 * mayFoo
 *      (_   => console.error("cannot find foo"))
 *      (x   => doSomethingWithFoo(x));
 */
const Nothing = Left (undefined);

/**
 * Just is the success case of the Maybe type. A "Maybe a" can be either {@link Nothing} or "Just a".
 * Just values are immutable.
 * Just is used to get around missing null/undefined checks.
 * @template a
 * @template b
 * @haskell Just a :: Maybe a
 * @pure
 * @type    { (x:a) => (y:*) => (f:functionAtoB<a,b>) => b }
 * @example
 * const mayFoo = (null == foo) ? Nothing : Just(foo);
 * mayFoo
 *      (_   => console.error("cannot find foo"))
 *      (x   => doSomethingWithFoo(x));
 */
const Just = Right;

// ----------- End of ADT section -----------

// to do
// Eq typeclass, symmetry, reflexivity
// booleanEq, pairEq, tupleEq, eitherEq, choiceEq, maybeEq, arrayEq

// functor typeclass, associativity (if pure), left and right identity
// pairMap, tupleMap, eitherMap (only Right), choiceMap (n functions), maybeMap

// Num? Ord? Monoid? Monad?
/**
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
 * @callback timesCallback
 * @param {!number} index
 * @template T
 * @return {T}
 */

/**
 * A function that executes the optional {@link timesCallback} "soMany" times, assembles the results and returns them in an
 * {@link array} of length "soMany". The arguments are given in curried style.
 * If no callback is given, the unaltered index is returned. Indexes go from 0 to soMany-1.
 * @impure if the callback is impure
 * @haskell  Int -> (Int -> a) -> [a]
 * @function times
 * @template T
 * @type    { (soMany:!number) => (callback:?timesCallback) => Array<T> }
 * @param   { !number | string } soMany - how often to execute the callback. Negative values will be treated like 0. Mandatory.
 * @returns { (callback:?timesCallback) => Array<T> } - finally returns an array of the assembled callback results
 * @throws  { TypeError } - if soMany is given as a String but does not represent a number
 * @example
 * times(3)(i => console.log(i)); // logs 0, 1, 2
 * times(5)(x=>x*x); // returns [0, 1, 4, 9, 16]
 */
const times = soMany => (callback= undefined) => {
    const number = Number(soMany.valueOf());
    if (isNaN(number)) {
        throw new TypeError("Object '" + soMany + "' is not a valid number.");
    }
    return Array.from({length: number}, (it, idx) => callback ? callback(idx) : idx);
};

/**
 * @callback sumCallback
 * @template T
 * @param {!T} item
 * @param {?number} index
 * @return {number}
 */

/**
 * A function that sums up all items from an {@link array} by applying the {@link sumCallback} to each item before adding up.
 * The arguments are given in curried style.
 * If no callback is given, the Number constructor is used.
 * @impure   if the callback is impure
 * @haskell  Num n => [a] -> (a -> n) -> n
 * @function times
 * @template T
 * @type    { (array:!Array<T>) => (callback:?sumCallback) => number }
 * @param   { array:!Array<T> } array - the array to sum up. Mandatory.
 * @returns { (callback:?sumCallback) => number } - finally returns the sum
 * @example
 * sum([1,2,3])()     === 1 + 2 + 3;
 * sum(["1"])(Number) === 1;
 */
const sum = array => (callback = Number) =>
    array.reduce( (acc, cur, idx) => acc + callback(cur, idx), 0);/**
 * @module util/array
 * Augmenting the {@link Array}, {@link String}, and {@link Number} prototypes with functions from the arrayFunctions module.
 * These functions live in their own module such that users of the library can keep their code clean
 * from prototype modifications if they prefer to do so.
 */

/**
 * See {@link arrayEq}.
 * @template T
 * @param  { Array<T> } array
 * @return { Boolean  }
 * @example
 * [1].eq([1]); // true
 */
Array.prototype.eq = function(array) { return arrayEq(this)(array);};

/**
 * See {@link removeAt}.
 * @template T
 * @impure Modifies the array instance.
 * @param  { Number } index
 * @return { Array<T> }
 * @example
 * [1,2,3].removeAt(0);
 */
Array.prototype.removeAt = function(index){ return removeAt(this)(index); };

/**
 * See {@link removeItem}.
 * @template T
 * @impure Modifies the array instance.
 * @param  { T } item
 * @return { Array<T> }
 * @example
 * ["a","b","c"].removeItem("b");
 */
Array.prototype.removeItem = function(item){ return removeItem(this)(item); };

/**
 * See {@link times}.
 * @template T
 * @param  { ?timesCallback } callback
 * @return { Array<T> }
 * @example
 * "10".times(it => console.log(it));
 */
String.prototype.times = function(callback = undefined){ return times(this)(callback); };

/**
 * See {@link times}.
 * @template T
 * @param  { ?timesCallback } callback
 * @return { Array<T> }
 * @example
 * (5).times(x => x * x); // [0, 1, 4, 9, 16]
 */
Number.prototype.times = function(callback= undefined){ return times(this)(callback); };

/**
 * See {@link sum}.
 * @param  { ?sumCallback } callback
 * @return { number }
 * @example
 * [1,2,3].sum();     // 6
 * ["1"].sum(Number); // 1
 */
Array.prototype.sum = function(callback = undefined){ return sum(this)(callback); };// noinspection JSUnusedGlobalSymbols

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
};/**
 * @module kolibriStyle
 * Common constants and facilities for a consistent look.
 * Importing a different style should give you a custom look.
 * Make sure to keep in line with kolibri-base.css
 */

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
`;/**
 * @module dataflow - a dataflow abstraction that is not based on concurrency but on laziness and
 * can be used in an asynchronous fashion.
 */

/**
 * @callback createValueCallback
 * @template T
 * @type { () => T }
 */
/**
 * A dataflow abstraction that takes a function that specifies how to create a value and returns a
 * function that returns that value. The callback will be only called when needed and not more than once.
 * In other contexts known as "lazy" or "thunk".
 * @template T
 * @param { !createValueCallback } createValue - will be called when needed and not more than once. Mandatory.
 * @return { () => T }
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
 * @template T
 * @param {AttributeType<String>} attribute
 * @return T
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
 * @template T
 * @property { ( getQualifier:function():String, name:ObservableTypeString, observable: IObservable<T> ) => void } update -
 *              update the value of the named observableType for all attributes that have the same qualifier.
 *              Add the respective observable if it not yet known.
 * @property { (qualifier:String, newQualifier:String, observables:Object<String, IObservable<T>>) => void} updateQualifier -
 *              handle the change when an attribute changes its qualifier such that all respective
 *              internal indexes need to be updated, their values are updated, and nullish newQualifier leads to removal.
 * @property { (qualifier:String) => T} readQualifierValue
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
        let candidates = data[key];
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
                    newCandidates = data[newKey] = [];
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
 * @template T
 * @param { String } qualifier - mandatory. Nullish values make no sense here since one can use {@link Attribute}.
 * @return { AttributeType<T> }
 * @impure since it changes the ModelWorld.
 * @example
 * const firstNameAttr = QualifiedAttribute("Person.4711.firstname"); // attr is set to existing values, if any.
 */
const QualifiedAttribute = qualifier => Attribute(readQualifierValue(qualifier), qualifier);

/**
 * @callback Converter
 * @template T
 * @param    { * } value - the raw value that is to be converted
 * @return   { T }     - the converted value
 * @example
 * dateAttribute.setConverter( date => date.toISOString() ); // external: Date, internal: String
 */

/**
 * @callback Validator
 * @template T
 * @param    { T } value
 * @return   { Boolean } - whether the given value is considered valid.
 * @example
 * dateAttribute.setValidator( date => date > Date.now()); // only future dates are considered valid
 */

/**
 * @typedef  AttributeType
 * @template T
 * @property { (name:ObservableTypeString, initValue:*=null) => IObservable} getObs - returns the {@link IObservable}
 *              for the given name and creates a new one if needed with the optional initValue.
 *              The initValue is of type T for the VALUE observable can be different for others, e.g. the
 *              VALID observable is of type Boolean.
 * @property { (name:ObservableTypeString) =>  Boolean } hasObs - true if an {@link Observable}
 *              for the given name has already been created, false otherwise.
 * @property { (value:*) => void } setConvertedValue - sets the value for the {@link VALUE} observable
 *              after piping the value through the optional converter. The value is not of type T since
 *              the converter might convert any type to T.
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
 * @template T
 * @param  { T } value              - the initial value
 * @param  { String } [qualifier]   - the optional qualifier. If provided and non-nullish it will put the attribute
 *          in the ModelWorld and all existing attributes with the same qualifier will be updated to the initial value.
 *          In case that the automatic update is to be omitted, consider using {@link QualifiedAttribute}.
 * @return { AttributeType<T> }
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
        const observable = Observable(initValue); // we might observe more types than just T, for example VALID: Boolean

        // noinspection JSValidateTypes // issue with T as generic parameter for the observed value and other observed types
        observables[name] = observable;
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
};const release     = "0.1.46";

const dateStamp   = "2022-06-02 T 21:19:36 MESZ";

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
 * @typedef { object } InputAttributes
 * @template T
 * @property { !T } value      - mandatory value, will become the input value, defaults to undefined
 * @property { ?String } label - optional label, defaults to undefined
 * @property { ?String } name  - optional name that reflects the name attribute of an input element, used in forms
 * @property { InputTypeString } type - optional type, allowed values are
 *              the values of the HTML Input element's "type" attribute. Defaults to "text".
 */

/**
 * Create a presentation model for the purpose of being used to bind against a single HTML Input in
 * combinations with its pairing Label element.
 * For a single input, it only needs one attribute.
 * @constructor
 * @template T
 * @param  { InputAttributes<T> }
 * @return { AttributeType<T> }
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

    return singleAttr;
};/**
 * @typedef { object } SimpleInputControllerType<T>
 * @template T
 * @property { ()  => T }                   getValue
 * @property { (T) => void }                setValue
 * @property { ()  => String}               getType
 * @property { (valid: !Boolean) => void }  setValid
 * @property { (converter: Converter<T>)                  => void } setConverter
 * @property { (callback: onValueChangeCallback<String>)  => void } onLabelChanged
 * @property { (callback: onValueChangeCallback<Boolean>) => void } onValidChanged
 * @property { (callback: onValueChangeCallback<T>)       => void } onValueChanged
 * @property { (callback: onValueChangeCallback<String>)  => void } onNameChanged
 * @property { (callback: onValueChangeCallback<Boolean>) => void } onEditableChanged
 */

/**
 * The SimpleInputController gives access to a {@link SimpleInputModel} but in a limited fashion.
 * It does not expose the underlying {@link Attribute} but only those functions that a user of this
 * controller needs to see.
 * While controllers might contain business logic, this basic controller does not contain any.
 * @constructor
 * @template T
 * @param  { InputAttributes } args
 * @return { SimpleInputControllerType<T> }
 * @example
 *     const controller = SimpleInputController({
         value:  "Dierk",
         label:  "First Name",
         name:   "firstname",
         type:   "text",
     });
 */
const SimpleInputController = args => SimpleAttributeInputController(SimpleInputModel(args));

const SimpleAttributeInputController = attribute => {
    return {
        setValue:           attribute.setConvertedValue,
        getValue:           attribute.getObs(VALUE)     .getValue,
        setValid:           attribute.getObs(VALID)     .setValue,
        getType:            attribute.getObs(TYPE)      .getValue,
        onValueChanged:     attribute.getObs(VALUE)     .onChange,
        onValidChanged:     attribute.getObs(VALID)     .onChange,
        onLabelChanged:     attribute.getObs(LABEL)     .onChange,
        onNameChanged:      attribute.getObs(NAME)      .onChange,
        onEditableChanged:  attribute.getObs(EDITABLE)  .onChange,
        setConverter:       attribute.setConverter,
    };
};/**
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
const projectInstantInput = projectInput(INPUT);/**
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

    formController.forEach(inputController => fieldset.append(...projectChangeInput(FORM_CLASS_NAME, inputController)));

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
`;// production classes for bundling and statistics
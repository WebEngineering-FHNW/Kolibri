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
 */
/**
 * A callback which takes one argument of type {@link _A_} and transforms it to {@link _B_}.
 * @template _A_
 * @template _B_
 * @callback Functor
 * @param   { _A_ } value
 * @returns { _B_ }
 */

/**
 * A callback which takes two arguments of type {@link _A_} and transforms it to {@link _A_}.
 * @template _A_
 * @callback BiOperation
 * @param   { _A_ } value1
 * @param   { _A_ } value2
 * @returns { _A_ }
 */

/**
 * A callback which takes two arguments of type _T_ and _U_}and transforms it to _R_.
 * @callback BiFunction
 * @type {  <_T_, _U_, _R_> (value1:_T_, value2:_U_) => _R_ }
 */

/**
 * A callback which takes an argument of type {@link _A_} and
 * a second argument of type {@link _A_} and returns a boolean.
 * @template _A_
 * @template _B_
 * @callback BiPredicate
 * @param   { _A_ } value1
 * @param   { _B_ } value2
 * @returns { boolean }
 */

/**
 * Defines a Monad.
 * @template  _T_
 * @typedef  MonadType
 * @property { <_U_> (bindFn: (_T_) => MonadType<_U_>) => MonadType<_U_> } and
 * @property { <_U_> (f:      (_T_) => _U_)            => MonadType<_U_> } fmap
 * @property {       (_T_)                             => MonadType<_T_> } pure
 * @property {       ()                                => MonadType<_T_> } empty
 *//**
 * A callback function that selects between two arguments that are given in curried style.
 * Only needed internally for the sake of proper JsDoc.
 * @callback PairSelectorType
 * @pure
 * @template _T_, _U_
 * @type     { <_T_, _U_> (x:_T_) => (y:_U_) => ( _T_ | _U_ ) }
 * @property { () => { next: () => IteratorResult<_T_ | _U_, undefined> } } Symbol.iterator
 */

/**
 * @typedef PairBaseType
 * @template _T_, _U_
 * @type {
 *      (x: _T_)
 *   => (y: _U_)
 *   => (s: PairSelectorType<_T_, _U_>) => ( _T_ | _U_ ) }
 *
 */
/**
 * @typedef PairType
 * @template _T_, _U_
 * @type {  PairBaseType<_T_, _U_> & Iterable<_T_ | _U_> }
 * see {@link Pair}
 */

/**
 * A Pair is a {@link Tuple}(2) with a smaller and specialized implementation.
 * Access functions are {@link fst} and {@link snd}. Pairs are immutable.
 * "V" in the SKI calculus, or "Vireo" in the Smullyan bird metaphors.
 *
 * @constructor
 * @pure
 * @haskell a -> b -> (a -> b -> a|b) -> a|b
 * @template _T_, _U_
 * @type    { PairType<_T_, _U_> }
 *
 * @example
 * const values = Pair("Tobi")("Andri");
 * values(fst) === "Tobi";
 * values(snd) === "Andri";
 *
 * // a pair is also iterable
 * const [tobi, andri] = values;
 * console.log(tobi, andri);
 * // => Logs '"Tobi", "Andri"'
 */
const Pair = x => y => {
  /**
   * @template _T_, _U_
   * @type { PairSelectorType<_T_,_U_> }
   */
  const pair = selector => selector(x)(y);

  pair[Symbol.iterator] = () => [x,y][Symbol.iterator]();
  return pair;
};// noinspection GrazieInspection


/**
 * JINQ brings query capabilities to any monadic type.
 * With it, it is possible to query different data sources using the one and same query language.
 *
 * @template _T_
 * @typedef JinqType
 * @property { <_U_> (selector:  Functor<_T_, _U_>)  => JinqType<_U_> }               map      - maps the current value to a new value
 * @property { <_U_> (selector:  Functor<_T_, _U_>)  => JinqType<_U_> }               select   - alias for map
 * @property { <_U_> ((prev: _T_) => MonadType<_U_>) => JinqType<_U_> }               inside   - maps the current value to a new {@link MonadType}
 * @property { <_U_> (monad:     MonadType<_U_>)     => JinqType<PairType<_T_,_U_>> } pairWith - combines the underlying data structure with the given data structure as {@link PairType}
 * @property {       (predicate: ConsumingPredicateType<_T_>) => JinqType<_T_> }      where    - only keeps the items that fulfill the predicate
 * @property {       ()                              => MonadType<_T_> }              result   - returns the result of this query
 */

/**
 * JINQ (JavaScript integrated query) is the implementation of LINQ for JavaScript.
 * It can handle any data that conforms to the {@link MonadType}. Therefore, JINQ can
 * handle monadic iterables like {@link SequenceType} and every monadic type such as
 * {@link MaybeType} or {@link JsonMonad}.
 *
 * Note: Despite the similarity to SQL, it is important to note that the functionalities are not exactly the same.
 *
 * @see https://learn.microsoft.com/en-us/dotnet/csharp/linq/
 * @template _T_
 * @param { MonadType<_T_> } monad
 * @returns { JinqType<_T_> }
 *
 * @example
 * const devs = [ {"name": "Tobi", "salary": 0},
 *                {"name": "Michael", "salary": 50000},
 *                ...
 *              ]
 * const salaryOfMichael = devs =>
 * from(JsonMonad(devs))
 *   .where( dev => dev.name != null)
 *   .where( dev => dev.name.startsWith("Michael"))
 *   .select(dev => dev.salary)
 *   .result();
 */
const jinq = monad => ({
  pairWith: pairWith(monad),
  where:    where   (monad),
  select:   select  (monad),
  map:      map$2     (monad),
  inside:   inside  (monad),
  result:   () =>    monad
});

/**
 * Serves as starting point to enter JINQ and specifies a data source.
 * Consider {@link jinq} linked below for further information.
 *
 * @see {jinq}
 * @template _T_
 * @param { MonadType<_T_> } monad
 * @returns { JinqType<_T_> }
 *
 * @example
 *  const range  = Range(7);
 *  const result =
 *  from(range)
 *    .where(x => x % 2 === 0)
 *    .result();
 *
 * console.log(result);
 * // => Logs '0 2 4 6'
 */
const from = jinq;


/**
 * Transforms each element of a collection using a selector function.
 *
 * @template _T_, _U_
 * @type {
 *           (monad1: MonadType<_T_>)
 *        => (selector: (_T_) => MonadType<_U_>)
 *        => JinqType<PairType<_T_,_U_>>
 *      }
 *
 * @example
 *  const Person = (name, maybeBoss) => ({name, boss: maybeBoss});
 *  const ceo   = Person("Paul",  Nothing);
 *  const cto   = Person("Tom",   Just(ceo));
 *  const andri = Person("Andri", Just(cto));
 *
 * const maybeBossNameOfBoss = employee =>
 *   from(Just(employee))
 *     .inside(p => p.boss)
 *     .inside(p => p.boss)
 *     .select(p => p.name)
 *     .result();
 *
 * const maybeName = maybeBossNameOfBoss(andri);
 * const noName    = maybeBossNameOfBoss(ceo);
 *
 * assert.is(noName, Nothing);
 * maybeName
 *    (_    => console.log("No valid result"))
 *    (name => console.log(name);
 *
 * // => Logs 'Paul'
 *
 */
const inside = monad => f => {
  const processed = monad.and(f);
  return jinq(processed);
};

/**
 * Combines elementwise two {@link MonadType}s.
 * It returns a {@link PairType} which holds a combination of two values.
 *
 * @template _T_, _U_
 * @type {
 *           (monad1: MonadType<_T_>)
 *        => (monad2: MonadType<_U_>)
 *        => JinqType<PairType<_T_,_U_>>
 *      }
 *
 * @example
 * const range  = Range(3);
 * const result =
 * from(range)
 *    .pairWith(range)
 *    .where (([fst, snd]) => fst === snd)
 *    .result();
 *
 * console.log(result);
 * // => Logs '0 0 1 1 2 2 3 3'
 */
const pairWith = monad1 => monad2 => {
  const processed = monad1.and(x =>
    monad2.fmap(y => Pair(x)(y))
  );

  return jinq(processed)
};

/**
 * Filters elements based on a given condition.
 *
 * @type { <_T_>
 *            (monad: MonadType<_T_>)
 *         => (predicate: ConsumingPredicateType<_T_>)
 *         => JinqType<_T_>
 *       }
 *
 * @example
 *  const range  = Range(7);
 *  const result =
 *  from(range)
 *    .where(x => x % 2 === 0)
 *    .result();
 *
 * console.log(result);
 * // => Logs '0 2 4 6'

 */
const where = monad => predicate => {
  const processed = monad.and(a => predicate(a) ? monad.pure(a) : monad.empty());
  return jinq(processed);
};

/**
 * Applies a function to each element of the collection.
 *
 * @alias map
 * @type { <_T_, _U_>
 *           (monad: MonadType<_T_>)
 *        => (selector: Functor<_T_, _U_>)
 *        => JinqType<_U_>
 *       }
 *
 * @example
 * const range  = Range(3);
 * const result =
 * from(range)
 *    .select(x => 2 * x)
 *    .result();
 *
 * console.log(result);
 * // => Logs '0, 2, 4, 6'
 */
const select = monad => mapper => {
  const processed = monad.fmap(mapper);
  return jinq(processed);
};

/**
 * Applies a function to each element of the collection.
 *
 * @alias select
 * @type { <_T_, _U_>
 *           (monad: MonadType<_T_>)
 *        => (mapper: Functor<_T_, _U_>)
 *        => JinqType<_U_>
 *       }
 *
 * @example
 * const range  = Range(3);
 * const result =
 * from(range)
 *    .select(x => 2 * x)
 *    .result();
 *
 * console.log(result);
 * // => Logs '0, 2, 4, 6'
 */
const map$2 = select;/**
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
const fst$1 = c;

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
const snd$1 = (_=undefined) => y => y;

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

const Left$1  = x => f => _g => f(x);

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
const Right$1 = x => _f => g => g(x);

/**
 * @typedef { LeftXType<_T_,_U_> | RightXType<_T_,_U_> } EitherType
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
const kite = snd$1;

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
const T$1   = fst$1;
/**
 * False is the error case of the Boolean type. 
 */
const F   = snd$1;

/**
 * A boolean value (True or False) in the Church encoding.
 * @typedef { T | F } ChurchBooleanType
 */

/**
 * Negating a boolean value.
 * @type { (x:ChurchBooleanType) => ChurchBooleanType }
 */
const not$1 = x => x(F)(T$1);

/** 
 * The "and" operation for boolean values.
 * @type { (x:ChurchBooleanType) => (y:ChurchBooleanType) => ChurchBooleanType }
 */
const and$1 = x => y => x(y)(x);

/**
 * The "or" operation for boolean values.
 * @type { (x:ChurchBooleanType) => (y:ChurchBooleanType) => ChurchBooleanType }
 */
const or$1 = x => x(x);

/**
 * The boolean equivalence operation.
 * @type { (x:ChurchBooleanType) => (y:ChurchBooleanType) => ChurchBooleanType }
 */
const beq$1 = x => y => x(y)(not$1(y));

/**
 * The boolean exclusive-or operation.
 * @type { (x:ChurchBooleanType) => (y:ChurchBooleanType) => ChurchBooleanType }
 */
const xor = x => y => cmp2 (not$1) (beq$1) (x) (y) ; // we cannot eta reduce since that messes up the jsDoc type inference

/**
 * The boolean implication operation.
 * @type { (x:ChurchBooleanType) => (y:ChurchBooleanType) => ChurchBooleanType }
 */
const imp = x => flip(x) (not$1(x)) ;

/**
 * Convert a boolean lambda expression to a javascript boolean value.
 * @type { (b:ChurchBooleanType) => Boolean }
 */
const jsBool$1 = b => b(true)(false);

/**
 * Convert a javascript boolean value to a boolean lambda expression.
 * @type { (jsB:Boolean) => ChurchBooleanType }
 */
const churchBool$1 = jsB => /** @type {ChurchBooleanType} */ jsB ? T$1 : F;

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
const LazyIf$1 = condition => thenFunction => elseFunction => ( condition(thenFunction)(elseFunction) )();

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
const either$1 = e => f => g => e(f)(g);

/**
 * @callback HandleNothingCallback
 * @template _T_,_U_
 * @type { (n:NothingType<_T_>) => _U_ }
 */
/**
 * @callback HandleJustCallback
 * @template _T_,_U_
 * @type { (j:JustType<_T_>) => _U_ }
 */
/**
 * Apply the f or g handling function to the Maybe value depending on whether it is a Just or a Nothing.
 * @type  { <_T_,_U_> (m:MaybeType<_T_>) => (hn:HandleNothingCallback<_T_,_U_>) => (hj:HandleJustCallback<_T_,_U_>) => _U_ }
 */
const maybe = m => f => g => m(f)(g);

/**
 * Take a function of two arguments and return a function of one argument that returns a function of one argument,
 * i.e. a function of two arguments in curried style.
 * @haskell curry :: ((a,b)->c) -> a -> b -> c
 * @type { <_T_,_U_,_V_> (f:FunctionAtoBType<_T_,FunctionAtoBType<_U_,_V_>>) => FunctionAtoBType<_T_,FunctionAtoBType<_U_,_V_>> }
 */
const curry = f => x => y => f(x,y);

/**
 * Take af function of two arguments in curried style and return a function of two arguments.
 * @haskell uncurry :: ( a -> b -> c) -> ((a,b) -> c)
 * @type { <_T_,_U_,_V_> (f:FunctionAtoBType<_T_,FunctionAtoBType<_U_,_V_>>) => FunctionAtoBType<_T_,_U_,_V_> }
 */
const uncurry = f => (x,y) => f(x)(y);


/**
 * Convert JS boolean to Church boolean
 * @param  { Boolean } value
 * @return { ChurchBooleanType & Function }
 */
const toChurchBoolean = value => /** @type { ChurchBooleanType& Function } */ value ? T$1 : F;

/**
 * Convert Church boolean to JS boolean
 * @param  { ChurchBooleanType & Function } churchBoolean
 * @return { Boolean }
 */
const toJsBool = churchBoolean =>  churchBoolean(true)(false);/**
 * @typedef MaybeMonadType
 * @template _T_
 * @property { <_V_> ((_T_) => MaybeType<_V_>) => MaybeType<_V_> } and
 * @property { <_V_> ((_T_) => _V_)            => MaybeType<_V_> } fmap
 * @property { <_V_> (_V_)                     => MaybeType<_T_> } pure
 * @property {       ()                        => MaybeType<_T_> } empty
 */

const MaybePrototype = () => undefined;

MaybePrototype.and = function (bindFn) {
  let returnVal;
  this
    (_ => returnVal = Nothing$1)
    (x => returnVal = bindFn(x));
  return returnVal;
};

MaybePrototype.fmap = function (mapper) {
  return this.and(x => Just$1(mapper(x)));
};

MaybePrototype.pure = val => Just$1(val);
MaybePrototype.empty = () => Nothing$1;


/**
 * @typedef { ProducerType<*>  } NothingBaseType
 */

/**
 * @typedef { NothingBaseType & MaybeMonadType<*> } NothingType
 */

/**
 * Nothing is the error case of the Maybe type. A "Maybe a" can be either Nothing or "{@link Just} a".
 * Nothing is immutable. Nothing is a singleton.
 * Nothing is used to get around missing null/undefined checks.
 * @haskell Nothing :: Maybe a
 * @pure
 * @type    { NothingType }
 *
 * @example
 * const mayFoo = (null == foo) ? Nothing : Just(foo);
 * mayFoo
 *      (_   => console.error("cannot find foo"))
 *      (x   => doSomethingWithFoo(x));
 */
const Nothing$1 = Left$1 (undefined);
Object.setPrototypeOf(Nothing$1, MaybePrototype);

/**
 * @typedef { NothingType | JustType<_T_> } MaybeType
 * @template _T_
 * @pure
 */



/**
 * Type of the {@link Just} constructor after being bound to a value x of type _T_.
 * @template _T_
 * @typedef { <_U_> (f:*)  => (f:FunctionAtoBType<_T_, _U_>) => _U_ } JustBaseType
 */
/** @typedef { JustBaseType<_T_> & MaybeMonadType<T> } JustType
 * @template _T_
 */

/**
 * Just is the success case of the Maybe type. A "Maybe a" can be either {@link Nothing} or "Just a".
 * Just values are immutable.
 * Just is used to get around missing null/undefined checks.
 * @haskell Just a :: Maybe a
 * @pure
 * @type    { <_T_>  (x:_T_) =>  JustType<_T_>}
 * @example
 * const mayFoo = (null == foo) ? Nothing : Just(foo);
 * mayFoo
 *      (_   => console.error("cannot find foo"))
 *      (x   => doSomethingWithFoo(x));
 */
const Just$1 = val => {
 const r = Right$1(val);
 Object.setPrototypeOf(r, MaybePrototype);
 return r;
};


/**
 * The catMaybes function takes a list of Maybes and returns a list of all the Just values.
 *
 * @template _T_
 * @haskell [Maybe a] -> [a]
 * @param  { Iterable<MaybeType<_T_>> } maybes
 * @returns { Array<_T_> }
 */
const catMaybes$1 = maybes => {
  const result = [];
  for (const maybe of maybes) {
    maybe(_ => _)(val => result.push(val));
  }
  return result;
};


/**
 * Chooses between the two given Maybe values.
 * If the first is a {@link JustType} it will be returned,
 * otherwise the second value will be returned.
 *
 * @type {<_T_>
 *      (maybe1: MaybeType<_T_>)
 *   => (maybe2: MaybeType<_T_>)
 *   => MaybeType<_T_>
 * }
 *
 * @example
 * const just    = Just(1);
 * const nothing = Nothing;
 *
 * const choice1 = choiceMaybe(just)(nothing)
 * const choice2 = choiceMaybe(nothing)(just)
 * console.log(choice1 === just && choice2 === just);
 * // => Logs 'true'
 */
const choiceMaybe = maybe1 => maybe2 =>
  maybe1
    (_ => maybe2)
    (_ => maybe1);/**
 * Creates a {@link SequenceType} which contains all given arguments as values.
 * The argument list might be empty, resulting in an empty iterator.
 *
 * @constructor
 * @pure
 * @template _T_
 * @param   { ..._T_ } values
 * @returns { SequenceType<_T_> }
 *
 * @example
 * const result = Seq(1, 2);
 *
 * console.log(...result);
 * // => Logs '1' '2'
 */
const Seq = (...values) => {

  const seqIterator = () => {
    let index = 0;

    const next = () => {
      const result = ( index > values.length -1 )
        ?  { done: true,  value: undefined }
        :  { done: false, value: values[index] };
      index++;
      return result;
    };

    return { next }
  };

  return createMonadicSequence( seqIterator )
};/**
 * Creates a {@link SequenceType} which contains just the given value.
 *
 * @constructor
 * @pure
 * @haskell pure :: a -> [a]
 * @template _T_
 * @param   { _T_ } value
 * @returns { SequenceType<_T_> }
 *
 * @example
 * const seq = PureSequence(1);
 *
 * console.log(...seq);
 * // => Logs '1'
 */
const PureSequence = value => Seq(value);/**
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
const levelNum = fst$1;

/**
 * Getter for the name of a log level.
 * @private
 */
const name$1 = snd$1;

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
    ? Right$1(level)
    : Left$1(`Unknown log level: "${str}"`);
};//                                                                -- logging level --

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
 * Adds one or multiple {@link AppenderType}s to the appender list.
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
 * This constant represents a sequence with no values in it.
 *
 * @constructor
 * @pure
 * @haskell []
 * @template _T_
 * @type { SequenceType<_T_> }
 *
 * @example
 * const emptySequence = nil;
 *
 * console.log(...emptySequence);
 * // => Logs '' (nothing)
 */
const nil = Seq();/**
 * Casts an arbitrary {@link Iterable} into the {@link SequenceType}.
 * @template _T_
 * @param { Iterable<_T_> } iterable
 * @return { SequenceType<_T_> }
 */
const toSeq = iterable => map$1(id)(iterable);

/**
 * Checks whether a given candidate is an {@link Iterable}.
 * @param { any } candidate
 * @return { boolean }
 */
const isIterable = candidate =>
       candidate !== null
    && candidate !== undefined
    && candidate[Symbol.iterator] !== undefined;

/**
 * Returns the {@link Iterator} of an {@link Iterable}.
 * @template _T_
 * @param { Iterable<_T_> } iterable
 * @returns Iterator<_T_>
 */
const iteratorOf = iterable => iterable[Symbol.iterator]();

/**
 * Checks whether a given candidate is a {@link SequenceType}.
 * @param { any } candidate
 * @return { Boolean } true if the candidate is a {@link SequenceType}, false otherwise
 */
const isSequence = candidate =>
       isIterable(candidate)
    && Object.getPrototypeOf(candidate) === SequencePrototype;

/**
 * Ensures that the given candidate iterable is a {@link SequenceType}.
 * @template _T_
 * @param   { Iterable<_T_> } iterable
 * @returns { SequenceType<_T_> } the input iterable if it is a {@link SequenceType}, otherwise a new {@link SequenceType} wrapping the input iterable
 */
const ensureSequence = iterable =>
    isSequence(iterable)
    ? iterable
    : toSeq(iterable);/**
 * Transforms each element using the given {@link Functor function}.
 *
 * @function
 * @pure
 * @haskell (a -> b) -> [a] -> [b]
 * @typedef MapOperationType
 * @template _T_
 * @template _U_
 * @type {
 *            (mapper: Functor<_T_, _U_>)
 *         => SequenceOperation<_T_, _U_>
 *       }
 *
 * @example
 * const numbers = [0, 1, 2];
 * const mapped  = map(el => el * 2)(numbers);
 *
 * console.log(...numbers);
 * // => Logs '0, 2, 4'
 */

/**
 * see {@link MapOperationType}
 * @template _T_
 * @template _U_
 * @type {MapOperationType<_T_, _U_>}
 */
const map$1 = mapper => iterable => {

  const mapIterator = () => {
    const inner = iteratorOf(iterable);
    let mappedValue;

    const next = () => {
      const { done, value } = inner.next();
      if (!done) mappedValue = mapper(value);

      return { /**@type boolean */ done, value: mappedValue }
    };

    return { next };
  };

  return createMonadicSequence(mapIterator);
};/**
 * Monoidal concatenation: flatten an {@link Iterable} of {@link Iterable Iterables} by appending.
 * @typedef MconcatOperationType
 * @template _T_
 * @function
 * @pure
 * @haskell [[a]] -> [a]
 * @type {
 *     (seqs: Iterable<Iterable<_T_>>)
 *     => SequenceType<_T_>
 * }
 *
 * @example
 * const ranges = map(x => Range(x))(Range(2));
 * const result = mconcat(ranges);
 *
 * console.log(...result);
 * // => Logs '0, 0, 1, 0, 1, 2'
 */

/**
 * see {@link MconcatOperationType}
 * @template _T_
 * @type { MconcatOperationType<_T_> }
 */
const mconcat = iterable => {

  const mconcatIterator = () => {
    /**
     * @template _T_
     * @type { Iterator<_T_> }
     */
    let current = undefined;
    const outer = iteratorOf(iterable);

    const next = () => {
      while (true) {
        if (current === undefined) {
          // if there is no current, get the next sub iterable of the outer iterable
          const nextOfOuter = outer.next();
          if (nextOfOuter.done) return nextOfOuter;
          current = iteratorOf(nextOfOuter.value);
        }

        // grab next value from sub iterable until it is done
        const nextOfCurrent = current.next();
        if (!nextOfCurrent.done) return nextOfCurrent;

        current = undefined;
      }
    };

    return { next }
  };

  return createMonadicSequence(mconcatIterator);
};/**
 * Applies the given function to each element of the {@link Iterable} and flats it afterward.
 * @Note This operation adds a monadic API to the {@link SequenceType}.
 *
 * @function
 * @pure
 * @haskell (>>=) :: m a -> (a -> m b) -> m b
 * @template _T_
 * @type {
 *          <_U_>(bindFn: (_T_) => Iterable<_U_>)
 *          => (it: Iterable<_T_>)
 *          => SequenceType<_U_>
 *       }
 *
 * @example
 * const numbers = [0, 1, 2, 3];
 * const bindFn  = el => take(el)(repeat(el));
 * const result  = bind(bindFn)(numbers);
 *
 * console.log(...result);
 * // => Logs '1, 2, 2, 3, 3, 3'
 */
const bind = bindFn => it =>
  mconcat(
    map$1(bindFn)(it)
  );/**
 * The catMaybes function takes an {@link Iterable} of {@link MaybeType Maybes}
 * and returns an {@link SequenceType} of all the {@link JustXType Just's} values.
 *
 * @typedef CatMaybesOperationType
 * @function
 * @pure
 * @haskell [Maybe a] -> a
 * @template _T_
 * @type {
              (iterable: Iterable<MaybeType<_T_>>)
 *         => SequenceType<_T_>
 *       }
 *
 * @example
 * const maybes = [Just(5), Just(3), Nothing];
 * const result = catMaybes(maybes);
 *
 * console.log(...result);
 * // => Logs '5, 3'
 */

/**
 * see {@link CatMaybesOperationType}
 * @template _T_
 * @type { CatMaybesOperationType<_T_> }
 */
const catMaybes = iterable => {

  const catMaybesIterator = () =>  {
    const inner = iteratorOf(iterable);

    const next = () => {
      while (true) {
        const { value, done } = inner.next();
        if (done) return { value: undefined, /** @type Boolean */ done };

        const result = catMaybes$1([value]);
        if (result.length !== 0) {
          return { value: result[0], done: false };
        }
      }
    };

    return { next };
  };

  return createMonadicSequence(catMaybesIterator);
};/**
 * Adds the second iterable to the first iterables end.
 *
 * @template _T_
 * @typedef AppendOperationType
 * @function
 * @pure
 * @haskell [a] -> [a] -> [a]
 * @type {
 *            (it1: Iterable<_T_>)
 *         => SequenceOperation<_T_>
 *       }
 *
 * @example
 * const numbers = [0, 1, 2];
 * const range   = Range(2);
 * const concatenated = append(numbers)(range);
 *
 * console.log(...concatenated);
 * // => Logs '0, 1, 0, 1, 2'
 */

/**
 * see {@link AppendOperationType}
 * @template _T_
 * @type {AppendOperationType<_T_>}
 */
const append$1 = it1 => it2 => mconcat([it1, it2]);/**
 * Adds the given element to the front of an iterable.
 * @typedef ConsOperationType
 * @pure
 * @haskell (:) :: a -> [a] -> [a]
 * @template _T_
 * @type { (element: _T_) => SequenceOperation<_T_> }
 * @example
 * const numbers  = [1, 2, 3];
 * const element  = 0;
 * const consed = cons(element)(numbers);
 *
 * console.log(...consed);
 * // => Logs '0, 1, 2, 3, 4'
 */

/**
 * see {@link ConsOperationType}
 * @template _T_
 * @type { ConsOperationType<_T_> }
 *
 */
const cons = element => append$1( Seq(element) )  ;/**
 * see {@link CycleOperationType}
 * @template _T_
 * @type { CycleOperationType<_T_> }
 */
const cycle = iterable => {

  const cycleIterator = () => {
    let inner = iteratorOf(iterable);

    const next = () => {
      const result = inner.next();
      if (!result.done) return result;

      inner = iteratorOf(iterable);
      return next();
    };

   return { next };
  };

  return createMonadicSequence(cycleIterator);
};/**
 * Discards all elements until the first element does not satisfy the predicate anymore.
 *
 * @template _T_
 * @typedef DropWhileOperationType
 * @function
 * @pure
 * @haskell (a -> Bool) -> [a] -> [a]
 * @template _T_
 * @type {
 *            (predicate: ConsumingPredicateType<_T_>)
 *         => SequenceOperation<_T_>
 *       }
 *
 * @example
 * const numbers = [0, 1, 2, 3, 4, 5];
 * const dropped = dropWhile(el => el < 2)(numbers);
 *
 * console.log(...dropped);
 * // => Logs '2, 3, 4, 5'
 */
/**
 * see {@link DropWhileOperationType}
 * @template _T_
 * @type { DropWhileOperationType<_T_> }
 */
const dropWhile = predicate => iterable => {

  const dropWhileIterator = () => {
    const inner = iteratorOf(iterable);
    const next = () => {
      let { done, value } = inner.next();

      while(!done && predicate(value)) {
        const n = inner.next();
        done    = n.done;
        value   = n.value;
      }

      return { /** @type boolean */ done, value }
    };

   return { next };
  };

  return createMonadicSequence(dropWhileIterator);
};/**
 * Jumps over so many elements.
 *
 * @template _T_
 * @typedef DropOperationType
 * @function
 * @pure
 * @haskell Int -> [a] -> [a]
 * @type {
 *            (count: number)
 *         => SequenceOperation<_T_>
 *       }
 *
 * @example
 * const numbers = [0, 1, 2, 3];
 * const dropped = drop(2)(numbers);
 *
 * console.log(...dropped);
 * // => Logs '2, 3'
 */

/**
 * see {@link DropOperationType}
 * @template _T_
 * @type { DropOperationType<_T_> }
 */
const drop = count => iterable => {
  const dropIterator = () => {
    let start               = 0;
    const dropWhileIterable = dropWhile(_ => start++ < count)(iterable);
    const inner             = iteratorOf(dropWhileIterable);

    return { next : inner.next }
  };

  return createMonadicSequence(dropIterator);
};/**
 * Transforms the given {@link Iterable} by applying each transformer's {@link SequenceOperation}
 * from begin to end while passing through the intermediate results.
 * @typedef PipeOperationType
 * @template _T_
 * @type  {
 *            (...transformers: SequenceOperation<*,*> )
 *            => (iterable: Iterable<_T_>)
 *            => (SequenceType<*> | *)
 *        }
 * @example
 * const numbers = [0, 1, 2, 3, 4, 5];
 * const piped = pipe(
 *                takeWhere(n => n % 2 === 0),
 *                map(n => 2*n),
 *                drop(2)
 *              )(numbers);
 *
 * console.log(...piped);
 * // => Logs '0, 4, 8'
 */

/**
 * see {@link PipeOperationType}
 * @template _T_
 * @type  { PipeOperationType<_T_> }
 */
const pipe = (...transformers) => iterable => {

  iterable = ensureSequence(iterable);

  for (const transformer of transformers) {
    iterable = transformer(iterable);
  }

  return  iterable;
};/**
 * Only keeps elements that satisfy the given predicate.
 *
 * @typedef TakeWhereOperationType
 * @template _T_
 * @function
 * @pure
 * @haskell (a -> Bool) -> [a] -> [a]
 * @type {
 *            (predicate: ConsumingPredicateType<_T_>)
 *         => SequenceOperation<_T_>
 *       }
 *
 * @example
 * const numbers = [0, 1, 2, 3, 4, 5];
 *
 * // just keep even numbers
 * const filtered = takeWhere(el => el % 2 === 0)(it);
 *
 * console.log(...filtered);
 * // => Logs '0, 2, 4'
 *
 */

/**
 * see {@link TakeWhereOperationType}
 * @template _T_
 * @type { TakeWhereOperationType<_T_> }
 */
const takeWhere = predicate => iterable => {

  const retainAllIterator = () => {
    const inner = iteratorOf(iterable);

    const next = () => {
      while(true) {
        const { done, value } = inner.next();
        const result = done || predicate(value);
        if (result) return { /**@type boolean */done, value } ;
      }
    };
    return { next };
  };

  return createMonadicSequence(retainAllIterator);
};/**
 * Only keeps elements which does not fulfil the given predicate.
 * @typedef DropWhereOperationType
 * @template _T_
 * @function
 * @pure
 * @haskell (a -> Bool) -> [a] -> [a]
 * @type {
 *            (predicate: ConsumingPredicateType<_T_>)
 *         => SequenceOperation<_T_>
 *       }
 *
 * @example
 * const numbers = [0, 1, 2, 3, 4, 5];
 *
 * // reject even numbers
 * const filtered = dropWhere(el => el % 2 === 0)(numbers);
 *
 * console.log(...filtered);
 * // => Logs '1, 3, 5'
*/

/**
 * see {@link DropWhereOperationType}
 * @template _T_
 * @type  { DropWhereOperationType<_T_> }
 */
const dropWhere = predicate => iterable =>
  // flip the predicate and call takeWhere
  takeWhere(el => !predicate(el))(iterable);/**
 * Processes the iterable backwards.
 * @typedef ReverseOperationType
 * @template _T_
 * @function
 * @pure
 * @haskell [a] -> [a]
 * @type {
 *             (iterable: Iterable<_T_>)
 *          => SequenceType<_T_>
 *       }
 *
 * @example
 * const numbers  = [0, 1, 2];
 * const reversed = reverse$(numbers);
 *
 * console.log(...reversed);
 * // => Logs '2, 1, 0'
 */

/**
 * see {@link ReverseOperationType}
 * @template _T_
 * @type { ReverseOperationType<_T_> }
 */
const reverse$ = iterable => {

  // wrap the code in a function, to keep laziness
  const reverse$Iterator = () => {
    const values         = [...iterable].reverse();
    const valuesIterator = iteratorOf(values);
    return { next: () => valuesIterator.next() };
  };

  return createMonadicSequence(reverse$Iterator);
};/**
 * Adds the given element to the end of the {@link Iterable}.
 * @typedef SnocOperationType
 * @template _T_
 * @function
 * @pure
 * @haskell a -> [a] -> [a]
 * @type {
 *           (element: _T_)
 *        => SequenceOperation<_T_>
 *       }
 *
 * @example
 * const numbers = [0, 1, 2, 3];
 * const snocced = snoc(7)(numbers);
 *
 * console.log(...snocced);
 * // => Logs '0, 1, 2, 3, 7'
 */

/**
 * see {@link SnocOperationType}
 * @template _T_
 * @type { SnocOperationType<_T_> }
 */
const snoc = element => iterable => mconcat( Seq( iterable, Seq(element) ));/**
 * Stop after so many elements.
 *
 * @template _T_
 * @typedef TakeOperationType
 * @function
 * @pure
 * @haskell Int -> [a] -> [a]
 * @type {
 *     (count: Number)
 *     => SequenceOperation<_T_>
 * }
 *
 * @example
 * const numbers = [0,1,2,3];
 * const taken   = take(2)(numbers);
 *
 * console.log(...taken);
 * // => Logs '0, 1'
 */

/**
 * see {@link TakeOperationType}
 * @template _T_
 * @type { TakeOperationType<_T_> }
 */
const take = count => iterable => {

  const takeIterator = () => {
    const inner = iteratorOf(iterable);
    let start = 0;

    const next = () => {
      // the iterator finishes, when the predicate does not return true anymore, // todo dk: copy/paste error?
      // or the previous iterator has no more elements left
      const takeDone = start++ >= count;
      if (takeDone) return { done: true, value: undefined };
      return inner.next();
    };

    return { next };
  };

  return createMonadicSequence(takeIterator);
};/**
 * Proceeds with the iteration until the predicate becomes true.
 * @typedef TakeWhileOperationType
 * @template _T_
 * @function
 * @pure (a -> Bool) -> [a] -> [a]
 * @type {
 *            (predicate: ConsumingPredicateType<_T_>)
 *         => SequenceOperation<_T_>
 *       }
 *
 * @example
 * const number  = [0, 1, 2, 3, 4 ,5];
 *
 * // keep all elements until one element is bigger or equal to 2.
 * const dropped = takeWhile(el => el <= 2)(numbers);
 *
 * console.log(...result);
 * // => Logs '0, 1, 2'
 */

/**
 * see {@link TakeWhileOperationType}
 * @template _T_
 * @type { TakeWhileOperationType<_T_> }
 */
const takeWhile = predicate => iterable => {

  const takeWhileIterator = () => {
    const inner = iteratorOf(iterable);

    const next = () => {
      const el = inner.next();
      // the iterator finishes, when the predicate does not return true anymore,
      // or the previous iterator has no more elements left
      const done = el.done || !predicate(el.value);

      return  { value: el.value, done };
    };

    return { next };
  };

  return createMonadicSequence(takeWhileIterator)
};/**
 * {@link zipWith} generalises {@link zip} by zipping with the function given as the first argument,
 * instead of a Pair constructor.
 * @typedef ZipWithOperationType
 * @template _T_
 * @function
 * @pure
 * @haskell (a -> b -> c) -> [a] -> [b] -> [c]
 * @type { <_U_, _V_>
 *            (zipper: BiFunction<_T_, _U_, _V_>)
 *         => (it1: Iterable<_T_>)
 *         => (it2: Iterable<_U_>)
 *         => SequenceType<_V_>
 *       }
 *
 * @example
 * const numbers = [0, 1, 2];
 * const range   = Range(2, 4);
 * const zipped  = zipWith((i,j) => [i,j])(numbers)(range);
 * console.log(...zipped);
 *
 * // => Logs '[0,2], [1,3], [2,4]'
 */

/**
 * see {@link ZipWithOperationType}
 * @template _T_
 * @type { ZipWithOperationType<_T_> }
 */
const zipWith$1 = zipper => it1 => it2 => {
  /**
   * @template _V_
   * @type _V_
   * */
  let zippedValue;

  const zipWithIterator = () =>  {
    const inner1 = iteratorOf(it1);
    const inner2 = iteratorOf(it2);

    /**
     *
     * @template _V_
     * @returns { IteratorResult<_V_,_V_> }
     */
    const next = () => {
      const { done: done1, value: value1 } = inner1.next();
      const { done: done2, value: value2 } = inner2.next();

      /**@type boolean */
      const done = done1 || done2;

      if (!done) zippedValue = zipper(value1, value2);
      return {
        done:  done,
        value: zippedValue
      };
    };
    return { next };
  };


  return createMonadicSequence(zipWithIterator);
};/**
 * Zip takes two {@link Iterable}s and returns an {@link Iterable} of corresponding {@link PairType pairs}.
 * @typedef ZipOperationType
 * @template _T_
 * @function
 * @pure
 * @haskell [a] -> [b] -> [(a, b)]
 * @type { <_U_>
 *             (it1: Iterable<_T_>)
 *          => (it2: Iterable<_U_>)
 *          => SequenceType<PairType<_T_, _U_>>
 * }
 *
 * @example
 * const numbers = [0, 1, 2],
 * const range   = Range(3, 5);
 * const zipped  = zip(numbers)(range);
 *
 * tap(x => console.log(...x))(zipped);
 * // => Logs '0 3, 1 4, 2 5'
 */

/**
 * see {@link ZipOperationType}
 * @template _T_
 * @type { ZipOperationType<_T_> }
 */
const zip$1 = it1 => it2 => zipWith$1((i,j) => Pair(i)(j))(it1)(it2);/**
 * Executes the callback for each element, leaving the original iterable unchanged other than making it a sequence.
 * @typedef TapOperationType
 * @template _T_
 * @function
 * @impure the whole point of this function is to execute the callback for each element, producing side effects
 * @haskell (a -> IO()) -> [a] -> [a]
 * @type {
 *            (callback: ConsumerType<_T_>)
 *         => (iterable: Iterable<_T_>)
 *         => SequenceOperation<_T_>
 *       }
 *
 * @example
 * const numbers   = [0, 1, 2, 3, 4];
 * const container = [];
 * tap(cur => container.push(cur))(numbers);
 *
 * console.log(...container);
 * // => Logs '0, 1, 2, 3, 4'
 */
/**
 * see {@link TapOperationType}
 * @template _T_
 * @type {TapOperationType<_T_>}
 */
const tap = callback => map$1(x => { callback(x); return x; } );/**
 * Checks the equality of two non-infinite {@link Iterable iterables}.
 *
 * _Note_: Two iterables are considered as equal if they contain or create the exactly same values in the same order.
 * @see Use ["=="] defined on the {@link SequencePrototype} to perform a comparison in a more readable form.
 * @typedef EqualOperationType
 * @function
 * @pure
 * @template _T_
 * @type {
 *          (it2: Iterable<_T_>)
 *          => Boolean
 *       }
 * @attention This function only works if at least one iterable is finite as indicated by the name ending with '$'.
 *
 * @example
 * const numbers = [0, 1, 2, 3];
 * const range   = Range(3);
 * const result  = eq$(numbers)(range);
 *
 * console.log(result);
 * // => Logs 'true'
 */

/**
 * see {@link EqualOperationType}
 * @haskell (==) :: Eq a => a -> a -> Bool
 * @template _T_
 * @param { Iterable<_T_> } it1
 * @returns { EqualOperationType<_T_> }
 */

const eq$ = it1 => it2 => arrayEq([...it1])([...it2]);/**
 * Performs a reduction on the elements from right to left, using the provided start value and an accumulation function,
 * and returns the reduced value.
 *
 * _Must not be called on infinite sequences!_
 *
 * _Note:_ The callback function takes the accumulator as first argument and the current element as second argument
 * as conventional in the JavaScript world. This is different from the Haskell world where the order of the arguments
 * is reversed.
 *
 * _Note:_
 * Since foldr reduces the {@link Iterable} from right to left, it needs O(n) memory to run the function.
 * Therefore {@link reduce$} is the better alternative for most cases
 *
 * @typedef FoldrOperationType
 * @template _T_
 * @function
 * @pure
 * @haskell foldr :: Foldable t => (a -> b -> b) -> b -> t a -> b
 * @type { <_U_>
 *             (accumulationFn: BiFunction<_U_, _T_, _U_>, start: _U_)
 *          => (iterable: Iterable<_T_>)
 *          => _T_
 *       }
 *
 * @example
 * const numbers = [0, 1, 2, 3, 4, 5];
 * const result  = foldr$((acc, cur) => cur + acc, 0)(numbers);
 *
 * console.log(result);
 * // => Logs "15"
 */

/**
 * see {@link FoldrOperationType}
 * @template _T_
 * @type { FoldrOperationType<_T_> }
 */
const foldr$ = (accumulationFn, start) => iterable => {
  const inner = reverse$(iterable);
  let accumulator = start;
  for (const current of inner) {
    accumulator = accumulationFn(accumulator, current);
  }
  return accumulator;
};/**
 * @typedef ForEachSequenceOperationType
 * @template _T_
 * @type {
 *            (callback: ConsumerType<_T_>)
 *         => void
 *       }
 */
/**
 * Executes the callback for each element and consumes the sequence.
 * Use only on **finite** iterables.
 * @typedef ForEachOperationType
 * @function
 * @pure
 * @haskell (a -> b) -> [a] -> Unit
 * @template _T_
 * @type {
 *            (callback: ConsumerType<_T_>)
 *         => (it: Iterable<_T_>)
 *         => void
 *       }
 *
 * @example
 * const numbers   = [0, 1, 2, 3, 4];
 * const container = [];
 * forEach$(cur => container.push(cur))(numbers);
 *
 * console.log(...container);
 * // => Logs '0, 1, 2, 3, 4'
 */

/**
 * see {@link ForEachOperationType}
 * @template _T_
 * @type {ForEachOperationType<_T_>}
 */
const forEach$ = callback => iterable => {
  for (const current of iterable) {
    callback(current);
  }
};/**
 * Return the next value without consuming it. `undefined` when there is no value.
 * @typedef HeadOperationType
 * @template _T_
 * @function
 * @pure
 * @haskell [a] -> a
 * @type {
 *              (iterable: Iterable<_T_>)
 *          =>  _T_ | undefined
 *       }
 *
 * @example
 * const numbers = [1, 2, 3, 4];
 * const result  = head(numbers);
 *
 * console.log(result);
 * // => Logs '1'
 */

/**
 * see {@link HeadOperationType}
 * @template _T_
 * @type { HeadOperationType<_T_> }
 */
const head$1 = iterable => {
  const inner = iteratorOf(iterable);
  const { done, value } = inner.next();

  return done ? undefined : value;
};/**
 * Returns true, if the iterables head is undefined.
 * @typedef IsEmptyOperationType
 * @template _T_
 * @function
 * @pure
 * @haskell [a] -> Bool
 * @type {
 *            (iterable: Iterable<_T_>)
 *         => Boolean
 *       }
 *
 * @example
 * const empty     = []
 * const result = isEmpty(empty);
 *
 * console.log(result);
 * // Logs 'true'
 */

/**
 * see {@link IsEmptyOperationType}
 * @template _T_
 * @type { IsEmptyOperationType<_T_> }
 */
const isEmpty = iterable => iteratorOf(iterable).next().done;const ILLEGAL_ARGUMENT_EMPTY_ITERABLE = "Illegal argument error: iterable must not be empty!";/**
 * @typedef SafeMaxOperationSequenceType
 * @template _T_
 * @param { BiPredicate<_T_, _T_> } [comparator] - an optional comparing function which returns true if the second argument is larger than the first
 * @returns MaybeType<_T_>
 */

/**
 *  Returns the largest element of an {@link Iterable}.
 *
 *  _Note_:
 *  To determine the largest element, a comparator function is used.
 *  This function compares two elements by default with the `< (LT)` operator,
 *  where on the left side is the current largest element when processing the iterable.
 *  If needed, a different comparator can also be passed as a second argument to {@link safeMax$}
 *  and will then be used to determine the largest element.
 *
 * @typedef SafeMaxOperationType
 * @template _T_
 * @function
 * @pure
 * @haskell Ord a => [a] -> Maybe a
 * @param { Iterable<_T_> }         iterable     - a finite iterable
 * @param { BiPredicate<_T_, _T_> } [comparator] - an optional comparing function which returns true if the second argument is larger than the first
 * @returns MaybeType<_T_>
 *
 * @example
 * const numbers = [1, 3, 0, 5];
 * const maybeMax = safeMax$(numbers);
 *
 * maybeMax
 *  (_ => console.log('iterable was empty, no max!')
 *  (x => console.log(x));
 * // => Logs '5'
 */

/**
 * see {@link SafeMaxOperationType}
 * @template _T_
 * @type { SafeMaxOperationType<_T_> }
 */
const safeMax$ = (iterable, comparator = (a, b) => a < b) => {
  const inner = iteratorOf(iterable);

  let {
    value: currentMax,
    done: isEmpty
  } = inner.next();


  if (isEmpty) {
    // iterable is empty, no max can be found
    return Nothing$1;
  }

  while (!isEmpty) {
    const nextEl = inner.next();
    isEmpty = nextEl.done;

    if (!isEmpty && comparator(currentMax, nextEl.value)) {
      currentMax = nextEl.value;
    }
  }

  return Just$1(currentMax);
};/**
 * @typedef MaxOperationSequenceType
 * @template _T_
 * @param { BiPredicate<_T_, _T_> } [comparator] - an optional comparing function which returns true if the second argument is larger than the first
 * @returns _T_
 */

/**
 *  Returns the largest element of a **non-empty** {@link Iterable}.
 *
 *  _Note_:
 *  To determine the largest element, a comparator function is used.
 *  This function compares two elements by default with the `< (LT)` operator,
 *  where on the left side is the current largest element when processing the iterable.
 *  If needed, a different comparator can also be passed as a second argument to {@link max$}
 *  and will then be used to determine the largest element.
 * @typedef MaxOperationType
 * @template _T_
 * @function
 * @pure
 * @haskell Ord a => [a] -> a
 * @param { Iterable<_T_> }         iterable     - a non-empty finite iterable
 * @param { BiPredicate<_T_, _T_> } [comparator] - an optional comparing function which returns true if the second argument is larger than the first
 * @returns _T_
 * @throws { Error } {@link ILLEGAL_ARGUMENT_EMPTY_ITERABLE} if the given iterable is empty
 *
 * @example
 * const numbers = [1, 3, 0, 5];
 * const maximum = max$(numbers);
 *
 * console.log(maximum);
 * // => Logs '5'
 */

/**
 * see {@link MaxOperationType}
 * @template _T_
 * @type { MaxOperationType<_T_> }
 */
const max$ = (iterable, comparator = (a, b) => a < b) => {
  let returnVal;
  const maybeResult = safeMax$(iterable, comparator);

  maybeResult
    (_ => { throw Error(ILLEGAL_ARGUMENT_EMPTY_ITERABLE) })
    (x => returnVal = x);

  return returnVal;
};/**
 * @typedef MinOperationSequenceType
 * @template _T_
 * @param { BiPredicate<_T_, _T_> } [comparator] - an optional comparing function which returns true if the first argument is smaller than the second
 * @returns _T_
 */
/**
 *  Returns the smallest element of a **non-empty** {@link Iterable}.
 *
 *  _Note_:
 *  To determine the  smallest element, a comparator function is used.
 *  This function compares two elements by default with the `< (LT)` operator.
 *  Where on the left side is the current smallest element when processing the iterable.
 *  If needed, a different comparator can also be passed as a second argument to {@link min$}
 *  and will then be used to determine the smallest element.
 *
 *
 * @typedef MinOperationType
 * @template _T_
 * @function
 * @pure
 * @haskell Ord a => [a] -> a
 * @param { Iterable<_T_> } iterable             - a non-empty finite iterable
 * @param { BiPredicate<_T_, _T_> } [comparator] - an optional comparing function which returns true if the first argument is smaller than the second
 * @returns _T_
 * @throws { Error } {@link ILLEGAL_ARGUMENT_EMPTY_ITERABLE} if the given iterable is empty
 *
 * @example
 * const numbers = [1, 3, 0, 5];
 * const minimum = min$(numbers);
 *
 * console.log(minimum);
 * // => Logs '0'
 */

/**
 * see {@link MinOperationType}
 * @template _T_
 * @type { MinOperationType<_T_> }
 */
const min$ = (iterable, comparator = (a, b) => a < b) => max$(iterable, (a,b) => ! comparator(a,b));/**
 * @typedef SafeMinOperationSequenceType
 * @template _T_
 * @param { BiPredicate<_T_, _T_> } [comparator] - an optional comparing function which returns true if the first argument is smaller than the second
 * @returns MaybeType<_T_>
 */
/**
 *  Returns the smallest element of an {@link Iterable}.
 *
 *  _Note_:
 *  To determine the smallest element, a comparator function is used.
 *  This function compares two elements by default with the `< (LT)` operator,
 *  where on the left side is the current largest element when processing the iterable.
 *  If needed, a different comparator can also be passed as a second argument to {@link safeMin$}
 *  and will then be used to determine the smallest element.
 * @typedef SafeMinOperationType
 * @template _T_
 * @function
 * @pure
 * @haskell Ord a => [a] -> Maybe a
 * @param { Iterable<_T_> } iterable             - a finite iterable
 * @param { BiPredicate<_T_, _T_> } [comparator] - an optional comparing function which returns true if the first argument is smaller than the second
 * @returns MaybeType<_T_>
 * @throws { Error } {@link ILLEGAL_ARGUMENT_EMPTY_ITERABLE} if the given iterable is empty
 *
 * @example
 * const numbers  = [0, 1, 2, 3];
 * const maybeMin = safeMin$(numbers);
 *
 * maybeMin
 *  (_ => console.log('iterable was empty, no min!')
 *  (x => console.log(x));
 * // => Logs '0'
 */

/**
 * see {@link SafeMinOperationType}
 * @template _T_
 * @type { SafeMinOperationType<_T_> }
 */
const safeMin$ = (iterable, comparator = (a, b) => a < b) => safeMax$(iterable, (a,b) => ! comparator(a,b));/**
 * Performs a reduction on the elements, using the provided start value and an accumulation function, and returns the reduced value.
 * @see foldl$ is an alias for reduce$
 * @typedef ReduceSequenceOperationType
 * @template _T_
 * @function
 * @pure
 * @haskell foldl :: Foldable t => (b -> a -> b) -> b -> t a -> b
 *
 * @type { <_U_>
 *             (accumulationFn: BiFunction<_U_, _T_, _U_>, start: _U_)
 *          => _T_
 *       }
 */

/**
 * Performs a reduction on the elements, using the provided start value and an accumulation function, and returns the reduced value.
 * @see foldl$ is an alias for reduce$
 *
 * @template _T_
 * @function
 * @pure
 * @haskell foldl :: Foldable t => (b -> a -> b) -> b -> t a -> b
 *
 * @type { <_U_>
 *             (accumulationFn: BiFunction<_U_, _T_, _U_>, start: _U_)
 *          => (iterable: Iterable<_T_>)
 *          => _T_
 *       }
 *
 * @example
 * const number = [0, 1, 2, 3, 4, 5];
 * const res = foldl$((acc, cur) => acc + cur, 0)(numbers);
 *
 * console.log(res);
 * // => Logs "15"
 */
const reduce$ = (accumulationFn, start) => iterable => {
  let accumulator = start;
  for (const current of iterable) {
    accumulator = accumulationFn(accumulator, current);
  }

  return accumulator;
};

const foldl$ = reduce$;/**
 * Transforms the passed {@link Iterable} into a {@link String}.
 * Elements are passes through the String() constructor, separated by a commas and enclosed in square brackets.
 * @typedef ShowOperationType
 * @function
 * @pure
 * @haskell Show a => [a] -> String
 * @param { Number }   [maxValues=50] - the maximum amount of elements that should be printed
 * @returns { String }
 *
 * @example
 * const numbers = [0, 1, 2, 3, 4, 5];
 * const text    = show(numbers, 3);
 *
 * console.log(text);
 * // => Logs '[0,1,2]'
 */

/**
 * see {@link ShowOperationType}
 * @param { Iterable } iterable
 * @param { Number }   [maxValues=50] - the maximum amount of elements that should be printed
 * @return { String }
 */
const show = (iterable, maxValues = 50) =>
  "[" +
  pipe(
    take(maxValues),
    reduce$((acc, cur) => acc === "" ? cur : `${acc},${String(cur)}`, ""),
  )(iterable)
  + "]";// noinspection GrazieInspection


/**
 * Removes the first element of this iterable.
 * The head and the tail of the iterable are returned then
 * @typedef UnconsSequenceOperationType
 * @function
 * @pure
 * @haskell [a] -> (a, [a])
 * @template _T_
 * @type { (s: PairSelectorType) => (_T_ | Iterable<_T_>) } - the head and the tail as a pair
 *
 * @example
 * const numbers       = [0, 1, 2, 3, 4];
 * const [head, tail]  = uncons(numbers);
 *
 * console.log("head:", head, "tail:", ...tail);
 * // => Logs 'head: 0 tail: 1 2 3 4'
 */

/**
 * see {@link UnconsSequenceOperationType}
 * @template _T_
 * @param   { Iterable<_T_> } iterable
 * @returns { UnconsSequenceOperationType<_T_> } }
 */
const uncons = iterable => {
  const inner = iteratorOf(iterable);
  const { value } = inner.next();

  const iterator = () => ({ next: () => inner.next() });

  return Pair(value)(createMonadicSequence(iterator));
};// noinspection GrazieInspection


const log$1 = LoggerFactory("kolibri.sequence");

/**
 * This function object serves as prototype for the {@link SequenceType}.
 * Singleton object.
 */
function SequencePrototype () {  } // does nothing on purpose

/**
 *
 * @template _T_
 * @param { Iterable<_T_> } iterable
 * @returns { SequenceType<_T_> }
 */
function setPrototype (iterable) {
  Object.setPrototypeOf(iterable, SequencePrototype);
  return /**@type SequenceType*/ iterable;
}

/**
 * Builds an {@link SequenceType} by decorating a given {@link Iterator}.
 * @template _T_
 * @param { () => Iterator<_T_> } iteratorConstructor - a function that returns an {@link Iterator}
 * @returns { SequenceType<_T_> }
 */
function createMonadicSequence (iteratorConstructor) {
  const iterable = { [Symbol.iterator]: iteratorConstructor }; // make a new iterable object
  return setPrototype(iterable);
}

// monadic sequence operations ----------------------------------

SequencePrototype.and = function (bindFn) {
  return bind(bindFn)(this);
};

SequencePrototype.fmap = function (mapper) {
  return map$1(mapper)(this);
};

SequencePrototype.pure = val => PureSequence(val);

SequencePrototype.empty = () => nil;

// terminal sequence operations ----------------------------------

SequencePrototype.show = function (maxValues = 50) {
  return show(this, maxValues);
};

SequencePrototype.toString = function (maxValues = 50) {
  if (maxValues !== 50) {
    log$1.warn("Sequence.toString() with maxValues might lead to type inspection issues. Use show("+ maxValues+") instead.");
  }
  return show(this, maxValues);
};

SequencePrototype.eq$ = function(that) {
  if (!isIterable(that)) return false;
  return eq$(this) /* == */ (that);
};

SequencePrototype["=="] = SequencePrototype.eq$;

SequencePrototype.foldr$ = function(callback, start) {
    return foldr$(callback, start)(this);
};

SequencePrototype.forEach$ = function(callback) {
    return forEach$(callback)(this);
};

SequencePrototype.head = function() {
    return head$1(this);
};

SequencePrototype.isEmpty = function() {
    return isEmpty(this);
};

SequencePrototype.max$ = function(comparator = (a, b) => a < b) {
    return max$(this, comparator);
};

SequencePrototype.safeMax$ = function(comparator = (a, b) => a < b) {
    return safeMax$(this, comparator);
};

SequencePrototype.min$ = function(comparator = (a, b) => a < b) {
    return min$(this, comparator);
};

SequencePrototype.safeMin$ = function(comparator = (a, b) => a < b) {
    return safeMin$(this, comparator);
};

SequencePrototype.reduce$ = function(callback, start) {
    return reduce$(callback, start)(this);
};

SequencePrototype.uncons = function() {
    return uncons(this);
};

// "semigroup-like" sequence operations -------------------------------------

SequencePrototype.append = function (sequence) {
  return append$1(this)(sequence);
};
SequencePrototype["++"] = SequencePrototype.append;

SequencePrototype.catMaybes = function () {
  return catMaybes(this);
};

SequencePrototype.cons = function (element) {
  return cons(element)(this);
};

SequencePrototype.cycle = function () {
  return cycle(this);
};

SequencePrototype.drop = function (n) {
  return drop(n)(this);
};

SequencePrototype.dropWhere = function (predicate) {
    return dropWhere(predicate)(this);
};

SequencePrototype.dropWhile = function (predicate) {
  return dropWhile(predicate)(this);
};

SequencePrototype.tap = function (callback) {
  return tap(callback)(this);
};

SequencePrototype.map = SequencePrototype.fmap;

SequencePrototype.mconcat = function () {
  return mconcat(this);
};

SequencePrototype.pipe = function(...transformers) {
  return pipe(...transformers)(this);
};

SequencePrototype.reverse$ = function () {
  return reverse$(this);
};

SequencePrototype.snoc = function (element) {
  return snoc(element)(this);
};

SequencePrototype.take = function (n) {
  return take(n)(this);
};

SequencePrototype.takeWhere = function (predicate) {
  return takeWhere(predicate)(this);
};

SequencePrototype.takeWhile = function (predicate) {
  return takeWhile(predicate)(this);
};

SequencePrototype.zip = function (iterable) {
  return zip$1(this)(iterable);
};

SequencePrototype.zipWith = function (zipFn) {
  return zipWith$1(zipFn)(this);
};/**
 * @module kolibri.sequence.constructors.unfold
 * The idea was thankfully provided by Daniel Kröni.
 */
/**
 * @typedef StateAndValueType
 * @template _S_, _T_
 * @property { _S_ } state
 * @property { _T_ } value
 */

/**
 * @typedef FromStateToNextStateAndValue
 * @callback
 * @pure The whole idea of `unfold` is to allow a pure function at this point. Depends on developer discipline.
 * @template _S_, _T_
 * @param { _S_ } state
 * @return { StateAndValueType<_S_, _T_> | undefined } - `undefined` if the sequence cannot produce any more values
 */

/**
 * Creates a {@link SequenceType} from a callback function that generates the next state and value from the current state.
 * The sequence is supposed to be exhausted when the callback returns `undefined`.
 * `unfold` abstracts over the proper state management
 * in the closure scope of an {@link Iterable}'s iterator function.
 * This allows the {@link FromStateToNextStateAndValue} callback function to be pure.
 * @template _T_, _S_
 * @param { FromStateToNextStateAndValue<_S_, _T_> } fromStateToNextStateAndValue - callback function to generate the next state and value
 * @param { _S_ } initialState
 * @return { SequenceType<_T_> }
 * @example
 *     const zeroToFour = unfold(0, n => n < 5 ? {state: n + 1, value: n} : undefined);
 *     zeroToFour ['=='] Range(4);
 */
const unfold = (initialState, fromStateToNextStateAndValue) => {

    const iterator = () => {
        let runningState = initialState;

        const next = () => {
            const result = fromStateToNextStateAndValue(runningState);
            if (result === undefined) {
                return { done: true, value: undefined };
            } else {
                runningState = result.state;
                return { done: false, value: result.value };
            }
        };
        return { next };
    };

    return createMonadicSequence(iterator);
};/**
 * The `incrementFunction` should change the value (make progress) in a way that the `whileFunction` function can
 * recognize the end of the sequence.
 *
 * Contract:
 * - `incrementFunction` & `whileFunction` should not refer to any mutable state variable (because of side effect) in
 *   the closure.
 *
 * @constructor
 * @pure if `whileFunction` & `incrementFunction` are pure
 * @template _T_
 * @param   { _T_ }               start             - the first value to be returned by this sequence
 * @param   { (_T_) => Boolean }  whileFunction     - returns false if the iteration should stop
 * @param   { (_T_) => _T_ }      incrementFunction - calculates the next value based on the previous
 * @returns { SequenceType<_T_> }
 *
 * @example
 * const start      = 0;
 * const whileF     = x => x < 3;
 * const incrementF = x => x + 1;
 * const sequence   = Sequence(start, whileF, incrementF);
 *
 * console.log(...sequence);
 * // => Logs '0, 1, 2'
 */

const Sequence = (start, whileFunction, incrementFunction) =>

   unfold(
       start,
       current  => whileFunction(current)
             ? { state: incrementFunction(current), value: current }
             : undefined
   );/**
 * Constructs a new {@link SequenceType} based on the given tuple. Each iteration returns an element of the tuple.
 *
 * @constructor
 * @pure
 * @template _T_
 * @param  { (f:ArrayApplierType<_T_>) => any } tuple
 * @returns { SequenceType<_T_> }
 *
 * @example
 * const [Triple]      = Tuple(3);
 * const triple        = Triple(1)(2)(3);
 * const tupleSequence = TupleSequence(triple);
 *
 * console.log(...tupleSequence);
 * // => Logs '1, 2, 3'
 */
const TupleSequence = tuple => {
  // detect number of elements in tuple using a special selector function
  const lengthSelector = arr => arr.length;
  const indexSequence  = Sequence(0, i => i !== tuple(lengthSelector), i => i + 1);

  const tupleIterator = () => {
    // map over indices and grab corresponding element from tuple
    const innerIterator = iteratorOf(map$1(idx => tuple(values => values[idx]))(indexSequence));
    return { next : innerIterator.next }
  };

  return createMonadicSequence(tupleIterator);
};/*
idea shortcuts:
Shift-Alt I   : inspection window (errors, warning)
Cmd-Shift-I   : quick show implementation
Ctrl-J        : jsdoc quick lookup
Cmd-Hover     : quick info
Cmd-P         : parameter info
Ctrl-Shift-P  : expression type
*/

/**
 * Generic Types
 * @typedef {function} pair
 * @typedef {function} triple
 * @typedef {function} churchBoolean
 */

/**
 * x -> x ; Identity (id)
 *
 * @lambda λx.x
 * @haskell Identity :: a -> a
 * @function Identity
 * @param   {*} x
 * @returns {*} x
 */
const I$1 = x => x;

/**
 * a -> b -> a ; Kestrel (Constant)
 *
 * @lambda  λx.y.x
 * @haskell Kestrel :: a -> b -> a
 * @function Konstant
 * @param    {*} x
 * @returns  {function(y:*): function(x:*)} a function that ignores its argument and returns x
 */
const K$1 = x => y => x;

/**
 * x -> y -> y ; Kite
 *
 * @lambda  λx.y.y
 * @haskell Kite :: a -> b -> b
 * @function Kite
 * @param    {*} x
 * @returns  {function(y:*): function(y:*)} a function that returns its argument y
 */
const KI$1 = x => y => y;

/**
 * f -> f( f ) ; Mockingbird
 * @lambda  λf.ff
 * @haskell Mockingbird :: f -> f
 * @function Mockingbird
 * @param   {function} f
 * @returns {function({ f: { f } })} a self-application combinator
 */
const M$1 = f => f(f);

/**
 * f -> x -> y -> f( x )( y ) ; Cardinal (flip)
 *
 * @lambda  λfxy.fxy
 * @haskell Cardinal :: f -> a -> b -> pair
 * @function Cardinal
 * @function flip
 * @param    {function} f
 * @returns  { function(x:*): function(y:*): {f: { y x }} } The Cardinal, aka flip, takes two-argument function, and produces a function with reversed argument order.
 * @example
 * C(K) (1)(2)  === 2
 * C(KI)(1)(21) === 1
 */
const C$1 = f => x => y => f(y)(x);


/**
 * f -> g -> x -> f( g( x ) ) ; Bluebird (Function composition)
 *
 * @lambda λfgx.f(gx)
 * @haskell Bluebird :: f -> a -> b -> c
 * @function Bluebird
 * @param   {function} f
 * @returns { function(g:function): function(x:*):  {f: { g:{x} } } } two-fold self-application composition
 * @example
 * B(id)(id)(n7)     === n7
 * B(id)(jsnum)(n7)  === 7
 * B(not)(not)(True) === True
 */
const B$1 = f => g => x => f(g(x));


/**
 * x -> f -> f( x ) ; Thrush (hold an argument)
 *
 * @lambda  λxf.fx
 * @haskell Thrush :: a -> f -> b
 * @function Thrush
 * @param    {*} x
 * @returns  {function(f:function): {f: {x} }} self-application with holden argument
 */
const T = x => f => f(x);


/**
 * x -> y -> f -> f (x)(y) ; Vireo (hold pair of args)
 *
 * @lambda  λxyf.fxy
 * @haskell Vireo :: a -> b -> f -> c
 * @function Vireo
 * @param    {*} x
 * @returns  {function(y:*): function(f:function): {f: {x y} }}
 */
const V$1 = x => y => f => f(x)(y);


/**
 * f -> g -> x -> y -> f( g(x)(y) ) ; Blackbird (Function composition with two args)
 *
 * @lambda  λfgxy.f(gxy)
 * @haskell Blackbird :: f -> g -> a -> b -> c
 * @function
 * @param   {function} f
 * @returns {function(g:function): function(x:*): function(y:*): function({ f:{g: {x y}} })}
 * @example
 * Blackbird(x => x)    (x => y => x + y)(2)(3) === 5
 * Blackbird(x => x * 2)(x => y => x + y)(2)(3) === 10
 */
const Blackbird = f => g => x => y => f(g(x)(y));

/**
 * x -> y -> y ; {churchBoolean} False Church-Boolean
 *
 * @function
 * @type    churchBoolean
 * @return  KI
 */
const False = KI$1;

/**
 * x -> y -> x ; {churchBoolean} True Church-Boolean
 *
 * @function
 * @type    churchBoolean
 * @return  K
 */
const True = K$1;

/**
 * Syntactic sugar for creating a If-Then-Else-Construct
 * Hint: Better use LazyIf to avoid that JavaScript eagerly evaluate both cases (then and else).
 *
 * @param condition
 * @return {function(truthy:churchBoolean): function(falsy:churchBoolean): *}
 * @constructor
 * @example
 * If( eq(n1)(n1) )
 *  (Then( "same"     ))
 *  (Else( "not same" ))
 */
const If = condition => truthy => falsy =>  condition(truthy)(falsy);

/**
 * Syntactic sugar for creating a If-Then-Else-Construct for lazy Evaluation - it avoid that JavaScript eagerly evaluate both cases (then and else)
 * Important: Add in 'Then' and 'Else' a anonym function: () => "your function"
 *
 * @param condition
 * @return {function(truthy:churchBoolean): function(falsy:churchBoolean): *}
 * @constructor
 * @example
 * LazyIf( eq(n1)(n1) )
 *  (Then( () => "same"     ))
 *  (Else( () => "not same" ))
 */
const LazyIf = condition => truthy => falsy => ( condition(truthy)(falsy) )();

/**
 * Syntactic sugar for If-Construct
 */
const Then = I$1;
const Else = I$1;

/**
 * f -> x -> y -> f( x )( y ) ; not ; Cardinal
 *
 * @function
 * @param   {churchBoolean} Church-Boolean
 * @returns {churchBoolean} negation of the insert Church-Boolean
 * @example
 * not( True      )("a")("b")  === "b"
 * not( False     )("a")("b")  === "a"
 * not( not(True) )("a")("b")  === "a"
 */
const not = C$1;

/**
 * p -> q -> p( q )(False) ; and
 *
 * @function
 * @param   {churchBoolean} p
 * @returns {function(q:churchBoolean): churchBoolean}  True or False
 */
const and = p => q => p(q)(False);

/**
 * p -> q -> p( True )(q) ; or
 *
 * @function
 * @param   {churchBoolean} p
 * @returns {function(q:churchBoolean): churchBoolean}  True or False
 */
const or = p => q => p(True)(q);

/**
 * p -> q -> p( q )( not(qn) ) ; beq (ChurchBoolean-Equality)
 *
 * @function
 * @param   {churchBoolean} p
 * @returns {function( q:churchBoolean): churchBoolean}  True or False
 * @example
 * beq(True)(True)   === True;
 * beq(True)(False)  === False;
 * beq(False)(False) === False;
 */
const beq = p => q => p(q)(not(q));

/**
 * b -> b("True")("False") ; showBoolean
 *
 * @function
 * @param  {churchBoolean} b
 * @return {string} - "True" or "False"
 * @example
 * showBoolean(True)  === "True";
 * showBoolean(False) === "False";
 */
const showBoolean = b => b("True")("False");

/**
 * b -> b(true)(false) ; jsBool
 *
 * @function
 * @param   {churchBoolean} b
 * @return  {boolean} - true or false
 * @example
 * jsBool(True)  === true;
 * jsBool(False) === false;
 */
const jsBool = b => b(true)(false);

/**
 * b => b ? True : False ; churchBool
 *
 * @function
 * @param   {boolean} b
 * @return  {churchBoolean} - True or False
 * @example
 * churchBool(true)  === True;
 * churchBool(false) === False;
 */
const churchBool = b => b ? True : False;

/**
 * x -> y -> f -> f(x)(y) ; Pair
 *
 * @function
 * @param   {*} x:  firstOfPair argument of the pair
 * @returns {function(y:*): function(f:function): {f: {x y} }} - returns a function, that store two value
 */
const pair = V$1;

/**
 * Get first value of Pair
 *
 * @function
 * @return {function(x:*): function(y:*): x} - pair first stored value
 * @example
 * pair(n2)(n5)(fst) === n2
 */
const fst = K$1;

/**
 * Get second value of Pair
 *
 * @function
 * @return {function(x:*): function(y:*): y} - pair second stored value
 * @example
 * pair(n2)(n5)(snd) === n5
 */
const snd = KI$1;

/**
 * x -> y -> z -> f -> f(x)(y)(z) ; Triple
 *
 * @function
 * @param  {*} x - firstOfTriple argument of the Triple
 * @return {function(y:*):  function(z:*): function(f:function): {f: {x y z}}} - returns a function, that storage three arguments
 */
const triple = x => y => z => f => f(x)(y)(z);

/**
 * @haskell firstOfTriple :: a -> b -> c -> a
 *
 * x -> y -> z -> x ; firstOfTriple
 *
 * @function
 * @param  {*} x
 * @return {function(y:*): function(z:*): x} - x
 * @example
 * triple(1)(2)(3)(firstOfTriple) === 1
 */
const firstOfTriple = x => y => z => x;

/**
 * x -> y -> z -> y ; secondOfTriple
 *
 * @function
 * @param  {*} x
 * @return {function(y:*): function(z:*): y} - y
 * @example
 * triple(1)(2)(3)(secondOfTriple) === 2
 */
const secondOfTriple = x => y => z => y;

/**
 * x -> y -> z -> z ; thirdOfTriple
 *
 * @function
 * @param {*} x
 * @return {function(y:*): function(z:*): z} - z
 * @example
 * triple(1)(2)(3)(thirdOfTriple) === 3
 */
const thirdOfTriple = x => y => z => z;

/**
 * function -> pair -> pair
 *
 * @function
 * @param  {function} f
 * @return {function(pair): function(Function): {f: {x, y}}} new mapped pair
 * @example
 * mapPair( x => x+3 )( pair(1)(2) ) === pair(4)(5)
 * mapPair( x => x + "!!!" )( pair("Yes")("No") ) === pair("Yes!!!")("No!!!")
 */
const mapPair = f => p => pair(f(p(fst)))(f(p(snd)));

/**
 * p -> p `${p(fst)} | ${p(snd)} ; showPair
 *
 * @function
 * @param  {pair} p
 * @return string with first and second value
 * @example
 * const testPair = pair('Erster')('Zweiter');
 * showPair(testPair) === 'Erster | Zweiter'
 */
const showPair = p => `${p(fst)} | ${p(snd)}`;/**
 * Generic Types
 * @typedef {function} churchBoolean
 * @typedef {function} churchNumber
 */

/**
 *  church numbers 0 - 9
 *  n times application of function f to the argument a
 */
const n0$1 = f => a => a;
const n1$1 = f => a => f(a);
const n2$1 = f => a => f(f(a));
const n3$1 = f => a => f(f(f(a)));
const n4$1 = f => a => f(f(f(f(a))));
const n5$1 = f => a => f(f(f(f(f(a)))));
const n6$1 = f => a => f(f(f(f(f(f(a))))));
const n7$1 = f => a => f(f(f(f(f(f(f(a)))))));
const n8$1 = f => a => f(f(f(f(f(f(f(f(a))))))));
const n9$1 = f => a => f(f(f(f(f(f(f(f(f(a)))))))));

/**
 * successor of a church number (with bluebird)
 *
 * @lambda λnfa.f(nfa)
 * @haskell successor :: Number -> a -> b -> Number
 *
 * @function successor
 * @param   {churchNumber} n
 * @returns {function(f:function): churchNumber} successor of n
 */
const succ$1 = n => f => B$1(f)(n(f));

/**
 * Addition with two Church-Numbers
 *
 * @lambda λnk.n( λnfa.f(nfa) )k
 * @haskell churchAddition :: Number -> Number -> Number
 *
 * @function
 * @param   {churchNumber} n
 * @returns {function(k:churchNumber): churchNumber } Church-Number
 */
const churchAddition = n => k => n(succ$1)(k);

/**
 * phi combinator
 * creates a new pair, replace first value with the second and increase the second value
 *
 * @function
 * @param   {pair} p
 * @returns {pair} pair
 */
const phi$1 = p => pair(p(snd))(succ$1(p(snd)));

/**
 * predecessor
 * return the predecessor of passed churchNumber (minimum is n0 aka Zero). Is needed for churchSubtraction
 *
 * @function predecessor
 * @param   {churchNumber} n
 * @returns {churchNumber} predecessor of n
 */
const pred$1 = n => n(phi$1)(pair(n0$1)(n0$1))(fst);

/**
 * Subtraction with two Church-Numbers
 *
 * @function
 * @param  {churchNumber} n
 * @return {function(k:churchNumber): churchNumber } Church-Number
 */
const churchSubtraction = n => k => k(pred$1)(n);

/**
 * Multiplication with two Church-Numbers
 *
 * @function
 * @param   {churchNumber} n
 * @returns {function(k:churchNumber): churchNumber } Church-Number
 */
const churchMultiplication = B$1;

/**
 * Potency with two Church-Numbers
 *
 * @function
 * @param   {churchNumber} n
 * @returns {function(k:churchNumber): churchNumber } Church-Number
 */
const churchPotency = T;

/**
 * query if the church number is zero (n0)
 *
 * @function
 * @param  {churchNumber} n
 * @return {churchBoolean} True / False
 */
const is0 = n => n(K$1(False))(True);

/**
 * converts a js number to a church number
 *
 * @function
 * @param   {number} n
 * @returns {churchNumber} church number of n
 */
const churchNum$1 = n => n === 0 ? n0$1 : succ$1(churchNum$1(n - 1));

/**
 * converts a church number to a js number
 *
 * @function
 * @param   {churchNumber} n
 * @returns {number} js number of n
 * @example
 * jsNum(n0) === 0
 * jsNum(n1) === 1
 * jsNum(n2) === 2
 * jsNum(n3) === 3
 */
const jsNum$1 = n => n(x => x + 1)(0);


/**
 * "less-than-or-equal-to" with Church-Numbers
 *
 * @function
 * @param  {churchNumber} n
 * @return {function(k:churchNumber): churchBoolean} True / False
 */
const leq$1 = n => k => is0(churchSubtraction(n)(k));

/**
 * "equal-to" with Church-Number
 *
 * @function
 * @param  {churchNumber} n
 * @return {function(k:churchNumber): churchBoolean} True / False
 */
const eq$1 = n => k => and(leq$1(n)(k))(leq$1(k)(n));

/**
 * "greater-than" with Church-Numbers
 *
 * @function
 * @param  {churchNumber} n
 * @return {function(k:churchNumber): churchBoolean} True / False
 */
const gt = Blackbird(not)(leq$1);

/**
 * max of two Church-Numbers
 *
 * @function
 * @param  {churchNumber} n
 * @return {function(k:churchNumber): churchBoolean} n / k
 */
const max = n => k => gt(n)(k)(n)(k);

/**
 * min of two Church-Numbers
 *
 * @function
 * @param  {churchNumber} n
 * @return {function(k:churchNumber): churchBoolean} n / k
 */
const min = n => k => leq$1(n)(k)(n)(k);/**
 * Generic Types
 * @typedef {function} pair
 * @typedef {function} churchBoolean
 * @typedef {function} churchNumber
 * @typedef {function} stack
 * @typedef {function} listMap
 */

/**
 * index -> predecessor -> pair -> f -> f(index)(predecessor)(head) ; Triple
 *
 * The listMap is a pure functional data structure and is therefore immutable.
 * The listMap is implemented as a stack aka triplet.
 * So the listMap have all the features and functionality that have the stack too.
 *
 * The first value of the listMap represents the size (number of elements) of the listMap.
 * At the same time the first value represents the index of the head (top value) of the listMap.
 * The second value represents the predecessor listMap
 * The third value represents the head ( top value ) of the listMap
 *
 * @type {function(index:churchNumber): function(predecessor:stack):  function(value:*): function(f:function): ({f: {index value head}}) }
 * @return {triple} listMap as triple aka stack
 */
const listMap = triple;

/**
 * Representation of the empty stack
 * The empty listMap has the size/index zero (has zero elements).
 * The empty listMap has no predecessor stack, but the identity function as placeholder.
 * The empty listMap has no head ( top value ), but a pair of two identity functions as placeholder.
 *
 * @type {function(Function): {f: {index, predecessor, head}}}
 */
const emptyListMap = listMap(n0$1)(I$1)( pair(I$1)(I$1) );

/**
 * A help function to create a new listMap
 */
const startListMap = f => f(emptyListMap);

/**
 * This function takes a map function (like JavaScript Array map) and a listMap. The function returns a new listMap with the "mapped" values.
 *
 * @function
 * @param  {function} f
 * @return {function(listMap): listMap} ListMap
 * @example
 * const toUpperCase      = str => str.toUpperCase();
 * const listMapWithNames = convertObjToListMap({name1: "Peter", name2: "Hans"});
 *
 * const mappedListMap    = mapListMap(toUpperCase)(listMapWithNames); // [ ("name1", "PETER"), ("name2", "HANS") ]
 *
 * getElementByKey( mappedListMap )( "name1" ) // "PETER"
 * getElementByKey( mappedListMap )( "name2" )  // "HANS"
 */
const mapListMap = f => map(p => pair( p(fst) )( f(p(snd)) ));

/**
 * This function takes a filter function (like JavaScript Array filter) and a listMap. The function returns the filtered listMap. If no elements match the filter, the empty listMap is returned.
 *
 * @function
 * @param  {function} f
 * @return {function(listMap): listMap} ListMap
 * @example
 * const listMapWithNames = convertObjToListMap({name1: "Peter", name2: "Hans", name3: "Paul"});
 *
 * const filteredListMap  = filterListMap(str => str.startsWith('P'))(listMapWithNames); // [ ("name1", "Peter"), ("name3", "Paul") ]
 *
 * getElementByKey(filteredListMap)("name1");  // "Peter"
 * getElementByKey(filteredListMap)("name3");  // "Paul"
 */
const filterListMap = f => filter(p => f(p(snd)) );

/**
 * This function takes a reduce function first, a start value second and a ListMap as the last parameter. The function returns the reduced value.
 *
 * @function
 * @param  {function} f
 * @return {function(listMap): listMap} ListMap
 * @example
 * const reduceFunc = acc => curr => acc + curr.income;
 * const employees = convertObjToListMap({ p1: {firstName: 'Peter',  income: 1000},
 *                                         p2: {firstName: 'Michael', income: 500} });
 *
 * reduceListMap(reduceFunc)(0)(employees); // 1500
 */
const reduceListMap = f => reduce(acc => curr => f(acc)(curr(snd)));

/**
 * Takes a JavaScript object and convert the key and values analog into a listMap
 *
 * @param  {object} obj
 * @return {listMap}
 * @example
 * const obj = {a: 'Hello', b: "Lambda"}
 *
 * const listMapEx = convertObjToListMap(obj);
 *
 * size(listMapEx)               // n2
 * getElementByIndex(result)(n1) // pair('a')("Hello"));
 * getElementByIndex(result)(n2) // pair('b')("Lambda"));
 */
const convertObjToListMap = obj => Object.entries(obj).reduce((acc, [key, value]) => push(acc)(pair(key)(value)), emptyListMap);

/**
 * Get the element in the ListMap by the key (key could be anything that can be comparable. Hint: Functions are not comparable except they have a notation like n1, n2, id, pair ... etc.)
 *
 * @function
 * @param  {listMap} listMap
 * @return {function(key:Number): *} element (value) or id if key not exist
 * @example
 * const testListMap = convertObjToListMap( {1: "Hans", 2: "Peter", 3: 42} )
 *
 * getElementByKey( testListMap )( 1 ) === "Hans"
 * getElementByKey( testListMap )( 2 ) === "Peter"
 * getElementByKey( testListMap )( 3 ) === 42
 */
const getElementByKey = listMap => key => {
    const times         = size(listMap); // TODO: successor of size
    const initArgsPair  = pair(listMap)(I$1); // TODO: set to undefined

    const getElement = argsPair => {
        const stack             = argsPair(fst);
        const predecessorStack  = (stack)(stackPredecessor);
        const currentKeyValPair = head(stack);

      return (currentKeyValPair(fst) === key)
        ? pair(predecessorStack)( currentKeyValPair(snd) )
        : pair(predecessorStack)( argsPair(snd)          );
    };

    return (times(getElement)(initArgsPair))(snd);
};

/**
 * Remove the element in the ListMap by the key (key could be anything that can be comparable. Hint: Functions are not comparable except they have a notation like n1, n2, id, pair ... etc.)
 *
 * @function
 * @param  {listMap} listMap
 * @return {function(key:*): *} element (value)
 * @example
 * const testListMap = convertObjToListMap( {1: "Hans", 2: "Peter", 3: 42} )
 *
 * jsnum( size(testListMap) ) === 3
 *
 * const listMapOneRemoved = removeByKey(testListMap)(1)
 * jsnum( size(listMapOneRemoved) ) === 2
 */
const removeByKey = listMap => key => {
    const times         = size(listMap);
    const reversedStack = reverseStack(listMap);

    const removeByCon = currentStack => resultStack => key => {
        const currentKeyValPair = head(currentStack);
        const currentElement    = currentKeyValPair(snd);
        const currentKey        = currentKeyValPair(fst);
        const result            = key === currentKey
                                       ? resultStack
                                       : push( resultStack )( pair(currentKey)(currentElement) );

        return pair( getPreStack(currentStack) )( result );
    };

    const iteration = argsPair =>
        If( hasPre(argsPair(fst)) )
            (Then( removeByCon(argsPair(fst))(argsPair(snd))(key) ))
            (Else( argsPair ));


    return (times
                (iteration)
                (pair(reversedStack)(emptyListMap) )
            )(snd);
};

/**
 *  A function that takes an ListMap, takes the values (ignore the keys) and converts it into an array and returns the array.
 *
 * @param  {listMap} listMap
 * @return {Array} Array
 * @example
 * const personObject  = {firstName: "George", lastName: "Lucas"}
 *
 * const personListMap = convertListMapToArray(personObject); // [ ("firstName", "George"), ("lastName","Lucas") ]
 *
 * convertListMapToArray( personListMap ) // [ "George", "Lucas" ]
 */
const convertListMapToArray = listMap => reduceListMap(acc => curr => [...acc, curr])([])(listMap);

/**
 *  A function that takes an ListMap, takes the values (ignore the keys) and converts it into an array and returns the array.
 *
 * @param  {listMap} listMap
 * @return {Array} Array
 * @example
 * const personObject = {firstName: "George", lastName: "Lucas"}
 *
 * const result = convertObjToListMap( personObject ); // [ ("firstName", "George"), ("lastName","Lucas") ]
 *
 * getElementByKey( result )( "firstName" );  // "George"
 * getElementByKey( result )( "lastName"  );  // "Lucas"
 */
const convertListMapToStack = listMap => reduceListMap(acc => curr => push(acc)(curr))(emptyStack)(listMap);

/**
 * The logListMapToConsole function takes a ListMap and executes a site effect. The site effect logs the ListMap with its key and values to the console.
 *
 * @sideeffect
 * @function
 * @param {listMap} listMap
 */
const logListMapToConsole = listMap =>
    forEach(listMap)((element, index) => console.log(`Index ${index} (Key, Element): (${JSON.stringify(element(fst))}, ${JSON.stringify(element(snd))})` ));/*
    EITHER-Type
    Left and Right are two functions that accept one value and two functions respectively.
    Both functions ignore one of the two passed functions.
    The Left function applies the left (first passed) function to the parameter x and ignores the second function.
    The Right function applies the right (second passed) function to the parameter x and ignores the first function.
    Left and Right form the basis for another type, the Maybe Type.
 */
const Left   = x => f => _ => f (x);
const Right  = x => _ => g => g (x);
const either = I$1;

/*
    MAYBE-Type
    The Maybe Type builds on the Either Type and comes from the world of functional programming languages.
    The Maybe Type is a polymorphic type that can also (like the Either Type) assume two states.
    The states are: there is a value, which is expressed with Just(value), or there is no value, which is expressed with Nothing.
 */
const Nothing  = Left();
const Just     = Right ;

/**
 * unpacks the Maybe element if it is there, otherwise it returns the default value
 *
 * @param maybe
 * @return {function(defaultVal:function): *} maybe value or given default value
 * @example
 * getOrDefault( maybeDiv(6)(2) )( "Can't divide by zero" ) === 3
 * getOrDefault( maybeDiv(6)(0) )( "Can't divide by zero" ) === "Can't divide by zero"
 */
const getOrDefault = maybe => defaultVal =>
    maybe
        (() => defaultVal)
        (I$1);

/**
 * The function maybeDivision "maybe" performs a division with 2 passed parameters.
 * If the passed numbers are of type integer and the divisor is not 0, the division is performed and Just is returned with the result.
 *
 * @param  {number} dividend
 * @return {function(divisor:number): function(Just|Nothing)} a Maybe (Just with the divided value or Nothing)
 */
const maybeDivision = dividend => divisor =>
    Number.isInteger(dividend) &&
    Number.isInteger(divisor) &&
    divisor !== 0
        ? Just(dividend / divisor)
        : Nothing;

/**
 * The eitherTruthy function expects a value and checks whether it is truthy.
 * In case of success, a Right with the element is returned and in case of error a Left with the corresponding error message.
 *
 * @param  {*} value
 * @return {Left|Right} either Right with the truthy value or Left with Error
 */
const eitherTruthy = value =>
    value
      ? Right(value)
      : Left(`'${value}' is a falsy value`);

/**
 * Take the element as maybe value if the element is a truthy value inclusive number Zero.
 *
 * @param  {*} value
 * @return {Just|Nothing} a Maybe (Just with the element or Nothing)
 */
const maybeTruthy = value =>
    eitherTruthy(value)
        (_ => Nothing)
        (_ => Just(value));

/**
 * The eitherNotNullAndUndefined function expects a value and checks whether it is not null or undefined.
 *
 * @param  {*} value
 * @return {Left|Right} either Right with the truthy value or Left with Error
 */
const eitherNotNullAndUndefined = value =>
    value !== null && value !== undefined
        ? Right(value)
        : Left(`element is '${value}'`);

/**
 * The maybeNotNullAndUndefined function expects a value and checks whether it is not null or undefined.
 *
 * @param  {*} value
 * @return {Just|Nothing} a Maybe (Just with the element or Nothing)
 */
const maybeNotNullAndUndefined = value =>
    eitherNotNullAndUndefined(value)
        (_ => Nothing)
        (_ => Just(value));

/**
 * The eitherElementOrCustomErrorMessage function expects an error message and an element.
 * The function checks the element for null or undefined and returns either a Right with the value or a Left with the error message passed.
 *
 * @param  {string} errorMessage
 * @return {function(element:*): Left|Right} either Right with the given Element or Left with the custom ErrorMessage
 */
const eitherElementOrCustomErrorMessage = errorMessage => element =>
    eitherNotNullAndUndefined(element)
        (_ => Left(errorMessage))
        (_ => Right(element));

/**
 * The eitherDomElement function takes a Dom element id and returns an Either Type.
 * If successful, the HTML element is returned, otherwise an error message that such an element does not exist.
 *
 * @param  {string} elemId
 * @return {Left|Right} either Right with HTMLElement or Left with Error
 */
const eitherDomElement = elemId =>
    eitherElementOrCustomErrorMessage
        (`no element exist with id: ${elemId}`)
        (document.getElementById(elemId));

/**
 * This function takes a DOM element ID as a string.
 * If an element with this ID exists in the DOM, a Just with this HTMLElement is returned, otherwise Nothing.
 *
 * @param  {*} value
 * @return {Just|Nothing} a Maybe (Just with the element or Nothing)
 */
const maybeDomElement = elemId =>
    eitherDomElement(elemId)
        (_ => Nothing)
        (e => Just(e));

/**
 * This function takes a DOM element ID as a string.
 * If an element with this ID exists in the DOM, the HTMLElement is returned, otherwise undefined.
 *
 * @param  {string} elemId
 * @return {HTMLElement|undefined} HTMLElement when exist, else undefined
 */
const getDomElement = elemId =>
    eitherDomElement(elemId)
        (console.error)
        (I$1);

/**
 * This function takes many DOM element ID as array of string.
 * If elements with those ID exists in the DOM, the HTMLElements ares returned, otherwise undefined
 *
 * @param  {string} elemIds
 * @return {HTMLElement|undefined[]} a array with HTMLElements when exist, else undefined
 */
const getDomElements = (...elemIds) =>
    elemIds.map(getDomElement);

/**
 * This function takes a value and checks whether it is of the type Integer.
 * If it is not a value of the type Integer, a Nothing is returned.
 *
 * @param  {*} value
 * @return {Just|Nothing} a Maybe (Just with the element or Nothing)
 */
const maybeNumber = value =>
    eitherNumber(value)
        (_ => Nothing)
        (_ => Just(value));

/**
 * The eitherNumber function checks whether a value is of the integer type.
 *
 * @param  {*} value
 * @return {Left|Right} either Right with number or Left with Error
 */
const eitherNumber = value =>
    Number.isInteger(value)
        ? Right(value)
        : Left(`'${value}' is not a integer`);

/**
 * The eitherNaturalNumber function checks whether the value passed is a natural JavaScript number.
 *
 * @param  {*} value
 * @return {Left|Right} either Right with positiv number or Left with Error
 */
const eitherNaturalNumber = value =>
    Number.isInteger(value) && value >= 0
        ? Right(value)
        : Left(`'${value}' is not a natural number`);

/**
 * The eitherFunction function checks whether a value is of the type function.
 *
 * @param  {*} value
 * @return {Left|Right} either Right with function or Left with Error
 */
const eitherFunction = value =>
    typeof value === "function"
        ? Right(value)
        : Left(`'${value}' is not a function`);

/**
 * The maybeFunction function checks whether a value is of the type function.
 *
 * @param  {*} value
 * @return {Just|Nothing} a Maybe (Just with the element or Nothing)
 */
const maybeFunction = value =>
    eitherFunction(value)
        (_ => Nothing)
        (_ => Just(value));

/**
 * The eitherTryCatch function takes a function f that could go wrong.
 * This function is executed in a try-catch block.
 * If an error occurs during the execution of the function, it is caught and a left is returned with the error message, otherwise a right with the result.
 *
 * @param  {function} f
 * @return {Left|Right} either Right with function or Left with Error
 */
const eitherTryCatch = f => {
    try {
        return Right(f());
    } catch (error) {
        return Left(error);
    }
};

/**
 * The function eitherElementsOrErrorsByFunction takes a function as the first parameter and a rest parameter (JavaScript Rest Parameter) as the second parameter.
 * The function that is passed should take a value and return an Either Type. The function eitherElementsOrErrorsByFunction then applies the passed function to any value passed by the Rest parameter.
 * An Either is returned: In case of success (Right) the user gets a ListMap with all "success" values. In case of an error, the user gets a stack with all error messages that occurred.
 *
 * @haskell eitherElementsOrErrorsByFunction:: (a -> Either a) -> [a] -> Either [a]
 * @param  {function} eitherProducerFn
 * @return {function(elements:...[*]): {(Left|Right)}} either Right with all "success" values as ListMap or Left with all error messages that occurred as Stack
 */
const eitherElementsOrErrorsByFunction = eitherProducerFn => (...elements) =>
    reduce(acc => curr =>
        acc
         ( stack => Left( eitherProducerFn(curr)
                            (err => push(stack)(err) )
                            (_   => stack            )
                        )
         )
         ( listMap => eitherProducerFn(curr)
                        (err => Left(  push( emptyStack )( err             )))
                        (val => Right( push( listMap    )( pair(curr)(val) )))
         )
    )
    ( Right( emptyListMap) )
    ( convertArrayToStack(elements) );

// Haskell: (a -> Maybe a) -> [a] -> Maybe [a]
const maybeElementsByFunction = maybeProducerFn => (...elements) =>
    reduce
    (acc => curr =>
        flatMapMaybe(acc)(listMap =>
            mapMaybe( maybeProducerFn(curr) )(val => push(listMap)( pair(curr)(val) ))
        )
    )
    ( Just(emptyListMap) )
    ( convertArrayToStack(elements) );

/**
 * The mapMaybe function is used to map a Maybe Type. The function takes a Maybe and a mapping function f.
 * The function returns the mapped Maybe.
 *
 * @param  {function} maybe
 * @return {function(f:function): Just|Nothing} a Maybe (Just with the element or Nothing)
 * @example
 * mapMaybe( Just(10) ) (x => x * 4) // Just (40)
 * mapMaybe( Nothing )  (x => x * 4) // Nothing
 */
const mapMaybe  = maybe => f => maybe (() => maybe) (x => Just(f(x)));  // maybe.map

/**
 * The function flatMapMaybe is used to map a maybe type and then flatten the result.
 *
 * @param  {function} maybe
 * @return {function(f:function): Just|Nothing} a Maybe (Just with the element or Nothing=
 * @example
 * flatMapMaybe( Just(10) )(num => Just(num * 2));    // Just (20)
 * flatMapMaybe( Just(10) )(num => Nothing      );    // Nothing
 * flatMapMaybe( Nothing  )(num => Just(num * 2));    // Nothing
 */
const flatMapMaybe = maybe => f => maybe (() => maybe) (x =>       f(x));  // maybe.flatmap
/**
 * Generic Types
 * @typedef {function} pair
 * @typedef {function} churchBoolean
 * @typedef {function} stack
 * @typedef {function} stackOp
 * @typedef {function} maybe
 * @typedef {function} either
 * @typedef {function} churchNumber
 * @typedef {number}   jsNumber
 */

/**
 * index -> predecessor -> value -> f -> f(index)(predecessor)(head) ; Triple
 *
 * The stack is a pure functional data structure and is therefore immutable.
 * The stack is implemented as a triplet.
 * The first value of the triple represents the size (number of elements) of the stack.
 * At the same time the first value represents the index of the head (top value) of the stack.
 * The second value represents the predecessor stack
 * The third value represents the head ( top value ) of the stack
 *
 * @function
 * @type stack
 * @return {triple} stack as triple
 */
const stack = triple;

/**
 * Representation of the empty stack
 * The empty stack has the size/index zero (has zero elements).
 * The empty stack has no predecessor stack, but the identity function as placeholder.
 * The empty stack has no head ( top value ), but the identity function as placeholder.
 *
 * @function
 * @type stack
 * @return {stack} emptyStack
 */
const emptyStack = stack(n0$1)(I$1)(I$1);

/**
 * A help function to create a new stack
 *
 * @function
 * @param  {function} f
 * @return {stack} stack
 */
const startStack = f => f(emptyStack);

/**
 * stack getter function - get the Index (first of a triple)
 *
 * @haskell stackIndex :: a -> b -> c -> a
 * @function
 * @return {churchNumber} index/size
 * @example
 * stack(n0)(emptyStack)(42)(stackIndex) === n0
 */
const stackIndex = firstOfTriple;

/**
 * stack getter function - get the Predecessor (second of a triple)
 *
 * @haskell stackPredecessor :: a -> b -> c -> b
 * @function
 * @return {stack|id} predecessor stack or id if emptyStack
 * @example
 * stack(n0)(emptyStack)(42)(stackPredecessor) === emptyStack
 */
const stackPredecessor = secondOfTriple;

/**
 * stack getter function - get the Value (third of a triple)
 *
 * @haskell stackValue :: a -> b -> c -> c
 * @function
 * @return {*} value
 * @example
 * stack(n0)(emptyStack)(42)(stackValue) === 42
 */
const stackValue = thirdOfTriple;

/**
 * A function that takes a stack and returns a church-boolean, which indicates whether the stack has a predecessor stack
 *
 * @haskell: hasPre :: a -> churchBoolean
 * @function hasPredecessor
 * @param  {stack} s
 * @return {churchBoolean} churchBoolean
 */
const hasPre = s => not(is0(s(stackIndex)));

/**
 * A function that takes a stack and returns the predecessor stack
 *
 * @haskell getPreStack :: stack -> stack
 * @function getPredecessorStack
 * @param  {stack} s
 * @return {stack} predecessor stack of that stack
 */
const getPreStack = s => s(stackPredecessor);

/**
 * A function that takes a stack and a value.
 * The function returns a new stack with the pushed value.
 *
 * @haskell push :: stack -> a -> stack
 * @param  {stack} s
 * @return {stack} stack with value x
 */
const push = s => stack(succ$1(s(stackIndex)))(s);

/**
 * A function that takes a stack and returns a value pair.
 * The first element of the pair is the predecessor stack.
 * The second element of the pair is the head (the top element) of the stack.
 *
 * @haskell pop :: stack -> pair
 * @param  {stack} s
 * @return {pair} pair
 */
const pop = s => pair(getPreStack(s))(head(s));

/**
 * A function that takes a stack. The function returns the head (the top value) of the stack.
 *
 * @haskell head :: stack -> a
 * @function
 * @param  {stack} s
 * @return {*} stack-value
 */
const head = s => s(stackValue);

/**
 * A function that takes a stack. The function returns the index (aka stack-size) of the stack
 *
 * @haskell size :: stack -> churchNumber
 * @function
 * @param  {stack} s
 * @return {churchNumber} stack-index as church numeral
 */
const getStackIndex = s => s(stackIndex);

/**
 * A function that takes a stack and returns the size (number of elements) in the stack
 *
 * @haskell size :: stack -> churchNumber
 * @function
 * @param  {stack} s
 * @return {churchNumber} size (stack-index) as church numeral
 */
const size = getStackIndex;

/**
 * A function that takes a reduce-function, the initial reduce value and a stack.
 * The function reduces the stack using the passed reduce function and the passed start value
 *
 * @haskell reduce :: reduceFn ->initialValue -> stack -> a
 * @function
 * @param  {function} reduceFn
 * @return {function(initialValue:*): function(s:stack): function(stack)} reduced value
 * @example
 * const stackWithNumbers  = convertArrayToStack([0,1,2]);
 *
 * const reduceFunctionSum = acc => curr => acc + curr;
 * reduce( reduceFunctionSum )( 0 )( stackWithNumbers )          ===  3
 * reduce( reduceFunctionSum )( 0 )( push(stackWithNumbers)(3) ) ===  5
 *
 * reduce( reduceFunctionSum )( 5 )( stackWithNumbers )          ===  8
 * reduce( reduceFunctionSum )( 5 )( push(stackWithNumbers)(3) ) === 10
 *
 * const reduceToArray = acc => curr => [...acc, curr];
 * reduce( reduceToArray )( [] )( stackWithNumbers ) === [0, 1, 2]
 */
const reduce = reduceFn => initialValue => s => {

    const reduceIteration = argsTriple => {
        const stack = argsTriple(firstOfTriple);

        const getTriple = argsTriple => {
            const reduceFunction    = argsTriple(secondOfTriple);
            const preAcc            = argsTriple(thirdOfTriple);
            const curr              = head(stack);
            const acc               = reduceFunction(preAcc)(curr);
            const preStack          = stack(stackPredecessor);
            return triple(preStack)(reduceFunction)(acc);
        };

        return If( hasPre(stack) )
                (Then( getTriple(argsTriple) ))
                (Else(           argsTriple  ));
    };

    const times = size(s);
    const reversedStack = times
                            (reduceIteration)
                                (triple
                                    (s)
                                    (acc => curr => push(acc)(curr))
                                    (emptyStack)
                                )
                                (thirdOfTriple);

    return times
            (reduceIteration)
                (triple
                    (reversedStack)
                    (reduceFn)
                    (initialValue)
            )(thirdOfTriple);
};

/**
 * A function that takes a stack and an index (as Church- or JS-Number).
 * The function returns the element at the passed index or undefined incl. a Error-Log to the Console
 *
 * @haskell getElementByIndex :: stack -> number -> a
 * @sideeffect Logs a error when index is no Church- or JS-Number or valid number
 * @function
 * @param {stack} stack
 * @return {function(index:churchNumber|jsNumber) : * } stack-value or undefined when not exist or invalid
 * @example
 * const stackWithNumbers  = convertArrayToStack([0,1,2]);
 *
 * getElementByIndex( stackWithNumbers )( n0 ) === id
 * getElementByIndex( stackWithNumbers )( n1 ) ===  0
 * getElementByIndex( stackWithNumbers )( n2 ) ===  1
 * getElementByIndex( stackWithNumbers )( n3 ) ===  2
 *
 * getElementByIndex( stackWithNumbers )( 0 ) === id
 * getElementByIndex( stackWithNumbers )( 1 ) ===  0
 * getElementByIndex( stackWithNumbers )( 2 ) ===  1
 * getElementByIndex( stackWithNumbers )( 3 ) ===  2
 *
 * getElementByIndex( stackWithNumbers )( "im a string" ) === undefined // strings not allowed, throws a Console-Warning
 */
const getElementByIndex = stack => index =>
    eitherElementByIndex(stack)(index)
     (console.error)
     (I$1);

/**
 * A function that takes a stack and an index (as Church- or JS-Number).
 * The function returns a either Right with the value or if not exist or illegal index argument a Left with Error
 *
 * @haskell eitherElementByIndex :: stack -> number -> either
 * @function
 * @param  {stack} stack
 * @return {function(index:churchNumber|jsNumber) : either } a either with Right(value) or Lef("Element Error msg")
 * @example
 * const stackWithNumbers  = convertArrayToStack([0,1,2]);
 *
 * eitherElementByIndex( stackWithNumbers )( n0 )(id)(id) ===  id
 * eitherElementByIndex( stackWithNumbers )( n1 )(id)(id) ===   0
 * eitherElementByIndex( stackWithNumbers )( n2 )(id)(id) ===   1
 * eitherElementByIndex( stackWithNumbers )( n3 )(id)(id) ===   2
 *
 * eitherElementByIndex( stackWithNumbers )(  0 )(id)(id) ===  id
 * eitherElementByIndex( stackWithNumbers )(  1 )(id)(id) ===   0
 * eitherElementByIndex( stackWithNumbers )(  2 )(id)(id) ===   1
 * eitherElementByIndex( stackWithNumbers )(  3 )(id)(id) ===   2
 *
 * eitherElementByIndex( stackWithNumbers )( "im a string" )(id)(id) === "getElementByIndex - TypError: index value 'im a string' (string) is not allowed. Use Js- or Church-Numbers"
 */
const eitherElementByIndex = stack => index =>
    eitherTryCatch(
        () => eitherFunction(stack) // stack value is NOT a stack aka function
            (_ => Left(`getElementByIndex - TypError: stack value '${stack}' (${typeof stack}) is not allowed. Use a Stack (type of function)`))
            (_ => eitherNaturalNumber(index)
                (_ => eitherElementByChurchIndex(stack)(index) )
                (_ => eitherElementByJsNumIndex (stack)(index) )
            ))
    (_ => Left(`getElementByIndex - TypError: stack value '${stack}' (${typeof stack}) is not a stack`)) // catch
    (I$1); // return value

/**
 * A function that takes a stack and an index as ChurchNumber.
 * The function returns a either Right with the value or if not exist or illegal index argument a Left with Error
 *
 * @haskell eitherElementByChurchIndex :: stack -> churchNumber -> either
 * @function
 * @param  {stack} stack
 * @return {function(index:churchNumber) : either } a either with Right(value) or Lef("Element Error msg")
 */
const eitherElementByChurchIndex = stack => index =>
    eitherFunction(index)
        (_ => Left(`getElementByIndex - TypError: index value '${index}' (${typeof index}) is not allowed. Use Js- or Church-Numbers`))
        (_ => eitherNotNullAndUndefined( getElementByChurchNumberIndex(stack)(index) )
            (_ => Left("invalid index"))
            (e => Right(e))               );

/**
 * A function that takes a stack and an index as JsNumber.
 * The function returns a either Right with the value or if not exist or illegal index argument a Left with Error
 *
 * @haskell eitherElementByJsNumIndex :: stack -> jsNumber -> either
 * @function
 * @param  {stack} stack
 * @return {function(index:jsNumber) : either } a either with Right(value) or Lef("Element Error msg")
 */
const eitherElementByJsNumIndex = stack => index =>
    eitherNotNullAndUndefined( getElementByJsNumIndex(stack)(index) )
        (_ => Left("invalid index"))
        (e => Right(e)                );

/**
 * A function that takes a stack and an index as ChurchNumber.
 * The function returns the element at the passed index or if not exist a undefined
 *
 * @function
 * @param  {stack} s
 * @return {function(i:churchNumber) : *} stack-value
 */
const getElementByChurchNumberIndex = s => i =>
    If( leq$1(i)(size(s)))
        (Then( head( ( churchSubtraction(size(s))(i) )(getPreStack)(s))))
        (Else(undefined));

/**
 * A function that takes a stack and an index as JsNumber.
 * The function returns the element at the passed index or if not exist a undefined
 *
 * @function
 * @param  {stack} s
 * @return {function(i:Number) : *} stack-value
 */
const getElementByJsNumIndex = s => i => {
    if (i < 0){ return undefined; } // negativ index are not allowed

    const times = succ$1(size(s));
    const initArgsPair = pair(s)(undefined);

    const getElement = argsPair => {
        const stack = argsPair(fst);
        const result = pair(getPreStack(stack));

        return (jsNum$1(getStackIndex(stack)) === i)
            ? result(head(stack))
            : result(argsPair(snd));

    };
    return (times
                (getElement)(initArgsPair)
            )
            (snd);
};

/**
 * A function that takes a stack and an element. The function returns the index (ChurchNumber) of the element from the passed stack.
 * Returns undefined when element does not exist in the stack.
 *
 * @function
 * @param  {stack} s
 * @return {function(element:*) : churchNumber|undefined} a ChurchNumber or undefined
 * @example
 * const stackWithNumbers  = convertArrayToStack([0,1,2]);
 *
 * getIndexOfElement( stackWithNumbers )(  0 ) === n1
 * getIndexOfElement( stackWithNumbers )(  1 ) === n2
 * getIndexOfElement( stackWithNumbers )(  2 ) === n3
 * getIndexOfElement( stackWithNumbers )( 42 ) === undefined
 */
const getIndexOfElement = s => element => {

    const getIndex = argsPair => {
        const stack  = argsPair(fst);
        const result = pair(getPreStack(stack));

        return If( churchBool(head(stack) === element))
                    (Then( result(getStackIndex(stack)) ) )
                    (Else( result(argsPair(snd))        ) );
    };

    const times        = succ$1(size(s));
    const initArgsPair = pair(s)(undefined);

    return (times
             (getIndex)(initArgsPair)
           )
           (snd);
};

/**
 * A function that takes a stack and an element. The function returns a maybe-Monade Just with the index (ChurchNumber) of the element from the passed stack.
 * Returns Nothing when element does not exist in the stack.
 *
 * @function
 * @param  {stack} s
 * @return {function(element:*): either} Just(withIndex) or Nothing
 */
const maybeIndexOfElement = s => element => {
    const result = getIndexOfElement(s)(element);
    return result === undefined
            ? Nothing
            : Just(result);
};

/**
 * A function that takes a stack and an element.
 * Returns True (ChurchBoolean) when element does exist in the stack.
 * Returns False (ChurchBoolean) when element does not exist in the stack.
 *
 * @function
 * @param  {stack} s
 * @return {function(element:*) : churchBoolean } True or False
 */
const containsElement = s => element =>
    maybeIndexOfElement(s)(element)
        ( () => False )
        ( () => True  );

/**
 *  A function that takes an stack and converts the stack into an array. The function returns an array
 *
 * @param  {stack} s
 * @return {Array} Array
 * @example
 * const stackWithValues = convertArrayToStack( [1,2,3] )
 *
 * convertArrayToStack( stackWithValues ) === [1,2,3]
 */
const convertStackToArray = reduce(acc => curr => [...acc, curr])([]);

/**
 * A function that takes an javascript array and converts the array into a stack. The function returns a stack.
 *
 * @param  {Array} array
 * @return {stack} stack
 * const stackWithValues = convertArrayToStack( [1,2,3] )
 *
 * convertArrayToStack( stackWithValues ) === [1,2,3]
 */
const convertArrayToStack = array =>
    array.reduce((acc, curr) => push(acc)(curr), emptyStack);

/**
 * A function that takes an some Element and converts into a stack. The function returns a stack
 *
 * @param  {...*} elements
 * @return {stack} stack
 * const stackWithValues = convertElementsToStack( 1,2,3 )
 * convertStackToArray( stackWithValues ) === [1,2,3]
 *
 * const stackWithValues2 = convertElementsToStack( 1,2,3,...['a','b','c'] )
 * convertStackToArray( stackWithValues2 ) === [1,2,3,'a','b','c']
 */
const convertElementsToStack = (...elements) =>
    convertArrayToStack(elements);

/**
 * A function that accepts a stack and returns as a reversed stack.
 *
 * @param  {stack} s
 * @return {stack} stack (reversed)
 */
const reverseStack = s =>
    reduce(acc => _ => pair(pop(acc(fst))(fst))(push(acc(snd))(pop(acc(fst))(snd))))(pair(s)(emptyStack))(s)(snd);

/**
 *  A function that accepts a map function and a stack. The function returns the mapped stack.
 *
 * @param  {function} mapFunc
 * @return {function(reduce:stack): function(stack)} stack
 */
const mapWithReduce = mapFunc =>
    reduce(acc => curr => push(acc)(mapFunc(curr)))(emptyStack);

/**
 *  A function that accepts a stack and a filter function. The function returns the filtered stack.
 *
 * @param  {function} filterFunc
 * @return {function(reduce:stack): function(stack)} stack
 */
const filterWithReduce = filterFunc =>
    reduce(acc => curr => filterFunc(curr) ? push(acc)(curr) : acc)(emptyStack);

/**
 *  A function that takes a map function and a stack. The function returns the mapped stack
 *
 * @param  {function} mapFunction
 * @return {function(s:stack): stack} stack
 * @example
 * const stackWithNumbers = convertArrayToStack([2,5,6])
 *
 * const stackMultiplied  = map( x => x * 2)(stackWithNumbers)
 *
 * getElementByIndex( stackMultiplied )( 1 ) ===  4
 * getElementByIndex( stackMultiplied )( 2 ) === 10
 * getElementByIndex( stackMultiplied )( 3 ) === 12
 */
const map = mapFunction => s => {

    const mapIteration = argsPair => {
        const _stack       = argsPair(snd);
        const _mappedValue = mapFunction(head(_stack));
        const _resultStack = push(argsPair(fst))(_mappedValue);
        return pair(_resultStack)(getPreStack(_stack));
    };

    const times        = size(s);
    const initArgsPair = pair(emptyStack)(reverseStack(s));

    return (times
             (mapIteration)(initArgsPair)
            )
            (fst);
};

/**
 * A function that accepts a stack and a filter function. The function returns the filtered stack
 *
 * @param  {function} filterFunction
 * @return {function(s:stack): stack} pair
 * @example
 * const stackWithNumbers = convertArrayToStack([42,7,3])
 *
 * filter(x => x < 20 && x > 5)(stackWithNumbers) === convertArrayToStack([7])
 */
const filter = filterFunction => s => {

    const filterIteration = argsPair => {
        const _stackFilter    = argsPair(fst);
        const _stack          = argsPair(snd);
        const _nextValueStack = getPreStack(_stack);
        const _stackCurrValue = head(_stack);

        if (filterFunction(_stackCurrValue)) {
            const resultStack = push(_stackFilter)(_stackCurrValue);
            return pair(resultStack)(_nextValueStack);
        }

        return pair(_stackFilter)(_nextValueStack);
    };

    const times = size(s);
    const initArgsPair = pair(emptyStack)(reverseStack(s));

    return (times
                (filterIteration)(initArgsPair)
            )
            (fst);
};

/**
 * A function that accepts a stack. The function performs a side effect. The side effect logs the stack to the console.
 *
 * @function
 * @sideffect log to Console
 * @param {stack} stack
 */
const logStackToConsole = stack =>
    forEach(stack)((element, index) => console.log("At Index " + index + " is the Element " + JSON.stringify(element)));

/**
 * stackOperationBuilder is the connector for Stack-Operations to have a Builderpattern
 *
 * @function stackOperationBuilder
 * @param   {stackOp} stackOp
 * @returns {function(s:stack): function(x:*): function(f:function): function(Function) } pushToStack
 */
const stackOpBuilder = stackOp => s => x => f =>
    f(stackOp(s)(x));

/**
 * pushToStack is a Stack-Builder-Command to push new values to the current stack
 *
 * @function
 * @param   {stackOpBuilder} stackOp
 * @returns {function(pushToStack)} pushToStack
 * @example
 * const stackOfWords = convertArrayToStack(["Hello", "World"])
 *
 * getElementByIndex( stackOfWords )( 1 ) === "Hello"
 * getElementByIndex( stackOfWords )( 2 ) === "World"
 */
const pushToStack = stackOpBuilder(push);

/**
 * Foreach implementation for stack
 * A function that expects a stack and a callback function.
 * The current element of the stack iteration and the index of this element is passed to this callback function
 */
const forEachOld = stack => f => {
    const times = size(stack);
    const reversedStack = reverseStack(stack);

    const iteration = s => {
        if (jsBool(hasPre(s))) {
            const element = head(s);
            const index = jsNum$1(succ$1(churchSubtraction(times)(size(s))));

            f(element, index);

            return (pop(s))(fst);
        }
        return s;
    };

    times
        (iteration)(reversedStack);
};

/**
 * Foreach implementation for stack
 * A function that expects a stack and a callback function.
 * The current element of the stack iteration and the index of this element is passed to this callback function
 *
 * @function
 * @param stack
 * @return {function(callbackFunc:function): void}
 * @example
 * const stackWithNumbers = convertArrayToStack([5,10,15])
 *
 * forEach( stackWithNumbers )( (element, index) => console.log("At Index " + index + " is the Element " + element) );
 *
 * // Console-Output is:
 * // At Index 1 is the Element 5
 * // At Index 2 is the Element 10
 * // At Index 3 is the Element 15
 */
const forEach = stack => callbackFunc => {

    const invokeCallback = p => {
        const _stack   = p(fst);
        const _index   = p(snd);
        const _element = head(_stack);

        callbackFunc(_element, _index);

        return pair( getPreStack(_stack) )(_index + 1 );
    };

    const iteration = p =>
        If( hasPre(p(fst)) )
            (Then( invokeCallback(p) ))
            (Else(                p  ));

    const times         = size(stack);
    const reversedStack = reverseStack(stack);

    times
        (iteration)( pair(reversedStack)(1) );
};

/**
 * The removeByIndex function takes a stack and a Church- or JS-Number as an index.
 * The function deletes the element at the passed index and returns the new stack.
 * If the index does not exist, the same stack is returned.
 *
 * @function
 * @param  {stack} stack
 * @return {function(index:churchNumber|jsNumber) : stack } stack
 * @example
 * const stackWithStrings = convertArrayToStack(["Hello", "Haskell", "World"]);
 *
 * removeByIndex(stackWithStrings)(  2 )     // [ "Hello", "World" ]
 * removeByIndex(stackWithStrings)( n2 )     // [ "Hello", "World" ]
 */
const removeByIndex = stack => index => {

    const removeByCondition = currentStack => resultStack => index => currentIndex => {
        const currentElement    = head(currentStack);
        const result            = If( eq$1(index)(currentIndex) )
                                    (Then( resultStack ))
                                    (Else( push( resultStack )( currentElement )));

        return triple
                ( getPreStack(currentStack) )
                ( result                    )
                ( succ$1(currentIndex)        );
    };

    const removeElementFn = stack => index => {
        const times         = size(stack);
        const reversedStack = reverseStack(stack);

        const iteration = argsTriple => {
            const currentStack = argsTriple(firstOfTriple);
            const resultStack  = argsTriple(secondOfTriple);
            const currentIndex = argsTriple(thirdOfTriple);

            return If(hasPre(currentStack))
                      (Then( removeByCondition(currentStack)(resultStack)(index)(currentIndex) ))
                      (Else( argsTriple                                                        ));
        };

        return times
                (iteration)
                    (triple
                        ( reversedStack )
                        ( emptyStack    )
                        ( n1$1            )
                    )
                (secondOfTriple);
    };

    return eitherTryCatch(
        () => eitherFunction(stack) // stack value is NOT a stack aka function
            (_ => Left(`removeByIndex - TypError: stack value '${stack}' (${typeof stack}) is not allowed. Use a Stack (type of function)`))
            (_ => eitherNaturalNumber(index)
                (_ => removeElementFn(stack)(index))
                (_ => removeElementFn(stack)(churchNum$1(index)))
            ))
    (_ => Left(`removeByIndex - TypError: stack value '${stack}' (${typeof stack}) is not a stack`)) // catch
    (I$1) // return value
};

/**
 * Takes two stacks and concat it to one. E.g.:  concat( [1,2,3] )( [1,2,3] ) -> [1,2,3,1,2,3]
 *
 * @function
 * @haskell concat :: [a] -> [a] -> [a]
 * @param  {stack} s1
 * @return {function(s2:stack)} a concat stack
 * @example
 * const elements1          = convertArrayToStack( ["Hello", "Haskell"] );
 * const elements2          = convertArrayToStack( ["World", "Random"] );
 * const concatenatedStacks = concat( elements1 )( elements2 );
 *
 * jsNum( size( concatenatedStacks ) )          === 4
 * getElementByIndex( concatenatedStacks )( 0 ) === id
 * getElementByIndex( concatenatedStacks )( 1 ) === "Hello"
 * getElementByIndex( concatenatedStacks )( 2 ) === "Haskell"
 * getElementByIndex( concatenatedStacks )( 3 ) === "World"
 * getElementByIndex( concatenatedStacks )( 4 ) === "Random"
 */
const concat = s1 => s2 =>
    s1 === emptyStack
        ? s2
        : s2 === emptyStack
          ? s1
          : reduce(acc => curr => push(acc) (curr)) (s1) (s2);

/**
 * This function flatten a nested stack of stacks with values.
 * The function links them all together to form a stack. The depth level to which the structure is flattened is one.
 *
 * @function
 * @param  {stack} stack
 * @return {stack} a flatten stack
 * @example
 * const s1            = convertArrayToStack([1, 2]);
 * const s2            = convertArrayToStack([3, 4]);
 * const s3            = convertArrayToStack([5, 6]);
 * const stackOfStacks = convertArrayToStack([s1, s2, s3]);
 *
 * const flattenStack  = flatten( stackOfStacks );
 *
 * jsNum( size( flattenStack ) )          ===  6
 *
 * convertStackToArray(flattenStack)      === [1,2,3,4,5,6]
 *
 * getElementByIndex( flattenStack )( 0 ) === id
 * getElementByIndex( flattenStack )( 1 ) ===  1
 * getElementByIndex( flattenStack )( 2 ) ===  2
 * getElementByIndex( flattenStack )( 3 ) ===  3
 * getElementByIndex( flattenStack )( 4 ) ===  4
 * getElementByIndex( flattenStack )( 5 ) ===  5
 * getElementByIndex( flattenStack )( 6 ) ===  6
 */
const flatten = reduce( acc => curr => concat( acc )( curr ) )(emptyStack);

/**
 * The zipWith function receives a linking function and two stacks.
 * Using the linking function, the elements of the two transferred stacks are linked together to form a new stack.
 * If one of the two stacks passed is shorter, only the last element of the shorter stack is linked.
 *
 * @function
 * @haskell zipWith :: (a -> b -> c) -> [a] -> [b] -> [c]
 * @param  {function} f
 * @return {function(s1:stack): function(s2:stack): stack}
 * @example
 * const add = x => y => x + y;
 * const s1  = convertArrayToStack([1, 2, 3]);
 * const s2  = convertArrayToStack([4, 5, 6]);
 *
 * const zippedStack = zipWith(add)(s1)(s2);
 *
 * convertStackToArray( zippedStack )    === [5,7,9]
 *
 * jsNum( size( zippedStack ) )          ===  3
 *
 * getElementByIndex( zippedStack )( 0 ) === id
 * getElementByIndex( zippedStack )( 1 ) ===  5
 * getElementByIndex( zippedStack )( 2 ) ===  7
 * getElementByIndex( zippedStack )( 3 ) ===  9
 */
const zipWith = f => s1 => s2 => {

    const zipElements = t => {
        const s1  = t(firstOfTriple);
        const s2  = t(secondOfTriple);
        const acc = t(thirdOfTriple);

        const element1 = head(s1);
        const element2 = head(s2);

        const result = push(acc)( f(element1)(element2) );

        return triple
            ( getPreStack(s1) )
            ( getPreStack(s2) )
            ( result          );
    };

    const iteration = t =>
        If( hasPre(t(firstOfTriple)) )
            (Then( zipElements(t) ))
            (Else(             t  ));

    const times = min(size(s1))(size(s2));

    return times
        (iteration)
        (triple
            ( reverseStack(s1) )
            ( reverseStack(s2) )
            ( emptyStack       )
        )
        (thirdOfTriple);
};

/**
 * Zip (combine) two Stack to one stack of pairs
 * If one of the two stacks passed is shorter, only the last element of the shorter stack is linked.
 *
 * @function
 * @haskell zip :: [a] -> [b] -> [(a, b)]
 * @type {function(triple): function(triple): triple}
 * @example
 * const s1 = convertArrayToStack([1, 2]);
 * const s2 = convertArrayToStack([3, 4]);
 *
 * const zippedStack = zip(s1)(s2);
 *
 * jsNum( size(zippedStack) )          === 2
 * getElementByIndex( zippedStack )(0) === id
 * getElementByIndex( zippedStack )(1) === pair(1)(3)
 * getElementByIndex( zippedStack )(2) === pair(2)(4)
 */
const zip = zipWith(pair);

/**
 * Check two stacks of equality.
 *
 * @function
 * @param {stack} s1
 * @return {function(s2:stack): churchBoolean} True / False (ChurchBoolean)
 * @example
 * const s1 = convertArrayToStack([1, 2, 7]);
 * const s2 = convertArrayToStack([1, 2, 3]);
 *
 * stackEquals(s1)(s1) === True
 * stackEquals(s1)(s2) === False
 */
const stackEquals = s1 => s2 => {
    const size1 = size(s1);
    const size2 = size(s2);

    const times = size1;

    const compareElements = t => {
        const s1 = t(firstOfTriple);
        const s2 = t(secondOfTriple);

        const element1 = head(s1);
        const element2 = head(s2);

        const result = churchBool(element1 === element2);

        return triple
                ( getPreStack(s1) )
                ( getPreStack(s2) )
                ( result          );
    };

    const iteration = t =>
        LazyIf( and( hasPre( t(firstOfTriple)) )( t(thirdOfTriple)) )
         (Then(() => compareElements(t) ))
         (Else(() => t                  ));

    return LazyIf( eq$1(size1)(size2) )
                (Then(() => times
                                (iteration)
                                    (triple
                                        ( reverseStack(s1) )
                                        ( reverseStack(s2) )
                                        ( True             )
                                    )
                                    (thirdOfTriple))
                )
                (Else(() => False));
};/**
 * Creates a {@link SequenceType} on top of the given {@link stack}.
 *
 * @constructor
 * @pure
 * @template _T_
 * @param { stack } stack
 * @returns SequenceType<_T_>
 *
 * @example
 * const stack         = push(push(push(emptyStack)(1))(2))(3);
 * const stackSequence = StackSequence(stack);
 *
 * console.log(...stackSequence);
 * // => Logs: '3, 2, 1'
 */
const StackSequence = stack => {

  const stackIterator = () => {
    let internalStack = stack;

    const next = () => {
      const stackTuple  = pop(internalStack);
      const value       = stackTuple(snd$1);
      const done        = toJsBool(stackEquals(emptyStack)(internalStack));
      internalStack     = stackTuple(fst$1);

      return { value, done }
    };
    return { next };
  };

  return createMonadicSequence(stackIterator);
};/**
 * Returns a {@link SequenceType} that will repeatedly yield the value of `arg` when iterated over.
 * `repeat` will never be exhausted.
 *
 * @constructor
 * @pure
 * @haskell repeat :: a -> [a]
 * @template _T_
 * @param   { _T_ } arg
 * @returns { SequenceType<_T_> }
 *
 * @example
 * const ones   = repeat(1);
 * const result = take(3)(ones);
 *
 * console.log(...result);
 * // => Logs '1, 1, 1'
 */
const repeat = arg => Sequence(arg, _ => true, _ => arg);/**
 * `replicate(n)(x)` creates a {@link SequenceType} of length `n` with `x` the value of every element.
 *
 * @constructor
 * @pure
 * @haskell replicate :: Int -> a -> [a]
 * @type { <_T_>
 *           (n: Number)
 *        => (value: _T_)
 *        => Iterable<_T_>
 *       }
 *
 * @example
 * const trues = replicate(3)(true);
 *
 * console.log(...trues);
 * // => Logs 'true, true, true'
 */
const replicate = n => value => take(n)(repeat(value));/**
 * Creates a range of numbers between two inclusive boundaries,
 * that implements the JS iteration protocol.
 * First and second boundaries can be specified in arbitrary order,
 * step size is always the third parameter.
 * Consider the examples at the end of the documentation.
 *
 * Contract:
 * - End-value may not be reached exactly, but will never be exceeded.
 * - Zero step size leads to infinite loops.
 * - Only values that behave correctly with respect to addition and
 *   size comparison may be passed as arguments.
 *
 * @constructor
 * @pure
 * @haskell (a, a) -> [a]
 * @param { !Number } firstBoundary  - the first boundary of the range
 * @param { Number }  secondBoundary - optionally the second boundary of the range
 * @param { Number }  step - the size of a step, processed during each iteration
 * @returns SequenceType<Number>
 *
 * @example
 *  const range               = Range(3);
 *  const [five, three, one]  = Range(1, 5, -2);
 *  const [three, four, five] = Range(5, 3);
 *
 *  console.log(...range);
 *  // => Logs '0, 1, 2, 3'
 */
const Range = (firstBoundary, secondBoundary = 0, step = 1) => {
  const stepIsNegative = 0 > step;
  const [left, right]  = normalize(firstBoundary, secondBoundary, stepIsNegative);

  return Sequence(left, value => !hasReachedEnd(stepIsNegative, value, right), value => value + step);
};

/** Walk is an alias for {@link Range} that allows for easier discovery since the name "Range" is also
 * used within the dom API [https://developer.mozilla.org/en-US/docs/Web/API/Range], which
 * undermines the auto-import when typing "Range" for the first time in a file.
 * Just typing "Walk" and using the auto-import will lead to here.
 */
const Walk = Range;

/**
 * Sorts the two parameter a and b by its magnitude.
 * @param  { Number } a
 * @param  { Number } b
 * @returns { [Number, Number] }
 */
const sort = (a, b) => {
  if (a < b) return [a,b];
  else return [b,a];
};

/**
 * Determines if the end of the range is reached.
 * @param   { Boolean } stepIsNegative - signals, which range boundary condition is active
 * @param   { Number }  next
 * @param   { Number }  end
 * @returns  { boolean }
 */
const hasReachedEnd = (stepIsNegative, next, end) =>
    stepIsNegative ? next < end : next > end;

/**
 * Make sure, that the left and right values
 * are in the proper order according to the given step.
 * @param   { Number }  left
 * @param   { Number }  right
 * @param   { Boolean } stepIsNegative
 * @returns  { [Number, Number] }
 */
const normalize = (left, right, stepIsNegative) => {
  const [min, max] = sort(left, right);
  let next = min;
  let end  = max;
  if (stepIsNegative) {
    next = max;
    end = min;
  }
  return [next, end];
};/**
 * This {@link JsonMonad} can be used to process JSON data or JS objects in a fluent way.
 * It is mainly used with {@link JinqType}.
 * @see https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/linq/
 *
 * @constructor
 * @template _T_
 * @param { Object | Array<_T_> } jsObject
 * @returns MonadType<_T_>
 *
 * @example
 * const result =
 *    from(JsonMonad(jsObject))
 *      .select(x => x["id"])
 *      .result()
 *      .get();
 *
 * console.log(...result);
 * // => Logs all ids of the passed json
 *
 */
const JsonMonad = jsObject => {
  if (!jsObject[Symbol.iterator]) {
    jsObject = [jsObject];
  }
  const inner = innerIterable(...jsObject);

  /**
   *
   * @template _T_
   * @param { MaybeType<SequenceType<_T_>> & MaybeMonadType<_T_> } maybeObj
   * @returns { MonadType<_T_> }
   * @constructor
   */
  const JsonMonadFactory = maybeObj => {

    const ensureIterable = value => {
      const it = Array.isArray(value) ? value: [value];
      return innerIterable(...it)
    };

    const fmap = f => {
      // the result can be turned to nothing as well, therefore and on maybe must be used
      const result = maybeObj.and(iterator => {
        const newIt = iterator.and(elem => {
          const mapped = f(elem); // deep dive into json structure
          return mapped ? ensureIterable(mapped) : nil;
        });

        return isEmpty(newIt) ? Nothing$1 : Just$1(newIt);
      });

      // wrap result in json monad again
      return JsonMonadFactory(result);
    };

    const and = f => {
      // Map each element of this iterable, that might be in this maybe
      const result = maybeObj.fmap(iterable => {
        const maybeIterable = iterable.fmap(elem => {
          // f :: _T_ -> JsonMonad<SequenceType<MaybeXType<_T_>>>
          const jsonMonad = f(elem);
          return jsonMonad.get(); // unwrap the JsonMonad to access the iterable in it.
        });

        /**@type SequenceType<SequenceType> */
        const catted = /**@type any */catMaybes(maybeIterable);
        return mconcat(catted)
      });

      return JsonMonadFactory(result);
    };

    const pure  = a  => JsonMonad(PureSequence(a));
    const empty = () => JsonMonadFactory(Nothing$1);

    const iterator = () => {
      let inner;
     maybeObj
      (() => inner = nil)
      (it => inner = it);

      return iteratorOf(inner);
    };

    return {
      pure,
      empty,
      fmap,
      and,
      [Symbol.iterator]: iterator,
      get: () => maybeObj
    }
  };

  return JsonMonadFactory(Just$1(inner));
};


/**
 * Helper function to create a {@link SequenceType} from varargs.
 * {@link toSeq } can't be used here, because sub iterables shouldn't be consumed
 *
 * @template _T_
 * @param  { ..._T_ } elements - the elements to iterate on
 * @returns { SequenceType<*> }
 */
const innerIterable = (...elements) => {
  const iterator = () => {
    const inner = iteratorOf(elements);

    const next = () => inner.next();
    return { next };
  };
  return createMonadicSequence(iterator);
};// typedefs

/**
 * Defines how each Sequence is a {@link MonadType}.
 * @template  _T_
 * @typedef  SequenceMonadType
 * @property { <_U_> (bindFn: (_T_) => SequenceType<_U_>) => SequenceType<_U_> } and
 *              - monadic _bind_,
 *              - example: `Seq(1, 2).and(x => Seq(x, -x)) ['=='] Seq(1, -1, 2, -2)`
 * @property { <_U_> (f:      (_T_) => _U_)               => SequenceType<_U_> } fmap
 *              - functorial _map_,
 *              - example: `Seq(1, 2).fmap(x => x * 2) ['=='] Seq(2, 4)`
 * @property {       (_T_)                                => SequenceType<_T_> } pure
 *              - applicative _pure_,
 *              - example: `Seq().pure(1) ['=='] Seq(1)`
 * @property {       ()                                   => SequenceType<_T_> } empty
 *              - monoidal _empty_
 *              - example: `Seq().empty() ['=='] Seq()`
 *
 */

/**
 * Collection of all {@link SequenceOperation}s that are defined on a {@link SequenceType}.
 * @template  _T_
 * @typedef  SequenceOperationTypes
 * @property { AppendOperationType<_T_> } append
 *              - Type: {@link AppendOperationType}
 *              - append one sequence to another
 *              - Example: `Seq(1).append(Seq(2,3)) ['=='] (Seq(1, 2,3))`
 * @property { AppendOperationType<_T_> } ['++']
 *              - Type: {@link AppendOperationType}
 *              - append one sequence to another, alias for {@link append}
 *              - Example: `Seq(1).append(Seq(2,3)) ['++'] (Seq(1, 2,3))`
 * @property { CatMaybesOperationType<_T_> } catMaybes
 *              - Type: {@link CatMaybesOperationType}
 *              - Sequence of Maybe values to a Sequence of values
 *              - Example: `Seq(Just(1), Nothing, Just(2)).catMaybes() ['=='] (Seq(1, 2))`
 * @property { ConsOperationType<_T_> } cons
 *              - Type: {@link ConsOperationType}
 *              - Prefix with a single value
 *              - Example: `Seq(1, 2).cons(0) ['=='] (Seq(0, 1, 2))`
 * @property { CycleOperationType<_T_> } cycle
 *              - Type: {@link CycleOperationType}
 *              - infinite repetition of the original {@link SequenceType}
 *              - Example: `Seq(1, 2).cycle().take(4) ['=='] (Seq(1, 2, 1, 2))`
 * @property { DropOperationType<_T_> } drop
 *              - Type: {@link DropOperationType}
 *              - return a {@link SequenceType} without the first n elements
 *              - Example: `Seq(1, 2, 3).drop(2) ['=='] (Seq(3))`
 * @property { DropWhileOperationType<_T_> } dropWhile
 *              - Type: {@link DropWhileOperationType}
 *              - jump over elements until the predicate is not satisfied anymore
 *              - Example: `Seq(1, 2, 3).dropWhile(x => x < 3) ['=='] (Seq(3))`
 * @property { DropWhereOperationType<_T_> } dropWhere
 *              - Type: {@link DropWhereOperationType}
 *              - jump over all elements that satisfy the predicate
 *              - Example: `Seq(1, 2, 0).dropWhere(x => x > 1) ['=='] (Seq(1, 0))`
 * @property { TapOperationType<_T_> } tap
 *             - Type: {@link TapOperationType}
 *             - Executes the callback when tapping into each element, great for debugging and separating side effects.
 *               Leaves the original sequence unchanged.
 *             - example: `Seq(1, 2).tap(x => console.log(x)) ['=='] (Seq(1, 2))`
 * @property { <_U_> (f: (_T_) => _U_) => SequenceType<_U_> } map
 *              - Type: {@link MapOperationType}, alias for {@link SequenceMonadType.fmap}
 *              - functorial _map_,
 *              - example: `Seq(1, 2).map(x => x * 2) ['=='] Seq(2, 4)`
 * @property { MconcatOperationType<_T_> } mconcat
 *              - Type: {@link MconcatOperationType}
 *              - monoidal concatenation: flatten an {@link Iterable} of {@link Iterable Iterables} by appending.
 *              - Example: `Seq( Seq(1), Seq(2,3)).mconcat() ['=='] (Seq(1,2,3))`
 * @property { PipeOperationType<_T_> } pipe
 *              - Type: {@link PipeOperationType}
 *              - Run a series of {@link SequenceOperation}s on a {@link SequenceType}
 *              - example: `Seq(1, 2).pipe(map(x => x * 2), drop(1)) ['=='] (Seq(4))`
 * @property { ReverseOperationType<_T_> } reverse$
 *             - Type: {@link ReverseOperationType}
 *             - Processes the iterable backwards, *Works only on finite sequences!*.
 *             - example: `Seq(1, 2, 3).reverse$() ['=='] (Seq(3, 2, 1))`
 * @property { SnocOperationType<_T_> } snoc
 *             - Type: {@link SnocOperationType}
 *             - Append a single element to the end of the {@link SequenceType}
 *             - example: `Seq(1, 2).snoc(3) ['=='] (Seq(1, 2, 3))`
 * @property { TakeOperationType<_T_> } take
 *              - Type: {@link TakeOperationType}
 *              - take n elements from a potentially infinite {@link SequenceType}
 *              - example: `Seq(1, 2, 3).take(2) ['=='] (Seq(1,2))`
 * @property { TakeWhereOperationType<_T_> } takeWhere
 *             - Type: {@link TakeWhereOperationType}
 *             - Only keeps elements that satisfy the given predicate.
 *             - example: `Seq(1, 3, 2).takeWhere(x => x < 3) ['=='] (Seq(1, 2))`
 * @property { TakeWhileOperationType<_T_> } takeWhile
 *             - Type: {@link TakeWhileOperationType}
 *             - Proceeds until the predicate becomes true.
 *             - example: `Seq(0, 1, 2, 0).takeWhile(x => x < 2) ['=='] (Seq(0, 1))`
 * @property { ZipOperationType<_T_> } zip
 *            - Type: {@link ZipOperationType}
 *            - Combines two {@link Iterable}s into a single sequence of pairs of elements.
 *            - example: `Seq(1, 2).zip("ab").map(([x, y]) => ""+x+y) ['=='] (Seq("1a", "2b")))`
 * @property { ZipWithOperationType<_T_> } zipWith
 *            - Type: {@link ZipWithOperationType}
 *            - Combines two {@link Iterable}s into a single sequence of results of the callback function.
 *            - example: `Seq(1, 2).zipWith((x, y) => ""+x+y)("ab") ['=='] (Seq("1a", "2b")))`
 */


/**
 * Collection of all terminal operations that are defined on a {@link SequenceType}.
 * @template  _T_
 * @typedef  SequenceTerminalOperationTypes
 * @property { EqualOperationType<_T_> } "=="
 *           - Type: {@link EqualOperationType}
 *           - Check for element-wise equality
 *           - **Warning**: This only works on finite sequences
 *           - Example: `Seq(1, 2) ['=='] (Seq(1, 2))`
 * @property { EqualOperationType<_T_> } eq$
 *           - Type: {@link EqualOperationType}
 *           - Check for element-wise equality
 *           - **Warning**: This only works on finite sequences as indicated by the name ending with `$`
 *           - Example: `Seq(1, 2).eq$(Seq(1, 2))`
 * @property { FoldrOperationType<_T_> } foldr$
 *           - Type: {@link FoldrOperationType}
 *           - **Must not be called on infinite sequences!**
 *           - Performs a reduction on the elements from right to left, using the provided start value and an accumulation function.
 *           - example: `Seq(1, 2, 3).foldr$((acc, cur) => "" + acc + cur, "") === "321"`
 * @property { ForEachSequenceOperationType<_T_> } forEach$
 *          - Type: {@link ForEachOperationType}
 *          - Executes the callback for each element and consumes the sequence. Returns undefined.
 *          - Use only on **finite** sequences.
 *          - example: `Seq(1, 2).forEach$(x => console.log(x))`
 * @property { HeadOperationType<_T_> } head
 *           - Type: {@link HeadOperationType}
 *           - Returns the first value or `undefined` if the sequence is empty.
 *           - example: `Seq(1, 2, 3).head() === 1`
 * @property { IsEmptyOperationType<_T_> } isEmpty
 *           - Type: {@link IsEmptyOperationType}
 *           - Returns true, if there are no elements in the sequence.
 *           - example: `Seq().isEmpty() === true`
 * @property { MaxOperationSequenceType<_T_> } max$
 *           - Type: {@link MaxOperationType}
 *           - Returns the largest element of a **non-empty** sequence.
 *           - example: `Seq(1, 3, 0, 5).max$() === 5`
 * @property { SafeMaxOperationSequenceType<_T_> } safeMax$
 *           - Type: {@link SafeMaxOperationType}
 *           - Returns {@link Just} the largest element of a sequence or {@link Nothing} otherwise.
 *           - example: `Seq(1, 3, 0, 5).safeMax$() ( _ => console.log(":-(")) ( x => console.log(x)) // logs 5`
 * @property { MinOperationSequenceType<_T_> } min$
 *           - Type: {@link MinOperationType}
 *           - Returns the smallest element of a **non-empty** sequence.
 *           - example: `Seq(1, 3, 0, 5).min$() === 0`
 * @property { SafeMinOperationSequenceType<_T_> } safeMin$
 *           - Type: {@link SafeMinOperationType}
 *           - Returns {@link Just} the smallest element of a sequence or {@link Nothing} otherwise.
 *           - example: `Seq(1, 3, 0, 5).safeMin$() ( _ => console.log(":-(")) ( x => console.log(x)) // logs 0`
 * @property { ReduceSequenceOperationType<_T_> } reduce$
 *           - Type: {@link ReduceSequenceOperationType}
 *           - Combines the elements of a **non-empty** sequence left-to-right using the provided start value and an accumulation function.
 *           - example: `Seq(1, 2, 3).reduce$((acc, cur) => "" + acc + cur, "") === "123"`
 * @property { ShowOperationType<_T_> } show
 *           - Type: {@link ShowOperationType}
 *           - A string representation of the {@link SequenceType} with optionally a maximum amount of elements
 *           - Example: `Seq(1, 2).show() === "[1,2]"`
 * @property { ShowOperationType<_T_> } toString
 *           - Type: {@link ShowOperationType}, alias for {@link show}
 *           - Note that providing a maximum amount of elements works but is not advised since it will
 *             cause type warnings because it breaks the contract of the inherited `Object.toString()`.
 *             Use {@link show} instead.
 *           - Example: `Seq(1, 2).toString() === "[1,2]"`
 * @property { UnconsSequenceOperationType<_T_> } uncons
 *          - Type: {@link UnconsSequenceOperationType}
 *          - Returns the head and the tail of the sequence as a {@link PairType}.
 *          - Example: `show(Seq(1,2,3).uncons()) === "[1,[2,3]]"`
 */
/**
 * This type combines the {@link Iterable} with {@link SequenceMonadType}.
 * Objects of this type can therefore be used in [for...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of) loops,
 * and further syntactical sugar.
 *
 * _Note_: The Kolibri defines many functions of type {@link SequenceOperation} which can be used to
 * transform the elements of this Sequence.
 *
 * @template _T_
 * @typedef {
 *              Iterable<_T_>
 *            & SequenceMonadType<_T_>
 *            & SequenceOperationTypes<_T_>
 *            & SequenceTerminalOperationTypes<_T_>
 * } SequenceType
 */

/**
 * @template _T_
 * @typedef SequenceBuilderType
 * @property { InsertIntoBuilder<_T_> } prepend - adds one or more elements to the beginning of the {@link SequenceBuilderType}
 * @property { InsertIntoBuilder<_T_> } append  - adds one or more elements to the end of the {@link SequenceBuilderType}
 * @property { () => SequenceType<_T_> } build  - starts the built phase and returns an {@link SequenceType} which iterates over the added elements
 */

// callbacks
/**
 * Defines a single operation to decorate an existing {@link SequenceType}.
 *
 * @callback SequenceOperation
 * @template _T_
 * @template _U_
 * @param   { Iterable<_T_>} iterable
 * @returns { SequenceType<_U_>}
 */

/**
 * @callback PipeTransformer
 * @template _T_, _U_
 * @type { SequenceOperation<_T_, _U_> | ((SequenceType) => *)}
 */
/**
 * Pipe applies the given {@link SequenceOperation} to the {@link Iterable} it is called on.
 * @callback Pipe
 * @param { ...SequenceOperation<any,any>} operations
 * @returns { SequenceType<any> }
 */

/**
 * @template _T_
 * @callback ArrayApplierType
 * @param { Array<_T_> } arr
 * @returns any
 */

/**
 * Adds multiple elements to this {@link SequenceBuilderType}.
 * @template _T_
 * @callback InsertIntoBuilder
 * @param   { ...(_T_ | Iterable<_T_>) } args
 * @returns SequenceBuilderType<_T_>
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
  LazyIf$1(full(limit))
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
const full = limit => churchBool$1(limit <= appenderArray.length);



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
  LazyIf$1(full(limit))
    (() => {
      // if array is full, despite using the set eviction strategy, use the default eviction strategy to make space.
      appenderArray = /** @type {Array<String>} */DEFAULT_CACHE_EVICTION_STRATEGY(appenderArray);
      appenderArray.push(OVERFLOW_LOG_MESSAGE);
      appenderArray.push(msg);
    })
    (() => appenderArray.push(msg));
  return /** @type {ChurchBooleanType} */ T$1;
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
  return /** @type {ChurchBooleanType} */T$1;
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
  return /** @type {ChurchBooleanType} */ T$1; // logging a string to the console cannot fail
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
 * @param   { LogMeType } message
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
 *//**
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
`;// noinspection FunctionTooLongJS


const log = LoggerFactory("kolibri.test");

/**
 * The running total of executed test assertions
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
 * @returns void
 * */

/**
 * @callback AssertThrows
 * @param { () => void } functionUnderTest - this function should throw an error
 * @param { String = ""} expectedErrorMsg  - if set, the thrown errors message will be compared to this string
 * @returns void
 */

/**
 * @callback IterableEq
 * @param { Iterable<*> } actual            - the actual iterable
 * @param { Iterable<*> } expected          - an iterable with the expected elements
 * @param { number } [maxElementsToConsume] - if set, the thrown errors message will be compared to this string
 * @returns void
 */

/**
 * @typedef  { Object }                AssertType
 * @property { Array<String> }         messages     - stores all assertions messages, one for each entry in "results"
 * @property { Array<Boolean> }        results      - stores all assertion results
 * @property { (Boolean)  => void }    isTrue       - assert that expression is true, side effects "results" and "messages"
 * @property { equalityCheckFunction } is           - assert that two expressions are equal,
 *                                                    side effects "results" and "messages", and
 *                                                    logs an error to the console incl. stack trace in case of failure
 * @property { AssertThrows }          throws       - assert that the given function throws an exception,
 *                                                    logs an error to the console incl. stack trace in case of failure
 * @property { IterableEq }            iterableEq   - assert that two objects conform to the [JS iteration protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) are equal.
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
    /** @type Array<Boolean> */ const results  = []; // true if test passed, false otherwise
    /** @type Array<String> */  const messages = [];
    return {
        results,
        messages,
        isTrue: testResult => {
            let message = "";
            if (!testResult) {
                log['error']("test failed");
                message = "not true";
            }
            results .push(testResult);
            messages.push(message);
        },
        is: (actual, expected) => {
            const testResult = actual === expected;
            let message = "";
            if (!testResult) {
                message = `Got '${actual}', expected '${expected}'`;
                log.error(message);
            }
            results .push(testResult);
            messages.push(message);
        },
        iterableEq: (actual, expected, maxElementsToConsume = 1_000) => {

            if (actual[Symbol.iterator]   === undefined) log.error("actual is not iterable!");
            if (expected[Symbol.iterator] === undefined) log.error("expected is not iterable!");

            const actualIt     = actual[Symbol.iterator]();
            const expectedIt   = expected[Symbol.iterator]();

            let iterationCount = 0;
            let testPassed     = true;
            let message        = "";

            while (true) {
                const { value: actualValue,   done: actualDone   } = actualIt.next();
                const { value: expectedValue, done: expectedDone } = expectedIt.next();

                const oneIteratorDone      = actualDone || expectedDone;
                const bothIteratorDone     = actualDone && expectedDone;
                const tooManyIterations    = iterationCount > maxElementsToConsume;

                if (bothIteratorDone) break;
                if (oneIteratorDone) {
                    testPassed = false;
                    const actualMsg = actualDone ? "had no more elements" : "still had elements";
                    message = `Actual and expected do not have the same length! After comparing ${iterationCount} 
                               elements, actual ${actualMsg}, which was not expected!`;
                    break;
                }
                if (tooManyIterations) {
                    message = `It took more iterations than ${maxElementsToConsume}. Aborting.\n`;
                    testPassed = false;
                    break;
                }

                if (actualValue !== expectedValue) {
                    testPassed = false;
                    message = `Values were not equal in iteration ${iterationCount}! Expected ${expectedValue} but was ${actualValue}\n`;
                    break;
                }

                iterationCount++;
            }

            if (!testPassed) log.error(message);
            results.push(testPassed);
            messages.push(message);
        },
        throws: (functionUnderTest, expectedErrorMsg = "") => {
            let testResult    = false;
            let message       = "";
            const hasErrorMsg = expectedErrorMsg !== "";

            try {
                functionUnderTest();

                message = "Did not throw an error!";
                if (hasErrorMsg) {
                    message += ` Expected: '${expectedErrorMsg}'`;
                }
                log.error(message);
            } catch (e) {
                testResult = true;

                if (hasErrorMsg) {
                    testResult = expectedErrorMsg === e.message;
                }
            }
            results .push(testResult);
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
 * @property { (testName:String, callback:TestCallback) => void} test - running a test function for this suite
 * @property { (testName:String, callback:TestCallback) => void} add  - adding a test function for later execution
 * @property { () => void} run                                        - runs the given test suite
 * @property { function(): void } run:                                - running and reporting the suite
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
                const prevLoggingLevel = getLoggingLevel();
                setLoggingLevel(LOG_DEBUG);
                setLoggingContext("");
                const appender = Appender();
                setMessageFormatter(
                  context => logLevel => logMessage => `[${logLevel}]\t${context} ${suiteName}: ${logMessage}`
                );
                addToAppenderList(appender);
                tests.forEach( testInfo => test( testInfo(name), testInfo(logic) ));
                setLoggingLevel(prevLoggingLevel);
                removeFromAppenderList(appender);
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
const write = html => out.append(...dom(html));const release     = "0.9.0";

const dateStamp   = "2023-09-12 T 15:44:57 MESZ";

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
const KI  = snd$1;

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
const isZero = cn => /** @type { ChurchBooleanType } **/ cn (c(F)) (T$1); // We need a cast since we don't return a church numeral.

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
const phi = p => Pair (p(snd$1)) (succ(p(snd$1)));

/**
 * "less-than-or-equal-to" with church numbers
 * @type { (n:ChurchNumberType) => (k:ChurchNumberType) => ChurchBooleanType }
 */
const leq = n => k => isZero(minus(n)(k));

/**
 * "equal-to" with church numbers.
 * @type { (n:ChurchNumberType) => (k:ChurchNumberType) => ChurchBooleanType }
 */
const eq = n => k => and$1(leq(n)(k))(leq(k)(n));

/**
 * Predecessor of a church number. Opposite of succ.
 * Minimum is zero. Is needed for "minus".
 * @type { (n:ChurchNumberType) => ChurchNumberType }
 */
const pred = n => n(phi)(Pair(n0)(n0))(fst$1);

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
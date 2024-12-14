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
const toChurchBoolean = value => /** @type { ChurchBooleanType& Function } */ value ? T : F;

/**
 * Convert Church boolean to JS boolean
 * @param  { ChurchBooleanType & Function } churchBoolean
 * @return { Boolean }
 */
const toJsBool = churchBoolean =>  churchBoolean(true)(false);/**
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
   * @type { PairType<_T_,_U_> }
   */
  const pair = selector => selector(x)(y);

  pair[Symbol.iterator] = () => [x,y][Symbol.iterator]();
  return pair;
};/**
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
    (_ => returnVal = Nothing)
    (x => returnVal = bindFn(x));
  return returnVal;
};

MaybePrototype.fmap = function (mapper) {
  return this.and(x => Just(mapper(x)));
};

MaybePrototype.pure = val => Just(val);
MaybePrototype.empty = () => Nothing;


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
const Nothing = Left (undefined);
Object.setPrototypeOf(Nothing, MaybePrototype);

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
const Just = val => {
 const r = Right(val);
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
};//                                                                -- logging level --

/**
 * This is a singleton state.
 * The currently active logging level.
 * Only messages from loggers whose have at least this log level are logged.
 * Default log level is {@link LOG_INFO}.
 * @type { IObservable<LogLevelType> }
 * @private
 */
const loggingLevelObs = /** @type { IObservable<LogLevelType> } */ Observable(LOG_INFO);

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
 * @type { IObservable<LogMessageFormatterType> }
 * @private
 */
const globalMessageFormatterObs = Observable(_context => _logLevel => id);

/**
 * This function can be used to specify a global formatting function for log messages.
 * Appenders are free to use this global function (maybe as a default or as a fallback)
 * or to use their own, specific formatting functions.
 * @impure **Warning:** this is global mutable state and can have far-reaching effects on log formatting.
 * @param { LogMessageFormatterType } formattingFunction
 * @example
 * const formatLogMsg = context => logLevel => logMessage => {
 *   const date = new Date().toISOString();
 *   return `[${logLevel}]\t${date} ${context}: ${logMessage}`;
 * }
 * setGlobalMessageFormatter(formatLogMsg);
 */
const setGlobalMessageFormatter = globalMessageFormatterObs.setValue;

/**
 * Returns the currently used global formatting function.
 * @impure **Warning:** different values by come at different times.
 * @type { () => LogMessageFormatterType }
 */
const getGlobalMessageFormatter = globalMessageFormatterObs.getValue;

/**
 * What to do when the log formatting function changes.
 * @impure will typically change the side effects of logging.
 * @type { (cb:ValueChangeCallback<LogMessageFormatterType>) => void }
 */
const onGlobalMessageFormatterChanged = globalMessageFormatterObs.onChange;

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
 * The result of the callback function {@link LogMessageFormatterType}
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
 * @pure if the {@link AppendCallback} in the appender list and the parameter msgFormatter of type {@link LogMessageFormatterType} are pure.
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
              const formatter = appender.getFormatter()       // Maybe<LogMessageFormatterType>
                   ( _ => getGlobalMessageFormatter() )       // use global formatter if no specific formatter is set
                   ( id );                                    // use appender-specific formatter if set
              formattedMessage = formatter (loggerContext) (levelName) (evaluatedMessage); // formatting can fail
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
 * Constant for the log context that is used as the basis for all Kolibri-internal logging.
 * @type { String } */
const LOG_CONTEXT_KOLIBRI_BASE = "ch.fhnw.kolibri";

/**
 * Constant for the log context that is used for all Kolibri-internal testing.
 * @type { String } */
const LOG_CONTEXT_KOLIBRI_TEST = LOG_CONTEXT_KOLIBRI_BASE + ".test";

/**
 * Constant for the log context that logs for all contexts.
 * @type { String } */
const LOG_CONTEXT_All = "";let warn$3 = undefined;
/** @private */
function checkWarning(list) {
    if (list.length > 100) {
        if (!warn$3) {
            warn$3 = LoggerFactory(LOG_CONTEXT_KOLIBRI_BASE + ".observable").warn;
        }
        warn$3(`Beware of memory leak. ${list.length} listeners.`);
    }
}

/**
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
function Observable(value) {
    const listeners = [];
    return {
        onChange: callback => {
            checkWarning(listeners);
            listeners.push(callback);
            callback(value, value);
        },
        getValue: () => value,
        setValue: newValue => {
            if (value === newValue) return;
            const oldValue = value;
            value          = newValue;
            listeners.forEach(callback => {
                if (value === newValue) { // pre-ordered listeners might have changed this and thus the callback no longer applies
                    callback(value, oldValue);
                }
            });
        }
    };
}

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
        count:   () => list.length,
        countIf: pred => list.reduce((sum, item) => pred(item) ? sum + 1 : sum, 0)
    };
}/**
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
 */// noinspection GrazieInspection


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
 * @property { <_U_> (monadCtor: (_T_) =>  MonadType<_U_>)    => JinqType<PairType<_T_,_U_>> } combine - combines the underlying data structure with the given constructor as {@link PairType}
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
  pairWith:     pairWith(monad),
  combine:      combine (monad),
  where:        where   (monad),
  select:       select$1  (monad),
  map:          map$1     (monad),
  inside:       inside  (monad),
  result:       () =>    monad
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
 * @type { <_T_, _U_>
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
 * Combines elementwise two {@link MonadType monad}s much like
 * {@link pairWith} but the second monad is given as a constructor.
 * This allows usages that come closer to list comprehensions.
 * It returns a {@link PairType} which holds a combination of two values.
 *
 *
 * @type { <_T_, _U_>
 *           (monad1:     MonadType<_T_>)
 *        => (monad2ctor: (arg:_T_) => MonadType<_U_>)
 *        => JinqType<PairType<_T_,_U_>>
 *      }
 *
 * @example
 *  const result =
 *     from(                         Range(2, Number.MAX_VALUE)) // infinite sequence
 *       .combine( z              => Range(2, z) )
 *       .combine( ([_z, y])      => Range(2, y) )
 *       .where ( ([[ z, y ], x]) => x*x + y*y === z*z )
 *       .result()                                               // monad to sequence
 *       .take(2)                                                // lazy pruning
 *       .map ( ([[ z, y ], x]) => `${x} ${y} ${z}`)             // easy to compare
 *   ;
 *
 *   assert.is( [...result].join(" - "), "3 4 5 - 6 8 10");
 */
const combine = monad1 => monad2ctor => {
  const processed = monad1.and(x =>
    monad2ctor(x).fmap(y => Pair(x)(y))
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
const select$1 = monad => mapper => {
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
const map$1 = select$1;/**
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
 * The casting is lazy and does not touch (or even exhaust) the iterable.
 * @type { <_T_>  (iterable:Iterable<_T_>) => SequenceType<_T_> }
 */
const toSeq = iterable => map(id)(iterable);

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
    : toSeq(iterable);

/**
 * A convenience constant that can be used when a Sequence is infinite.
 * @type { ConsumingPredicateType<Boolean> }
 */
const forever = _ => true;

/**
 * Convenience function to be used in reduce situations where the
 * plus operation should be used as a projection.
 * Works with both, strings or numbers.
 * @param { String | Number } acc
 * @param { String | Number } cur
 * @return { String | Number }
 * @example
 *   const nums = Seq(1,2,3);
 *   const result  = nums.reduce$( plus, 0);
 *   assert.is(result, 6 );
 *   
 *   const strings = "a b c".split(" ");
 *   const string  = strings.reduce( plus, "");
 *   assert.is( string, "abc" );
 */
const plus$1 = (acc, cur) => acc + cur;

/**
 * Calculate the limit that the number sequence approaches by comparing successive elements until they are
 * less than epsilon apart.
 * Return {@link undefined} if no limit matches the criteria.
 * @WARNING **Might not finish when sequence is infinite and limit cannot be found.**
 * @param { Number }                epsilon
 * @param { SequenceType<Number> }  numberSequence
 * @return { undefined| Number }    the first element with less than epsilon distance from its predecessor
 */
const limit = (epsilon, numberSequence) => {
    let last = numberSequence.head();
    for (const it of numberSequence.drop(1)) {
        if ( Math.abs(last - it) <= epsilon) {
            return it;
        }
        last = it;
    }
    return undefined;
};/**
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
const map = mapper => iterable => {

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
    map(bindFn)(it)
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
const append = it1 => it2 => mconcat([it1, it2]);/**
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
const cons = element => append( Seq(element) )  ;/**
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
const zipWith = zipper => it1 => it2 => {
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
const zip = it1 => it2 => zipWith((i,j) => Pair(i)(j))(it1)(it2);/**
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
const tap = callback => map(x => { callback(x); return x; } );/**
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
 * @typedef CountSequenceOperationType
 * @type { () => CountOperationType }
 */
/**
 *  Count the number of elements in a **finite** {@link Iterable}.
 *  The **finite** constraint is indicated by the trailing **$** in the function name.
 *
 *  _Note_:
 *  When erroneously called on an **infinite** iterable, the function **does not return**.
 *  So better be safe and first {@link TakeOperationType take} as many elements as you consider the allowed maximum count.
 *
 *
 * @typedef CountOperationType
 * @function
 * @pure
 * @haskell [a] -> Int
 * @param   { Iterable } iterable - a finite iterable
 * @returns { Number   }
 *
 * @example
 * const numbers = [1, 3, 0, 5];
 * const count   = count$(numbers);
 *
 * console.log(count);
 * // => Logs '4'
 *
 * const infinite = Sequence(0, forever, id);   // this cannot be counted
 * assert.is(count$( take(10)(infinite) ), 10); // take with upper limit
 */

/**
 * see {@link CountOperationType}
 * @type { CountOperationType }
 */
const count$ = iterable => /** @type { Number } */ reduce$( (acc, _cur) => acc + 1, 0)(iterable);/**
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
const head = iterable => {
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
    return Nothing;
  }

  while (!isEmpty) {
    const nextEl = inner.next();
    isEmpty = nextEl.done;

    if (!isEmpty && comparator(currentMax, nextEl.value)) {
      currentMax = nextEl.value;
    }
  }

  return Just(currentMax);
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


const LOG_CONTEXT_KOLIBRI_SEQUENCE = LOG_CONTEXT_KOLIBRI_BASE+".sequence";
const log$1 = LoggerFactory(LOG_CONTEXT_KOLIBRI_SEQUENCE);
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
  return map(mapper)(this);
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

SequencePrototype.count$ = function() {
  return count$(this);
};

SequencePrototype.eq$ = function(that) {
  if (!isIterable(that)) return false;
  return eq$(this) /* == */ (that);
};

SequencePrototype["=="] = SequencePrototype.eq$;

SequencePrototype.foldr$ = function(callback, start) {
    return foldr$(callback, start)(this);
};

SequencePrototype.foldl$ = function(callback, start) {
    return foldl$(callback, start)(this);
};

SequencePrototype.forEach$ = function(callback) {
    return forEach$(callback)(this);
};

SequencePrototype.head = function() {
    return head(this);
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
  return append(this)(sequence);
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
  return zip(this)(iterable);
};

SequencePrototype.zipWith = function (zipFn) {
  return zipWith(zipFn)(this);
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
    const innerIterator = iteratorOf(map(idx => tuple(values => values[idx]))(indexSequence));
    return { next : innerIterator.next }
  };

  return createMonadicSequence(tupleIterator);
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
const repeat = arg => Sequence(arg, forever, _ => arg);/**
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
const replicate = n => value => take(n)(repeat(value));/** A convenience value to use as the highest possible but still reliable upper bound
 * in a long {@link Walk} or extensive {@link Range} over
 * all integral numbers with integral increments.
 * Higher numbers like {@link Number.MAX_VALUE} or {@link Number.POSITIVE_INFINITY}
 * do not always increment to the next Integer reliably.
 * @example
 * const allFromZero = Walk(ALL);
 * const allEven     = Walk(0, ALL, 2);
 * */
const ALL = Number.MAX_SAFE_INTEGER;

/**
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

        return isEmpty(newIt) ? Nothing : Just(newIt);
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
    const empty = () => JsonMonadFactory(Nothing);

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

  return JsonMonadFactory(Just(inner));
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
 *            - example: `Seq(1, 2).zip("ab").map(([x, y]) => ""+x+y) ['=='] (Seq("1a", "2b"))`
 * @property { ZipWithOperationType<_T_> } zipWith
 *            - Type: {@link ZipWithOperationType}
 *            - Combines two {@link Iterable}s into a single sequence of results of the callback function.
 *            - example: `Seq(1, 2).zipWith((x, y) => ""+x+y)("ab") ['=='] (Seq("1a", "2b"))`
 */


/**
 * Collection of all terminal operations that are defined on a {@link SequenceType}.
 * @template  _T_
 * @typedef  SequenceTerminalOperationTypes
 * @property { CountSequenceOperationType } count$
 *           - Type: {@link CountSequenceOperationType}
 *           - Count the number of elements
 *           - **Warning**: This only works on finite sequences
 *           - Example: `Seq(1, 2).count$() === 2`
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
 * @property { ReduceSequenceOperationType<_T_> } foldl$
 *           - Type: {@link ReduceSequenceOperationType}, same as `reduce$`
 *           - Combines the elements of a **non-empty** sequence left-to-right using the provided start value and an accumulation function.
 *           - example: `Seq(1, 2, 3).foldl$((acc, cur) => "" + acc + cur, "") === "123"`
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


const { warn: warn$2 } = LoggerFactory("ch.fhnw.kolibri.util.dom");

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

/**
 * Utility function that works like {@link Element.querySelectorAll} but logs a descriptive warning when
 * the resulting NodeList is empty. Wraps the result in a {@link SequenceType } such that the
 * Kolibri goodies become available.
 * It is a suitable function when a result is **always** expected.
 * @param { Element! } element - a DOM element (typically HTMLElement)
 * @param { String! } selector - a CSS query selector, might contain operators
 * @return { SequenceType<Node> }
 */
const select = (element, selector) => {
    const result = toSeq( /** @type { Iterable<Node> } */ element.querySelectorAll(selector));
    if (result.isEmpty()) {
        warn$2(`Selector "${selector}" did not select any nodes in "${element.outerHTML}"`);
    }
    return result;
};/**
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
const dangerBg          = pink100;

const KOLIBRI_LOGO_SVG = `
<svg class="kolibri-logo-svg" viewBox="0 0 305 342" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M138 194C183.5 214.5 228 221.5 236.5 341.5C229.5 273.5 187 263.5 138 194Z" fill="#5F2EEA"/>
    <path d="M117 122C117 46 42.5 17 0 0C81.2 39.2 77.5 79.5 80.5 138C87 216.5 128 235.667 150.5 248C105.7 212 117 157 117 122Z" fill="#FE2EA8"/>
    <path d="M80.9999 144.5C81.3468 146.565 81.692 148.581 82.0374 150.552C86.8892 170.965 107.957 211.566 156.5 225.5C210.5 241 236.407 308.5 237.074 342C220.5 279.5 210.346 274.538 156.5 250.5C102.35 226.326 92.1459 208.229 82.0374 150.552C81.492 148.257 81.1515 146.218 80.9999 144.5Z" fill="#BE58FD"/>
    <path d="M115 49.5C100.5 39.8333 79 51.0005 54 32C92.5 36.5 109.5 26 129.5 44C149.5 65 128.5 90 148 113.499C123.5 104.499 133 61.5 115 49.5Z" fill="#5F2EEA"/>
    <circle cx="100.5" cy="60.5" r="9.5" fill="#2D1FB1"/>
    <path class="wing" opacity="0.5" d="M128 179.114C176.159 220.174 254.92 177.348 279 146C243.884 171.608 187.698 146.442 128 179.114Z" fill="#BD53FE" stroke="#BD53FE"/>
    <path class="wing" opacity="0.7" d="M128 158C163.892 67.1818 241.575 130.021 305 47C263.208 149.285 161.925 132.314 128 158Z" fill="#4C2EEC"/>
    <path class="wing" opacity="0.7" d="M128 178.895C162.922 103.67 248.073 126.739 305 47C278.211 119.718 247.116 181.904 128 178.895Z" fill="#FF2CA5"/>
</svg>
`;/**
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
    // Create view.
    // The input element sits in a span that allows identification and css reference for
    // the span that serves as the invalidation marker. See kolibri-base.css for details.
    const elements = dom(`
        <label for="${id}"></label>
        <span  data-id="${id}">
            <input type="${inputController.getType()}" id="${id}">
            <span class="invalidation_marker" aria-hidden="true"></span>
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


const MAX_ARRAY_ELEMENTS   = Number.MAX_SAFE_INTEGER - 1;
const MIN_ARRAY_LENGTH     = 2;
const OVERFLOW_LOG_MESSAGE =
          "LOG ERROR: Despite running the chosen eviction strategy, the array was full! The first third of the log messages have been deleted!";

/**
 * @type { CacheEvictionStrategyType }
 * @pure
 */
const DEFAULT_CACHE_EVICTION_STRATEGY = cache => {
    const oneThirdIndex    = Math.round(cache.length / 3);
    // if oneThird is smaller than the minimum of the array length, slice the whole array.
    const deleteUntilIndex = oneThirdIndex > MIN_ARRAY_LENGTH ? oneThirdIndex : MIN_ARRAY_LENGTH;
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
 * @returns { AppenderType<Array<String>> }
 */
const ArrayAppender = (limit = MAX_ARRAY_ELEMENTS, cacheEvictionStrategy = DEFAULT_CACHE_EVICTION_STRATEGY) => {
    const calculatedLimit = MIN_ARRAY_LENGTH < limit ? limit : MIN_ARRAY_LENGTH;

    let formatter      = Nothing; // per default, we do not use a specific formatter.
    const getFormatter = () => formatter;
    const setFormatter = newFormatter => formatter = newFormatter;

    /**
     * Collects all log messages by storing them in the array.
     * @private
     * @type { Array<String> }
     */
    let appenderArray = [];

    /**
     * Clears the current appender array.
     * @impure
     * @returns { Array<String> } - the last value before clearing
     */
    const reset = () => {
        const oldAppenderArray = appenderArray;
        appenderArray              = [];
        return oldAppenderArray;
    };

    /**
     * @returns { Array<String> } - The current value of the appender string
     */
    const getValue = () => appenderArray;

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
    const appenderCallback = limit => onOverflow => msg =>
        LazyIf(full(limit))
            // if the array is full, call the overflow function and add the new value afterward.
            (() => append(msg)(limit)(onOverflow))
            // in any other case just append the new message.
            (() => append(msg)(limit)(id));

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
    };

    return {
        /**
         * the function to append trace logs in this application
         * @type { AppendCallback }
         */
        trace: appenderCallback(calculatedLimit)(cacheEvictionStrategy),
        /**
         * the function to append debug logs in this application
         * @type { AppendCallback }
         */
        debug: appenderCallback(calculatedLimit)(cacheEvictionStrategy),
        /**
         * the function to append info logs in this application
         * @type { AppendCallback }
         */
        info: appenderCallback(calculatedLimit)(cacheEvictionStrategy),
        /**
         * the function to append warn logs in this application
         * @type { AppendCallback }
         */
        warn: appenderCallback(calculatedLimit)(cacheEvictionStrategy),
        /**
         * the function to append error logs in this application
         * @type { AppendCallback }
         */
        error: appenderCallback(calculatedLimit)(cacheEvictionStrategy),
        /**
         * the function to append fatal logs in this application
         * @type { AppendCallback }
         */
        fatal:        appenderCallback(calculatedLimit)(cacheEvictionStrategy),
        getValue,
        reset,
        setFormatter,
        getFormatter
    };
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
const ObservableAppender = appender => listener => {

    const trace =  arg => { const x = appender.trace(arg); listener(LOG_TRACE, arg); return x };
    const debug =  arg => { const x = appender.debug(arg); listener(LOG_DEBUG, arg); return x };
    const info  =  arg => { const x = appender.info (arg); listener(LOG_INFO , arg); return x };
    const warn  =  arg => { const x = appender.warn (arg); listener(LOG_WARN , arg); return x };
    const error =  arg => { const x = appender.error(arg); listener(LOG_ERROR, arg); return x };
    const fatal =  arg => { const x = appender.fatal(arg); listener(LOG_FATAL, arg); return x };
    const reset =  ()  => { const x = appender.reset();    listener(LOG_NOTHING);    return x };  // we notify via log nothing to indicate the reset
    const getFormatter = appender.getFormatter;
    const setFormatter = appender.setFormatter;
    const getValue     = appender.getValue;


  return /** @type {AppenderType} */ {trace, debug, info, warn, error, fatal, reset, getFormatter, setFormatter, getValue}};/**
 * Provides an appender that logs to the console how many log messages have been issued on the various levels.
 * @returns { AppenderType<StatisticType> }
 * @constructor
 */
const CountAppender = () => {
    let formatter      = Nothing; // per default, we do not use a specific formatter.
    const getFormatter = () => formatter;
    const setFormatter = newFormatter => formatter = newFormatter;

    /**
     * @typedef { {warn: Number, trace: Number, debug: Number, error: Number, info: Number, fatal: Number} } StatisticType
     */

    /**
     * @type { StatisticType }
     */
    let statistic = {trace: 0, debug: 0, info: 0, warn: 0, error: 0, fatal: 0};

    /**
     * Resets the values of all level to zero.
     * @return { StatisticType }
     */
    const reset = () => {
        statistic = {trace: 0, debug: 0, info: 0, warn: 0, error: 0, fatal: 0};
        return statistic;
    };

    /**
     * Returns an object with summarized counter values.
     * @returns { StatisticType }
     */
    const getValue = () => statistic;

    /**
     * @type { (String) => (callback:ConsumerType<String>) => (String) => ChurchBooleanType }
     */
    const appenderCallback = type => callback => msg => {
        statistic[type] = statistic[type] + 1;
        callback(` (${statistic[type]}) ` + msg);
        return /** @type {ChurchBooleanType} */T;
    };

    /**
     * the function to append trace logs in this application
     * @type { AppendCallback }
     */
    const trace = appenderCallback("trace")(console.trace);

    /**
     * the function to append debug logs in this application
     * @type { AppendCallback }
     */
    const debug = appenderCallback("debug")(console.debug);

    /**
     * the function to append info logs in this application
     * @type { AppendCallback }
     */
    const info = appenderCallback("info")(console.info);

    /**
     * the function to append warn logs in this application
     * @type { AppendCallback }
     */
    const warn = appenderCallback("warn")(console.warn);

    /**
     * the function to append error logs in this application
     * @type { AppendCallback }
     */
    const error = appenderCallback("error")(console.error);

    /**
     * the function to append fatal logs in this application
     * @type { AppendCallback }
     */
    const fatal = appenderCallback("fatal")(console.error);

    return {
        trace,
        debug,
        info,
        warn,
        error,
        fatal,
        getValue,
        reset,
        getFormatter,
        setFormatter
    };
};/**
 * Provides console appender.
 * Using this appender you are able to log to the console.
 * @returns { AppenderType<void> }
 * @constructor
 */
const ConsoleAppender = () => {
  let formatter      = Nothing; // per default, we do not use a specific formatter.
  const getFormatter = () => formatter;
  const setFormatter = newFormatter => formatter = newFormatter;
  return {
    trace,
    debug: debug$2,
    info: info$1,
    warn: warn$1,
    error,
    fatal,
    getValue: () => { /* Nothing to do */},
    reset:    () => { /* Nothing to do */},
    getFormatter,
    setFormatter
  };
};

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
const debug$2 = appenderCallback(console.debug);

/**
 * the function to append debug logs in this application
 * @type { AppendCallback }
 */
const info$1 = appenderCallback(console.info);

/**
 * the function to append warn logs in this application
 * @type { AppendCallback }
 */
const warn$1 = appenderCallback(console.warn);

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
 * @typedef { String | ProducerType<String> } LogMeType
 */


/**
 * A function that takes logging arguments and creates a formatted string.
 * @typedef LogMessageFormatterType
 * @pure
 * @type { (context: String) => (logLevel: String) => (logMessage: String) => String }
 */

/**
 * Provides appender for loglevel types  "trace", "debug", "info", "warn", "error" & "fatal".
 * Some appenders may have a result, that can be collected using the getValue function.
 * @typedef  AppenderType
 * @template _ValueType_
 * @property { AppendCallback } trace - Defines the appending strategy for the {@link LOG_TRACE}-level messages.
 * @property { AppendCallback } debug - Defines the appending strategy for the {@link LOG_DEBUG}-level messages.
 * @property { AppendCallback } info  - Defines the appending strategy for the {@link LOG_INFO}-level messages.
 * @property { AppendCallback } warn  - Defines the appending strategy for the {@link LOG_WARN}-level messages.
 * @property { AppendCallback } error - Defines the appending strategy for the {@link LOG_ERROR}-level messages.
 * @property { AppendCallback } fatal - Defines the appending strategy for the {@link LOG_FATAL}-level messages.
 * @property { () => _ValueType_ } getValue - Some appender may produce a result, that can be collected using getValue.
 * @property { () => _ValueType_ } reset    - Clean up the appender result. The next call of getValue returns the default value.
 * @property { (formatter: MaybeType<LogMessageFormatterType>) => void } setFormatter - set an appender specific formatter
 * @property { () =>       MaybeType<LogMessageFormatterType>          } getFormatter - get the currently used formatter
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
window["setLoggingContext"] = setLoggingContext;

const defaultConsoleLogging = (context, level) => {
  addToAppenderList(ConsoleAppender());
  setLoggingContext(context);
  setLoggingLevel(level);
};let idPostfix = 0; // makes sure we have unique ids in case of many such controls

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
 * @property { () => void }                        cleanup - make sure no more log messages are processed
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
        (msg => {
            throw new Error(msg);
        })
        (level => setLoggingLevel(level));

    const loggingLevelController = SimpleInputController({
       value: toString(getLoggingLevel()),
       label: "Logging Level",
       name:  "loggingLevel",
       type:  "text", // we treat the logging level as a string in the presentation layer
    });
    // presentation binding: when the logging level string changes, we need to set the global logging level
    loggingLevelController.onValueChanged(setLoggingLevelByString);
    // domain binding: when the global logging level changes, we need to update the string of the logging level
    onLoggingLevelChanged(level => loggingLevelController.setValue(toString(level)));

    const loggingContextController = SimpleInputController({
       value: getLoggingContext(),
       label: "Logging Context",
       name:  "loggingContext",
       type:  "text",
    });
    // presentation binding: when the string of the context changes, we need to update the global logging context
    loggingContextController.onValueChanged(contextStr => setLoggingContext(contextStr));
    // domain binding: when the global logging context changes, we need to update the string of the logging context
    onLoggingContextChanged(context => loggingContextController.setValue(context));

    const lastLogMessageController = SimpleInputController({
       value: "no message, yet",
       label: "Last Log Message",
       name:  "lastLogMessage",
       type:  "text",
    });
    const observableAppender       = ObservableAppender
    (CountAppender())
    ((level, msg) => lastLogMessageController.setValue(msg));

    addToAppenderList(observableAppender);

    const cleanup = () => removeFromAppenderList(observableAppender);

    return {
        loggingLevelController,
        loggingContextController,
        lastLogMessageController,
        cleanup,
    };
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


const log = LoggerFactory(LOG_CONTEXT_KOLIBRI_TEST);

/**
 * The running total of executed test assertions
 * @impure the reference does not change, but the contained value. Listeners will produce side effects like DOM changes.
 * @type { IObservable<Number> }
 */
const total = Observable(0);

/**
 * Whether any test assertion has failed.
 * @impure the reference does not change, but the contained value. Listeners will produce side effects like DOM changes.
 * @type { IObservable<Boolean> }
 */
const failed = Observable(false);

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
    /** @type Array<String> */  const messages = []; // message for each test result at the same index
    const addMessage = message => {
        if (message !== "") {
            failed.setValue(true);
        }
        messages.push(message);
    };
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
            addMessage(message);
        },
        is: (actual, expected) => {
            const testResult = actual === expected;
            let message = "";
            if (!testResult) {
                message = `Got '${actual}', expected '${expected}'`;
                log.error(message);
            }
            results .push(testResult);
            addMessage(message);
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
                    const actualMsg = actualDone
                        ? "had no more elements but expected still had more"
                        : "still had elements but expected had no more.";
                    message = `Actual and expected do not have the same length! After comparing ${iterationCount} 
                               elements, actual ${actualMsg}!`;
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
            addMessage(message);
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
            addMessage(message);
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
            } else { // some test in suite failed, rerun tests for better error indication with debug logging
                const consoleAppender = ConsoleAppender();
                const formattingFn  = context => logLevel => logMessage => `[${logLevel}]\t'${context}' ${suiteName}: ${logMessage}`;
                consoleAppender.setFormatter(Just(formattingFn));
                withAppender(consoleAppender, LOG_CONTEXT_All, LOG_DEBUG)(() =>
                    tests.forEach(testInfo => test(testInfo(name), testInfo(logic))));
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
        const message = messages[idx].replaceAll("<","&lt;").replaceAll(">","&gt;");
        write(`
                <!--suppress ALL -->
                <div></div>
                <div>assertion </div> 
                <div ${failedStyle}>#${idx+1}: ${message}</div>
                <div ${failedStyle}>failed</div> 
        `);
    });
};

/**
 * Write the formatted test results in the holding report HTML page.
 * @param { !String } html - HTML string of the to-be-appended DOM
 * @private
 */
const write = html => document.getElementById("out").append(...dom(html));

/**
 * Convenience function to run an isolated test with a given appender, logging context and level.
 * @type { <_T_>
 *          (appender:AppenderType<_T_>, context:String, level:LogLevelType)
 *          => (codeUnderTest: ConsumerType<void>)
 *          => void
 *        }
 */
const withAppender = (appender, context, level) => codeUnderTest => {
    const oldLevel   = getLoggingLevel();
    const oldContext = getLoggingContext();
    try {
        setLoggingContext(context);
        setLoggingLevel(level);
        addToAppenderList(appender);
        codeUnderTest();
    } catch (e) {
        console.error(e, "withAppender logging test failed!");
    } finally {
        setLoggingLevel(oldLevel);
        setLoggingContext(oldContext);
        removeFromAppenderList(appender);
    }
};/**
 * @module util/memoize
 * Helper functions for caching previous results.
 */


const { debug: debug$1 } = LoggerFactory("ch.fhnw.kolibri.util.memoize");

/** @private */ const MAX_CACHE_SIZE = 1000;


/**
 * A function that takes a function **f(x)** and returns a new function
 * **f(x)** that stores the result in a cache and returns the result value from the
 * cache for successive invocation of **f(x)**.
 * Where **x** should be a scalar value that can be used as a key in a {@link Map}.
 * The cache hit count is logged on {@link LOG_DEBUG} level.
 * @type {  <_T_, _U_>  (f: Functor<_T_,_U_>) => Functor<_T_,_U_> }
 * @example
   let fib = n => n < 2 ? 1 : fib(n-1) + fib(n-2);
   fib = memoize(fib);
   fib(2)  // is 2
 */
const memoize = f => {
    const cache = new Map();
    let   cacheHitCount = 0;
    return x => {
        if (cache.size >= MAX_CACHE_SIZE) {
            cache.clear();
        }
        let y = cache.get(x);
        if (undefined === y) {
            y = f(x);
            cache.set(x,y);
        } else {
            debug$1("memoized cache hits: " + (++cacheHitCount) );
        }
        return y;
    }
};const release     = "0.9.6";

const dateStamp   = "2024-12-13 T 17:51:07 MEZ";

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
 * Basis for the Y-combinator.
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

// The Y-combinator appears only as a comment here, because it is of little use in a strict language.
// Y combinator: \f. (\x.f(x x)) (\x.f(x x))
// Y = f => ( x => f(x(x)) )  ( x => f(x(x)) )
// Y is a fixed point for every f: Y(f) == Y(Y(f))
// \f. M(\x. f(Mx))
// f => M(x => f(M(x)))

/**
 * Z combinator, \f. M(\x. f(\v. Mxv)) .
 * The replacement for the Y-combinator in a strict language to capture recursion and looping.
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
const phi = p => Pair (p(snd)) (succ(p(snd)));

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
};/**
 * @typedef  PageDataType
 * @property { !String }            titleText      - title text for the html page when the page is displayed
 * @property { !HTMLStyleElement }  styleElement   - the style to add into the html head
 * @property { !HTMLElement }       contentElement - what to display
 * @property { !String }            pageClass      - name of the CSS class that identifies the style of this page in the html page header
 * @property { Number= }            activationMs   - milliseconds to run the activation animation, optional with default value
 * @property { Number= }            passivationMs  - milliseconds to run the passivation animation, optional with default value
 * @property { Function= }          onBootstrap    - behavior after first mount, optional: no operation for static pages
 */

/**
 * @typedef PageFunctionsType
 * @property { () => Boolean  }                     getVisited
 * @property { (Boolean) => void }                  setVisited
 * @property { (cb:ConsumerType<Boolean>) => void } onVisited  - notify callback when page was visited
 */

/**
 * @typedef { PageDataType & PageFunctionsType } PageType
 * A page of type PageType is a domain object in the domain of pages of a website.
 * It provides information about what to display as content plus additional information like visitation state.
 */

/**
 * Constructor for a {@link PageType Page}.
 * To be called from specialized page constructors to set up the common properties of all pages.
 * @param { PageDataType } parameterObject
 * @return { PageType }
 * @constructor
 * @example
 * Page({
 *      titleText:         "About",
 *      activationMs:      1000,
 *      passivationMs:     1000,
 *      pageClass:         "about",
 *      styleElement,
 *      contentElement,
 *  })
 */
const Page = ( {
                   titleText,
                   styleElement,
                   contentElement,
                   pageClass,
                   onBootstrap   = () => undefined, // default is do nothing
                   activationMs  = 500,
                   passivationMs = 500
              } ) => {
    const visitedObs = Observable(false);
    let   bootStrapped = false;
    const mayBootstrap = () => {
        if (bootStrapped) { return; }
        onBootstrap();
        bootStrapped = true;
    };
    return /** @type { PageType } */ {
        titleText        ,
        styleElement     ,
        contentElement   ,
        pageClass        ,
        onBootstrap:     mayBootstrap, // make sure onBootstrap is called at most once
        activationMs     ,
        passivationMs    ,
        getVisited:      visitedObs.getValue,
        setVisited:      visitedObs.setValue,
        onVisited :      visitedObs.onChange,
    }
};/**
 * Use this module to define a type for each URI hash in your application
 * that serves as a target for a page that the user can navigate to.
 */

/**
 * @typedef {
 *        "#empty"
 *      | "#home"
 *      | "#unstyled"
 *      | "#masterDetail"
 *      }  UriHashType
 * UriHashes must be unique, start with a hash character and be formatted like in proper URIs.
 */

/** @type { UriHashType } */ const URI_HASH_EMPTY         = "#empty"; // should always be available
/** @type { UriHashType } */ const URI_HASH_HOME          = "#home";  // should always be available
/** @type { UriHashType } */ const URI_HASH_UNSTYLED      = "#unstyled";
/** @type { UriHashType } */ const URI_HASH_MASTER_DETAIL = "#masterDetail";

/**
 * Typesafe creation of link hrefs. One cannot create hrefs if the uriHash is not registered by type.
 * @param  { UriHashType } uriHash
 * @return { String } - a properly formatted HTML href attribute
 * @example
 * `<a ${href(URI_HASH_HOME)}> Home </a>` // error marker if not known
 */
const href = uriHash => ` href="${uriHash}" `;const PAGE_CLASS$1     = URI_HASH_EMPTY.substring(1);

/**
 * This page will never be displayed.
 * It serves as a stand-in for which page to activate when there is no page (yet).
 * Analogous to the Null Object Pattern.
 * @return { PageType }
 * @constructor
 */
const EmptyPage = () => Page({
     titleText:         "Empty",
     activationMs:      0,
     passivationMs:     0,
     pageClass:         PAGE_CLASS$1,
     styleElement  :    /** @type { HTMLStyleElement } */ styleElement,
     contentElement:    /** @type { HTMLElement }      */ contentElement,
 });

const [styleElement, contentElement] = dom(`
    <style data-style-id="${PAGE_CLASS$1}">  
        @layer pageStyle {
             /* no style */
        }
    </style>
    <div class="${PAGE_CLASS$1}">
        Empty Page      
    </div>
`);const PAGE_CLASS = "simpleNavigationProjector";

const iconSVGStr = `
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 5L15.0368 11.9632L8 18.9263" stroke="url(#paint0_linear_1028_8530)"/>
        <defs>
        <linearGradient id="paint0_linear_1028_8530" x1="7.98915" y1="5" x2="18.7337" y2="14.9252" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#FF2CA5"/>
        <stop offset="1" stop-color="#6000FF"/>
        </linearGradient>
    </svg>
`;

/**
 * A projector of anchors to all pages that are registered in the {@link SiteControllerType}.
 * It binds each anchor to the "visited" state and highlights the currently selected page (uriHash).
 * The highlighting is part of the style but layouting of the anchors is left to the parent
 * such that the same projector can be used for horizontal and vertical display.
 * @constructor
 * @param { !SiteControllerType } siteController - the source of the information that we display
 * @param { !HTMLDivElement }     root           - where to mount the view
 * @param { Boolean= }            canHide        - whether this navigation can hide itself, defaults to false
 * @return { NavigationProjectorType }
 * @example
 * // set up
 * const siteController = SiteController();
 * const siteProjector  = SiteProjector(siteController);
 * // add pages
 * siteController.registerPage(URI_HASH_HOME,     HomePage());
 * siteController.registerPage(URI_HASH_UNSTYLED, UnstyledPage());
 * // mount the navigation. We can even have multiple ones!
 * SimpleNavigationProjector(siteController, siteProjector.sideNavigationElement);
 * SimpleNavigationProjector(siteController, siteProjector.topNavigationElement);
 */

const SimpleNavigationProjector = (siteController, root, canHide=false) => {

    root.innerHTML = `<nav class="${PAGE_CLASS}"></nav> `;

    const projectNavigation = () => {

        // add specific style if not yet available
        if (null === document.head.querySelector(`style[data-style-id="${PAGE_CLASS}"]`)) {
            document.head.innerHTML += projectorStyle;
        }

        const [navigationEl] = select(root, `nav.${PAGE_CLASS}`);

        // view is just so many anchors
        navigationEl.innerHTML = (canHide ? `<div class="toggler">${iconSVGStr}</div>` : '') +
            Object.entries(siteController.getAllPages())
              .map( ([hash, page]) => `<a href="${hash}">${page.titleText}</a>`)
              .join(" ");

        // view binding is done by the browser implicitly when following the link

        // bind all anchors to their "visited" state (:visited does not allow much)
        Object.entries(siteController.getAllPages())
              .forEach( ([hash, page]) => page.onVisited( visited => {
                  if (!visited) return;
                  navigationEl.querySelector(`a[href="${hash}"]`)?.classList?.add("visited");
              } ));
        // update which anchor shows the current page
        siteController.onUriHashChanged((newHash, oldHash) => {
            navigationEl.querySelector(`a[href="${oldHash}"]`)?.classList?.remove("current");
            navigationEl.querySelector(`a[href="${newHash}"]`)?.classList?.add   ("current");
        });

        if (canHide) {
            navigationEl.classList.toggle("hide");
            select(navigationEl, ".toggler").head().onclick = _evt => navigationEl.classList.toggle("hide");
        }
    };

    projectNavigation();
};

const projectorStyle = `
    <style data-style-id="${PAGE_CLASS}">    
        @layer navigationLayer {
            .${PAGE_CLASS} {
                overflow-x: clip;
                &.hide {                 
                    .toggler {                    
                        rotate:         0deg;
                    }
                    a, a.current {      /* hide the anchors */
                        width:          0;
                        color:          transparent;
                        pointer-events: none;
                    } 
                }
                .toggler {              /* provide a box for the svg */
                    margin-inline:      auto;
                    width:              2rem;
                    aspect-ratio:       1 / 1;
                    rotate:             180deg;
                    transition:         rotate .3s ease-in-out .1s; /* delayed and shorter than the width transition */
                }
                svg {
                    fill:               none;
                    stroke-width:       2;
                    stroke-linecap:     round;
                    stroke-linejoin:    round;
                }
                a {
                    width:              auto;
                    color:              revert;
                    pointer-events:     revert;
                    user-select:        none;
                    text-wrap:          nowrap;
                    font-family:        system-ui;
                    transition-property:        width;
                    transition-duration:        .5s;
                    transition-timing-function: ease-out;
                    transition-behavior:        allow-discrete; /* progressive enhancement*/
                }
                a.visited {
                    text-decoration:    none;
                }
                a.visited:not(.current) {
                    filter:             brightness(150%) grayscale(60%);
                }
                a.current {
                    color:              var(--kolibri-color-accent, deeppink);
                }
            }
        }

    </style>
`;const SITE_CLASS     = "site";

const SiteProjector = siteController => {

     const sideNavigationElement = bodyElement.querySelector("#side-nav");
     const topNavigationElement  = bodyElement.querySelector("#top-nav");
     const activeContentElement  = bodyElement.querySelector("#content");
     const passiveContentElement = bodyElement.querySelector("#content-passivated");

     document.head.append(...headElements);
     document.body.append(bodyElement);

     siteController.onUnsupportedUriHash( uriHash =>                     // think about monolog and i18n
         alert(`Sorry, the target "${uriHash}" is not available.`)
     );

     siteController.onPageActivated( page => {

          // set the title
          const titleElement = document.head.querySelector("title");
          titleElement.textContent = page.titleText;

          // make sure that the required page style is in the head
          const styleElement = document.head.querySelector(`style[data-style-id="${page.pageClass}"]`);
          if (null === styleElement) {
              document.head.append(page.styleElement);
          }

          // make sure the animation timings in model and css are the same
          page.contentElement.style.setProperty("--activation-ms" ,page.activationMs);
          page.contentElement.style.setProperty("--passivation-ms",page.passivationMs);

          setTimeout( _time => {                                           // allow activation anim its time
               page.contentElement.classList.remove("activate");           // we have to remove or we cannot start again
          }, page.activationMs );

          activeContentElement.replaceChildren(page.contentElement);       // finally mount the page
          page.contentElement.classList.add("activate");
     });

     siteController.onPagePassivated( page => {
          passiveContentElement.replaceChildren(page.contentElement);      // moves from content to passivated

          // trigger the passivation anim
          page.contentElement.classList.add("passivate");
          setTimeout( _time => {                                           // give the passivation anim some time
               page.contentElement.classList.remove("passivate");          // just to be sure
               passiveContentElement.innerHTML = "";                       // remove all children
               // we do not remove the page styleElement because of issues when
               // passivation and re-activation styling overlaps
          }, page.passivationMs);
     });

     return {
          sideNavigationElement    ,
          topNavigationElement
     }
};

const headElements = dom(`

        <title>(no title - will be replaced)</title>
        <link id="favicon" rel="icon" type="image/x-icon" href='${window.BASE_URI}img/logo/logo.svg'>
        
        <style data-style-id="${SITE_CLASS}">
        
            /*  use layers to avoid overriding defaults by accident */
            @layer pageLayer, navigationLayer, siteLayer, kolibriLayer;
        
            @import "${window.BASE_URI}css/kolibri-base-light.css" layer(kolibriLayer);
            
            @layer ${SITE_CLASS}Layer { /* styles for the whole website */ 
                 body {
                     margin: 0;
                 }
                 #application-frame {
                     position:               fixed;
                     inset:                  0;
     
                     display:                grid;
                     grid-template-columns:  min-content auto;
                     grid-template-rows:     min-content auto;
                     grid-template-areas:    "logo       top-nav"
                                             "side-nav   content";
                 }            
                 #top-nav, #side-nav, #logo {
                     padding:                .5rem;
                 }
                 #top-nav {
                     grid-area:              top-nav;
                     align-self:             center;
                     filter:                 drop-shadow(0 0 .5rem white);
                     --kolibri-color-accent: var(--kb-color-hsl-bg-light);
                     font-weight:            bold;
                     & a {
                         margin-right:       1em;
                     }
                 }
                 #side-nav {
                     grid-area:              side-nav;
                     background-color:       var(--kb-color-hsl-bg-light);
                     box-shadow:             var(--kolibri-box-shadow);
                     padding-block:          1lh;
                     & a {
                         display:            block;
                         margin-top:         .5lh;
                     }
                 }
                 #logo {
                     grid-area:              logo;
                     justify-self:           center;
                     & a img {
                         display:            block;
                         border-radius:      50%;
                         background-color:   var(--kb-color-hsl-bg-light);
                         width:              3rem;
                         aspect-ratio:       1 / 1;
                         box-shadow:         1px 1px .2rem 0 var(--kb-color-hsl-lavender-700) inset; 
                     }
                 }
                 #top-backdrop {
                     grid-row:               1;
                     grid-column:            1 / -1;
                     z-index:                -10;
                     background-image:       linear-gradient( 90deg,
                                                 var(--kb-color-hsl-pink-300) 50%,
                                                 var(--kb-color-hsl-lavender-700)
                                             );
                 }
     
                 .content {                  /* must be shared in #content and #content-passivated */
                     grid-area:              content;
                     container-type:         size; 
                     container-name:         pageContainer;
                     overflow:               auto;
                     padding:                2rem;
                 }
                 #content-passivated {
                     z-index:                -10;
                 }
                 
                 @media (width < 90ch) {  /* --kolibri-prosa-width plus side-nave hidden width */
                    .content {                        
                        grid-column: 1 / -1;
                    }
                    #side-nav {
                        display: none;
                    }
                 }
            }

        </style>
`);

const [bodyElement] = dom(`
    <div id="application-frame">
        <div id="top-backdrop"></div>
        <div id="logo">
            <a ${href(URI_HASH_HOME)}>
                <img src="${window.BASE_URI}img/logo/logo-new-128.svg" alt="Kolibri-logo">
            </a>
        </div>
        <div  id="top-nav"> top  nav stand-in</div>
        <div  id="side-nav">side nav stand-in</div>
        <div  id="content-passivated"   class="content">
            <!-- holder to display content during passivation -->
        </div>
        <div  id="content"              class="content">
            <!-- page content will be added here -->
        </div>

    </div>
`);/**
 * @module kolibri.navigation.siteController
 */


const { warn, info, debug } = LoggerFactory("ch.fhnw.kolibri.navigation.siteController");

/**
 * @typedef SiteControllerType
 * @property { (uriHash:UriHashType, page:PageType) => void }   registerPage     - protocol: do this first
 * @property { (uriHash:UriHashType) => void }                  gotoUriHash      - navigate to the page for this uriHash
 * @property { () => Object.<UriHashType, PageType>}            getAllPages      - call after all pages were registered
 * @property { (cb:ConsumerType<UriHashType>) => void }         onUriHashChanged - notify anchors
 * @property { (cb:ConsumerType<PageType>) => void }            onPageActivated  - notify site projector
 * @property { (cb:ConsumerType<PageType>) => void}             onPagePassivated - notify site projector
 * @property { (cb:ConsumerType<String>)   => void}             onUnsupportedUriHash - navigation failure callback
 */

/**
 * @return { SiteControllerType }
 * @constructor
 */

const SiteController = () => {

    let   unsupportedHashReaction = _uriHash => undefined;
    const onUnsupportedUriHash = handler => unsupportedHashReaction = handler;

    const emptyPage      = EmptyPage();
    const pageActivated  = /** @type { IObservable<PageType> } */ Observable(emptyPage);
    const pagePassivated = /** @type { IObservable<PageType> } */ Observable(emptyPage);

    const allPages       = {};  // URI_HASH to Page
    const currentUriHash = /** @type { IObservable<UriHashType> } */ Observable(URI_HASH_EMPTY);

    // the main Hash relates to the Controller that is used for activation and passivation
    const mainHash = uriHash => uriHash.split('/')[0]; // if there are subHashes, take the parent

    const gotoUriHash = uriHash => {
        uriHash = uriHash || URI_HASH_HOME;                             // handle "", "#", null, undefined => home
        if ( null == allPages[mainHash(uriHash)] ) {
            warn(`cannot activate page for hash "${uriHash}"`);
            unsupportedHashReaction(uriHash);
            return;
        }
        pageTransition(uriHash);
    };

    // handles initial page load and page reload, it jumps "direct"ly to the hash without transition
    window.onload       = () => gotoUriHash(window.location.hash, /* direct */ true);

    // handles navigation through the browser URL field, bookmarking, or browser previous/next
    window.onhashchange = () => gotoUriHash(window.location.hash, /* direct */ false);

    /**
     * Navigates to the {@link PageType page} for the given {@link UriHashType}.
     * This includes side-effecting the model, the browser incl. history, and
     * activating / passivating the involved {@link PageType pages}.
     *
     * @private
     * @impure
     * @param { !UriHashType } newUriHash - this might include subHashes like `#parent/sub`
     * @return { void }
     */
    const pageTransition = newUriHash => {

        if(currentUriHash.getValue() === newUriHash) { // guard
            return;
        }
        info(`page transition from ${currentUriHash.getValue()} to ${newUriHash}`);

        // effect: navigate to hash, trigger onhashchange event (but not if same), add to history
        window.location.hash = newUriHash;
        currentUriHash.setValue(newUriHash); // notify the listeners (mostly navigation projectors)

        const activePage = pageActivated.getValue();
        const newPage     = allPages[mainHash(newUriHash)];

        debug(`passivate ${activePage.titleText}`);
        pagePassivated.setValue(activePage);

        newPage.setVisited(true);

        debug(`activate ${newPage.titleText}`);
        pageActivated.setValue(newPage);
        newPage.onBootstrap(); // self-aware to only execute at most once
    };

    const registerPage = ( uriHash, page) => {
        allPages[uriHash] = page;
    };

    return /** @type { SiteControllerType } */ {
        gotoUriHash,
        registerPage,                           // protocol: your must first register before you can go to it
        getAllPages:       () => ({...allPages}),     // defensive copy
        onUnsupportedUriHash,                         // navigation failure callback
        onUriHashChanged : currentUriHash.onChange,   // notify navigation projectors
        onPageActivated:   pageActivated.onChange,    // notify site projector
        onPagePassivated:  pagePassivated.onChange,   // notify site projector
    }
};// production classes for bundling and statistics, without tests or examples
/**
 * @module lambda/church
 * Church encoding of the lambda calculus in JavaScript
 * to the extent that we need it in Kolibri.
 * Recommended reading: https://en.wikipedia.org/wiki/Church_encoding .
 * Recommended watching: https://www.youtube.com/watch?v=6BnVo7EHO_8&t=1032s .
 */

export {
    id, beta, konst, c, flip, kite, cmp, cmp2,
    T, F, and, not, beq, or, xor, imp,
    LazyIf, jsBool, churchBool, rec,
    fst, snd,                           // Pair and its types are exported from pair.js
    Tuple, Choice,
    either, Left, Right,
    maybe,                              // Nothing, Just and their types are exported from maybe.js
    curry, uncurry,
    toChurchBoolean, toJsBool
}


/**
 * Identity function, aka "I" in the SKI calculus or "Ibis" (or "Idiot") in the Smullyan bird metaphors.
 * The function is pure and runs in O(1). Function calls can be inlined.
 * @haskell  a -> a
 * @pure
 * @template _T_
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
 * @template _T_
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
 * @template _T_
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
 * @template _T_
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
 * @template _T_
 * @type     { <_T_, _U_> (x:_T_) => _U_ }
 */

/**
 * Type of the {@link Left} constructor after being bound to a value x of type _T_.
 * @typedef LeftXType
 * @template _T_, _U_
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
 * @template _T_, _U_
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
 * @template _T_, _U_
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
 * @template _T_, _U_
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
 * @template _T_, _U_
 * @pure
 */

/** function application, beta reduction
 * @haskell (a -> b) -> a -> b
 * @pure if f is pure
 * @template _T_, _U_
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
 * @template _T_, _U_, _V_
 * @type { <_T_, _U_, _V_> (f: (_T_) => (_U_) => _V_) => (_U_) => (_T_) => _V_ }
 */
const flip = f => x => y => f(y)(x);

/** An alternative name for the {@link snd} function. */
const kite = snd;

/** Composition of two functions, aka Bluebird (B) in the Smullyan bird metaphors.
 * @haskell (b -> c) -> (a -> b) -> a -> c
 * @template _T_, _U_, _V_
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
 *
 * @template _T_
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
 * @template _T_
 * @type { <_T_> (f: (_T_) => _T_) => _T_ }
 */
const rec = f => f ( n => rec(f)(n)  ) ;

/**
 * @callback HandleLeftCallback
 * @template _T_, _U_, _V_
 * @type { <_T_,_U_,_V_> (l:LeftXType<_T_,_U_>) => _V_ }
 */
/**
 * @callback HandleRightCallback
 * @template _T_, _U_, _V_
 * @type { <_T_,_U_,_V_> (r:RightXType<_T_,_U_>) => _V_ }
 */
/**
 * Apply the f or g handling function to the Either value.
 * @template _T_, _U_, _V_
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
 * @template _T_, _U_
 * @type  { <_T_,_U_> (m:MaybeType<_T_>) => (hn:HandleNothingCallback<_T_,_U_>) => (hj:HandleJustCallback<_T_,_U_>) => _U_ }
 */
const maybe = m => f => g => m(f)(g);

/**
 * Take a function of two arguments and return a function of one argument that returns a function of one argument,
 * i.e. a function of two arguments in curried style.
 * @haskell curry :: ((a,b)->c) -> a -> b -> c
 * @template _T_, _U_, _V_
 * @type { <_T_,_U_,_V_> (f:FunctionAtoBType<_T_,FunctionAtoBType<_U_,_V_>>) => FunctionAtoBType<_T_,FunctionAtoBType<_U_,_V_>> }
 */
const curry = f => x => y => f(x,y);

/**
 * Take af function of two arguments in curried style and return a function of two arguments.
 * @haskell uncurry :: ( a -> b -> c) -> ((a,b) -> c)
 * @template _T_, _U_, _V_
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
const toJsBool = churchBoolean =>  churchBoolean(true)(false);


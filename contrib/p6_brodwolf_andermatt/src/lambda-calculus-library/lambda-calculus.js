export {I as id, M, K, KI, C, B, T, V, Blackbird, fst, snd, firstOfTriple, secondOfTriple, thirdOfTriple, True, False, If, Then, Else, not, and, or, beq, showBoolean, jsBool, pair, triple, mapPair, showPair, churchBool, LazyIf}

/*
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
const I = x => x;

/**
 * a -> b -> a ; Kestrel (Constant)
 *
 * @lambda  λx.y.x
 * @haskell Kestrel :: a -> b -> a
 * @function Konstant
 * @param    {*} x
 * @returns  {function(y:*): function(x:*)} a function that ignores its argument and returns x
 */
const K = x => y => x;

/**
 * x -> y -> y ; Kite
 *
 * @lambda  λx.y.y
 * @haskell Kite :: a -> b -> b
 * @function Kite
 * @param    {*} x
 * @returns  {function(y:*): function(y:*)} a function that returns its argument y
 */
const KI = x => y => y;

/**
 * f -> f( f ) ; Mockingbird
 * @lambda  λf.ff
 * @haskell Mockingbird :: f -> f
 * @function Mockingbird
 * @param   {function} f
 * @returns {function({ f: { f } })} a self-application combinator
 */
const M = f => f(f);

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
const C = f => x => y => f(y)(x);


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
const B = f => g => x => f(g(x));


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
const V = x => y => f => f(x)(y);


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
const False = KI;

/**
 * x -> y -> x ; {churchBoolean} True Church-Boolean
 *
 * @function
 * @type    churchBoolean
 * @return  K
 */
const True = K;

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
const Then = I;
const Else = I;

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
const not = C;

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
const pair = V;

/**
 * Get first value of Pair
 *
 * @function
 * @return {function(x:*): function(y:*): x} - pair first stored value
 * @example
 * pair(n2)(n5)(fst) === n2
 */
const fst = K;

/**
 * Get second value of Pair
 *
 * @function
 * @return {function(x:*): function(y:*): y} - pair second stored value
 * @example
 * pair(n2)(n5)(snd) === n5
 */
const snd = KI;

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
const showPair = p => `${p(fst)} | ${p(snd)}`;
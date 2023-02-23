export { Pair, snd, fst, LazyIf, Then, Else, True, False, not, and, id, lazy,
  toChurchBoolean, convertToJsBool, n0, n1, n2, n3, n4, n5, n6, n7, n8, n9,
  succ, leq, eq, jsNum
}

import { fst, snd } from "../../../../docs/src/kolibri/stdlib.js";

const lazy = x => () => x;
const toChurchBoolean = value => value ? True : False;
const convertToJsBool = b => b(true)(false);

// lambda calculus

const id = x => x;
/**
 * a -> b -> a ; Kestrel (Constant)
 *
 * @lambda  λx.y.x
 * @haskell Kestrel :: a -> b -> a
 * @function Konstant
 * @param    {*} x
 * @returns  {function(y:*): function(x:*)} a function that ignores its argument and returns x
 */
const K = x => _y => x;

/**
 * x -> y -> y ; Kite
 *
 * @lambda  λx.y.y
 * @haskell Kite :: a -> b -> b
 * @function Kite
 * @param    {*} _x
 * @returns  {function(y:*): function(y:*)} a function that returns its argument y
 */
const KI = _x => y => y;

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


const Pair = a => b => f => f(a)(b);

/**
 * phi combinator
 * creates a new pair, replace first value with the second and increase the second value
 *
 * @function
 */
const phi = p => Pair(p(snd))(succ(p(snd)));

// churchBooleans & logical operators

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
 * p -> q -> p( q )(False) ; and
 *
 * @function
 * @param   {churchBoolean} p
 * @returns {function(q:churchBoolean): churchBoolean}  True or False
 */
const and = p => q => p(q)(False);

/**
 * @function
 * @param p {churchBoolean}
 * @returns churchBoolean
 */
const not = p => p(False)(True);


/**
 * Syntactic sugar for creating an If-Then-Else-Construct for lazy Evaluation - it avoid that JavaScript eagerly evaluate both cases (then and else)
 * Important: Add in 'Then' and 'Else' an anonym function: () => "your function"
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
const Then = id;
const Else = id;

// churchNumbers

/*
 *  church numbers 0 - 9
 *  n times application of function f to the argument a
 */
const n0 = _f => a => a;
const n1 = f => a => f(a);
const n2 = f => a => f(f(a));
const n3 = f => a => f(f(f(a)));
const n4 = f => a => f(f(f(f(a))));
const n5 = f => a => f(f(f(f(f(a)))));
const n6 = f => a => f(f(f(f(f(f(a))))));
const n7 = f => a => f(f(f(f(f(f(f(a)))))));
const n8 = f => a => f(f(f(f(f(f(f(f(a))))))));
const n9 = f => a => f(f(f(f(f(f(f(f(f(a)))))))));

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
const succ = n => f => B(f)(n(f));

/**
 * query if the church number is zero (n0)
 *
 * @function
 * @param  {churchNumber} n
 * @return {churchBoolean} True / False
 */
const is0 = n => n(K(False))(True);

/**
 * "less-than-or-equal-to" with Church-Numbers
 *
 * @function
 * @param  {churchNumber} n
 * @return {function(k:churchNumber): churchBoolean} True / False
 */
const leq = n => k => is0(churchSubtraction(n)(k));

/**
 * "equal-to" with Church-Number
 *
 * @function
 * @param  {churchNumber} n
 * @return {function(k:churchNumber): churchBoolean} True / False
 */
const eq = n => k => and(leq(n)(k))(leq(k)(n));

/**
 * predecessor
 * return the predecessor of passed churchNumber (minimum is n0 aka Zero). Is needed for churchSubtraction
 *
 * @function predecessor
 * @param   {churchNumber} n
 * @returns {churchNumber} predecessor of n
 */
const pred = n => n(phi)(Pair(n0)(n0))(fst);

/**
 * Subtraction with two Church-Numbers
 *
 * @function
 * @param  {churchNumber} n
 * @return {function(k:churchNumber): churchNumber } Church-Number
 */
const churchSubtraction = n => k => k(pred)(n);


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
const jsNum = n => n(x => x + 1)(0);
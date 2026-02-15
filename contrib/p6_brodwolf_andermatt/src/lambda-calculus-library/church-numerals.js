import {B, K, T, True, False, and, or, pair, fst, snd, Blackbird, not} from "./lambda-calculus.js";
export {n0, n1, n2, n3, n4, n5, n6, n7, n8, n9, succ, pred, phi, churchAddition, churchSubtraction, churchMultiplication, churchPotency, is0, churchNum, jsNum, eq, leq, gt, max, min}

/**
 * Generic Types
 * @typedef {function} churchBoolean
 * @typedef {function} churchNumber
 */

/**
 *  church numbers 0 - 9
 *  n times application of function f to the argument a
 */
const n0 = f => a => a;
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
 * Addition with two Church-Numbers
 *
 * @lambda λnk.n( λnfa.f(nfa) )k
 * @haskell churchAddition :: Number -> Number -> Number
 *
 * @function
 * @param   {churchNumber} n
 * @returns {function(k:churchNumber): churchNumber } Church-Number
 */
const churchAddition = n => k => n(succ)(k);

/**
 * phi combinator
 * creates a new pair, replace first value with the second and increase the second value
 *
 * @function
 * @param   {pair} p
 * @returns {pair} pair
 */
const phi = p => pair(p(snd))(succ(p(snd)));

/**
 * predecessor
 * return the predecessor of passed churchNumber (minimum is n0 aka Zero). Is needed for churchSubtraction
 *
 * @function predecessor
 * @param   {churchNumber} n
 * @returns {churchNumber} predecessor of n
 */
const pred = n => n(phi)(pair(n0)(n0))(fst);

/**
 * Subtraction with two Church-Numbers
 *
 * @function
 * @param  {churchNumber} n
 * @return {function(k:churchNumber): churchNumber } Church-Number
 */
const churchSubtraction = n => k => k(pred)(n);

/**
 * Multiplication with two Church-Numbers
 *
 * @function
 * @param   {churchNumber} n
 * @returns {function(k:churchNumber): churchNumber } Church-Number
 */
const churchMultiplication = B;

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
const is0 = n => n(K(False))(True);

/**
 * converts a js number to a church number
 *
 * @function
 * @param   {number} n
 * @returns {churchNumber} church number of n
 */
const churchNum = n => n === 0 ? n0 : succ(churchNum(n - 1));

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
 * "greater-than" with Church-Numbers
 *
 * @function
 * @param  {churchNumber} n
 * @return {function(k:churchNumber): churchBoolean} True / False
 */
const gt = Blackbird(not)(leq);

/**
 * max of two Church-Numbers
 *
 * @function
 * @param  {churchNumber} n
 * @return {function(k:churchNumber): churchBoolean} n / k
 */
const max = n => k => gt(n)(k)(n)(k)

/**
 * min of two Church-Numbers
 *
 * @function
 * @param  {churchNumber} n
 * @return {function(k:churchNumber): churchBoolean} n / k
 */
const min = n => k => leq(n)(k)(n)(k)

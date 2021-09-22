import {B, K, T, True, False, and, or, pair, fst, snd, Blackbird, not} from "./lambda-calculus.js";

export {
    n0, n1, n2, n3, n4, n5, n6, n7, n8, n9,
    succ, pred, phi, churchAddition, churchSubtraction,
    churchMultiplication, churchPotency, is0, toChurchNum, jsnum, eq, leq, gt
}

/**
 * Generic Types
 * @typedef {*} a
 * @typedef {*} b
 * @typedef {*} c
 * @typedef {(a|b|c)} abc
 * @typedef {function} fn
 * @typedef {function} gn
 * @typedef {function} pn
 * @typedef {function} qn
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
 * successor of a church number
 * @param {churchNumber} n
 * @returns {churchNumber} successor of n
 */
const successor = n => f => a => f(n(f)(a));

/**
 * successor with bluebird
 * @param {churchNumber} n
 * @returns {churchNumber} successor of n
 */
const succ = n => f => B(f)(n(f));

/**
 * Addition with two Church-Numbers
 * @param n {churchNumber}
 * @returns {function(k:{churchNumber}): churchNumber } Church-Number
 */
const churchAddition = n => k => n(succ)(k);

/**
 * phi combinator ;
 * creates a new pair, replace first value with the second and increase the second value
 * @param {pair} p
 * @returns {pair} pair
 */
const phi = p => pair(p(snd))(succ(p(snd)));

/**
 * predecessor
 * @param {churchNumber} n
 * @returns {churchNumber} predecessor of n
 */
const pred = n => n(phi)(pair(n0)(n0))(fst);

/**
 * Subtraction with two Church-Numbers
 * @param n1 {churchNumber}
 * @return {function(n2:{churchNumber}): churchNumber } Church-Number
 */
const churchSubtraction = n => k => k(pred)(n);

/**
 * Multiplication with two Church-Numbers
 * @param n1 {churchNumber}
 * @returns {function(n1:{fn}): function(n2:{gn}): churchNumber } Church-Number
 */
const churchMultiplication = B;

/**
 * Potency with two Church-Numbers
 * @param n1 {churchNumber}
 * @returns {function(n1:{x}): function(n2:{f}): churchNumber } Church-Number
 */
const churchPotency = T;

/**
 * query if the church number is zero (n0)
 * @param n {churchNumber}
 * @return {churchBoolean} True / False
 */
const is0 = n => n(K(False))(True);

/**
 * converts a js number to a church number
 * @param n {number} -
 * @returns {churchNumber} church number of n
 */
const toChurchNum = n => n === 0 ? n0 : succ(toChurchNum(n - 1))

/**
 * converts a church number to a js number
 * @param n {churchNumber} -
 * @returns {number} js number of n
 */
const jsnum = n => n(x => x + 1)(0);


/**
 * "less-than-or-equal-to" with Church-Numbers
 * @param n1 {churchNumber} -
 * @return {function(n2:{churchNumber}): churchBoolean} True / False
 */
const leq = n => k => is0(churchSubtraction(n)(k));

/**
 * "equal-to" with Church-Number
 * @param n1 {churchNumber} -
 * @return {function(n2:{churchNumber}): churchBoolean} True / False
 */
const eq = n => k => and(leq(n)(k))(leq(k)(n));


/**
 * "greater-than" with Church-Numbers
 * @param n1 {churchNumber} -
 * @return {function(n2:{churchNumber}): churchBoolean} True / False
 */
const gt = Blackbird(not)(leq);

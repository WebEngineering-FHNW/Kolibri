/**
 * @module lambda/churchNumbers
 * Peano numbers in the church encoding and their operations.
 */

import {cmp,c,T,F,and,Pair,snd,fst} from "./church.js";

export {
    n0, n1, n2, n3, n4, n5, n6, n7, n8, n9,
    succ, plus, mult, pow, isZero, churchNum, jsNum,
    leq, eq, pred, minus
}

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
const minus = n => k => k(pred)(n);

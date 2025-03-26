/**
 * @module lambda/ski
 * The SKI combinators for the church encoding of lambda calculus wrt the Smullyan bird names.
 * Recommended reading: https://en.wikipedia.org/wiki/SKI_combinator_calculus,
 * https://www.angelfire.com/tx4/cus/combinator/birds.html.
 * Graham Hutton: https://www.youtube.com/watch?v=9T8A89jgeTI
 */

import {Pair} from "./pair.js";

export { I, K, M, C, KI, B, BB, S, Z, Th, V }

import {id, c, flip, snd, cmp, cmp2 } from "./church.js"

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
const V = Pair;

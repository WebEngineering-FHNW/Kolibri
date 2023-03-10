// the SKI combinators for the church encoding

export {I, K, M, C, KI, B, BB, S, Z, Th, V}

import {id, beta, konst, flip, kite, cmp, cmp2, F, T, pair } from "./church.js"

const I = id ;          // Identity I, for all a: id(a) == a

// self-application, Mockingbird, \x.x x
const M = f => beta(f)(f);  // f(f)
// M is SII
// S(id)(id) (x) = id(x) (id(x))
// S(id)(id) = M
// S(I)(I) = M
//, also: M = or

// M, const, first, id2, true
const K = konst;        // Kestrel K, \x. \y. x

const C = flip;         // Cardinal C, \fxy.fyx

const KI  = kite;

const B = cmp; // Bluebird B,  \fg.S(Kf)g
// also:  B = mult

const BB = cmp2;        // Blackbird

// Starling, \abc.ac(bc)
const S = f => g => x => f(x)(g(x));

// identity is SKK, S(konst)(konst)
// S(K)(K)(x) = konst(x)( konst(x) )
// S(K)(K)(x) =      (x)
// S(K)(K)(x) =    id(x)
// S(K)(K)    =    id          // qed


// ---- boolean logic

// const imp = S(C)(C) ;

// ----
// Graham Hutton: https://www.youtube.com/watch?v=9T8A89jgeTI

// Y combinator: \f. (\x.f(x x)) (\x.f(x x))
// Y = f => ( x => f(x(x)) )  ( x => f(x(x)) )
// Y is a fixed point for every f: Y(f) == Y(Y(f))
// \f. M(\x. f(Mx))
// f => M(x => f(M(x)))

// in a non-lazy language, we need the Z fixed-point combinator
// \f. (\x. f(\v.xxv)) (\x. f(\v.xxv))
// \f. M(\x. f(\v. Mxv))
const Z = f => M(x => f(v => M(x)(v) ));

// const mult = B;

const Th = f => g => g(f);  // Thrush combinator  Th \af.fa ; CI

const V = pair;  // Vireo  V \abf.fab
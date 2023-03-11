export {
  LazyIf,
  Then,
  Else,
  True,
  False,
  lazy,
  toChurchBoolean,
  convertToJsBool
}

import {id, c, T, F, churchBool, jsBool} from "../lambda/church.js";

export {
  id,
  T, F, and, not,
  jsBool,
  Pair, fst, snd
} from "../lambda/church.js";

export {
  n0, n1, n2, n3, n4, n5, n6, n7, n8, n9,
  leq, eq, succ, pred, minus,
  jsNum,
} from "../lambda/churchNumbers.js";

const lazy = c;
const toChurchBoolean = churchBool;
const convertToJsBool = jsBool;

const True  = T;
const False = F;


/**
 * Syntactic sugar for creating an If-Then-Else-Construct for lazy Evaluation - it avoid that JavaScript eagerly evaluate both cases (then and else)
 * Important: Add in 'Then' and 'Else' an anonym function: () => "your function"
 *
 * @type { <_T_>
 *     (ChurchBooleanType)
 *     => (f:FunctionAtoBType<undefined, _T_>)
 *     => (g:FunctionAtoBType<undefined, _T_>)
 *     => _T_
 *     }
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


export {
  LazyIf
}

import {id } from "../lambda/church.js";

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


/**
 * Syntactic sugar for creating an If-Then-Else-Construct for lazy Evaluation - it avoid that JavaScript eagerly evaluate both cases (then and else)
 * Important: Add the 'Then' and 'Else' cases anonymous producer functions: () => "your function".
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



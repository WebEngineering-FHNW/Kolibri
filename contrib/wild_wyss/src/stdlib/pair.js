export { Pair }

/**
 * A callback function that selects between two arguments that are given in curried style.
 * Only needed internally for the sake of proper JsDoc.
 * @callback PairSelectorType
 * @template _T_, _U_
 * @pure
 * @type     { <_T_, _U_> (x:_T_) => (y:_U_) => ( _T_ | _U_ ) }
 * @property { () => { next: () => IteratorResult<_T_ | _U_, undefined> } } Symbol.iterator
 */

/**
 * @typedef PairType
 * @type {  <_T_, _U_>
 *      (x: _T_)
 *   => (y: _U_)
 *   => (s: PairSelectorType<_T_, _U_>) => ( _T_ | _U_ ) }
 */
/**
 * A Pair is a {@link Tuple}(2) with a smaller and specialized implementation.
 * Access functions are {@link fst} and {@link snd}. Pairs are immutable.
 * "V" in the SKI calculus, or "Vireo" in the Smullyan bird metaphors.
 * @haskell a -> b -> (a -> b -> a|b) -> a|b
 * @pure    if the selector function is pure, which it usually is
 * @template _T_, _U_
 * @type    { PairType<_T_, _U_> }
 * @constructor
 * @example
 * const values = Pair("Tobi")("Andri");
 * values(fst) === "Tobi";
 * values(snd) === "Andri";
 */
const Pair = x => y => {
  /**
   * @template _T_, _U_
   * @type { PairSelectorType<_T_,_U_> }
   */
  const pair = selector => selector(x)(y);

  pair[Symbol.iterator] = () => [x,y][Symbol.iterator]();
  return pair;
};
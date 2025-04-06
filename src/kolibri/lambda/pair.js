export { Pair }

/**
 * A callback function that selects between two arguments that are given in curried style.
 * Only needed internally for the sake of proper JsDoc.
 * @callback PairSelectorType
 * @pure
 * @template _T_, _U_
 * @type     { <_T_, _U_> (x:_T_) => (y:_U_) => ( _T_ | _U_ ) }
 * @property { () => { next: () => IteratorResult<_T_ | _U_, undefined> } } Symbol.iterator
 */

/**
 * @typedef PairBaseType
 * @template _T_, _U_
 * @type {
 *      (x: _T_)
 *   => (y: _U_)
 *   => (s: PairSelectorType<_T_, _U_>) => ( _T_ | _U_ ) }
 *
 */
/**
 * @typedef PairType
 * @template _T_, _U_
 * @type {  PairBaseType<_T_, _U_> & Iterable<_T_ | _U_> }
 * see {@link Pair}
 */

/**
 * A Pair is a {@link Tuple}(2) with a smaller and specialized implementation.
 * Access functions are {@link fst} and {@link snd}. Pairs are immutable but
 * accessing the values via the _iterator is not totally safe since some malicious
 * programmer could have overridden the iterator_. Accessing via `fst` or `snd` is safe.
 * "V" in the SKI calculus, or "Vireo" in the Smullyan bird metaphors.
 *
 * @constructor
 * @pure
 * @immutable
 * @haskell a -> b -> (a -> b -> a|b) -> a|b
 * @template _T_, _U_
 * @type    { PairType<_T_, _U_> }
 *
 * @example
 * const values = Pair("Tobi")("Andri");
 * values(fst) === "Tobi";
 * values(snd) === "Andri";
 *
 * // a pair is also iterable
 * const [tobi, andri] = values;
 * console.log(tobi, andri);
 * // => Logs '"Tobi", "Andri"'
 */
const Pair = x => y => {
  /**
   * @template _T_, _U_
   * @type { PairType<_T_,_U_> }
   */
  const pair = selector => selector(x)(y);

  pair[Symbol.iterator] = () => [x,y][Symbol.iterator]();
  return pair;
};

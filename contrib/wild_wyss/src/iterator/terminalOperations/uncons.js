import { Pair }    from "../../../../../docs/src/kolibri/stdlib.js";
import { nextOf }  from "../util/util.js";

export { uncons }

/**
 * Removes the first element of this iterator.
 * @function
 * @template _T_
 * @param   { IteratorType<_T_> } iterator
 * @returns { (s: PairSelectorType) => (_T_ |IteratorType<_T_>) }
 * @pure iterator will be copied defensively
 * @example
 * const it     = Iterator(0, inc, stop);
 * const result = uncons(it);
 * const head   = result(fst); // 0
 * const tail   = result(snd); // 1, 2, 3, ...
 */
const uncons = iterator => {
  const inner = iterator.copy();
  const { value } = nextOf(inner);

  return Pair(value)(inner);
};

import { pipe, reduce$, take } from "../../iterator.js";

export { show }

/**
 * Transforms the passed {@link Iterable} to a {@link String}.
 *
 * @template _T_
 * @pure the passed iterable will not be changed.
 * @param { Iterable<_T_> } iterable
 * @param { number }        [maxValues=50] - the amount of elements that should be printed at most
 * @returns { String }
 */
const show = (iterable, maxValues = 50) =>
  "[" +
  pipe(
    take(maxValues),
    reduce$((acc, cur) => acc === "" ? cur : `${acc},${String(cur)}`, ""),
  )(iterable)
  + "]";
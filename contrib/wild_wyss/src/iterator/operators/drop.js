import { nextOf } from "../util/util.js";

export { drop }

/**
 * Jumps over so many elements.
 *
 * @function
 * @template _T_
 * @pure
 * @type {
 *            (count: number)
 *         => IteratorOperation<_T_>
 *       }
 * @example
 * const it      = Iterator(0, inc, stop);
 * const dropped = drop(2)(it);
 */
const drop = count => iterator => {

  /**
   * @type { <_T_>
   *     (start: Number)
   *  => (count: Number)
   *  => (iterator: IteratorType<_T_>)
   *  => IteratorType<_T_>
   * }
   */
  const dropFactory = start => count => iterator => {
    const inner = iterator.copy();

    const next = () => {
      let { done, value } = nextOf(inner);

      while (!done && start++ < count) {
        const n = nextOf(inner);
        done = n.done;
        value = n.value;
      }

      return { done, value }
    };

    return {
      [Symbol.iterator]: () => ({ next }),
      copy: () => dropFactory(start)(count)(inner),
    }
  };
  return dropFactory(0)(count)(iterator);
};

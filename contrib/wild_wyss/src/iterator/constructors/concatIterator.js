import { nextOf } from "../util/util.js";

export { ConcatIterator }

/**
 * Adds the second iterator to the first iterators end.
 * @template _T_
 * @pure it1 and it2 will be copied defensively
 * @type {
 *             (it1: IteratorType<_T_>)
 *          => (it2: IteratorType<_T_>)
 *          => IteratorType<_T_>
 *       }
 * @constructor
 * @example
 * const it1 = Constructors(0, inc, stop);
 * const it2 = Constructors(0, inc, stop);
 * const concatIterator = ConcatIterator(it1)(it2);
 */
const ConcatIterator = it1 => it2 => {
  const inner1 = it1.copy();
  const inner2 = it2.copy();
  let fstDone, sndDone = false;

  const next = () => {
    let result;

    // Note: Two separate if statements required, because if `fstDone` changes its state to true,
    //       the second iterator has to be processed. This can not be solved using if else.
    if (!fstDone) {
      result  = nextOf(inner1);
      fstDone = result.done;
    }

    if (fstDone) {
      result  = nextOf(inner2);
      sndDone = result.done;
    }
    return {
      done:  fstDone && sndDone,
      value: result.value
    }
  };

  const copy = () => ConcatIterator(inner1.copy())(inner2.copy());

  return { [Symbol.iterator]: () => ({ next }), copy, };
};

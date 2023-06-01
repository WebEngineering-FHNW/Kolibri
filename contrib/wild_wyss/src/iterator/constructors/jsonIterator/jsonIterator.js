export { JsonIterator }
import { createMonadicIterable, iteratorOf } from "../../util/util.js";

/**
 *
 * Returns every element of the given JavaScript object.
 * If the passed object is an array, every element of the object is returned.
 * Thw whole object otherwise.
 * @template _T_
 * @param { _T_ | Array<_T_>} json -
 * @returns {IteratorMonadType<_T_>}
 * @constructor
 */
// TODO: Can this be done using varargs?!
const JsonIterator = (...json) => {
  // convert this object to an array.
  const jsonArray = json;

  const jsonIterator = () => {
    const inner = iteratorOf(jsonArray);

    const next = () => inner.next();
    return { next };
  };


  return createMonadicIterable(jsonIterator);
};

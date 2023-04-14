import { Iterator } from "../iterator.js";

export { emptyIterator }

/**
 * This const represents an iterator with no values in it.
 * @template _T_
 * @type { IteratorType<_T_> }
 */
const emptyIterator =
  Iterator(undefined, _ => undefined, _ => true);


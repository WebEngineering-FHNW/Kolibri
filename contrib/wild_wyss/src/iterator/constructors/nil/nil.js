import { Iterator } from "../../iterator.js";

export { nil }

/**
 * This const represents an iterator with no values in it.
 * @template _T_
 * @type { IteratorType<_T_> }
 */
const nil =
  Iterator(undefined, _ => undefined, _ => true);


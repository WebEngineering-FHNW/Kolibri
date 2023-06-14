import { Sequence } from "../../iterator.js";

export { nil }

/**
 * This const represents an iterator with no values in it.
 * @template _T_
 * @type { IteratorMonadType<_T_> }
 */
const nil =
  Sequence(undefined, _ => true, _ => undefined);


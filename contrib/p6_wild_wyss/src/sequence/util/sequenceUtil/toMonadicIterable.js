import { map } from "../../operators/map/map.js"
import { id }  from "../../../../../../docs/src/kolibri/stdlib.js"

export { toMonadicIterable }

/**
 * Casts an arbitrary {@link Iterable} into the {@link SequenceType}.
 * @template _T_
 * @param { Iterable<_T_> } iterable
 * @return { SequenceType<_T_> }
 */
const toMonadicIterable = iterable => map(id)(iterable);

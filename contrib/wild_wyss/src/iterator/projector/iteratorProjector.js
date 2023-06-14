import * as _   from "../iterator.js";
import { dom }  from "../../../../../docs/src/kolibri/util/dom.js";

export { iteratorProjector }

/**
 * Converts a single value of an {@link IteratorType} to an {@link HTMLElement}.
 *
 * @template _T_
 * @callback IteratorValueProjector
 * @param { _T_ } elementToProject
 * @returns HTMLElement
 */

/**
 * Projects an {@link IteratorType} using the given projector for a single value of the iterator.
 * It can be used to add the content of an Sequence to the DOM.
 *
 * @function
 * @template _T_
 * @type {
 *       (iterator: IteratorType<_T_>)
 *    => (valueProjector: IteratorValueProjector<_T_>)
 *    => Element
 *   }
 */
const iteratorProjector = iterator => elementProjector => {
  const [container] = dom(`<div></div>`);
  const mapped = _.map(elementProjector)(iterator);
  container.append(...mapped);
  return container;
};

import * as _  from "../sequence.js";
import { dom } from "../../util/dom.js";

export { sequenceProjector }

/**
 * Converts a single value of a {@link SequenceType} to an {@link HTMLElement}.
 *
 * @template _T_
 * @callback SequenceValueProjector
 * @param { _T_ } elementToProject
 * @returns HTMLElement
 */

/**
 * Projects a {@link SequenceType} using the given projector for a single value of the {@link Iterable}.
 * It can be used to add the content of a Sequence to the DOM.
 *
 * @function
 * @template _T_
 * @type {
 *           (sequence: SequenceType<_T_>)
 *        => (valueProjector: SequenceValueProjector<_T_>)
 *        => Element
 *       }
 */
const sequenceProjector = sequence => elementProjector => {
  const [container] = dom(`<div></div>`);
  const mapped = _.map(elementProjector)(sequence);
  container.append(...mapped);
  return container;
};

import * as _   from "../iterator.js";
import { dom }  from "../../../../../docs/src/kolibri/util/dom.js";

export { iteratorProjector }

const iteratorProjector = iterator => elementProjector => {
  const [container] = dom(`<div></div>`);
  const mapped = _.map(elementProjector)(iterator);
  container.append(...mapped);
  return container;
};

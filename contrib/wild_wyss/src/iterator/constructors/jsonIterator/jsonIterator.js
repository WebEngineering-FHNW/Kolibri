export { JsonIterator }
import {ArrayIterator} from "../arrayIterator/arrayIterator.js";
import {createIterator, nextOf} from "../../util/util.js";

const JsonIterator = json => {
  const inner = ArrayIterator(Array.isArray(json) ? json : [json]);

  const next = () => nextOf(inner);
  const copy = () => JsonIterator(json);

  return createIterator(next, copy);
};

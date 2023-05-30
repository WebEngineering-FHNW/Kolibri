import { pipe, reduce$, take } from "../../iterator.js";

export { show }

const show = (iterator, maxValues = 50) =>
  "[" +
  pipe(
    take(maxValues),
    reduce$((acc, cur) => acc === "" ? cur : `${acc},${String(cur)}`, ""),
  )(iterator)
  + "]";
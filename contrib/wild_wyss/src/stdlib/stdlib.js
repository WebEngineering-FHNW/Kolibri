export { catMaybes }
/**
 * The catMaybes function takes a list of Maybes and returns a list of all the Just values.
 *
 * @template _T_
 * @template _U_
 * @haskell [Maybe a] -> [a]
 * @param  { Array<JustXType<_T_, _U_> | NothingXType<_T_, _U_>> } maybes
 * @return { Array<_T_> }
 */
const catMaybes = maybes => {
  const result = [];
  for (const maybe of maybes) {
    maybe(_ => _)(val => result.push(val));
  }
  return result;
};

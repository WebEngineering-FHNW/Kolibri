export { catMaybes, choiceMaybe }

/**
 * The catMaybes function takes a list of Maybes and returns a list of all the Just values.
 *
 * @template _T_
 * @template _U_
 * @haskell [Maybe a] -> [a]
 * @param  { Array<MaybeType<_T_, _U_>> } maybes
 * @returns { Array<_T_> }
 */
const catMaybes = maybes => {
  const result = [];
  for (const maybe of maybes) {
    maybe(_ => _)(val => result.push(val));
  }
  return result;
};


/**
 * Chooses between the two given Maybe values.
 * If the first is a {@link JustXType} it will be returned,
 * otherwise the second value will be returned.
 *
 * @type {<_T_>
 *      (maybe1: MaybeType<_T_>)
 *   => (maybe2: MaybeType<_T_>)
 *   => MaybeType<_T_>
 * }
 *
 * @example
 * const just    = Just(1);
 * const nothing = Nothing;
 *
 * const choice1 = choiceMaybe(just)(nothing)
 * const choice2 = choiceMaybe(nothing)(just)
 * console.log(choice1 === just && choice2 === just);
 * // => Logs 'true'
 */
const choiceMaybe = maybe1 => maybe2 =>
  maybe1
    (_ => maybe2)
    (_ => maybe1);
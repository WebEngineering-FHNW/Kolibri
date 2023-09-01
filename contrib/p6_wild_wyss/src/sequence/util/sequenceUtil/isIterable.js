export { isIterable }

/**
 * Checks if a given value is an {@link Iterable}.
 * @param { any } value
 * @return { boolean }
 */
const isIterable = value => value && value[Symbol.iterator] !== undefined;
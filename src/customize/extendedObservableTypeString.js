/**
 * @module customize/extendedObservableTypeString
 *
 * This is the place where you can extend the {@link ObservableTypeString } type by
 * providing more "known strings" that are used as keys in an {@link AttributeType}
 * to reference further {@link IObservable observables} without
 * the need to modify Kolibri core.
 *
 * These extensions should be chosen with care.
 * They extend _all_ attributes.
 * Choose those extensions that are useful for a wide range of attributes - not just one.
 * A common misconception is to extend a single attribute with many type strings where
 * the alternative of just having so-many observables would be more appropriate.
 *
 * A good reason to provide extensions could be that all so defined observables
 * need to kept in sync by means of the attribute's qualifier.
 *
 * The provided "sample" is just for showing what to do.
 */

export { SAMPLE }

/**
 * @typedef {'sample' } ExtendedObservableTypeString
 * Feel free to extend this type with new unique type strings as needed for your application.
 * Make sure that it does not clash with names in {@link ObservableTypeString }.
 */

/** @type ExtendedObservableTypeString */ const SAMPLE           = "sample";

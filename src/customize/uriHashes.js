/**
 * Use this module to define a type for each URI hash in your application
 * that serves as a target for a page that the user can navigate to.
 */
export {
    href,
    URI_HASH_EMPTY,
    URI_HASH_HOME,
    URI_HASH_UNSTYLED,
    URI_HASH_MASTER_DETAIL
}

/**
 * @typedef {
 *        "#empty"
 *      | "#home"
 *      | "#unstyled"
 *      | "#masterDetail"
 *      }  UriHashType
 * UriHashes must be unique, start with a hash character and be formatted like in proper URIs.
 */

/** @type { UriHashType } */ const URI_HASH_EMPTY         = "#empty"; // should always be available
/** @type { UriHashType } */ const URI_HASH_HOME          = "#home";  // should always be available
/** @type { UriHashType } */ const URI_HASH_UNSTYLED      = "#unstyled";
/** @type { UriHashType } */ const URI_HASH_MASTER_DETAIL = "#masterDetail";

/**
 * Typesafe creation of link hrefs. One cannot create hrefs if the uriHash is not registered by type.
 * @param  { UriHashType } uriHash
 * @return { String } - a properly formatted HTML href attribute
 * @example
 * `<a ${href(URI_HASH_HOME)}> Home </a>` // error marker if not known
 */
const href = uriHash => ` href="${uriHash}" `;


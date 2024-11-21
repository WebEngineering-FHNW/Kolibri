
export {
    href,
    URI_HASH_HOME,
    URI_HASH_ERROR,
    URI_HASH_ABOUT
}

/**
 * @typedef { "#" | "#E404" | "#about" } UriHashType
 * UriHashes must be unique, start with a hash character and be formatted like in proper URIs.
 */

/** @type { UriHashType } */ const URI_HASH_HOME  = "#";
/** @type { UriHashType } */ const URI_HASH_ERROR = "#E404";
/** @type { UriHashType } */ const URI_HASH_ABOUT = "#about";

/**
 * Typesafe creation of link hrefs. One cannot create hrefs if the uriHash is not registered by type.
 * @param  { UriHashType } uriHash
 * @return { String } - a properly formatted HTML href attribute
 * @example
 * href(URI_HASH_HOME); //
 */
const href = uriHash => ` href="${uriHash}" `;


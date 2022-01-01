export { release, dateStamp, versionInfo, clientId }

const release     = "0.1.34";

const dateStamp   = "2022-01-02 T 00:22:51 MEZ";

const versionInfo = release + " at " + dateStamp;

const stamp       = () => Math.random().toString(36).slice(2).padEnd(11,"X").slice(0,11);
/**
 * An constant random string of 22 lowercase characters/digits, probability: 1 of 36 ** 22 > 1.7e+34,
 * generated at construction time.
 * @type {string}
 */
const clientId    = stamp() + stamp();

export { release, dateStamp, versionInfo, clientId }

const release     = "0.1.48";

const dateStamp   = "2022-10-19 T 14:34:59 MESZ";

const versionInfo = release + " at " + dateStamp;

const stamp       = () => Math.random().toString(36).slice(2).padEnd(11,"X").slice(0,11);

/**
 * A constant random string of 22 lowercase characters/digits, probability: 1 of 36 ** 22 > 1.7e+34,
 * generated at construction time.
 * The typical use case is to identify the client in a team application / multi-user environment
 * such that value changes can be properly attributed and conflicts can be avoided.
 * @type { String }
 */
const clientId    = stamp() + stamp();


export {
    LOG_CONTEXT_KOLIBRI_BASE,
    LOG_CONTEXT_KOLIBRI_TEST,
    LOG_CONTEXT_All
}

/**
 * Constant for the log context that is used as the basis for all Kolibri-internal logging.
 * @type { String } */
const LOG_CONTEXT_KOLIBRI_BASE = "ch.fhnw.kolibri";

/**
 * Constant for the log context that is used for all Kolibri-internal testing.
 * @type { String } */
const LOG_CONTEXT_KOLIBRI_TEST = LOG_CONTEXT_KOLIBRI_BASE + ".test";

/**
 * Constant for the log context that logs for all contexts.
 * @type { String } */
const LOG_CONTEXT_All = "";

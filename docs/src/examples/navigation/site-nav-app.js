import { SiteController }                                 from "../../kolibri/navigation/siteController.js";
import { Observable}                                       from "../../kolibri/observable.js";
import { HomePage, URI_HASH_HOME}                                 from "./pages/home.js";
import { AboutPage, URI_HASH_ABOUT}                                 from "./pages/about.js";

/**
 * @typedef UriHash
 * @type { "#" | "#E404" | "#about" }
 * UriHashes must be unique start with a hash character and be formatted like in proper URIs.
 */

/** @type { UriHash } */ const URI_HASH_ERROR = "#E404";

const SiteModel = () => {
    const allPages = {
        [URI_HASH_HOME]  : HomePage(),
        [URI_HASH_ERROR] : E404PageController( ),
        [URI_HASH_ABOUT] : AboutPage,
    };
    const activeUriHashObs  = Observable(URI_HASH_HOME);
    return {
        allPages,
        activeUriHashObs,
    }
};

const siteModel = SiteModel();
const siteController = SiteController(siteModel);

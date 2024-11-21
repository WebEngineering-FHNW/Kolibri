import { SiteController }                                 from "../../kolibri/navigation/siteController.js";
import { Observable}                                      from "../../kolibri/observable.js";
import { HomePage  }                                      from "./pages/home.js";
import { AboutPage }                                      from "./pages/about.js";
import {URI_HASH_HOME, URI_HASH_ABOUT, URI_HASH_ERROR}    from "./pages/uriHashes.js";



const SiteModel = () => {
    const allPages = {
        [URI_HASH_HOME]  : HomePage(),
        // [URI_HASH_ERROR] : E404PageController(),
        [URI_HASH_ABOUT] : AboutPage(),
    };
    const activeUriHashObs  = Observable(URI_HASH_HOME);
    return {
        allPages,
        activeUriHashObs,
    }
};

const siteModel = SiteModel();
const siteController = SiteController(siteModel);
siteController.gotoUriHash(URI_HASH_HOME);


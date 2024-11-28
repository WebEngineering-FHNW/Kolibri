import { SiteController }                from "../../../kolibri/navigation/siteController.js";
import { defaultConsoleLogging }         from "../../../kolibri/logger/loggingSupport.js"; // allow console manipulation
import { HomePage  }                     from "./home.js";
import { AboutPage }                     from "./unstyled.js";
import { URI_HASH_HOME, URI_HASH_ABOUT } from "../../../customize/uriHashes.js";
import { SimpleNavigationProjector } from "../../../kolibri/navigation/projector/simple/simpleNavigationProjector.js";
import { SiteProjector }             from "../../../kolibri/navigation/projector/siteProjector.js";

// defaultConsoleLogging("ch.fhnw.kolibri", LOG_INFO);
defaultConsoleLogging("ch.fhnw.kolibri.navigation", LOG_DEBUG);

const siteController = SiteController();
const siteProjector  = SiteProjector(siteController);

siteController.registerPage(URI_HASH_HOME,  HomePage());
siteController.registerPage(URI_HASH_ABOUT, AboutPage());

SimpleNavigationProjector(siteController, siteProjector.sideNavigationElement);
SimpleNavigationProjector(siteController, siteProjector.topNavigationElement);

siteController.gotoUriHash(window.location.hash);


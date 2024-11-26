import { SiteController }                                 from "../../kolibri/navigation/siteController.js";
import { defaultConsoleLogging }                          from "../../kolibri/logger/loggingSupport.js"; // allow console manipulation
import { HomePage  }                     from "./home.js";
import { AboutPage }                     from "./about.js";
import { URI_HASH_HOME, URI_HASH_ABOUT } from "./uriHashes.js";
import { BasicNavigationProjector }      from "../../kolibri/navigation/projector/basicNavigationProjector_new.js";
import {SiteProjector}                                    from "./siteProjector.js";

// defaultConsoleLogging("ch.fhnw.kolibri", LOG_INFO);
defaultConsoleLogging("ch.fhnw.kolibri.navigation", LOG_DEBUG);

const siteController = SiteController();
const siteProjector  = SiteProjector(siteController);

siteController.registerPage(URI_HASH_HOME,  HomePage());
siteController.registerPage(URI_HASH_ABOUT, AboutPage());

BasicNavigationProjector(siteController, siteProjector.sideNavigationElement);
BasicNavigationProjector(siteController, siteProjector.topNavigationElement);

siteController.gotoUriHash(URI_HASH_HOME);


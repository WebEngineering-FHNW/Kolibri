import { SiteController }                           from "../../../kolibri/navigation/siteController.js";
import { defaultConsoleLogging }                    from "../../../kolibri/logger/loggingSupport.js"; // allow console manipulation
import { SimpleNavigationProjector }                from "../../../kolibri/navigation/projector/simple/simpleNavigationProjector.js";
import { SiteProjector }                            from "../../../kolibri/navigation/projector/siteProjector.js";
import { HomePage  }                                from "./home.js";
import { UnstyledPage }                             from "./unstyled.js";
import { MasterDetailPage }                         from "./masterDetailPage.js";
import {
        URI_HASH_HOME,
        URI_HASH_MASTER_DETAIL,
        URI_HASH_UNSTYLED
}                                                   from "../../../customize/uriHashes.js";
import {ICON_HOUSE, ICON_PLUS_MINUS, ICON_TERMINAL} from "../../../customize/icons.js";

defaultConsoleLogging("ch.fhnw.kolibri", LOG_INFO);

const siteController = SiteController();
const siteProjector  = SiteProjector(siteController);

siteController.registerPage(URI_HASH_HOME,          HomePage());
siteController.registerPage(URI_HASH_UNSTYLED,      UnstyledPage());
siteController.registerPage(URI_HASH_MASTER_DETAIL, MasterDetailPage());

const hash2icon = /** @type { Object } */{
    [URI_HASH_HOME]             : ICON_HOUSE,
    [URI_HASH_UNSTYLED]         : ICON_TERMINAL,
    [URI_HASH_MASTER_DETAIL]    : ICON_PLUS_MINUS,
};
const noIcons = /** @type { Object } */ {}; // pass to avoid icons in the navigation

siteProjector.sideNavigationElement.append(...SimpleNavigationProjector(siteController, hash2icon, true));
siteProjector.topNavigationElement .append(...SimpleNavigationProjector(siteController, noIcons,   false));

siteController.gotoUriHash(window.location.hash);


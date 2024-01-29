import { NavigationController }                                 from "../../kolibri/navigation/navigationController.js";
import { SideNavigationProjector }                              from "../../kolibri/navigation/projector/sideNavigation/sideNavigationProjector.js";
import { registerSiteMap, resourceBaseURI, setResourceBaseURI } from "../../kolibri/navigation/applicationConfig.js";

// where all the resources reside relative to the home URL.
setResourceBaseURI("../../../");

const navigationController = NavigationController();
navigationController.setWebsiteLogo(resourceBaseURI + 'img/logo/logo.svg');
navigationController.setWebsiteName('Basic Navigation');

// this must come first since the nav registrations triggers the repaint
SideNavigationProjector(navigationController, document.getElementById("nav"));

registerSiteMap(null /* no parent at start */, navigationController,
    [
        {
            name:  "all",
            icon:  resourceBaseURI + "img/icons/house.svg",  // override naming convention
            pages: [
                {
                    home:  true,
                    name:  "home",
                    file:  './pages/static/home.html',
                    style: './pages/static/home.css',
                },
                {
                    name:  "about",
                    file:  './pages/static/about.html',
                    style: './pages/static/about.css'
                },
            ]
        }
    ]
);

import {NavigationController}                                 from "../../kolibri/navigation/navigationController.js";
import {DashboardRefinedProjector}                            from "../../kolibri/navigation/projector/dashboard/dashboardNavigationProjector.js";
import {registerSiteMap, resourceBaseURI, setResourceBaseURI} from "../../kolibri/navigation/applicationConfig.js";

// where all the resources reside relative to the home URL.
setResourceBaseURI("../../../");

const navigationController = NavigationController();
navigationController.setWebsiteLogo(resourceBaseURI + 'img/logo/logo.svg');
navigationController.setWebsiteName('Basic Navigation');

// this must come first since the nav registrations triggers the repaint
DashboardRefinedProjector(navigationController, document.getElementById("nav"));

registerSiteMap(null /* no parent at start */, navigationController,
    [
        {
            name:  "all",
            icon:  resourceBaseURI + "img/icons/house.svg",  // override naming convention
            pages: [
                {
                    name: "home",
                    file: './pages/static/home.html',
                    home: true,
                },
                {
                    name: "about",
                    file: './pages/static/about.html'
                },
            ]
        }
    ]
);

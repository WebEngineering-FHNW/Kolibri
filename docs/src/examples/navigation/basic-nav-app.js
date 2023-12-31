import {PageController}       from "../../kolibri/navigation/pageController.js";
import {StaticPageProjector}  from "../../kolibri/navigation/projector/page/staticPageProjector.js";
import {NavigationController} from "../../kolibri/navigation/navigationController.js";
import {NavigationProjector}  from "../../kolibri/navigation/projector/basicNavigationProjector.js";
import {DashboardRefinedProjector} from "../../kolibri/navigation/projector/dashboard/dashboardNavigationProjector.js";

// pages that will be displayed as content

const homePageController = PageController("home", null);
homePageController.setIconPath('../../../img/icons/house.svg');
StaticPageProjector(
    /** @type { !PageControllerType } */ homePageController,
    document.getElementById("content"),
    './pages/static/home.html');


const aboutPageController = PageController("about", null);
aboutPageController.setIconPath('../../../img/icons/cute-robot.svg');
StaticPageProjector(
    aboutPageController,
    document.getElementById("content"),
    './pages/static/about.html');

// navigation

const navigationController = NavigationController();
navigationController.setWebsiteLogo('../../../img/logo/logo.svg');
navigationController.setWebsiteName('Basic Navigation');


DashboardRefinedProjector(navigationController, document.getElementById("nav"));

navigationController.addPageControllers(
    homePageController,
    aboutPageController
);

navigationController.setHomeLocation(homePageController);

// for later: more visualizations of the navigation
// const pinToBreadCrumbElement = document.getElementById('bread-crumbs');
// BreadCrumbProjector(navigationController, pinToBreadCrumbElement);


/**
 * If you'd like you can add our debugger below to your application to observe and alter some of your pages attributes
 */

// const pinToDebugElement = document.getElementById("debug");
//
// const debugPageController = PageController("debug", null);
// debugPageController.setIconPath('./pages/icons/bug.svg');
// debugPageController.setVisible(false);
// DebugPageProjector(navigationController, debugPageController, pinToDebugElement);
// navigationController.addPageControllers(debugPageController);
// navigationController.setDebugMode(true);


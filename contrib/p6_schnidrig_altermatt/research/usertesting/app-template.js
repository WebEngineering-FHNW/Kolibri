import { PageController }                 from "../../prototype/pages/pageController.js";
// import { NavigationController }           from "../../prototype/navigation/navigationController.js";
import { PageProjector }                  from "./pages/pageProjector/pageProjector.js";
import { DebugPageProjector }             from "./pages/debug/debugPageProjector.js";
import { NavigationProjector }            from "./navigations/bubble-state/bubblestateNavigationProjector.js";
import { BreadCrumbProjector }            from "./navigations/bread-crumbs/breadCrumbProjector.js";

/**
 * We want to create a small single page application (SPA). The following steps should guide you on how to create an SPA
 * with Kolibri.
 *
 * 1. Create a homepage for your website
 */

/*
 You can find this div element in the index.html
 The currently active pages content will get rendered into that div
 */
const pinToContentElement = document.getElementById("content");

/*
 The first thing we want to do for our little SPA is to create a page we can view.
 As seen in the USERTEST.md we can do that by creating a PageController.
 The code below will give us a PageController, but we need a name for our homepage.
 */
const homePageController = PageController("home", null); //@TODO remove "home"

/*
 Now we want to set an icon for our homePageController. A fitting icon would be a house icon which can be found under
 the following path: './pages/icons/house.svg'
 */
// your code here
homePageController.setIconPath('./pages/icons/house.svg'); //@TODO remove

/*
 The last step to get our page would be to call a PageProjector with our PageController, a PinToElement and the path
 to the HTML of our page. We have already created an HTML file for you under './pages/home.html' which you can use.
 */
// your code here
PageProjector(homePageController, pinToContentElement, './pages/home.html'); //@TODO remove


/**
 * 2. Create a navigation for our SPA
 */

/*
 We previously had a pinToContentElement which we had in the index.html file. Now we need an element to pin our
 navigation to as well. Go to the 'index.html' file and check if you can find a div we could use for that.
 */
// your code here
const pinToNavElement = document.getElementById("nav"); //@TODO remove

/*
 Now we want to create our NavigationController for our SPA.
 */
// your code here
const navigationController = NavigationController(); //@TODO remove

/*
 To add our navigation to our SPA we need to give our NavigationController and the pinToElement to our NavigationProjector.
 We have already created a BubbleStateNavigationProjector which you can use. You previously saw in the USERTEST.md how you
 have to do that.
 */
// your code here
NavigationProjector(navigationController, pinToNavElement); //@TODO remove

const pinToBreadCrumbElement = document.getElementById('bread-crumbs'); //@TODO remove
BreadCrumbProjector(navigationController, pinToBreadCrumbElement); //@TODO remove

/**
 * 3. Add your homepage to your navigation
 */

/*
 The last step is now to connect our page to our navigation so that we are able to navigate to our page. This is
 achievable by adding your PageController to your NavigationController.
 */
// your code here
navigationController.addPageControllers(homePageController); // @TODO remove

/**
 * 4. More content is needed
 *
 * An SPA with only one page to navigate to is pretty boring and makes the navigation redundant because who needs a
 * navigation if there is no other place to go too?
 */

/*
 You have learned how to create a page and how to add this page to your navigation. Your next task is so create a new
 page to your existing SPA. We have prepared an 'about.html' file for you which you can add.
 */
// your code here

const aboutPageController = PageController("about", null); //@TODO remove
aboutPageController.setIconPath('./pages/icons/cute-robot.svg'); //@TODO remove
PageProjector(aboutPageController, pinToContentElement, './pages/about.html'); //@TODO remove

navigationController.addPageControllers(aboutPageController); //@TODO remove

/**
 * 5. Wouldn't it be fun to add a breadcrumb feature to our SPA now?
 *
 * We have prepared a BreadCrumbProjector which you can add. But there is one important thing you have to know first.
 * A NavigationProjector needs to be initialized before the navigation points get added to the NavigationController.
 * Therefor you need to add the BreadCrumbProjector right below the BubbleStateNavigationProjector. And keep in mind,
 * we always need an element to bind a navigation to in the index.html
 */

/**
 * 6. Create a page on your own
 *
 * We have nearly reached the end of our user test.
 * Now, if you'd like, you can try to add a custom page to your SPA or explore what kind of functionality we haven't
 * explored yet. Maybe you can set a default homepage, so you get redirected to a page when entering the website without
 * a hash. Hint: Check out what functions can be called on the navigationController.
 */

navigationController.setHomePage(homePageController.getHash());

/**
 * 7. Way more content and features to explore
 *
 * Good job! You have successfully built an SPA with Kolibri.
 * As you can imagine, there are tons of other features and functionalities in Kolibri and in the Kolibri Navigation alone
 * to explore. Feel free to experiment with the toolkit if you like. But this would be it for our dev user test. We hope
 * you have enjoyed it and would like to thank you for taking that time. It really helped us! :)
 */

/**
 * If you'd like you can add our debugger below to your application to observe and alter some of your pages attributes
 */

const pinToDebugElement = document.getElementById("debug");

const debugPageController = PageController("debug", null);
debugPageController.setIconPath('./pages/icons/bug.svg');
debugPageController.setVisible(false);
DebugPageProjector(navigationController, debugPageController, pinToDebugElement);
navigationController.addPageControllers(debugPageController);
navigationController.setDebugMode(true);


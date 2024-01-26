/**
 * @module navigation/ApplicationConfig
 * A singleton to capture base configuration data that is needed throughout the navigation layer.
 */

import {PageController}      from "./pageController.js";
import {StaticPageProjector} from "./projector/page/staticPageProjector.js";

export { setResourceBaseURI, resourceBaseURI, registerSiteMap }

let   resourceBaseURI = "./";
const setResourceBaseURI = uri => resourceBaseURI = uri;

const registerSiteMap = (parentController, navigationController, pages) => {
    if (!pages) return;
    pages.forEach(page => {
        const pageController = PageController(page.name, null);
        navigationController.addPageController(pageController);
        pageController.setParent(parentController);
        if (page.home) {
            navigationController.setHomeLocation(pageController);
        }
        pageController.setIconPath(page.icon ?? `${resourceBaseURI}img/icons/${page.name}.svg`);
        if (page.file) {
            StaticPageProjector(
                /** @type { !PageControllerType } */ pageController,
                document.getElementById("content"),
                page.file,
                page.style);
        }
        registerSiteMap(pageController, navigationController, page.pages);
    });
};

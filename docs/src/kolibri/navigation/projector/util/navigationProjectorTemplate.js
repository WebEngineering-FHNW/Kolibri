import { ObservableList } from "../../../observable.js";
import { dom }            from "../../../util/dom.js";

export { NavigationProjector }

/**
 * @typedef NavigationProjectorType
 */

/**
 * @constructor
 * @param { !NavigationControllerType } controller
 * @param { !HTMLDivElement } pinToElement
 * @return { NavigationProjectorType }
 * @example
 * const navigationController = NavigationController();
 * NavigationProjector(navigationController, pinToNavElement);
 */
const NavigationProjector = (controller, pinToElement) => {
    const positionWrapper = pinToElement;
    const observableNavigationAnchors = ObservableList([]);
    const navigationAnchors = [];

    /**
     * Initializes a navigation anchor
     *
     * @function
     * @param { !String } hash - the hash that represents the identifier of a page
     * @param { !String } pageName - the pageName that is displayed for this hash
     * @return { HTMLAnchorElement }
     *
     */
    const initializeNavigationPoint = (hash, pageName) => {
        // Initialize your navigation anchors here...

        // initialize anchor
        const [anchor] = dom(`
            <a href="${hash}">${pageName}</a>
        `);

        return anchor;
    };

    /**
     * Binds the navigation anchors to the DOM.
     *
     * @function
     * @return void
     */
    const projectNavigation = () => {
        const navigationDiv = document.createElement("div");
        navigationDiv.classList.add("your-navigation-class");

        navigationAnchors.forEach(anchor => {
            // insert your projector code here...
            navigationDiv.append(anchor);
        });

        if (positionWrapper.firstChild === null) {
            positionWrapper.appendChild(navigationDiv)
        } else {
            positionWrapper.replaceChild(navigationDiv, positionWrapper.firstChild);
        }
    };

    observableNavigationAnchors.onAdd(anchor => {
        controller.registerAnchorClickListener(anchor);
        navigationAnchors.push(anchor);
    });

    controller.onWebsiteNameChanged(newWebsiteName => {
        // add website name anywhere to website
    });

    controller.onWebsiteLogoChanged(newWebsiteLogoSrc => {
        // add logo anywhere to website
    });

    controller.onFavIconChanged(newFavIconSrc => {
        // add favicon to website
    });

    controller.onLocationAdded( location => {
        const pageController = location;
        const pageName = pageController.getValue();
        const newNavPoint = initializeNavigationPoint(location.getHash(), pageName);
        observableNavigationAnchors.add(newNavPoint);

        // CREATE BINDINGS
        // pageController.onSomethingChanged(changedValue => {
        //      do something with binding
        //});
        // END

        projectNavigation();
    });
};

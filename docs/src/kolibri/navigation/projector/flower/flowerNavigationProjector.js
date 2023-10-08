import { ObservableList } from "../../../kolibri/observable.js";
import { dom } from "../../../kolibri/util/dom.js";

export { NavigationProjector as FlowerNavigationProjector }

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
 * DashboardNavigationProjector(navigationController, pinToNavElement);
 */


const NavigationProjector = (controller, pinToElement) => {
    const positionWrapper = pinToElement;
    const observableNavigationAnchors = ObservableList([]);
    const navigationAnchors = [];
    const anchorListWrappers = {};
    const arrowSVGPathRelativeIndex = "../navigation/icons/plus.svg";

    /**
     * Initializes a navigation anchor
     *
     * @function
     * @param { !String } qualifier - the unique qualifier for this navigation point
     * @param { !String } hash - the hash that represents the identifier of a page
     * @param { !String } icon - the icon that is displayed for this navigation point.
     * @return { HTMLAnchorElement }
     *
     */
    const initializeNavigationPoint = (qualifier, hash, icon) => {
        // initialize anchor
        const [navPoint] = dom(`
            <span id="${qualifier}">
                <a class="list" href="${hash}">
                    <img src="${icon}" alt="qualifier-icon" class="icon">
                </a>
            </span>
        `);

        // get anchor from collection
        const anchor = navPoint.getElementsByTagName('a')[0];

        anchorListWrappers[qualifier] = navPoint;

        return anchor;
    };

    /**
     * Binds the navigation anchors to the DOM.
     *
     * @function
     * @return void
     */
    const projectNavigation = () => {
        const [styleTag, navigation] = dom(`
            <style id="flower-nav-styles"></style>
            <nav id="flower-nav-wrapper-element">
                <div id="flowerNavPointWrapper" class="navigation">
                    <div class="toggle" onclick="document.getElementById('flower-nav-wrapper-element').classList.toggle('open')">
                        <img src=${arrowSVGPathRelativeIndex} class="icon" alt="open toggle">
                    </div>
                    <!-- anchors come here -->
                </div>
            </nav>
        `);

        let i = 1;
        navigationAnchors.forEach(anchor => {
            const pageController = controller.getPageController(anchor.hash);
            const isNavigational = pageController.isNavigational();
            const isVisible = pageController.isVisible();

            if(isNavigational && isVisible) {
                const navigationPointName = anchor.hash.substring(1);
                const navPoint = anchorListWrappers[navigationPointName];
                navPoint.setAttribute('style',`--i:${i};`);
                navigation.querySelector('#flowerNavPointWrapper').append(navPoint);
                i++;
            }
        });

        const dynamicIndicatorStyle = `
                    nav.open .navigation span {
                        transform: rotate(calc(315deg + (var(--i) - 1) * 180deg / ${i - 2})) translateY(120px);
                        opacity: 1;
                    }
                    
                    nav .navigation span a img {
                        transform: rotate(calc(0deg - (var(--i) - 1) * (180deg / ${i - 2})));
                        opacity: 0.8;
                        transition: 0.2s;
                    }
                `;
        styleTag.append(dynamicIndicatorStyle);

        positionWrapper.replaceChildren(styleTag, navigation);
    };

    observableNavigationAnchors.onAdd(anchor => {
        controller.registerAnchorClickListener(anchor);
        navigationAnchors.push(anchor);
    });

    controller.onNavigationHashAdd(hash => {
        const pageController = controller.getPageController(hash);
        const qualifier = pageController.getQualifier();
        const icon = pageController.getIconPath();
        const newNavPoint = initializeNavigationPoint(qualifier, hash, icon);
        observableNavigationAnchors.add(newNavPoint);

        // CREATE BINDINGS TO MODEL
        pageController.onActiveChanged(active => {
            setActiveCSSClass(qualifier, hash, active);
            setPageTitle(hash, active);
        });

        pageController.onVisitedChanged(visited => {
            setVisitedCSSClass(hash, visited);
        });

        pageController.onNavigationalChanged(() => projectNavigation());

        pageController.onVisibleChanged(() => projectNavigation());

        pageController.onIconPathChanged(newIcon => {
            setIconSource(hash, newIcon);
        });

        pageController.onValueChanged(newValue => {
            setPageTitle(newValue, pageController.isActive());
        });
        // END

        projectNavigation();
    });

    /* ********************* Utility functions for bindings ***************************** */
    /**
     * A utility function that sets the active CSS class for the given hash
     * and removes the class from the old active hash.
     *
     * @function
     * @param { !String } qualifier
     * @param { !String } hash
     * @param { !Boolean } active
     */
    const setActiveCSSClass = (qualifier, hash, active) => {
        if (active) {
            if (undefined !== anchorListWrappers[qualifier]) {
                anchorListWrappers[qualifier].getElementsByTagName('a')[0].classList.add("active");
            }
        } else {
            if (undefined !== anchorListWrappers[qualifier]) {
                anchorListWrappers[qualifier].getElementsByTagName('a')[0].classList.remove("active");
            }
        }
    };

    /**
     * A utility function that sets the HTML title attribute to the value of the page identified by hash.
     *
     * @function
     * @param { !String } pageName
     * @param { !Boolean } active
     */
    const setPageTitle = (pageName, active) => {
        if (active) {
            const title = document.getElementsByTagName("title")[0];
            title.innerText = pageName;
        }
    };

    /**
     * A utility function that sets the visited CSS class for the given hash.
     *
     * @function
     * @param { !String } hash
     * @param { !Boolean } visited
     */
    const setVisitedCSSClass = (hash, visited) => {
        if (visited) {
            const anchor = navigationAnchors.find(a => a.hash === hash);
            if (undefined !== anchor) {
                anchor.classList.add("visited");
            }
        } else {
            const anchor = navigationAnchors.find(a => a.hash === hash);
            if (undefined !== anchor) {
                anchor.classList.remove("visited");
            }
        }
    };

    /**
     * A utility function that sets the icon source for the given hash to newIcon.
     *
     * @function
     * @param { !String } hash
     * @param { !String } newIcon
     */
    const setIconSource = (hash, newIcon) => {
        const anchor = navigationAnchors.find(a => a.hash === hash);
        if(undefined !== anchor) {
            const imageToReplace = anchor.getElementsByTagName('img')[0];
            if (null !== imageToReplace) {
                imageToReplace.setAttribute('src', newIcon);
            }
        }
    };
};

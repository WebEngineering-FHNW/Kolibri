import { ObservableList } from "../../../../prototype/kolibri/observable.js";
import { dom } from "../../../../prototype/kolibri/util/dom.js";

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
 * DashboardNavigationProjector(navigationController, pinToNavElement);
 */


const NavigationProjector = (controller, pinToElement) => {
    const positionWrapper = pinToElement;
    const observableNavigationAnchors = ObservableList([]);
    const navigationAnchors = [];
    const anchorListWrappers = {};

    /**
     * Initializes a navigation anchor
     *
     * @function
     * @param { !String } qualifier - the unique qualifier for this navigation point
     * @param { !String } hash - the hash that represents the identifier of a page
     * @param { !String } pageName - the pageName that is displayed for this hash
     * @return { HTMLAnchorElement }
     *
     */
    const initializeNavigationPoint = (qualifier, hash, pageName) => {
        // initialize anchor
        const [navPoint] = dom(`
            <li class="list" id="${qualifier}">
                <a href="${hash}">
                    <span class="icon" id="${qualifier}-icon-wrapper">
                        <img class="icon" id="${qualifier}-icon" alt="${qualifier}-icon">
                    </span>
                    <span class="text" id="${qualifier}-name">${pageName}</span>
                </a>
            </li>
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
            <style id="bubble-state-nav-styles"></style>
            <div id="bubble-state-nav-wrapper">
                <div id="bubbleStateWrapper" class="bubble-state-nav">
                    <ul id="bubbleStateNavPointWrapper">
                        <!-- Placeholder for navigation li elements and indicator -->
                    </ul>
                </div>
            </div>
        `);

        let i = 1;
        navigationAnchors.forEach(anchor => {
            const pageController = controller.getPageController(anchor.hash);
            const isNavigational = pageController.isNavigational();
            const isVisible = pageController.isVisible();

            if(isNavigational && isVisible) {
                const navigationPointName = anchor.hash.substring(1);
                const navPoint = anchorListWrappers[navigationPointName];
                const dynamicIndicatorStyle = `
                    .bubble-state-nav ul li:nth-child(${i}).active ~.indicator {
                        transform: translateX(calc(70px * ${i-1}));
                    }
                `;
                styleTag.append(dynamicIndicatorStyle);
                navigation.querySelector('#bubbleStateNavPointWrapper').append(navPoint);
                i++;
            }
        });

        // Add styling for indicator
        const head = document.getElementsByTagName('head')[0];
        const documentStyles = document.getElementById('bubble-state-nav-styles');
        if (null === documentStyles) {
            head.append(styleTag);
        } else {
            head.replaceChild(styleTag, documentStyles);
        }

        const [indicator] = dom(`<div class="indicator"></div>`);
        navigation.querySelector('#bubbleStateNavPointWrapper').append(indicator);
        positionWrapper.replaceChildren(navigation);
    };

    observableNavigationAnchors.onAdd(anchor => {
        controller.registerAnchorClickListener(anchor);
        navigationAnchors.push(anchor);
    });

    controller.onNavigationHashAdd(hash => {
        const pageController = controller.getPageController(hash);
        const qualifier = pageController.getQualifier();
        const pageName = pageController.getValue();
        const newNavPoint = initializeNavigationPoint(qualifier, hash, pageName);
        observableNavigationAnchors.add(newNavPoint);

        // CREATE BINDINGS TO MODEL
        pageController.onActiveChanged(active => {
           setActiveCSSClass(qualifier, hash, active);
           setPageTitle(hash, active);
           handleIndicatorVisibility(hash, active);
        });

        pageController.onVisitedChanged(visited => {
            setVisitedCSSClass(hash, visited);
            projectNavigation();
        });

        pageController.onNavigationalChanged(() => projectNavigation());

        pageController.onVisibleChanged(() => projectNavigation());

        pageController.onIconPathChanged(newIcon => {
            setIconSource(hash, newIcon);
        });

        pageController.onValueChanged(newValue => {
            setNavpointName(qualifier, hash, newValue);
            setPageTitle(hash, pageController.isActive());
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
                anchorListWrappers[qualifier].classList.add("active");
            }
        } else {
            if (undefined !== anchorListWrappers[qualifier]) {
                anchorListWrappers[qualifier].classList.remove("active");
            }
        }
    };

    /**
     * A utility function that sets the HTML title attribute to the value of the page identified by hash.
     *
     * @function
     * @param { !String } hash
     * @param { !Boolean } active
     */
    const setPageTitle = (hash, active) => {
        const pageName = controller.getPageController(hash).getValue();
        if (active) {
            const title = document.getElementsByTagName("title")[0];
            title.innerText = pageName.charAt(0).toUpperCase() + pageName.slice(1);
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

    /**
     * A utility function that sets the CSS class for the indicator when an invisible page is displayed
     * and removes the CSS class when a visible.
     *
     * @function
     * @param { !String } hash
     * @param { !Boolean } active
     */
    const handleIndicatorVisibility = (hash, active) => {
        const pageController = controller.getPageController(hash);
        if (active && pageController.isVisible() === false) {
            positionWrapper.classList.add('invisiblePage');
        } else {
            positionWrapper.classList.remove('invisiblePage');
        }
    };

    /**
     * A utility function that sets the displayed name of a nav-point to the current page-name value.
     *
     * @function
     * @param { !String } qualifier
     * @param { !String } hash
     * @param { !String } newValue
     */
    const setNavpointName = (qualifier, hash, newValue) => {
        const navigationNode     = anchorListWrappers[qualifier];
        const navigationNameSpan = navigationNode.querySelector(`#${qualifier}-name`);
        navigationNameSpan.innerText = newValue;
    };
};

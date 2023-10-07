import { ObservableList } from "../../../../prototype/kolibri/observable.js";
import { dom } from "../../../../prototype/kolibri/util/dom.js";

export { BreadCrumbProjector }

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
const BreadCrumbProjector = (controller, pinToElement) => {
    const positionWrapper = pinToElement;
    const observableNavigationAnchors = ObservableList([]);
    const anchorMap = {};
    const navigationAnchors = [];
    const DEPTH = 3;

    /**
     * Initializes a navigation anchor
     *
     * @function
     * @param hash - the hash that represents the identifier of a page
     * @param pageName - the pageName that is displayed for this hash
     * @return { HTMLAnchorElement }
     *
     */
    const initializeNavigationPoint = (hash, pageName) => {
        // initialize anchor
        const [anchorDom] = dom(`
            <a href="${hash}">${pageName}</a>
        `);

        return anchorDom;
    };

    /**
     * Binds the navigation anchors to the DOM.
     *
     * @function
     * @return void
     */
    const projectNavigation = () => {
        const [navigationDiv] = dom(`
            <div class="bread-crumbs"></div>
        `);

        const breadCrumbs = [];

        // iterate through history in reverse and add breadcrumbs until DEPTH is reached if they do not exist already
        for(let i = navigationAnchors.length-1; i >= 0 && breadCrumbs.length < DEPTH; i--) {
            if (!breadCrumbs.includes(navigationAnchors[i])) {
                breadCrumbs.push(navigationAnchors[i]);
            }
        }

        // reverse breadCrumbs because of reversing loop above
        breadCrumbs.reverse();

        breadCrumbs.forEach((breadCrumb, index) => {
            breadCrumb.onclick = () => {
                // cut index at last index of current bread crumb, if user navigates via bread crumb
                navigationAnchors.length = navigationAnchors.lastIndexOf(breadCrumb);

            };

            navigationDiv.append(breadCrumb);

            // do not add ">" on last bread crumb
            if (index < breadCrumbs.length - 1) {
                navigationDiv.append(">");
            }

        });

        if (positionWrapper.firstChild === null) {
            positionWrapper.appendChild(navigationDiv)
        } else {
            positionWrapper.replaceChild(navigationDiv, positionWrapper.firstChild);
        }
    };

    observableNavigationAnchors.onAdd(anchor => controller.registerAnchorClickListener(anchor));

    controller.onNavigationHashAdd(hash => {
        const pageController = controller.getPageController(hash);
        const qualifier = pageController.getQualifier();
        const pageName = pageController.getValue();
        const newNavPoint = initializeNavigationPoint(hash, pageName);
        anchorMap[qualifier]  = newNavPoint;
        observableNavigationAnchors.add(newNavPoint);

        // CREATE BINDINGS
        pageController.onActiveChanged(active => {
            const pageController = controller.getPageController(hash);
            if (active && pageController.isVisible()) {
                navigationAnchors.push(anchorMap[qualifier]);
                projectNavigation();
            }
        });

        pageController.onValueChanged(newValue => {
            setNavpointName(qualifier, hash, newValue);
            setPageTitle(hash, pageController.isActive());
        });
        // END
    });

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
     * A utility function that sets the displayed name of a nav-point to the current page-name value.
     *
     * @function
     * @param { !String } qualifier
     * @param { !String } hash
     * @param { !String } newValue
     */
    const setNavpointName = (qualifier, hash, newValue) => {
        const navigationNode   = anchorMap[qualifier];
        navigationNode.innerText = newValue;
    };
};

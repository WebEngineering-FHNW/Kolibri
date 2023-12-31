import { ObservableList } from "../../observable.js";

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

    const projectNavigation = () => {
        const navigationDiv = document.createElement("nav");

        navigationAnchors.forEach(anchor => navigationDiv.appendChild(anchor));

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

    controller.onLocationAdded(location => {
        const hash = location.getHash();
        const newNavPoint = document.createElement('a');
        newNavPoint.setAttribute('href', hash);
        newNavPoint.innerText = hash.substring(1);
        observableNavigationAnchors.add(newNavPoint);

        // CREATE BINDINGS TO MODEL
        controller.getPageController(hash).onVisitedChanged(visited => {
            if (visited) {
                const anchor = navigationAnchors.find(/** HTMLAnchorElement */ a => {
                    const urlHash = a.href.substring(a.href.indexOf("#"));
                    return urlHash === hash;
                });
                if (anchor !== undefined) {
                    anchor.classList.add("visited");
                }
            }
        });
        // END

        projectNavigation();
    });
};

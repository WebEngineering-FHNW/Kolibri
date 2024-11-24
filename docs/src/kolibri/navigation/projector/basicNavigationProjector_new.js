import { ObservableList } from "../../observable.js";
import {SiteController}   from "../siteController.js";

export { BasicNavigationProjector }

/**
 * @typedef NavigationProjectorType
 */

/**
 * @constructor
 * @param { !NavigationControllerType } controller todo dk: adapt
 * @param { !HTMLDivElement } root
 * @return { NavigationProjectorType }
 * @example
 * const navigationController = NavigationController();
 * DashboardNavigationProjector(navigationController, pinToNavElement);
 */

const BasicNavigationProjector = (controller, root) => {

    root.innerHTML = `
        ${projectorStyle}
        <nav class="basicNavigationProjector"></nav>
    `;

    const projectNavigation = () => {
        const navigationDiv = root.querySelector("nav.basicNavigationProjector");

        // view
        navigationDiv.innerHTML =
            Object.entries(controller.getAllPages())
              .map( ([hash, page]) => `<a href="${hash}">${page.titleText}</a>`)
              .join(" ");

        // view binding id done by the browser implicitly when following the link
        // data binding
        Object.entries(controller.getAllPages())
              .forEach( ([hash, page]) => page.onVisited( visited => {
                  if (!visited) return;
                  navigationDiv.querySelector(`a[href="${hash}"]`).classList.add("visited");
              } ));

        controller.uriHashChanged( (newHash, oldHash) => {
            navigationDiv.querySelector(`a[href="${oldHash}"]`)?.classList?.remove("current");
            navigationDiv.querySelector(`a[href="${newHash}"]`)?.classList?.add   ("current");
        });
    };

    projectNavigation();
};

const projectorStyle = `
    <style>
        .basicNavigationProjector {
            a {
                text-wrap: nowrap;
                font-family: system-ui;
            }
            a.visited {
                text-decoration: none;
            }
            a.visited:not(.current) {
                filter: brightness(150%) grayscale(60%);
            }
            a.current {
                color: var(--kolibri-color-accent, deeppink);
            }
        }
    </style>
`;

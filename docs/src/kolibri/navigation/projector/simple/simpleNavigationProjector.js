
export { SimpleNavigationProjector }

const PAGE_CLASS = "simpleNavigationProjector";

/**
 * A projector of anchors to all pages that are registered in the {@link SiteControllerType}.
 * It binds each anchor to the "visited" state and highlights the currently selected page (uriHash).
 * The highlighting is part of the style but layouting of the anchors is left to the parent
 * such that the same projector can be used for horizontal and vertical display.
 * @constructor
 * @param { !SiteControllerType } siteController - the source of the information that we display
 * @param { !HTMLDivElement } root               - where to mount the view
 * @return { NavigationProjectorType }
 * @example
 * // set up
 * const siteController = SiteController();
 * const siteProjector  = SiteProjector(siteController);
 * // add pages
 * siteController.registerPage(URI_HASH_HOME,     HomePage());
 * siteController.registerPage(URI_HASH_UNSTYLED, UnstyledPage());
 * // mount the navigation. We can even have multiple ones!
 * SimpleNavigationProjector(siteController, siteProjector.sideNavigationElement);
 * SimpleNavigationProjector(siteController, siteProjector.topNavigationElement);
 */

const SimpleNavigationProjector = (siteController, root) => {

    root.innerHTML = ` <nav class="${PAGE_CLASS}"></nav> `;

    const projectNavigation = () => {

        // add specific style if not yet available
        if (null === document.head.querySelector(`style[data-style-id="${PAGE_CLASS}"]`)) {
            document.head.innerHTML += projectorStyle;
        }

        const navigationDiv = root.querySelector(`nav.${PAGE_CLASS}`);

        // view is just so many anchors
        navigationDiv.innerHTML =
            Object.entries(siteController.getAllPages())
              .map( ([hash, page]) => `<a href="${hash}">${page.titleText}</a>`)
              .join(" ");

        // view binding is done by the browser implicitly when following the link

        // bind all anchors to their "visited" state (:visited does not allow much)
        Object.entries(siteController.getAllPages())
              .forEach( ([hash, page]) => page.onVisited( visited => {
                  if (!visited) return;
                  navigationDiv.querySelector(`a[href="${hash}"]`).classList.add("visited");
              } ));
        // update which anchor shows the current page
        siteController.onUriHashChanged((newHash, oldHash) => {
            navigationDiv.querySelector(`a[href="${oldHash}"]`)?.classList?.remove("current");
            navigationDiv.querySelector(`a[href="${newHash}"]`)?.classList?.add   ("current");
        });
    };

    projectNavigation();
};

const projectorStyle = `
    <style data-style-id="${PAGE_CLASS}">    
        @layer navigationLayer {
            .${PAGE_CLASS} {
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
        }

    </style>
`;

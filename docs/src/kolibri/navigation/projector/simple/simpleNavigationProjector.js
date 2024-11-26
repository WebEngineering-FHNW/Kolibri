
export { SimpleNavigationProjector }

const PAGE_CLASS = "simpleNavigationProjector";

/**
 * @constructor
 * @param { !SiteControllerType } controller todo dk: adapt
 * @param { !HTMLDivElement } root
 * @return { NavigationProjectorType }
 * @example
 * todo: fill
 */

const SimpleNavigationProjector = (controller, root) => {

    root.innerHTML = ` <nav class="${PAGE_CLASS}"></nav> `;

    const projectNavigation = () => {

        // add specific style if not yet available
        if (null === document.head.querySelector(`style[data-style-id="${PAGE_CLASS}"]`)) {
            document.head.innerHTML += projectorStyle;
        }

        const navigationDiv = root.querySelector(`nav.${PAGE_CLASS}`);

        // view is just so many anchors
        navigationDiv.innerHTML =
            Object.entries(controller.getAllPages())
              .map( ([hash, page]) => `<a href="${hash}">${page.titleText}</a>`)
              .join(" ");

        // view binding is done by the browser implicitly when following the link

        // bind all anchors to their "visited" state (:visited does not allow much)
        Object.entries(controller.getAllPages())
              .forEach( ([hash, page]) => page.onVisited( visited => {
                  if (!visited) return;
                  navigationDiv.querySelector(`a[href="${hash}"]`).classList.add("visited");
              } ));
        // update which anchor shows the current page
        controller.uriHashChanged( (newHash, oldHash) => {
            navigationDiv.querySelector(`a[href="${oldHash}"]`)?.classList?.remove("current");
            navigationDiv.querySelector(`a[href="${newHash}"]`)?.classList?.add   ("current");
        });
    };

    projectNavigation();
};

const projectorStyle = `
    <style data-style-id="${PAGE_CLASS}">
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
    </style>
`;

import {select} from "../../../util/dom.js";

export { SimpleNavigationProjector }

const PAGE_CLASS = "simpleNavigationProjector";

const iconSVGStr = `
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 5L15.0368 11.9632L8 18.9263" stroke="url(#paint0_linear_1028_8530)"/>
        <defs>
        <linearGradient id="paint0_linear_1028_8530" x1="7.98915" y1="5" x2="18.7337" y2="14.9252" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#FF2CA5"/>
        <stop offset="1" stop-color="#6000FF"/>
        </linearGradient>
    </svg>
`;

/**
 * A projector of anchors to all pages that are registered in the {@link SiteControllerType}.
 * It binds each anchor to the "visited" state and highlights the currently selected page (uriHash).
 * The highlighting is part of the style but layouting of the anchors is left to the parent
 * such that the same projector can be used for horizontal and vertical display.
 * @constructor
 * @param { !SiteControllerType } siteController - the source of the information that we display
 * @param { !HTMLDivElement }     root           - where to mount the view
 * @param { Boolean= }            canHide        - whether this navigation can hide itself, defaults to false
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

const SimpleNavigationProjector = (siteController, root, canHide=false) => {

    root.innerHTML = `<nav class="${PAGE_CLASS}"></nav> `;

    const projectNavigation = () => {

        // add specific style if not yet available
        if (null === document.head.querySelector(`style[data-style-id="${PAGE_CLASS}"]`)) {
            document.head.innerHTML += projectorStyle;
        }

        const [navigationEl] = select(root, `nav.${PAGE_CLASS}`);

        // view is just so many anchors
        navigationEl.innerHTML = (canHide ? `<div class="toggler">${iconSVGStr}</div>` : '') +
            Object.entries(siteController.getAllPages())
              .map( ([hash, page]) => `<a href="${hash}">${page.titleText}</a>`)
              .join(" ");

        // view binding is done by the browser implicitly when following the link

        // bind all anchors to their "visited" state (:visited does not allow much)
        Object.entries(siteController.getAllPages())
              .forEach( ([hash, page]) => page.onVisited( visited => {
                  if (!visited) return;
                  navigationEl.querySelector(`a[href="${hash}"]`)?.classList?.add("visited");
              } ));
        // update which anchor shows the current page
        siteController.onUriHashChanged((newHash, oldHash) => {
            navigationEl.querySelector(`a[href="${oldHash}"]`)?.classList?.remove("current");
            navigationEl.querySelector(`a[href="${newHash}"]`)?.classList?.add   ("current");
        });

        if (canHide) {
            navigationEl.classList.toggle("hide");
            select(navigationEl, ".toggler").head().onclick = _evt => navigationEl.classList.toggle("hide");
        }
    };

    projectNavigation();
};

const projectorStyle = `
    <style data-style-id="${PAGE_CLASS}">    
        @layer navigationLayer {
            .${PAGE_CLASS} {
                &.hide {                 
                    .toggler {                    
                        rotate:         0deg;
                    }
                    a, a.current {      /* hide the anchors */
                        width:          0;
                        color:          transparent;
                        pointer-events: none;
                    } 
                }
                .toggler {              /* provide a box for the svg */
                    margin-inline:      auto;
                    width:              2rem;
                    aspect-ratio:       1 / 1;
                    rotate:             180deg;
                    transition:         rotate .3s ease-in-out;
                }
                svg {
                    fill:               none;
                    stroke-width:       2;
                    stroke-linecap:     round;
                    stroke-linejoin:    round;
                }
                a {
                    color:              revert;
                    pointer-events:     revert;
                    user-select:        none;
                    text-wrap:          nowrap;
                    font-family:        system-ui;
                }
                a.visited {
                    text-decoration:    none;
                }
                a.visited:not(.current) {
                    filter:             brightness(150%) grayscale(60%);
                }
                a.current {
                    color:              var(--kolibri-color-accent, deeppink);
                }
            }
        }

    </style>
`;

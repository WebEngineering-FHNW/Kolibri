import { select, dom } from "../../../util/dom.js";
import { Seq }         from "../../../sequence/constructors/seq/seq.js";
import { icon }        from "../../../style/icon.js";

export { SimpleNavigationProjector }

const NAVIGATION_CLASS = "simpleNavigationProjector";

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
 * If a map from hashes to icon names is given, the icons are rendered as SVG.
 * @constructor
 * @param { !SiteControllerType } siteController - the source of the information that we display
 * @param { !Object.<UriHashType, IconNameType> } hash2icon - maps hashes to their icon names, might be empty to indicate "no icons"
 * @param { Boolean= }            canHide        - whether this navigation can hide itself, defaults to false
 * @return { SequenceType<HTMLElement> }
 * @example
 * // set up
 * const siteController = SiteController();
 * const siteProjector  = SiteProjector(siteController);
 * // add pages
 * siteController.registerPage(URI_HASH_HOME,     HomePage());
 * siteController.registerPage(URI_HASH_UNSTYLED, UnstyledPage());
 * // mount the navigation. We can even have multiple ones!
 * siteProjector.sideNavigationElement.append(...SimpleNavigationProjector(siteController, {}, true));
 */

const SimpleNavigationProjector = (siteController, hash2icon, canHide=false) => {

    // note: there seems to be no special type like HTMLNavElement (?)
    const [navigationEl] = /** @type { Array<HTMLElement> } */ dom(`<nav class="${NAVIGATION_CLASS}"></nav>`);

    // add specific style if not yet available
    if (null === document.head.querySelector(`style[data-style-id="${NAVIGATION_CLASS}"]`)) {
        document.head.innerHTML += projectorStyle;
    }

    // view is just so many anchors
    navigationEl.innerHTML = (canHide ? `<div class="toggler">${iconSVGStr}</div>` : '') +
                             Object.entries(siteController.getAllPages())
                                   .map(([hash, page]) => `<a href="${hash}">${page.titleText}</a>`)
                                   .join(" ");

    // if icons available, add them to the anchors as nested elements
    if (hash2icon && Object.keys(hash2icon).length > 0) {
        select(navigationEl, "a").forEach$(anchorElement => {
            const hash    = anchorElement.getAttribute("href");
            const iconSVG = icon(hash2icon[hash]);
            anchorElement.prepend(...iconSVG);
        })
    }

    // view binding is done by the browser implicitly when following the link

    // bind all anchors to their "visited" state (:visited does not allow much)
    Object.entries(siteController.getAllPages())
          .forEach(([hash, page]) => page.onVisited(visited => {
              if (!visited) return;
              navigationEl.querySelector(`a[href="${hash}"]`)?.classList?.add("visited");
          }));
    // update which anchor shows the current page
    siteController.onUriHashChanged((newHash, oldHash) => {
        navigationEl.querySelector(`a[href="${oldHash}"]`)?.classList?.remove("current");
        navigationEl.querySelector(`a[href="${newHash}"]`)?.classList?.add("current");
    });

    if (canHide) {
        navigationEl.classList.toggle("hide");
        select(navigationEl, ".toggler").head().onclick = _evt => navigationEl.classList.toggle("hide");
    }

    return Seq(navigationEl);
};

const projectorStyle = `
    <style data-style-id="${NAVIGATION_CLASS}">    
        @layer navigationLayer {
            .${NAVIGATION_CLASS} {
                overflow-x: clip;
                &.hide {                 
                    .toggler {                    
                        rotate:         0deg;
                    }
                    a, a.current {      /* hide the anchors */
                        width:          0;
                        color:          transparent;
                    } 
                }
                .toggler {              /* provide a box for the svg */
                    margin-inline:      auto;
                    width:              2rem;
                    aspect-ratio:       1 / 1;
                    rotate:             180deg;
                    transition:         rotate .3s ease-in-out .1s; /* delayed and shorter than the width transition */
                }
                a svg {
                    --icon-width:       1.6rem;
                    width:              var(--icon-width);
                    margin-inline:      calc( (3rem - var(--icon-width)) / 2); /* logo-width 3rem */
                    fill:               var(--kolibri-color-accent);
                    aspect-ratio:       1;
                    stroke:             none;
                    transform:          translateY(20%);
                }
                svg {
                    fill:               none;
                    stroke-width:       2;
                    stroke-linecap:     round;
                    stroke-linejoin:    round;
                }
                a {
                    width:              auto;
                    color:              revert;
                    pointer-events:     revert;
                    user-select:        none;
                    text-wrap:          nowrap;
                    font-weight:        500;
                    transition-property:        width;
                    transition-duration:        .5s;
                    transition-timing-function: ease-out;
                    transition-behavior:        allow-discrete; /* progressive enhancement*/
                }
                a.visited {
                    text-decoration:    none;
                }
                a.visited:not(.current), a.visited:not(.current) svg {
                    filter:             opacity(85%) grayscale(60%);
                }
                a.current {
                    color:              var(--kolibri-color-accent, deeppink);
                }
                a.current svg {
                    fill:               var(--kolibri-color-accent, deeppink);
                }
            }
        }

    </style>
`;

/**
 * @module kolibri.navigation.siteController
 */

import { LoggerFactory } from "../logger/loggerFactory.js";
import {Observable}      from "../observable.js";

export { SiteController }

const { warn, info } = LoggerFactory("ch.fhnw.kolibri.navigation.siteController");

const SiteController = () => {

    const allPages     = {};  // URI_HASH to Page
    const currentUriHash = Observable("#"); // note: we could use last pageModel

    // the main Hash relates to the Controller that is used for activation and passivation
    const mainHash = uriHash => uriHash.split('/')[0]; // if there are subHashes, take the parent

    const gotoUriHash = (uriHash, direct) => {
        uriHash = uriHash || "#";                                       // handle "", null, undefined => home
        if ( null == allPages[mainHash(uriHash)] ) {
            warn(`cannot activate page for hash "${uriHash}"`);
            alert(`Sorry, the target "${uriHash}" is not available.`);  // todo dk: make message i18n
            return;
        }
        pageTransition(uriHash, direct);
    };

    // handles initial page load and page reload, it jumps "direct"ly to the hash without transition
    window.onload       = () => gotoUriHash(window.location.hash, /* direct */ true);

    // handles navigation through the browser URL field, bookmarking, or browser previous/next
    window.onhashchange = () => gotoUriHash(window.location.hash, /* direct */ false);

    const activate = pageModel => {
        const titleElement = document.head.querySelector("title");
        titleElement.textContent = pageModel.titleText;
        document.head.appendChild(pageModel.styleElement);
        const mainElement = document.body.querySelector("#content");
        mainElement.appendChild(pageModel.contentElement);
        pageModel.setVisited(true);
    };

    const passivate = pageModel => {
        // there is no need to blank out the title
        // on initialization the active page might be null/undefined and passivation should not fail in that case
        pageModel?.styleElement  .remove();
        pageModel?.contentElement.remove();
    };

    /**
     * Navigates to the {@link PageControllerType page} for the given {@link UriHashType}.
     * This includes side-effecting the model, the browser incl. history, and
     * activating / passivating the involved {@link PageControllerType controllers}.
     *
     * @private
     * @impure
     * @param { !UriHashType } newUriHash - this might include subHashes like `#parent/sub`
     * @return { void }
     */
    const pageTransition = (newUriHash, direct) => {
        info(`page transition from ${currentUriHash.getValue()} to ${newUriHash}`);

        const currentPage = allPages[mainHash(currentUriHash.getValue())];
        const newPage     = allPages[mainHash(newUriHash)];

        const doAnimate   = !direct && newUriHash !== currentUriHash.getValue();

        // allow the current page to animate passivation
        if (doAnimate) {
            currentPage.contentElement.classList.add("passivate");
        }
        const passivationCSS = getComputedStyle(currentPage.contentElement, null)
            .getPropertyValue("--passivation-ms");
        const passivationMs = doAnimate ? Number( passivationCSS || 500) : 0;
        setTimeout( _time => { // give the passivation anim some time

            passivate(currentPage);
            currentPage.contentElement.classList.remove("passivate");

            // effect: navigate to hash, trigger onhashchange event (but not if same), add to history
            window.location.hash = newUriHash;
            currentUriHash.setValue(newUriHash);

            if (doAnimate) {
                newPage.contentElement.classList.add("activate");
            }
            activate(newPage);
            const activationCSS = getComputedStyle(newPage.contentElement, null)
                .getPropertyValue("--activation-ms");
            const activationMs = doAnimate ? Number( activationCSS || 500) : 0;
            setTimeout( _time => { // give activation anim its time
                newPage.contentElement.classList.remove("activate");
            }, activationMs );

        }, passivationMs);

    };

    const registerPage = ( uriHash, page) => {
        allPages[uriHash] = page;
    };

    return /** @type { SiteControllerType } */{
        gotoUriHash,
        registerPage,                           // protocol: your must first register before you can go to it
        getAllPages: () => ({...allPages}),     // defensive copy
        uriHashChanged : currentUriHash.onChange,
    }
};

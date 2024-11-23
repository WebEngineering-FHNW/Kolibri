/**
 * @module kolibri.navigation.siteController
 */

import { LoggerFactory } from "../logger/loggerFactory.js";

export { SiteController }

const { warn, info } = LoggerFactory("ch.fhnw.kolibri.navigation.siteController");

const SiteController = siteModel => {

    let lastUriHash = "#"; // note: we could use last pageModel

    // the main Hash relates to the Controller that is used for activation and passivation
    const mainHash = uriHash => uriHash.split('/')[0]; // if there are subHashes, take the parent

    const gotoUriHash = uriHash => {
        uriHash = uriHash || "#";                                       // handle "", null, undefined => home
        if ( null == siteModel.allPages[mainHash(uriHash)] ) {
            warn(`cannot activate page for hash "${uriHash}"`);
            alert(`Sorry, the target "${uriHash}" is not available.`);  // todo dk: make message i18n
            return;
        }
        activateHash(uriHash);
    };

    // handles initial page load and page reload
    window.onload       = () => gotoUriHash(window.location.hash);

    // handles navigation through the browser URL field, bookmarking, or browser previous/next
    window.onhashchange = () => gotoUriHash(window.location.hash);


    const activate = pageModel => {
        const titleElement = document.head.querySelector("title");
        titleElement.textContent = pageModel.titleText;
        document.head.appendChild(pageModel.styleElement);
        const mainElement = document.body.querySelector("#content");
        mainElement.appendChild(pageModel.contentElement);
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
    const activateHash = newUriHash => {
        info(`page transition from ${lastUriHash} to ${newUriHash}`);
        passivate(siteModel.allPages[mainHash(lastUriHash)]);

        // effect: navigate to hash, trigger onhashchange event (but not if same), add to history
        window.location.hash = newUriHash;

        lastUriHash = newUriHash;
        activate(siteModel.allPages[mainHash(newUriHash)]);
    };

    return /** @type { SiteControllerType } */{
        gotoUriHash
    }
};

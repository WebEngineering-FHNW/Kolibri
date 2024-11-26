/**
 * @module kolibri.navigation.siteController
 */

import {LoggerFactory} from "../logger/loggerFactory.js";
import {Observable}    from "../observable.js";
import {URI_HASH_HOME} from "../../examples/navigation/uriHashes.js";
import {EmptyPage}     from "../../examples/navigation/empty.js";

export { SiteController }

const { warn, info, debug } = LoggerFactory("ch.fhnw.kolibri.navigation.siteController");


const SiteController = () => {

    const emptyPage      = EmptyPage();
    const pageActivated  = Observable(emptyPage);
    const pagePassivated = Observable(emptyPage);

    const allPages       = {};  // URI_HASH to Page
    const currentUriHash = Observable(URI_HASH_HOME);

    // the main Hash relates to the Controller that is used for activation and passivation
    const mainHash = uriHash => uriHash.split('/')[0]; // if there are subHashes, take the parent

    const gotoUriHash = (uriHash, direct) => {
        uriHash = uriHash || URI_HASH_HOME;                             // handle "", "#", null, undefined => home
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

    /**
     * Navigates to the {@link PageControllerType page} for the given {@link UriHashType}.
     * This includes side-effecting the model, the browser incl. history, and
     * activating / passivating the involved {@link PageControllerType controllers}.
     *
     * @private
     * @impure
     * @param { !UriHashType } newUriHash - this might include subHashes like `#parent/sub`
     * @param { Boolean }      direct     - show the page directly without page transition animation
     * @return { void }
     */
    const pageTransition = (newUriHash, direct) => {
        info(`page transition from ${currentUriHash.getValue()} to ${newUriHash}`);

        // effect: navigate to hash, trigger onhashchange event (but not if same), add to history
        window.location.hash = newUriHash;
        currentUriHash.setValue(newUriHash); // notify the listeners (mostly navigation projectors)

        const activePage = pageActivated.getValue();
        const newPage     = allPages[mainHash(newUriHash)];

        if (newPage === activePage) {
            debug(`new page is already active -> no transition`);
            return;
        }

        if (!direct) {
            debug(`passivate ${activePage.titleText}`);
            pagePassivated.setValue(activePage);
        } else {
            debug("direct call -> no passivation");
        }

        newPage.setVisited(true);

        debug(`activate ${newPage.titleText}`);
        pageActivated.setValue(newPage);
    };

    const registerPage = ( uriHash, page) => {
        allPages[uriHash] = page;
    };

    return /** @type { SiteControllerType } */{
        gotoUriHash,
        registerPage,                           // protocol: your must first register before you can go to it
        getAllPages: () => ({...allPages}),     // defensive copy
        uriHashChanged :    currentUriHash.onChange,  // notify navigation projectors
        onPageActivated:    pageActivated.onChange,   // notify site projector
        onPagePassivated:   pagePassivated.onChange,
    }
};

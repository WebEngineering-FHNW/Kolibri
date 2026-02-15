/**
 * @module kolibri.navigation.siteController
 */

import { LoggerFactory }                 from "../logger/loggerFactory.js";
import { Observable }                    from "../observable.js";
import { URI_HASH_EMPTY, URI_HASH_HOME } from "../../customize/uriHashes.js";
import { EmptyPage }                     from "./page/empty.js";

export { SiteController }

const { warn, info, debug } = LoggerFactory("ch.fhnw.kolibri.navigation.siteController");

/**
 * @typedef SiteControllerType
 * @property { (uriHash:UriHashType, page:PageType) => void }   registerPage     - protocol: do this first
 * @property { (uriHash:UriHashType) => void }                  gotoUriHash      - navigate to the page for this uriHash
 * @property { () => Object.<UriHashType, PageType>}            getAllPages      - call after all pages were registered
 * @property { (cb:ConsumerType<UriHashType>) => void }         onUriHashChanged - notify anchors
 * @property { (cb:ConsumerType<PageType>) => void }            onPageActivated  - notify site projector
 * @property { (cb:ConsumerType<PageType>) => void}             onPagePassivated - notify site projector
 * @property { (cb:ConsumerType<String>)   => void}             onUnsupportedUriHash - navigation failure callback
 */

/**
 * @return { SiteControllerType }
 * @constructor
 */

const SiteController = () => {

    let   unsupportedHashReaction = _uriHash => undefined;
    const onUnsupportedUriHash = handler => unsupportedHashReaction = handler;

    const emptyPage      = EmptyPage();
    const pageActivated  = /** @type { IObservable<PageType> } */ Observable(emptyPage);
    const pagePassivated = /** @type { IObservable<PageType> } */ Observable(emptyPage);

    const allPages       = {};  // URI_HASH to Page
    const currentUriHash = /** @type { IObservable<UriHashType> } */ Observable(URI_HASH_EMPTY);

    // the main Hash relates to the Controller that is used for activation and passivation
    const mainHash = uriHash => uriHash.split('/')[0]; // if there are subHashes, take the parent

    const gotoUriHash = uriHash => {
        uriHash = uriHash || URI_HASH_HOME;                             // handle "", "#", null, undefined => home
        if ( null == allPages[mainHash(uriHash)] ) {
            warn(`cannot activate page for hash "${uriHash}"`);
            unsupportedHashReaction(uriHash);
            return;
        }
        pageTransition(uriHash);
    };

    // handles initial page load and page reload, it jumps "direct"ly to the hash without transition
    window.onload       = () => gotoUriHash(window.location.hash, /* direct */ true);

    // handles navigation through the browser URL field, bookmarking, or browser previous/next
    window.onhashchange = () => gotoUriHash(window.location.hash, /* direct */ false);

    /**
     * Navigates to the {@link PageType page} for the given {@link UriHashType}.
     * This includes side-effecting the model, the browser incl. history, and
     * activating / passivating the involved {@link PageType pages}.
     *
     * @private
     * @impure
     * @param { !UriHashType } newUriHash - this might include subHashes like `#parent/sub`
     * @return { void }
     */
    const pageTransition = newUriHash => {

        if(currentUriHash.getValue() === newUriHash) { // guard
            return;
        }
        info(`page transition from ${currentUriHash.getValue()} to ${newUriHash}`);

        // effect: navigate to hash, trigger onhashchange event (but not if same), add to history
        window.location.hash = newUriHash;
        currentUriHash.setValue(newUriHash); // notify the listeners (mostly navigation projectors)

        const activePage = pageActivated.getValue();
        const newPage     = allPages[mainHash(newUriHash)];

        debug(`passivate ${activePage.titleText}`);
        pagePassivated.setValue(activePage);

        newPage.setVisited(true);

        debug(`activate ${newPage.titleText}`);
        pageActivated.setValue(newPage);
        newPage.onBootstrap(); // self-aware to only execute at most once
    };

    const registerPage = ( uriHash, page) => {
        allPages[uriHash] = page;
    };

    return /** @type { SiteControllerType } */ {
        gotoUriHash,
        registerPage,                           // protocol: your must first register before you can go to it
        getAllPages:       () => ({...allPages}),     // defensive copy
        onUnsupportedUriHash,                         // navigation failure callback
        onUriHashChanged : currentUriHash.onChange,   // notify navigation projectors
        onPageActivated:   pageActivated.onChange,    // notify site projector
        onPagePassivated:  pagePassivated.onChange,   // notify site projector
    }
};

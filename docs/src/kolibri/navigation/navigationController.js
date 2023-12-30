
// TODO: how to model HASH, PARENT, PATH, etc.

// import { Attribute, HASH, PARENT, PATH, VALUE, valueOf } from "../kolibri/presentationModel.js";
import {Location, NavigationModel} from "./navigationModel.js";
import {Attribute, VALUE, valueOf} from "../presentationModel.js";

export { NavigationController, NAME, LOGO, FAVICON, HOMEPAGE, DEBUGMODE }

const NAME      =  "websiteName";
const LOGO      = "websiteLogo";
const FAVICON   = "favicon";
const HOMEPAGE  = "homepage";
const DEBUGMODE = "debugMode";

/**
 * @template T
 * @typedef { Object.<ObservableTypeString, T>} ModelConfigurationObject
 */

/**
 * NavigationControllerType is a Controller that coordinates communication between Model and Projector.
 * The controller handles the routing triggered by the registered anchor elements.
 * The controller passes the website logo path, the homepage, the websites name and the page controllers to the {@link NavigationModel}.
 *
 * @typedef NavigationControllerType
 * @property { (pageControllerToAdd: PageControllerType) => void }       addPageController           - adds a page controller to the navigation controller and adds the page hash to the {@link NavigationModel}. Throws an error if the qualifier is not valid or has already been added to the {@link NavigationModel}.
 * @property { (...pageControllersToAdd: PageControllerType[]) => void } addPageControllers          - adds one or more page controllers to the {@link NavigationModel}. See {@link addPageController} for more details.
 * @property { (pageHash: String) => PageControllerType }                getPageController           - returns the page controller of a specific hash.
 * @property { (pageHash: String) => void }                              deletePageController        - deletes the page controller of a specific hash.
 * @property { (anchor: HTMLAnchorElement) => void }                     registerAnchorClickListener - registers a click listener on an anchor. this binding triggers a location change trough navigate based on the hash the anchor has.
 * @property { (confObj: ModelConfigurationObject) => boolean }          setConfiguration            - sets the attributes of this navigation for all keys in object to their value.
 * @property { (newHomepage: !PageControllerType) => void } setHomeLocation - sets the given PageController as the homepage. the homepage is the fallback page which gets opened when no hash is provided in the request url. Calling all registered {@link ValueChangeCallback}s.
 * @property { () => ?PageControllerType}            getHomeLocation        - returns the PageController of the homepage. See {@link setHomeLocation} for more details. Returns null if no homepage has been defined.
 * @property { (newPath: String) => void }           setPath            - sets the current path. The path consists of the string that is passed after the '#' in the url. The path can be used for granular sub-routing.
 * @property { () => String}                         getPath            - returns the current path. See {@link setPath} for more details.
 * @property { (name: String) => void }              setWebsiteName     - sets the name for the website, calling all registered {@link ValueChangeCallback}s. The name can be displayed by a {@link NavigationProjectorType}.
 * @property { () => String }                        getWebsiteName     - returns the name for the website. See {@link setWebsiteName} for more details.
 * @property { (logoSrcPath: String) => void }       setWebsiteLogo     - sets the path to the website logo, calling all registered {@link ValueChangeCallback}s. The website logo can be displayed by a {@link NavigationProjectorType}.
 * @property { () => String }                        getWebsiteLogo     - returns the path to the website logo. See {@link setWebsiteLogo}
 * @property { (favIconSrcPath: String) => void }    setFavIcon         - sets the favicon, calling all registered {@link ValueChangeCallback}s. The favicon path can be set with a {@link NavigationProjectorType} in the index.html.
 * @property { () => String }                        getFavIcon         - returns the path to the favicon. See {@link setFavIcon} for more details.
 * @property { (debugModeActive: Boolean) => void }  setDebugMode       - sets the debug mode active state. calling all registered {@link ValueChangeCallback}s.
 * @property { () => Boolean }                       isDebugMode        - returns if the debug mode is active.
 * @property { (callback: ConsumerType<String>) => Boolean }                 onNavigationHashAdd  - registers an {@link ConsumerType} that will be called whenever a page hash is added.
 * @property { (callback: ConsumerType<String>) => Boolean }                 onNavigationHashDel  - registers an {@link ConsumerType} that will be called whenever a page hash is deleted.
 * @property { (callback: ValueChangeCallback<PageControllerType>) => void } onLocationChanged    - registers an {@link ValueChangeCallback} that will be called whenever the current location is changed.
 * @property { (callback: ValueChangeCallback<String>) => void }             onPathChanged        - registers an {@link ValueChangeCallback} that will be called whenever the current path is changed.
 * @property { (callback: ValueChangeCallback<String>)  => void }            onWebsiteNameChanged - registers an {@link ValueChangeCallback} that will be called whenever the page name is changed.
 * @property { (callback: ValueChangeCallback<String>)  => void }            onWebsiteLogoChanged - registers an {@link ValueChangeCallback} that will be called whenever the page logo is changed.
 * @property { (callback: ValueChangeCallback<String>)  => void }            onFavIconChanged     - registers an {@link ValueChangeCallback} that will be called whenever the favicon is changed.
 * @property { (callback: ValueChangeCallback<Boolean>) => void }            onVisibleChanged     - registers an {@link ValueChangeCallback} that will be called whenever a pages visibility is changed.
 * @property { (callback: ValueChangeCallback<Boolean>) => void }            onDebugModeChanged   - registers an {@link ValueChangeCallback} that will be called whenever the debug mode active state is changed.
 */

/**
 * Constructor for a NavigationControllerType
 * @return  { NavigationControllerType }
 * @constructor
 * @example
 * const navigationController = NavigationController();
 * navigationController.setWebsiteName('Kolibri');
 * navigationController.setWebsiteLogo('./img/logo/logo-new-128.svg');
 */
const NavigationController = () => {
    const navigationModel  = NavigationModel();


    /**
     * Navigates to the {@link LocationType location}
     * that is found for a given hash. This includes side-effecting the model, the browser incl. history, and
     * activating / passivating the involved {@link PageControllerType controllers}.
     *
     * @function
     * @param { String } hash - will be normalized to start with # sign
     * @return { void }
     *
     */
    const navigateToHash = hash => {
        // check if hash is empty to redirect to fallback homepage

        if ( ! hash.startsWith("#")) { // todo: find out if this ever happens
            hash = "#" + hash;
        }

        // todo: this block should not be needed at all.
        // if(hash === '' || hash === '#') { // todo: check if null
        //     const homepageController = navigationModel.getHomepage(); // todo: why is the homepage not part of the locations?
        //     if (null !== homepageController) {
        //         hash = homepageController.getHash();
        //     } else  {
        //         // return if fallback homepage is not defined
        //         // todo: check what happens here: error, log?
        //         return;
        //     }
        // }

        // todo: should  this line move between passivation of last and activation of next location?
        window.location.hash = hash; // effect: navigate to hash, trigger hashchanged event (?), add to history

        const newLocation = findTargetLocation(hash);

        // on initialization the currentLocation can be null and passivation should not fail in that case
        navigationModel.getCurrentLocation() ?. passivate();

        newLocation.pageController.activate();

        navigationModel.setCurrentLocation(newLocation);

        if (navigationModel.isDebugMode()) { // todo: why is this done here? Shouldn't this be automatic on hash change?
            const debugController = navigationModel.findLocationByHash('#debug').pageController;
            debugController.setParent(newLocation.pageController);
        }
    };

    /**
     * Find the correct location for a hashPath
     * and return the corresponding {@link LocationType location}.
     *
     * @param { String } hashPath - can contain subHashes like '#myHash/mySubHash'
     * @return { LocationType } the new location where navigation should proceed
     */
    const findTargetLocation = hashPath => {
        const [hash] = hashPath.split('/'); // if there are subHashes, take the parent

        const targetLocation = navigationModel.findLocationByHash(hash);

        if(targetLocation === navigationModel.NO_SUCH_LOCATION) { // if newLocation is undefined, navigate to an error page
            return navigationModel.findLocationByHash('#E404');
        }
        if (!targetLocation.pageController.isNavigational()) { // if the newLocation exists but is not navigational we return a 403 forbidden error
            return navigationModel.findLocationByHash('#E403');
        }
        return targetLocation;
    };

    // handles initial page load and page reload
    window.onload = () => {
        const hash = window.location.hash;
        navigateToHash(hash);
    };

    // handles navigation through the browser URL field, bookmarking, or browser previous/next
    window.onhashchange = () => {
        const hash = window.location.hash;
        if (hash !== navigationModel.getCurrentLocation()?.hash) {
            navigateToHash(hash);
        }
    };

    const addLocation = newLocation => {
        if (navigationModel.findLocationByHash(newLocation.hash) === navigationModel.NO_SUCH_LOCATION) {
            navigationModel.addLocation(newLocation);
        } else {
            throw new Error('PageController could not be added to the NavigationModel. Please check that the hash is valid and has not already been added to the navigation: ' + newLocation.getHash());
        }
    };

    return {
        addPageController: pageController => addLocation(Location(pageController)),
        addPageControllers: (...pageControllersToAdd) => {
            for (const pageController of pageControllersToAdd) {
                addLocation(Location(pageController));
            }
        },
        getPageController: pageHash => navigationModel.findLocationByHash(pageHash)?.pageController,
        deletePageController: pageHash => {
            navigationModel.removeLocation(pageHash);
        },
        registerAnchorClickListener: anchor => {
            anchor.onclick = e => {
                e.preventDefault();
                const hash = e.currentTarget.getAttribute('href');
                navigateToHash(hash);
            };
        },
        setConfiguration:     confObj => {
            for (const [key, value] of Object.entries(confObj)) {
                switch (key) {
                    case NAME      : navigationModel.setWebsiteName(value); break;
                    case LOGO      : navigationModel.setWebsiteLogo(value); break;
                    case FAVICON   : navigationModel.setFavIcon    (value); break;
                    case HOMEPAGE  : navigationModel.setHomeLocation (Location(value)); break;
                    case DEBUGMODE : navigationModel.setDebugMode  (value); break;
                    default: console.error("can't find key " + key);
                }
            }
            return true;
        },
        setWebsiteName:       navigationModel.setWebsiteName,
        getWebsiteName:       navigationModel.getWebsiteName,
        setWebsiteLogo:       navigationModel.setWebsiteLogo,
        getWebsiteLogo:       navigationModel.getWebsiteLogo,
        setFavIcon:           navigationModel.setFavIcon,
        getFavIcon:           navigationModel.getFavIcon,
        setHomeLocation:      navigationModel.setHomeLocation,
        setHomeHash:          hash => navigationModel.setHomeLocation(navigationModel.findLocationByHash(hash)),
        getHomeLocation:      navigationModel.getHomeLocation,
        setDebugMode:         navigationModel.setDebugMode,
        isDebugMode:          navigationModel.isDebugMode,
        setPath:              (val) => console.error(" "+val),
        getPath:              (val) => console.error(" "+val),
        onNavigationHashAdd:  navigationModel.onLocationAdded,
        onNavigationHashDel:  navigationModel.onLocationRemoved,
        onLocationChanged:    (val) => console.error(" "+val),
        onPathChanged:        (val) => console.error(" "+val),
        onWebsiteNameChanged: navigationModel.onWebsiteNameChanged,
        onWebsiteLogoChanged: navigationModel.onWebsiteLogoChanged,
        onFavIconChanged:       navigationModel.onFavIconChanged,
        onDebugModeChanged:     navigationModel.onDebugModeChanged,
        onVisibleChanged:       navigationModel.onVisibleChanged,
    }
};

import { Attribute, HASH, PARENT, PATH, VALUE, valueOf } from "../kolibri/presentationModel.js";
import { NavigationModel } from "./navigationModel.js";

export { NavigationController }

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
 * @property { (pageControllerToAdd: PageControllerType) => void }       addPageController           - a function that adds a page controller to the navigation controller and adds the page hash to the {@link NavigationModel}. Throws an error if the qualifier is not valid or has already been added to the {@link NavigationModel}.
 * @property { (...pageControllersToAdd: PageControllerType[]) => void } addPageControllers          - a function that adds one or more page controllers to the {@link NavigationModel}. See {@link addPageController} for more details.
 * @property { (pageHash: String) => PageControllerType }                getPageController           - a function that returns the page controller of a specific hash.
 * @property { (pageHash: String) => void }                              deletePageController        - a function that deletes the page controller of a specific hash.
 * @property { (anchor: HTMLAnchorElement) => void }                     registerAnchorClickListener - a function that registers a click listener on an anchor. this binding triggers a location change trough navigate based on the hash the anchor has.
 * @property { (confObj: ModelConfigurationObject) => boolean }          setConfiguration            - a function that sets the attributes of this navigation for all keys in object to their value.
 * @property { (newHomepage: !PageControllerType) => void } setHomePage - a function that sets the given PageController as the homepage. the homepage is the fallback page which gets opened when no hash is provided in the request url. Calling all registered {@link onValueChangeCallback}s.
 * @property { () => ?PageControllerType}            getHomePage        - a function that returns the PageController of the homepage. See {@link setHomepage} for more details. Returns null if no homepage has been defined.
 * @property { (newPath: String) => void }           setPath            - a function that sets the current path. The path consists of the string that is passed after the '#' in the url. The path can be used for granular sub-routing.
 * @property { () => String}                         getPath            - a function that returns the current path. See {@link setPath} for more details.
 * @property { (name: String) => void }              setWebsiteName     - a function that sets the name for the website, calling all registered {@link onValueChangeCallback}s. The name can be displayed by a {@link NavigationProjectorType}.
 * @property { () => String }                        getWebsiteName     - a function that returns the name for the website. See {@link setWebsiteName} for more details.
 * @property { (logoSrcPath: String) => void }       setWebsiteLogo     - a function that sets the path to the website logo, calling all registered {@link onValueChangeCallback}s. The website logo can be displayed by a {@link NavigationProjectorType}.
 * @property { () => String }                        getWebsiteLogo     - a function that returns the path to the website logo. See {@link setWebsiteLogo}
 * @property { (favIconSrcPath: String) => void }    setFavIcon         - a function that sets the favicon, calling all registered {@link onValueChangeCallback}s. The favicon path can be set with a {@link NavigationProjectorType} in the index.html.
 * @property { () => String }                        getFavIcon         - a function that returns the path to the favicon. See {@link setFavIcon} for more details.
 * @property { (debugModeActive: Boolean) => void }  setDebugMode       - a function that sets the debug mode active state. calling all registered {@link onValueChangeCallback}s.
 * @property { () => Boolean }                       isDebugMode        - a function that returns if the debug mode is active.
 * @property { (callback: observableListCallback) => Boolean }                 onNavigationHashAdd  - a function that registers an {@link observableListCallback} that will be called whenever a page hash is added.
 * @property { (callback: observableListCallback) => Boolean }                 onNavigationHashDel  - a function that registers an {@link observableListCallback} that will be called whenever a page hash is deleted.
 * @property { (callback: onValueChangeCallback<PageControllerType>) => void } onLocationChanged    - a function that registers an {@link onValueChangeCallback} that will be called whenever the current location is changed.
 * @property { (callback: onValueChangeCallback<String>) => void }             onPathChanged        - a function that registers an {@link onValueChangeCallback} that will be called whenever the current path is changed.
 * @property { (callback: onValueChangeCallback<String>)  => void }            onWebsiteNameChanged - a function that registers an {@link onValueChangeCallback} that will be called whenever the page name is changed.
 * @property { (callback: onValueChangeCallback<String>)  => void }            onWebsiteLogoChanged - a function that registers an {@link onValueChangeCallback} that will be called whenever the page logo is changed.
 * @property { (callback: onValueChangeCallback<String>)  => void }            onFavIconChanged     - a function that registers an {@link onValueChangeCallback} that will be called whenever the favicon is changed.
 * @property { (callback: onValueChangeCallback<Boolean>) => void }            onVisibleChanged     - a function that registers an {@link onValueChangeCallback} that will be called whenever a pages visibility is changed.
 * @property { (callback: onValueChangeCallback<Boolean>) => void }            onDebugModeChanged   - a function that registers an {@link onValueChangeCallback} that will be called whenever the debug mode active state is changed.
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
    const currentLocation  = Attribute(null);
    const pageControllers  = {};

    /**
     * A function that navigates to the route
     * that is found for a given hash.
     *
     * @function
     * @param { String } hash
     * @return { void }
     */
    const navigate = hash => {
        // check if hash is empty to redirect to fallback homepage
        if(hash === '' || hash === '#') {
            const homepageController = navigationModel.getHomepage();
            if (null !== homepageController) {
                hash = homepageController.getHash();
            } else  {
                // return if fallback homepage is not defined
                return;
            }
        }

        window.location.hash = hash;
        const newLocation = getRoutingLocation(hash);

        // on initialization the currentLocation can be null and therefore not passivated
        if (valueOf(currentLocation) !== null) {
            valueOf(currentLocation).passivate();
        }

        newLocation.activate();
        currentLocation.getObs(VALUE).setValue(newLocation);

        if (navigationModel.isDebugMode()) {
            const debugController = pageControllers['#debug'];
            debugController.setParent(newLocation);
        }
    };

    /**
     * A function that finds the correct route for a path
     * and returns the corresponding pageController.
     *
     * @function
     * @param { String } path
     * @return { PageControllerType }
     */
    const getRoutingLocation = path => {
        const [hash] = path.split('/');
        /** @type { PageControllerType } */ let newLocation = pageControllers[hash];

        currentLocation.getObs(PATH).setValue(path);

        if(newLocation === undefined) { // if newLocation is undefined, navigate to an error page
            newLocation = pageControllers['#E404'];

        } else if (!newLocation.isNavigational()) { // if the newLocation exists but is not navigational we return a 403 forbidden error
            newLocation = pageControllers['#E403'];
        }
        return newLocation
    };

    // handles initial page load and page reload
    window.onload = () => {
        const hash = window.location.hash;
        navigate(hash);
    };

    // handles navigation through the browser URL field
    window.onhashchange = () => {
        const hash = window.location.hash;
        if (hash !== valueOf(currentLocation).getHash()) {
            navigate(hash);
        }
    };

    const addPageController = pageControllerToAdd => {
        if (pageControllerToAdd && pageControllers[pageControllerToAdd.getHash()] === undefined) {
            const hash = pageControllerToAdd.getHash();
            pageControllers[hash] = pageControllerToAdd;
            navigationModel.addNavigationHash(hash);
        } else {
            throw new Error('PageController could not be added to the NavigationModel. Please check that the qualifier is valid and has not already been added to the navigation: ' + pageControllerToAdd.getQualifier());
        }
    };

    return {
        addPageController: addPageController,
        addPageControllers: (...pageControllersToAdd) => {
            for (const pageController of pageControllersToAdd) {
                addPageController(pageController);
            }
        },
        getPageController: pageHash => pageControllers[pageHash],
        deletePageController: pageHash => {
            navigationModel.deleteNavigationHash(pageHash);
            delete pageControllers[pageHash];
        },
        registerAnchorClickListener: anchor => {
            anchor.onclick = e => {
                e.preventDefault();
                const hash = e.currentTarget.getAttribute('href');
                navigate(hash);
            };
        },
        setConfiguration: confObj => {
            for (const [key, value] of Object.entries(confObj)) {
                if (HASH === key){
                    console.error('You cannot change that hash');
                    return false;
                } else if (PARENT === key){
                    console.error('You can only call setParent() after this PageController has successfully been added to the NavigationController');
                    return false;
                } else {
                    navigationModel.getNavObs(key).setValue(value);
                }
            }
            return true;
        },
        setWebsiteName:         navigationModel.setWebsiteName,
        getWebsiteName:         navigationModel.getWebsiteName,
        setWebsiteLogo:         navigationModel.setWebsiteLogo,
        getWebsiteLogo:         navigationModel.getWebsiteLogo,
        setFavIcon:             navigationModel.setFavIcon,
        getFavIcon:             navigationModel.getFavIcon,
        setHomePage:            navigationModel.setHomepage,
        getHomePage:            navigationModel.getHomepage,
        setDebugMode:           navigationModel.setDebugMode,
        isDebugMode:            navigationModel.isDebugMode,
        setPath:                currentLocation.getObs(PATH).setValue,
        getPath:                currentLocation.getObs(PATH).getValue,
        onNavigationHashAdd:    navigationModel.onAdd,
        onNavigationHashDel:    navigationModel.onDel,
        onLocationChanged:      currentLocation.getObs(VALUE).onChange,
        onPathChanged:          currentLocation.getObs(PATH).onChange,
        onWebsiteNameChanged:   navigationModel.onWebsiteNameChanged,
        onWebsiteLogoChanged:   navigationModel.onWebsiteLogoChanged,
        onFavIconChanged:       navigationModel.onFavIconChanged,
        onDebugModeChanged:     navigationModel.onDebugModeChanged,
        onVisibleChanged:       navigationModel.onVisibleChanged,
    }
};

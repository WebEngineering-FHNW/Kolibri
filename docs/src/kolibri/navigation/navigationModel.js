import { Observable, ObservableList } from "../observable.js";

export { NavigationModel, Location , NO_SUCH_LOCATION}

/**
 * @typedef LocationType
 * @property { String } hash - starts with hash sign
 * @property { PageControllerType } pageController - controller that handles this hash
 */
// todo: when and how the hash sign is needed should be simplified
const Location = pageController => ({hash: pageController.getHash(), pageController: pageController});


/** @type { LocationType } */
const NO_SUCH_LOCATION   = undefined;

/**
 * NavigationModelType is the Model that contains the navigation-data for the overall application.
 * The model holds the page hashes of the accessible pages, the homepage, the website name, and the website logo.
 * @typedef NavigationModelType
 * @property { (pageHash: !String) => void } addLocation          - adds the hash of a page, calling all registered {@link ConsumerType}s.
 * @property { (pageHash: !String) => void } removeLocation       - deletes the hash of a page, calling all registered {@link ConsumerType}s.
 * @property { (cb: ConsumerType<String>) => Boolean } onLocationAdded            - registers an {@link ConsumerType} that will be called whenever a page hash is added.
 * @property { (cb: ConsumerType<String>) => Boolean } onLocationRemoved            - registers an {@link ConsumerType} that will be called whenever a page hash is deleted.
 * @property { (newHomepage: !LocationType) => void } setHomeLocation - sets the given PageController as the homepage. the homepage is the fallback page which gets opened when no hash is provided in the request url. Calling all registered {@link ValueChangeCallback}s.
 * @property { () => ?LocationType }           getHomeLocation        - returns the PageController of the homepage. See {@link setHomeLocation} for more details. Returns null if no homepage has been defined.
 * @property { (debugModeActive: Boolean) => void }  setDebugMode       - sets the debug mode active state. calling all registered {@link ValueChangeCallback}s.
 * @property { () => Boolean }                       isDebugMode        - returns if the debug mode is active.
 * @property { (name: String) => void }              setWebsiteName     - sets the name for the website, calling all registered {@link ValueChangeCallback}s. The name can be displayed by a {@link NavigationProjectorType}.
 * @property { () => String }                        getWebsiteName     - returns the name for the website. See {@link setWebsiteName} for more details.
 * @property { (logoSrcPath: String) => void }       setWebsiteLogo     - sets the path to the website logo, calling all registered {@link ValueChangeCallback}s. The website logo can be displayed by a {@link NavigationProjectorType}.
 * @property { () => String }                        getWebsiteLogo     - returns the path to the website logo. See {@link setWebsiteLogo}
 * @property { (favIconSrcPath: String) => void }    setFavIcon         - sets the favicon, calling all registered {@link ValueChangeCallback}s. The favicon path can be set with a {@link NavigationProjectorType} in the index.html.
 * @property { () => String }                        getFavIcon         - returns the path to the favicon. See {@link setFavIcon} for more details.
 * @property { (cb: ValueChangeCallback<String>)  => void } onWebsiteNameChanged - registers an {@link ValueChangeCallback} that will be called whenever the page name changes.
 * @property { (cb: ValueChangeCallback<String>)  => void } onWebsiteLogoChanged - registers an {@link ValueChangeCallback} that will be called whenever the page logo changes.
 * @property { (cb: ValueChangeCallback<String>)  => void } onFavIconChanged     - registers an {@link ValueChangeCallback} that will be called whenever the fav icon changes.
 * @property { (cb: ValueChangeCallback<PageControllerType>) => void } onHomeLocationChanged - registers an {@link ValueChangeCallback} that will be called whenever the homepage changes.
 * @property { (cb: ValueChangeCallback<Boolean>) => void } onDebugModeChanged   - registers an {@link ValueChangeCallback} that will be called whenever the debug mode changes.
 * @property { (cb: ValueChangeCallback<Boolean>) => void } onVisibleChanged     - registers an {@link ValueChangeCallback} that will be called whenever a pages visibility changes.
 * @property { (hash: String ) => LocationType } findLocationByHash -
 */

/**
 * Constructor for a NavigationModelType.
 * @return { NavigationModelType }
 * @constructor
 * @example
 * const navigationModel = NavigationModel();
 * navigationModel.onWebsiteNameChanged(val => console.log(val));
 * navigationModel.setWebsiteName("new website name");
 */

const NavigationModel = () => {
    /** @type { Array<LocationType> } */
    const locationList      = [];
    const locations         = ObservableList(locationList);
    
    /** @type { IObservable<LocationType> } */
    const homeLocationObs   = Observable(NO_SUCH_LOCATION);
    const debugModeObs      = Observable(false);
    const faviconObs        = Observable('');
    const websiteNameObs    = Observable('');
    const websiteLogoObs    = Observable('');
    const visibleObs        = Observable(true);

    /** @type { IObservable<LocationType> } */
    const currentLocationObs = Observable(undefined);

    const findLocationByHash = hash => locationList.find( location => {
        console.log( "hash", location.hash ); // todo: remove
        return location.hash === hash;
    });



    return /** @type { NavigationModelType } */ {
        addLocation:          locations.add,
        removeLocation:       hash => locations.del(findLocationByHash(hash)),
        onLocationAdded:      locations.onAdd,
        onLocationRemoved:    locations.onDel,

        setWebsiteName:       websiteNameObs.setValue,
        getWebsiteName:       websiteNameObs.getValue,
        onWebsiteNameChanged: websiteNameObs.onChange,

        setWebsiteLogo:       websiteLogoObs.setValue,
        getWebsiteLogo:       websiteLogoObs.getValue,
        onWebsiteLogoChanged: websiteLogoObs.onChange,

        setFavIcon:           faviconObs.setValue,
        getFavIcon:           faviconObs.getValue,
        onFavIconChanged:     faviconObs.onChange,

        setHomeLocation:       homeLocationObs.setValue,
        getHomeLocation:       homeLocationObs.getValue,
        onHomeLocationChanged: homeLocationObs.onChange,

        setDebugMode:         debugModeObs.setValue,
        isDebugMode:          debugModeObs.getValue,
        onDebugModeChanged:   debugModeObs.onChange,

        onVisibleChanged:     visibleObs.onChange, // todo: how can this ever be called when the setter is not exposed?

        setCurrentLocation:       currentLocationObs.setValue,
        getCurrentLocation:       currentLocationObs.getValue,
        onCurrentLocationChanged: currentLocationObs.onChange,

        findLocationByHash,

    }
};

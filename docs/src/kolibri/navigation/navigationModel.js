import { Observable, ObservableList } from "../observable.js";

export { NavigationModel, NO_SUCH_LOCATION}

/**
 * @typedef { PageControllerType } LocationType
 * This is a type alias for places where a page controller is used to reference a location in the sitemap.
 */

/** @type { LocationType } */
const NO_SUCH_LOCATION = undefined;

/**
 * NavigationModelType stores the navigation-data for the overall application:
 *  all accessible locations,
 *  which of the locations is considered the homepage,
 *  which of the locations is currently active,
 *  the website name, favicon, and the website logo.
 *
 * @typedef NavigationModelType
 * @property { (location: !LocationType) => void } addLocation          -
 * @property { (location: !LocationType) => void } removeLocation       -
 * @property { (pageHash: !String) => void } removeLocationByHash       -
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
 * @property { () => LocationType }                  getCurrentLocation -
 * @property { (newLocation: LocationType) => void } setCurrentLocation -
 * @property { (cb: ValueChangeCallback<LocationType>)  => void } onCurrentLocationChanged -
 * @property { (cb: ValueChangeCallback<String>)  => void } onWebsiteNameChanged - registers an {@link ValueChangeCallback} that will be called whenever the page name changes.
 * @property { (cb: ValueChangeCallback<String>)  => void } onWebsiteLogoChanged - registers an {@link ValueChangeCallback} that will be called whenever the page logo changes.
 * @property { (cb: ValueChangeCallback<String>)  => void } onFavIconChanged     - registers an {@link ValueChangeCallback} that will be called whenever the fav icon changes.
 * @property { (cb: ValueChangeCallback<LocationType>) => void } onHomeLocationChanged - registers an {@link ValueChangeCallback} that will be called whenever the homepage changes.
 * @property { (cb: ValueChangeCallback<Boolean>) => void } onDebugModeChanged   - registers an {@link ValueChangeCallback} that will be called whenever the debug mode changes.
 * @property { (hash: String ) => ?LocationType } findLocationByHash - returns location or {@link NO_SUCH_LOCATION} if not found.
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

    /** @type { IObservable<LocationType> } */
    const currentLocationObs = Observable(NO_SUCH_LOCATION);

    const findLocationByHash = hash => locationList.find( location => {
        return location.getHash() === hash;
    });

    return /** @type { NavigationModelType } */ {
        addLocation:          locations.add,
        removeLocation:       locations.del,
        removeLocationByHash: hash => locations.del(findLocationByHash(hash)),
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

        setCurrentLocation:       currentLocationObs.setValue,
        getCurrentLocation:       currentLocationObs.getValue,
        onCurrentLocationChanged: currentLocationObs.onChange,

        findLocationByHash,

    }
};

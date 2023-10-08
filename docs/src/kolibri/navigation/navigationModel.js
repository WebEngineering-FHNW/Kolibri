
import { Observable, ObservableList } from "../observable.js";

export { NavigationModel }

/**
 * NavigationModelType is the Model that contains the navigation-data for the application.
 * The model holds the page hashes of the accessible pages, the homepage, the websites name and the website logo.
 * @typedef NavigationModelType
 * @property { (pageHash: !String) => void } addNavigationHash          - adds the hash of a page, calling all registered {@link ConsumerType}s.
 * @property { (pageHash: !String) => void } deleteNavigationHash       - deletes the hash of a page, calling all registered {@link ConsumerType}s.
 * @property { (cb: ConsumerType<String>) => Boolean } onAdd            - registers an {@link ConsumerType} that will be called whenever a page hash is added.
 * @property { (cb: ConsumerType<String>) => Boolean } onDel            - registers an {@link ConsumerType} that will be called whenever a page hash is deleted.
 * @property { (newHomepage: !PageControllerType) => void } setHomepage - sets the given PageController as the homepage. the homepage is the fallback page which gets opened when no hash is provided in the request url. Calling all registered {@link ValueChangeCallback}s.
 * @property { () => ?PageControllerType }           getHomepage        - returns the PageController of the homepage. See {@link setHomepage} for more details. Returns null if no homepage has been defined.
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
 * @property { (cb: ValueChangeCallback<PageControllerType>) => void } onHomepageChanged - registers an {@link ValueChangeCallback} that will be called whenever the homepage changes.
 * @property { (cb: ValueChangeCallback<Boolean>) => void } onDebugModeChanged   - registers an {@link ValueChangeCallback} that will be called whenever the debug mode changes.
 * @property { (cb: ValueChangeCallback<Boolean>) => void } onVisibleChanged     - registers an {@link ValueChangeCallback} that will be called whenever a pages visibility changes.
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
    const navigationHashes = ObservableList([]);
    
    /** @type { IObservable<PageControllerType> } */
    const homepageObs       = Observable(undefined); 
    const debugModeObs      = Observable(false);
    const faviconObs        = Observable('');
    const websiteNameObs    = Observable('');
    const websiteLogoObs    = Observable('');
    const visibleObs        = Observable(true);


    return /** @type { NavigationModelType } */ {
        addNavigationHash:    navigationHashes.add,
        deleteNavigationHash: navigationHashes.del,
        onAdd:                navigationHashes.onAdd,
        onDel:                navigationHashes.onDel,
        setWebsiteName:       websiteNameObs.setValue,
        getWebsiteName:       websiteNameObs.getValue,
        onWebsiteNameChanged: websiteNameObs.onChange,
        setWebsiteLogo:       websiteLogoObs.setValue,
        getWebsiteLogo:       websiteLogoObs.getValue,
        onWebsiteLogoChanged: websiteLogoObs.onChange,
        setFavIcon:           faviconObs.setValue,
        getFavIcon:           faviconObs.getValue,
        onFavIconChanged:     faviconObs.onChange,
        setHomepage:          homepageObs.setValue,
        getHomepage:          homepageObs.getValue,
        onHomepageChanged:    homepageObs.onChange,
        setDebugMode:         debugModeObs.setValue,
        isDebugMode:          debugModeObs.getValue,
        onDebugModeChanged:   debugModeObs.onChange,
        onVisibleChanged:     visibleObs.onChange, // todo: how can this ever be called when the setter is not exposed?
    }
};

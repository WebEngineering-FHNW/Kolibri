import {
    ACTIVE,
    DESCRIPTION,
    HASH,
    ICONPATH,
    NAVIGATIONAL,
    PARENT,
    VALUE,
    VISIBLE,
    VISITED
} from "../kolibri/presentationModel.js";
import { PageModel } from "./pageModel.js";

export { PageController }

/**
 * @template T
 * @typedef { Object.<ObservableTypeString, T>} ModelConfigurationObject
 */


/**
 * PageControllerType is a controller for PageModelTypes.
 * It coordinates the state of the PageModelType and communicates changes to the PageProjectorTypes that are bound to the PageModelType and external observers.
 * The PageControllerType is responsible for the lifecycle handling of a PageModelType.
 *
 * @template T
 * @typedef PageControllerType
 * @property { () => void } activate    - a lifecycle function that allows a page to do initialization before displaying. This function will be called by a NavigationController on activation of this page.
 * @property { () => void } passivate   - a lifecycle function that allows a page to clean up before removing it from display. This function will be called by a NavigationController on passivation of this page.
 * @property { () => ?[T] } getDynamicContentControllers - a getter function that returns the dynamic content controllers. Dynamic content controllers control a model that can be projected at runtime by a {@link PageProjectorType}. Can be null if none are present.
 * @property { (confObj: ModelConfigurationObject) => boolean } setConfiguration - a function that sets the observables of this page for all keys in object to their value.
 * @property { () => String } getQualifier                          - a getter function that returns the qualifier for this page. The qualifier can be used for styling as it is unique and immutable.
 * @property { () => String } getHash                               - a getter function that returns the hash of the page. The hash is used for navigation by a {@link NavigationControllerType} and is unique and immutable.
 * @property { (newValue: String) => void } setValue                - a setter function that sets the newValue of the page. The value is the name for a page that can be used by both {@link PageProjectorType} and {@link NavigationProjectorType}.
 * @property { () => String } getValue                              - a getter function that returns the value of the page. See {@link setValue} for more details.
 * @property { (newDescription: String) => void } setDescription    - a setter function that sets a descriptive text of the page. The description can be used as a preview or teaser for a page that can be used by both {@link PageProjectorType} and {@link NavigationProjectorType}.
 * @property { () => String } getDescription                        - a getter function that returns a descriptive text of the page. See {@link setDescription} for more details.
 * @property { (iconPath: String) => void } setIconPath             - a setter function that sets the iconPath of the page (icon path must be relative to index.html). The icon is used to visually identify a page and can be used by both {@link PageProjectorType} and {@link NavigationProjectorType}.
 * @property { () => String } getIconPath                           - a getter function that returns the icon path of the page. See {@link setIconPath} for more details.
 * @property { (isActive: Boolean) => void } setActive              - a setter function that sets the active state of the page. The active state signals if a page is currently displayed. The active state should only be changed by a {@link NavigationControllerType}.
 * @property { () => Boolean } isActive                             - a getter function that returns the active state of the page. See {@link setActive} for more details.
 * @property { (isVisited: Boolean) => void } setVisited            - a setter function that sets the visited state of the page. The visited state declares if a page has been visited before and can be used by both {@link PageProjectorType} and {@link NavigationProjectorType}.
 * @property { () => Boolean } getVisited                           - a getter function that returns the visited state of the page. See {@link setVisited} for more details.
 * @property { (isVisible: Boolean) => void } setVisible            - a setter function that sets the isVisible state of the page. The visible state declares if a page is visible in the context of the current navigation. The visible state will mainly be used by a {@link NavigationProjectorType}. Note: a Page can be invisible but still navigational meaning that the user cannot see the page in the navigation but can still navigate to it directly with the hash. See {@link setNavigational} if you want to make it unreachable.
 * @property { () => Boolean } isVisible                            - a getter function that returns the isVisible state of the page. See {@link setVisible} for more details.
 * @property { (newParent: ?PageControllerType) => void } setParent - a setter function that sets the newParent that is given, if null is set, the parent is root. The parent can be used to hierarchically display a page in a navigation and will mainly be used by a {@link NavigationProjectorType}. Warning: if you call this method before the parent and this node have been added to the {@link NavigationControllerType}, unexpected behaviour will happen.
 * @property { () => ?PageControllerType } getParent                - a getter function that returns the parent of the page or null. See {@link setParent} for more details.
 * @property { (isNavigational: Boolean) => void } setNavigational  - a setter function that sets the navigational state of the page. The navigational state declares if a page should be reachable through navigation or if an error should be returned to the user. Note: a page can be unnavigational but still visible meaning that a user can see the page in the navigation but cannot navigate to it directly with the hash. See {@link setVisible} if you want to make it invisible.
 * @property { () => Boolean } isNavigational                       - a getter function that returns the navigational state of the page. See {@link setNavigational} for more details.
 * @property { (callback: ValueChangeCallback<Boolean>) => void } onActiveChanged             - a function that registers an {@link ValueChangeCallback} that will be called whenever the active state changes.
 * @property { (callback: ValueChangeCallback<String>) => void } onIconPathChanged            - a function that registers an {@link ValueChangeCallback} that will be called whenever the icon path changes.
 * @property { (callback: ValueChangeCallback<Boolean>) => void } onVisitedChanged            - a function that registers an {@link ValueChangeCallback} that will be called whenever the visited state changes.
 * @property { (callback: ValueChangeCallback<String>) => void } onValueChanged               - a function that registers an {@link ValueChangeCallback} that will be called whenever the value changes.
 * @property { (callback: ValueChangeCallback<Boolean>) => void } onNavigationalChanged       - a function that registers an {@link ValueChangeCallback} that will be called whenever the navigational state changes.
 * @property { (callback: ValueChangeCallback<Boolean>) => void } onVisibleChanged            - a function that registers an {@link ValueChangeCallback} that will be called whenever the visible state changes.
 * @property { (callback: ValueChangeCallback<?PageControllerType>) => void } onParentChanged - a function that registers an {@link ValueChangeCallback} that will be called whenever the parent changes.
 */

/**
 * Constructor for a PageControllerType.
 *
 * @template T
 * @constructor
 * @param { !String } qualifier             - unique qualifier for the page. The hash will be inferred from the qualifier, e.g. 'home' -> '#hash' and will be immutable. The qualifier will also be the initial page name that can be changed later.
 * @param { [T] } dynamicContentControllers - Dynamic content controllers control a model that can be projected at runtime by a {@link PageProjectorType}. Can be null if none are present.
 * @returns PageControllerType
 * @example
 * const homePageController = PageController('home', null);
 * homePageController.setIconPath('./navigation/icons/house.svg');
 * HomePageProjector(homePageController, pinToContentElement, './pages/home/home.html');
 */
const PageController = (qualifier, dynamicContentControllers) => {
    const pageModel = PageModel(qualifier);
    const pageContentControllers = dynamicContentControllers;

    return {
        activate: () => {
            pageModel.getPageObs(ACTIVE).setValue(true);
            pageModel.getPageObs(VISITED).setValue(true);
        },
        passivate: () => pageModel.getPageObs(ACTIVE).setValue(false),
        getDynamicContentControllers: () => pageContentControllers,
        setConfiguration: confObj => {
            for (const [key, value] of Object.entries(confObj)) {
                if (HASH === key){
                    console.error('You cannot change that hash');
                    return false;
                } else if (PARENT === key){
                    console.error('You can only call setParent() after this PageController has successfully been added to the NavigationController');
                    return false;
                } else {
                    pageModel.getPageObs(key).setValue(value);
                }
            }
            return true;
        },
        setParent: newParent => {
            if (null !== newParent) {
                let parent = newParent;
                let canAddParent = true;
                // iterate through all parents and check if thisNode is already a parent in the hierarchy
                while (null !== parent) {
                    if (parent.getHash() === pageModel.getPageObs(HASH).getValue()) {
                        console.error('Parent of this node cannot be a child of this node or this node itself.');
                        canAddParent = false;
                        break;
                    }
                    parent = parent.getParent();
                }
                if (canAddParent) {
                    pageModel.getPageObs(PARENT).setValue(newParent);
                }
            } else {
                // allow null as parent
                pageModel.getPageObs(PARENT).setValue(newParent);
            }
        },
        getQualifier:            pageModel.getQualifier,
        getHash:                 pageModel.getPageObs(HASH).getValue,
        setValue:                pageModel.getPageObs(VALUE).setValue,
        getValue:                pageModel.getPageObs(VALUE).getValue,
        setDescription:          pageModel.getPageObs(DESCRIPTION).setValue,
        getDescription:          pageModel.getPageObs(DESCRIPTION).getValue,
        setIconPath:             pageModel.getPageObs(ICONPATH).setValue,
        getIconPath:             pageModel.getPageObs(ICONPATH).getValue,
        setActive:               pageModel.getPageObs(ACTIVE).setValue,
        isActive:                pageModel.getPageObs(ACTIVE).getValue,
        setVisited:              pageModel.getPageObs(VISITED).setValue,
        getVisited:              pageModel.getPageObs(VISITED).getValue,
        setVisible:              pageModel.getPageObs(VISIBLE).setValue,
        isVisible:               pageModel.getPageObs(VISIBLE).getValue,
        setNavigational:         pageModel.getPageObs(NAVIGATIONAL).setValue,
        isNavigational:          pageModel.getPageObs(NAVIGATIONAL).getValue,
        getParent:               pageModel.getPageObs(PARENT).getValue,
        onActiveChanged:         pageModel.getPageObs(ACTIVE).onChange,
        onIconPathChanged:       pageModel.getPageObs(ICONPATH).onChange,
        onVisitedChanged:        pageModel.getPageObs(VISITED).onChange,
        onValueChanged:          pageModel.getPageObs(VALUE).onChange,
        onNavigationalChanged:   pageModel.getPageObs(NAVIGATIONAL).onChange,
        onVisibleChanged:        pageModel.getPageObs(VISIBLE).onChange,
        onParentChanged:         pageModel.getPageObs(PARENT).onChange,
    }
};

import { ObservableList } from "../../../kolibri/observable.js";
import { dom }           from "../../../kolibri/util/dom.js";
import { GridProjector } from "../util/gridProjector.js";

export { NavigationProjector as CardNavigationProjector }

/**
 * @typedef { Object.<String, HTMLAnchorElement[]>} ParentChildMap
 */


/**
 * @typedef NavigationProjectorType
 * @property { () => GridProjectorType } getGridProjector - a getter function that returns the grid projector for this navigation.
 */

/**
 * @constructor
 * @param { !NavigationControllerType } controller
 * @param { !HTMLDivElement } pinToElement
 * @returns NavigationProjectorType
 * @example
 * const navigationController = NavigationController();
 * DashboardNavigationProjector(navigationController, pinToNavElement);
 */
const NavigationProjector = (controller, pinToElement) => {
    const gridProjector = GridProjector();
    const positionWrapper = pinToElement;
    const observableNavigationAnchors = ObservableList([]);
    const parentAnchors = [];
    const childrenCards = {};

    /**
     * A function that initializes a navigation anchor
     *
     * @function
     * @param { !String } qualifier - the qualifier that uniquely
     * @param { !String } hash - the hash that represents the identifier of a page
     * @param { !String } pageName - the pageName that is displayed for this hash
     * @return { HTMLAnchorElement }
     *
     */
    const initializeNavigationPoint = (qualifier, hash, pageName) => {

        const [anchor] = dom(`
            <a id="${qualifier}-anchor" href="${hash}">${pageName}</a>
        `);

        return anchor;
    };

    /**
     * A projector function that projects a root anchor.
     *
     * @param { !HTMLDivElement } rootWrapper
     * @param { !String } qualifier
     * @param { !HTMLAnchorElement } anchor
     */
    const projectRootAnchors = (rootWrapper, qualifier, anchor) => {
        rootWrapper.append(anchor);

        rootWrapper.onclick = () => {
            const oldActive = document.getElementsByClassName('open')[0];
            if (undefined !== oldActive) {
                oldActive.classList.remove('open');
            }
            if (oldActive !== rootWrapper) {
                rootWrapper.classList.toggle('open');
            }
        };
    };

    /**
     * A projector function that projects all child anchors from an array.
     *
     * @param { !NavigationControllerType } navigationController
     * @param { !HTMLDivElement } cardWrapper
     * @param { !HTMLAnchorElement[] } childAnchors
     */
    const projectChildAnchors = (navigationController, cardWrapper, childAnchors) => {
        childAnchors.forEach(childAnchor => {
            const childController = navigationController.getPageController(childAnchor.hash);
            if (childController.isVisible()) {
                projectChildAnchor(childController, childAnchor);
                cardWrapper.append(childAnchor);
            }
        });
    };

    /**
     * A projector function that projects a child anchor.
     *
     * @param { !PageControllerType } childController
     * @param { !HTMLAnchorElement } childAnchor
     */
    const projectChildAnchor = (childController, childAnchor) => {
        childAnchor.classList.add('grid-item');
        const [cardIcon, cardDesc] = dom(`
                                <img src="${childController.getIconPath()}" alt="${childController.getValue()}-icon">
                                <p>${childController.getDescription()}</p>
                            `);
        if (0 === childAnchor.children.length) {
            const header = childAnchor.firstChild;
            childAnchor.removeChild(header);
            const [cardTitle] = dom(`
                                    <span>${header.textContent}</span>
                                `);
            childAnchor.append(cardIcon, cardTitle, cardDesc);
        }
        const gridProps = gridProjector.getGridForPage(childController.getQualifier());
        if (undefined !== gridProps && 1 === gridProps.rowSpan) {
            childAnchor.classList.add('half');
        }
    };

    /**
     * A utility function that returns the child anchors for a given parent. If no children are found, an empty array is returned.
     *
     * @param { !String } rootQualifier
     * @param { !ParentChildMap } parentChildMap
     * @return { HTMLAnchorElement[] }
     */
    const getChildAnchors = (rootQualifier, parentChildMap) => {
        if (undefined === parentChildMap[rootQualifier]) {
            return [];
        }
        return parentChildMap[rootQualifier];
    };

    /**
     * A projector function that projects all anchors and places them at the root or in a card depending on their hierarchy level.
     *
     * @param { !NavigationControllerType } navigationController
     * @param { !HTMLDivElement } navWrapper
     * @param { HTMLAnchorElement[] } rootAnchors
     * @param { !ParentChildMap } parentChildMap
     */
    const projectAnchors = (navigationController, navWrapper, rootAnchors, parentChildMap) => {
        const links = navWrapper.getElementsByClassName('links')[0];

        rootAnchors.forEach(rootAnchor => {
            const pageController = navigationController.getPageController(rootAnchor.hash);

            if (pageController.isVisible()) {
                const rootQualifier = pageController.getQualifier();
                const [rootWrapper, cardWrapper] = dom(`
                    <div id="${rootQualifier}-wrapper" class="nav-point-wrapper"></div>
                    <div class="card-wrapper"></div>
                `);

                const children = getChildAnchors(rootQualifier, parentChildMap);

                projectRootAnchors(rootWrapper, rootQualifier, rootAnchor);
                if (0 === children.length || (1 === children.length && children[0].hash === '#debug' )) {
                    rootWrapper.classList.add('childless');
                } else {
                    projectChildAnchors(navigationController, cardWrapper, children);
                    rootWrapper.append(cardWrapper);
                }

                links.append(rootWrapper);
            }
        });
    };

    /**
     * Binds the navigation anchors to the DOM.
     *
     * @function
     * @return void
     */
    const projectNavigation = () => {
        const [navWrapper] = dom(`
            <div class="card-nav nav-wrapper">
                <div class="card-header">
                    <a id="card-logo" href="${controller.getHomePage() ? controller.getHomePage().getHash() : '#'}">
                        <img src="${controller.getWebsiteLogo()}" alt="${controller.getWebsiteName()}-logo"/>
                    </a>
                    <p>${controller.getWebsiteName()}</p>
                </div>
                <div class="links">
                    <!-- Placeholder for navigation links -->
                </div>
            </div>
        `);

       projectAnchors(controller, navWrapper, parentAnchors, childrenCards);

        if (positionWrapper.firstChild === null) {
            positionWrapper.appendChild(navWrapper)
        } else {
            positionWrapper.replaceChild(navWrapper, positionWrapper.firstChild);
        }
    };

    observableNavigationAnchors.onAdd(anchor => {
        controller.registerAnchorClickListener(anchor);
        const pageController = controller.getPageController(anchor.hash);
        const qualifier = pageController.getQualifier();
        const parent = pageController.getParent();

        if (null === parent) {
            parentAnchors.push(anchor);
        } else {
            childrenCards[qualifier].push(anchor);
        }
        projectNavigation();
    });

    controller.onWebsiteNameChanged(newWebsiteName => {
        if (null !== newWebsiteName) {
            const cardHeader = document.getElementsByClassName('card-header')[0];
            if (undefined !== cardHeader) {
                cardHeader.lastElementChild.innerHTML = newWebsiteName;
            }
        }
    });

    controller.onWebsiteLogoChanged(newWebsiteLogoSrc => {
        if (null !== newWebsiteLogoSrc) {
            const cardHeaderLogo = document.getElementById('card-logo');
            if (null !== cardHeaderLogo) {
                cardHeaderLogo.firstElementChild.src = newWebsiteLogoSrc;
                console.log(cardHeaderLogo.firstElementChild);
            }
        }
    });

    controller.onFavIconChanged(newFavIconSrc => {
        if (null !== newFavIconSrc) {
            const favIcon = document.getElementById('favicon');
            favIcon.href = newFavIconSrc;
        }
    });

    controller.onNavigationHashAdd(hash => {
        const pageController = controller.getPageController(hash);
        const qualifier = pageController.getQualifier();
        const pageName = pageController.getValue();

        const newNavPoint = initializeNavigationPoint(qualifier, hash, pageName);
        observableNavigationAnchors.add(newNavPoint);

        pageController.onParentChanged((newParent, oldParent) => {
            addAnchor(pageController, newParent, oldParent, parentAnchors, childrenCards);
            if(pageController.isActive()){
                setActiveCSSClass(pageController.isActive(), pageController.getQualifier(), newParent);
                setActiveCSSClass(!pageController.isActive(), pageController.getQualifier(), oldParent);
            }
            projectNavigation();
        });

        pageController.onActiveChanged(isActive => {
            setActiveCSSClass(isActive, qualifier, pageController.getParent());
            setPageTitle(hash, isActive);
        });

        pageController.onVisitedChanged(visited => {
            setVisitedCSSClass(visited, qualifier);
        });

        pageController.onVisibleChanged(isVisible => {
            setVisibleCSSClass(isVisible, qualifier, pageController.getParent());
        });

        projectNavigation();
    });

    /* ********************* Utility functions for bindings ***************************** */

    /**
     * A utility function that adds an anchor to the corresponding data structure depending on if it is a child or a parent.
     *
     * @param { !PageControllerType } pageController
     * @param { ?PageControllerType } newParent
     * @param { ?PageControllerType } oldParent
     * @param { !HTMLAnchorElement[] } parentAnchors
     * @param { !ParentChildMap } parentChildMap
     */
    const addAnchor = (pageController, newParent, oldParent, parentAnchors, parentChildMap) => {
        if (null === newParent) {
            addParentAnchor(pageController, newParent, oldParent, parentAnchors, parentChildMap);
        } else if (null === oldParent) {
            addChildAnchor(pageController, newParent, parentAnchors, parentChildMap);
        } else {
            swapParents(pageController, newParent, oldParent, parentAnchors, parentChildMap);
        }
    };

    /**
     * A utility function that adds an anchor to the parent anchors data structure
     * and removes it from the child anchors if present.
     *
     * @param { !PageControllerType } pageController
     * @param { ?PageControllerType } newParent
     * @param { ?PageControllerType } oldParent
     * @param { !HTMLAnchorElement[] } parentAnchors
     * @param { !ParentChildMap } parentChildMap
     */
    const addParentAnchor = (pageController, newParent, oldParent, parentAnchors, parentChildMap) => {
        const qualifier = pageController.getQualifier();
        const pageName = pageController.getValue();
        // initialize empty child array for new parents
        if (undefined === parentChildMap[qualifier]) {
            parentChildMap[qualifier] = [];
        }
        if (null !== oldParent) {
            const children = parentChildMap[oldParent.getQualifier()];
            const deleteAnchorIndex = children.findIndex(anchor => anchor.id === qualifier + '-anchor');
            if (deleteAnchorIndex !== -1) {
                const newParentAnchor = children[deleteAnchorIndex];
                transformChildToParentAnchor(newParentAnchor, pageName);
                parentAnchors.push(newParentAnchor);
                removeAtIndex(children, deleteAnchorIndex);
            }
        }
    };

    /**
     * A utility function that adds an anchor to the children anchors data structure
     * and removes it from the parent anchors if present.
     *
     * @param { !PageControllerType } pageController
     * @param { ?PageControllerType } newParent
     * @param { !HTMLAnchorElement[] } parentAnchors
     * @param { !Object } childrenCards
     */
    const addChildAnchor = (pageController, newParent, parentAnchors, childrenCards) => {
        const qualifier = pageController.getQualifier();
        const deleteAnchorIndex = parentAnchors.findIndex(anchor => anchor.id === qualifier + '-anchor');
        const children = childrenCards[newParent.getQualifier()];
        const childExists = children.findIndex(child => child.id === qualifier + '-anchor');

        if (-1 === childExists) {
            children.push(parentAnchors[deleteAnchorIndex]);
        }
        if (-1 !== deleteAnchorIndex) {
            removeAtIndex(parentAnchors, deleteAnchorIndex);
        }
    };

    /**
     * A utility function that swaps an anchor to a new parent node
     * and removes it from the old parent node.
     *
     * @param { !PageControllerType } pageController
     * @param { ?PageControllerType } newParent
     * @param { ?PageControllerType } oldParent
     * @param { !HTMLAnchorElement[] } parentAnchors
     * @param { !ParentChildMap } parentChildMap
     */
    const swapParents = (pageController, newParent, oldParent, parentAnchors, parentChildMap) => {
        const qualifier = pageController.getQualifier();
        const newChildren = childrenCards[newParent.getQualifier()];
        const oldChildren = childrenCards[oldParent.getQualifier()];
        const anchorIndex = oldChildren.findIndex(anchor => anchor.id === qualifier + '-anchor');

        const childExists = newChildren.findIndex(child => child.id === qualifier + '-anchor');

        if (-1 === childExists) {
            newChildren.push(oldChildren[anchorIndex]);
        }
        if (-1 !== anchorIndex) {
            removeAtIndex(oldChildren, anchorIndex);
        }
    };

    /**
     * A utility function that changes transforms the child anchor html structure
     * so that it represents the parent anchor html structure. The function also removes child CSS classes.
     *
     * @param { !HTMLAnchorElement } anchor
     * @param { !String } pageName
     */
    const transformChildToParentAnchor = (anchor, pageName) => {
        anchor.innerHTML = pageName;
        anchor.classList.forEach(cssClass => anchor.classList.remove(cssClass));
    };

    /**
     * A utility function that removes an array element at index i.
     * @template T
     * @param { T[] } arr
     * @param { number } i
     */
    const removeAtIndex = (arr, i) => {
        arr.splice(i, 1);
        if (1 === arr.length && undefined === arr[0]) {
            arr = [];
        }
    };

    /**
     * A utility function that sets the active CSS class for the given qualifier
     * and removes the class from the old active qualifier.
     *
     * @function
     * @param { !Boolean } isActive
     * @param { !String } qualifier
     * @param { ?PageControllerType } parentController
     */
    const setActiveCSSClass = (isActive, qualifier, parentController) => {
        const thisAnchor = document.getElementById(qualifier + '-anchor');
        if (null !== parentController) {
            setActiveCSSClass(isActive, parentController.getQualifier(), null);
        }
        if (null !== thisAnchor) {
            if (isActive) {
                thisAnchor.classList.add('active');
            } else if (!isActive) {
                thisAnchor.classList.remove('active');
            }
        }
    };

    /**
     * A utility function that sets the HTML title attribute to the value of the page identified by hash.
     *
     * @function
     * @param { !String } hash
     * @param { !Boolean } active
     */
    const setPageTitle = (hash, active) => {
        const pageName = controller.getPageController(hash).getValue();
        if (active) {
            const title = document.querySelector("head title");
            title.innerText = pageName.charAt(0).toUpperCase() + pageName.slice(1);
        }
    };

    /**
     * A utility function that sets the visited CSS class for the given qualifier
     *
     * @function
     * @param { !Boolean } visited
     * @param { !String } qualifier
     */
    const setVisitedCSSClass = (visited, qualifier) => {
        if (visited) {
            const anchor = document.getElementById(qualifier + '-anchor');
            anchor.classList.add('visited');
        }
    };

    /**
     * A utility function that adds or removes the invisible CSS class to a given node with the qualifier.
     *
     * @function
     * @param { !Boolean } isVisible
     * @param { !String } qualifier
     * @param { ?PageControllerType } parentController
     */
    const setVisibleCSSClass = (isVisible, qualifier, parentController) => {
        let thisAnchor;
        if (null !== parentController) {
            thisAnchor = document.getElementById(qualifier + '-anchor');
        } else {
            thisAnchor = document.getElementById(qualifier + '-wrapper');
        }
        if (null !== thisAnchor) {
            if (isVisible) {
                thisAnchor.classList.remove('invisible');
            } else if (!isVisible) {
                thisAnchor.classList.add('invisible');
            }
        }

    };

    return {
        getGridProjector: () => gridProjector
    }
};

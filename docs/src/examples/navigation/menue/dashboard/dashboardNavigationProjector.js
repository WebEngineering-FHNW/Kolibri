import { ObservableList } from "../../../../kolibri/observable.js";
import { dom }            from "../../../../kolibri/util/dom.js";

export { NavigationProjector }

/**
 * @typedef NavigationProjectorType
 */

/**
 * @constructor
 * @param { !NavigationControllerType } controller
 * @param { !HTMLDivElement } pinToElement
 * @return { NavigationProjectorType }
 * @example
 * const navigationController = NavigationController();
 * NavigationProjector(navigationController, pinToNavElement);
 */
const NavigationProjector = (controller, pinToElement) => {
    const positionWrapper = pinToElement;
    const observableNavigationAnchors = ObservableList([]);
    const navigationAnchors = [];

    const tree = document.createElement('ol');
    tree.id = 'tree';

    /**
     * A function that initializes a navigation anchor
     *
     * @function
     * @param { !String } hash - the hash that represents the identifier of a page
     * @param { !String } pageName - the pageName that is displayed for this hash
     * @param { ?PageControllerType } parentNode - the parent of this node or null if no parent exists
     * @return { HTMLAnchorElement }
     *
     */
    const initializeNavigationPoint = (hash, pageName, parentNode) => {

        // initialize anchor
        const anchorDom = dom(`
            <a href="${hash}" id="${pageName}-a">
                <span class="icon" id="${pageName}-icon-wrapper">
                    <img class="icon" id="${pageName}-icon" alt="${pageName}-icon">
                </span>
                <span class="text">${pageName}</span>
            </a>
        `);

        // initialize li wrapper for styling purposes
        const navPointDom = dom(`
                <li class="list" id="${pageName}-li">
                    <!-- Placeholder for anchor tag -->
                </li>
        `);

        // get anchor from collection
        const anchor = anchorDom[0];

        navPointDom[pageName + '-li'].append(anchor);

        // check if node is root element or if parentNode already exists
        if (null === parentNode) {
            tree.append(...navPointDom);
        } else {
            const parentName = parentNode.getValue();
            const navPointLi = navPointDom.namedItem(`${pageName}-li`);
            appendNode(navPointLi, parentName);
        }

        return anchor;
    };

    /**
     * A function that binds the navigation anchors to the DOM.
     *
     * @function
     * @return void
     */
    const projectNavigation = () => {
        const navigationDiv = document.createElement("div");
        navigationDiv.classList.add('dashboard-nav', 'open');
        navigationDiv.append(tree);

        if (null === positionWrapper.firstChild) {
            positionWrapper.appendChild(navigationDiv)
        } else {
            positionWrapper.replaceChild(navigationDiv, positionWrapper.firstChild);
        }

        const arrowSVGPathRelativeIndex = "../prototype/navigation/icons/right-arrow-gradient.svg";

        const toggle = dom(`
            <div id="toggle">
                <img src="${arrowSVGPathRelativeIndex}" alt="right-arrow">
            </div>
        `);

        toggle["toggle"].onclick = () => navigationDiv.classList.toggle('open');
        navigationDiv.append(...toggle);
    };

    /**
     * A function that finds an HTML element by its ID in an HTML Collection
     *
     * @function
     * @param { HTMLElement } tree
     * @param { String } searchId
     * @return { HTMLElement|null }
     */
    const findElementById = (tree, searchId) =>{
        if(tree.id === searchId){
            return tree;
        } else if (null !== tree.children){
            let result = null;
            for(let i=0; null === result && i < tree.children.length; i++){
                result = findElementById(tree.children[i], searchId);
            }
            return result;
        }
        return null;
    };

    /**
     * A function that appends a node to a given parentNode in a tree structure.
     *
     * @function
     * @param { !HTMLElement } node
     * @param { !String } parentName
     * @return { void }
     */
    const appendNode = (node, parentName) => {
        const parentLi = findElementById(tree, parentName + '-li');
        if (null !== parentLi) {
            let childrenNodeList = parentLi.children.namedItem(parentName + '-children');
            if (null === childrenNodeList) {
                // create sublist for children and append child
                childrenNodeList = document.createElement('ol');
                childrenNodeList.id = parentName + '-children';
                parentLi.append(childrenNodeList);
            }
            childrenNodeList.append(node);
        }

    };

    /**
     * A function that moves childNode from oldParent to newParent.
     *
     * @param { !HTMLElement } childNode
     * @param { ?PageControllerType } oldParent
     * @param { ?PageControllerType } newParent
     * @return { void }
     */
    const moveChildNode = (childNode, oldParent, newParent) => {
        if (null === newParent) { // append node to root if newParent is null
            tree.append(childNode);
        } else if (null === oldParent) { // check if old parent is root and move node from root to newParent
            tree.removeChild(childNode);
            const parentName = newParent.getValue();
            appendNode(childNode, parentName);
        } else { // if new parent and old parent are not root, move node from oldParent to newParent
            const oldParentName = oldParent.getValue();
            const oldParentChildrenNodeList = findElementById(tree, oldParentName + '-children');
            oldParentChildrenNodeList.removeChild(childNode);
            // check if list of children has no more elements and if so remove it
            if (oldParentChildrenNodeList.children.length < 1) {
                const oldParentNode = findElementById(tree, oldParentName + '-li');
                oldParentNode.removeChild(oldParentChildrenNodeList);
            }
            const parentName = newParent.getValue();
            appendNode(childNode, parentName);
        }
    };

    observableNavigationAnchors.onAdd(anchor => {
        controller.registerAnchorClickListener(anchor);
        navigationAnchors.push(anchor);
    });

    controller.onNavigationHashAdd(hash => {

        // CREATE BINDINGS
        controller.getPageController(hash).onParentChanged((newParent, oldParent) => {
            addNodeToTree(hash, newParent, oldParent);
            setParentCSSClass(hash, newParent, oldParent);
            projectNavigation();
        });

        controller.getPageController(hash).onVisibleChanged(visible => {
            setInvisibleCSSClass(hash, visible);
            projectNavigation();
        });

        controller.getPageController(hash).onActiveChanged((newActive, oldActive) => {
            setActiveCSSClass(hash, newActive, oldActive);
            setParentActiveCSSClass(hash, newActive, oldActive);
            setPageTitle(hash, newActive);
        });

        controller.getPageController(hash).onIconPathChanged(newIcon => setIconSource(hash, newIcon));
        // END
    });

    /* ********************* Utility functions for bindings ***************************** */
    /**
     * A utility function that adds the given hash as a node the newParent
     * and removes it from the oldParent.
     *
     * @param { !String } hash
     * @param { ?PageControllerType } newParent
     * @param { ?PageControllerType } oldParent
     */
    const addNodeToTree = (hash, newParent, oldParent) => {
        const pageName = controller.getPageController(hash).getValue();
        const thisNode = findElementById(tree, pageName + '-li');
        if (null === thisNode) { // check if this node has not been initialized yet
            const newNavPoint = initializeNavigationPoint(hash, pageName, newParent);
            observableNavigationAnchors.add(newNavPoint);
        } else {
            // relocate node
            moveChildNode(thisNode, oldParent, newParent);
        }
    };

    /**
     * A utility function that adds the parent CSS class to the newParent if it does not exist already
     * and removes it from the oldParent.
     *
     * @param { !String } hash
     * @param { ?PageControllerType } newParent
     * @param { ?PageControllerType } oldParent
     */
    const setParentCSSClass = (hash, newParent, oldParent) => {
        // Add class for styling to newParent if not null and remove it from oldParent if not null
        let oldParentHasNoChildren = true;

        const newParentPageList = findPageListTagInTree(newParent);
        const oldParentPageList = findPageListTagInTree(oldParent);

        if(null !== oldParentPageList) {
            for (const child of oldParentPageList.children) {
                if (child.tagName === 'ol') {
                    oldParentHasNoChildren = false;
                }
            }
            if (oldParentHasNoChildren) {
                oldParentPageList.classList.remove('parent');
            }
        }
        if(null !== newParentPageList && !newParentPageList.classList.contains('parent')) {
            newParentPageList.classList.add('parent');
        }
    };

    /**
     * A utility function that finds the page list tag in a DOMTree
     *
     * @function
     * @param { ?PageControllerType } controller
     * @return { ?HTMLElement }
     */
    const findPageListTagInTree = controller => {
        let parentPage = null;
        if(null !== controller) {
            const pageNameNewParent = controller.getValue();
            parentPage = findElementById(tree, pageNameNewParent + '-li');
        }
        return parentPage;
    };

    /**
     * A utility function that sets the active CSS class for the given hash
     * and removes the class from the old active hash.
     *
     * @function
     * @param { !String } hash
     * @param { !Boolean } newActive
     * @param { !Boolean } oldActive
     */
    const setActiveCSSClass = (hash, newActive, oldActive) => {
        const pageController = controller.getPageController(hash);
        const pageName = pageController.getValue();
        const pageAnchor = findElementById(tree, pageName + '-a');
        if (null !== pageAnchor) {
            if (newActive) {
                pageAnchor.classList.add('active');
            } else if (newActive !== oldActive) {
                pageAnchor.classList.remove('active');
            }
        }
    };

    /**
     * A utility function that sets the active CSS class for the parent of a given hash
     * and removes the class from the old active hash.
     *
     * @function
     * @param { !String } hash
     * @param { !Boolean } newActive
     * @param { !Boolean } oldActive
     */
    const setParentActiveCSSClass = (hash, newActive, oldActive) => {
        const pageController = controller.getPageController(hash);
        let parentNode = pageController.getParent();
        if (null !== parentNode) {
            while (null !== parentNode.getParent()) {
                parentNode = parentNode.getParent();
            }
            const parentName = parentNode.getValue();
            const parentAnchor = findElementById(tree, `${parentName}-a`);
            if (newActive) {
                parentAnchor.classList.add('parent-active');
            } else if (newActive !== oldActive) {
                parentAnchor.classList.remove('parent-active');
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
            const title = document.getElementsByTagName("title")[0];
            title.innerText = pageName.charAt(0).toUpperCase() + pageName.slice(1);
        }
    };

    /**
     * A utility function that sets the invisible CSS class for the given hash if it is invisible.
     *
     * @param { !String } hash
     * @param { !Boolean } visible
     */
    const setInvisibleCSSClass = (hash, visible) => {
        const pageName = controller.getPageController(hash).getValue();
        const pageLi = findElementById(tree, pageName + '-li');
        if (null !== pageLi && visible) {
            pageLi.classList.remove('invisible');
        } else if (null !== pageLi) {
            pageLi.classList.add('invisible');
        }
    };

    /**
     * A utility function that sets the icon source for the given hash to newIcon.
     *
     * @function
     * @param { !String } hash
     * @param { !String } newIcon
     */
    const setIconSource = (hash, newIcon) => {
        const anchor = navigationAnchors.find(a => a.hash === hash);
        const anchorIcon = anchor.getElementsByTagName('img')[0];

        anchorIcon.setAttribute('src', newIcon);
    }
};

import { ObservableList } from "../../../observable.js";
import { dom }            from "../../../util/dom.js";

export { PageSwitchProjector }

/**
 * @typedef NavigationProjectorType
 * @property { (exampleDiv: !HTMLDivElement) => HTMLDivElement } projectNavigation - a function that returns a HtmlDivElement where the example and code switch is implemented.
 */

/**
 * @constructor
 * @param { !String } hash - the hash for which this PageSwitchProjector will project.
 * @param { !NavigationControllerType } navigationController - the navigation controller that controls the current path.
 * @param { !String } gistID - the GitHub GistID of the code that you want to show.
 * @return { NavigationProjectorType }
 */
const PageSwitchProjector = (hash, navigationController, gistID) => {
    const observableNavigationAnchors = ObservableList([]);
    const navigationAnchors = [];

    const [switchDiv, navDiv, contentDiv, codeDiv] = dom(`
            <div class="switch-nav"></div>
            <div class="ensemble-navigation"></div>
            <div class="ensemble-content"></div>
            <div class="code gistEmbed" data-gist-id="${gistID}"></div>
        `);

    /**
     * A function that renders the code block headers based on the github gists.
     */
    const renderCodeBlockHeaders = () => {
        const codeBlocks = codeDiv.getElementsByTagName('table');
        for (const codeBlock of codeBlocks) {
            const fileNameWithExtension = codeBlock.getAttribute('data-tagsearch-path');
            let fileNameWOExtension = fileNameWithExtension.split('.js')[0];
            fileNameWOExtension = fileNameWOExtension.replace(/[^\w\s]/gi, '');
            fileNameWOExtension = fileNameWOExtension.replace(' ', '-');
            const [fileHeader] = dom(`<h3>${fileNameWOExtension}</h3>`);
            let fileContainer = document.getElementById('file-' + fileNameWOExtension.toLowerCase() + '-js');
            while (null != fileContainer && !fileContainer.classList.contains('gist-file')) {
                fileContainer = fileContainer.parentNode;
            }
            fileContainer.parentNode.insertBefore(fileHeader, fileContainer);
        }
    };

    /**
     * A function that creates a JSONP request for the given GitHub GistID.
     * The content will dynamically be fetched and rendered into the given codeDiv.
     *
     * JSONP is used to bypass CORS, for more details visit: https://en.wikipedia.org/wiki/JSONP.
     *
     * @param { !HTMLDivElement } codeDiv - the div that you want to render your gist in.
     * @param { !String } gistID - the gist id for the gist you want to render.
     */
    const loadGist = (codeDiv, gistID) => {
        // REF: http://stackoverflow.com/a/16178339
        const callbackName = "gist_callback";
        window[callbackName] = gistData => {
            delete window[callbackName];
            codeDiv.innerHTML = gistData['div'];
        };

        const script = document.createElement("script");
        script.setAttribute("src", "https://gist.github.com/" + gistID + ".json?callback=" + callbackName);
        script.onload = renderCodeBlockHeaders;
        document.body.appendChild(script);
    };

    /**
     * A function that adds a css class to elementStateActive
     * and removes it from the elementStateInactive.
     *
     * @param { !String } cssClass - the css class to toggle
     * @param { !HTMLDivElement } elementStateActive - the element where the class will be added
     * @param { !HTMLDivElement } elementStateInactive - the element where the class will be removed
     */
    const toggleState = (cssClass, elementStateActive, elementStateInactive) => {
        elementStateActive.classList.add(cssClass);
        elementStateInactive.classList.remove(cssClass);
    };

    /**
     * A function that switches between the example / code view. The displayed view is decided based on the given path.
     *
     * @param { !String } path - the path for which this toggle decides whether to switch or not.
     */
    const toggleSwitch = path => {
        const exampleDiv = document.querySelector('.example');
        if (path && exampleDiv && 2 === navigationAnchors.length) {
            projectNavigation(exampleDiv);
        }
    };


    /**
     * Initializes the navigation anchors
     *
     * @function
     * @return { HTMLAnchorElement[] }
     *
     */
    const initializeNavigationPoint = () => {
        const [exampleAnchor, codeAnchor] = dom(`
            <a href="${hash}/example">Example</a>
            <a href="${hash}/code">Code</a>
        `);

        return [/** @type { HTMLAnchorElement } */ exampleAnchor, /** @type { HTMLAnchorElement } */ codeAnchor];
    };

    /**
     * A function that initializes the content of this navigation.
     *
     * @param { !HTMLDivElement } exampleDiv - the div where the example part of this code is rendered in.
     */
    const initializeNavigation = exampleDiv => {
        if (0 === navigationAnchors.length) {
            const [exampleAnchor, codeAnchor] = initializeNavigationPoint();
            observableNavigationAnchors.add(exampleAnchor);
            observableNavigationAnchors.add(codeAnchor);
        }
        const [exampleAnchor, codeAnchor] = navigationAnchors;

        exampleDiv.classList.add('example');

        loadGist(codeDiv, gistID);

        contentDiv.append(exampleDiv, codeDiv);
        navDiv.append(exampleAnchor, codeAnchor);
        switchDiv.append(navDiv, contentDiv);
    };

    /**
     * Binds the navigation anchors to the DOM.
     *
     * @function
     * @param { !HTMLDivElement } exampleDiv  - a div with the projection of a running example. Mandatory.
     * @return { HTMLDivElement }
     */
    const projectNavigation = exampleDiv => {
        if (0 === switchDiv.children.length) {
            initializeNavigation(exampleDiv);
        }

        const [exampleAnchor, codeAnchor] = navigationAnchors;

        const currentPath = navigationController.getPath();
        if (currentPath.includes(hash + '/code')) {
            toggleState('active', codeAnchor, exampleAnchor);
            toggleState('invisible', exampleDiv, codeDiv);
            navDiv.classList.add('active');
        } else if (currentPath.includes(hash)) {
            toggleState('active', exampleAnchor, codeAnchor);
            toggleState('invisible', codeDiv, exampleDiv);
            navDiv.classList.remove('active');
        }

        return /** @type HTMLDivElement */ switchDiv;
    };

    observableNavigationAnchors.onAdd(anchor => {
        navigationController.registerAnchorClickListener(anchor);
        navigationAnchors.push(anchor);
    });

    navigationController.onPathChanged(newPath => {
        toggleSwitch(newPath);
    });

    return {
        projectNavigation
    };
};

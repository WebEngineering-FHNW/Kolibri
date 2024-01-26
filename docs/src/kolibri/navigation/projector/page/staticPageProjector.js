import {dom} from "../../../util/dom.js";

export { StaticPageProjector }

/**
 * PageProjectorType is responsible to project a PageModelType's content to the DOM.
 * A PageProjectorType binds itself to the DOM when the Page is activated.
 * A PageProjectorType observes the PageModelType via a PageControllerType.
 *
 * @typedef PageProjectorType
 */

/**
 * A constructor for a PageProjectorType.
 *
 * @constructor
 * @param { !PageControllerType } pageController - the pageController that controls the PageModelType we want to observe. Mandatory.
 * @param { !HTMLDivElement } pinToElement - the element in the DOM that we want to bind to append the pageContent. Mandatory.
 * @param { String } contentFilePath - the path to the static html content relative to index.html! Can be null.
 * @param { ?String } styleFilePath  - the path to the static css file! Optional. Defaults to ''.
 * @returns { PageProjectorType }
 * @example
 * const homePageController = PageController("home", null);
 * homePageController.setIcon('./navigation/icons/house.svg');
 * HomePageProjector(homePageController, pinToContentElement, './pages/home/home.html');
 */
const StaticPageProjector = (pageController, pinToElement, contentFilePath, styleFilePath = '') => {
    const pageWrapper = pinToElement;
    const contentWrapper = document.createElement("div");
    const header = document.createElement("h1");
    const [styleSheetElement] = dom(`<link rel="stylesheet" href="${styleFilePath}">`);

    /**
     * A function that initializes the content and stores it in the pageWrapper.
     *
     * @function
     * @return { void }
     */
    const initialize = () => {
        const contentPromise = fetchPageContent(contentFilePath);
        contentPromise.then(contentHtml => {
            contentWrapper.innerHTML = contentHtml;
            const existingH1 = contentWrapper.querySelector('h1');
            if (null !== existingH1) {
                pageController.setValue(existingH1.textContent);
                existingH1.remove();
            }
            contentWrapper.prepend(header);


            if (pageWrapper.firstChild === null) {
                pageWrapper.append(contentWrapper);
            } else {
                pageWrapper.replaceChild(contentWrapper, pageWrapper.firstChild);
            }
        });

        const pageClass = pageController.getHash().slice(1);
        contentWrapper.classList.add(pageClass);
    };

    /**
     * A function that creates the DOM binding and initializes the page on first activation.
     *
     * @function
     * @return { void }
     */
    const projectPage = () => {
        // initialize content on first call
        if (contentWrapper.firstChild === null) {
            initialize();
        }
        // bind content to document
        if (pageWrapper.firstChild === null) {
            pageWrapper.append(contentWrapper);
        } else {
            pageWrapper.replaceChild(contentWrapper, pageWrapper.firstChild);
        }
    };

    /**
     * An async function that fetches the static page content from a given filePath and returns a promise with the string content.
     *
     * @param filePath - the filePath that belongs to the static page content
     * @return { Promise<String> }
     */
    const fetchPageContent = async (filePath) => { // TODO: use utility function
        try {
            const response = await fetch(filePath, {
                    headers: {
                        'Content-Type': 'application/html',
                        'Accept': 'application/html'
                    }
                }
            );
            if (response.ok) {
                const content = await response.text();
                return content;
            } else {
                // TODO: proper logging.
                throw new Error(`HTTP error: ${response.status}`);
            }
        } catch (e) {
            console.error(e);
        }
    };

    pageController.onActiveChanged( active => {
        if (active) {
            projectPage();
        }
        if(styleFilePath) {
            if (active) {
                document.head.append(styleSheetElement);
            } else {
                styleSheetElement.parentElement.removeChild(styleSheetElement);
            }
        }
    });

    /**
     * A utility function that sets the header of the page to the new value if it is not undefined.
     *
     * @param { ?String } newValue
     */
    const setH1 = newValue => {
        if (undefined !== newValue) {
            header.textContent = newValue
        }
    };

    pageController.onValueChanged(newValue => {
        setH1(newValue);
    });


};


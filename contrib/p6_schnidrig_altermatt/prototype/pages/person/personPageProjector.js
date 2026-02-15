import { personProjectMasterView, personProjectDetailView } from "./masterDetailProjector.js";
import { personPageCss } from "./instantUpdateProjector.js";
import { dom } from "../../kolibri/util/dom.js";

export { PersonPageProjector }

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
 * @template T
 * @param { !PageControllerType } pageController - the pageController that controls the PageModelType we want to observe. Mandatory.
 * @param { !HTMLDivElement } pinToElement - the element in the DOM that we want to bind to append the pageContent. Mandatory.
 * @param { ?String } contentFilePath - the path to the static html content relative to index.html! Can be null.
 * @param { ...?T } pageContentProjectors - optional pageContentProjectors used to project dynamic content.
 * @returns { PageProjectorType }
 * @example
 * const personPageController = PageController("home", null);
 * personPageController.setIconPath('./navigation/icons/house.svg');
 * PersonPageProjector(homePageController, pinToContentElement, './pages/home/home.html');
 */
const PersonPageProjector = (pageController, pinToElement, contentFilePath, ...pageContentProjectors) => {
    const pageWrapper = pinToElement;
    const contentWrapper = document.createElement("div");
    const header = document.createElement("h1");
    const [listController, selectionController] = pageController.getDynamicContentControllers();
    const [pageSwitchProjector] = pageContentProjectors;
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

            const [exampleDiv, masterContainer, detailCard] = dom(`
                    <div></div>
                    <div class="holder" id="masterContainer">
                        <h2>Person Master</h2>
                        <button id="plus" autoFocus >+</button>
                    </div>
                    <div class="card" id="detailCard">
                        <h2>Person Detail</h2>
                        <div class="holder" id="detailContainer"></div>
                    </div>
            `);

            const plusButton = masterContainer.lastElementChild;
            const detailContainer = detailCard.lastElementChild;

            const master = personProjectMasterView(listController, selectionController,);
            masterContainer.append(...master);

            const detailForm = personProjectDetailView(selectionController, detailCard);
            detailContainer.append(...detailForm);

            let headStyles = document.querySelector("head style");
            if (null === headStyles) {
                const head = document.querySelector('head');
                headStyles = document.createElement('style');
                head.append(headStyles);
            }
            headStyles.textContent += personPageCss;

            // binding of the main view
            plusButton.onclick = _ => listController.addModel();

            exampleDiv.append(masterContainer, detailCard);

            const switchDiv = pageSwitchProjector.projectNavigation(exampleDiv);
            const cardDiv = document.getElementById('person-holder');
            cardDiv.append(switchDiv);
        });

        const pageClass = pageController.getQualifier();
        contentWrapper.classList.add(pageClass);
    };

    /**
     * A function that creates the DOM binding and initializes the page on first activation.
     *
     * @function
     * @return { void }
     */
    const projectPage =  () => {
        if (contentWrapper.firstChild === null) {
            initialize();
        }

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
    const fetchPageContent = async (filePath) => {
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
                console.error(`HTTP error: ${response.status}`);
            }
        } catch (e) {
            console.error(e);
        }
    };

    pageController.onActiveChanged(active => {
        if (active) {
            projectPage();
        }
    });

    /**
     * A utility function that sets the header of the page to the new value if it is not undefined.
     *
     * @param { ?String } newValue
     */
    const setH1 = newValue => {
        if (undefined !== newValue) {
            header.innerText = newValue
        }
    };

    pageController.onValueChanged(newValue => {
        setH1(newValue);
    });

};


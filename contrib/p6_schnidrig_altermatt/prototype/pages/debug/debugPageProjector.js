import { dom } from "../../kolibri/util/dom.js";

export { DebugPageProjector }

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
 * @param { !NavigationControllerType } navigationController - the navigationController that controls the navigation we want to debug. Mandatory.
 * @param { !PageControllerType } pageController - the pageController that controls the PageModelType we want to observe. Mandatory.
 * @param { !HTMLDivElement } pinToElement - the element in the DOM that we want to bind to append the pageContent. Mandatory.
 * @returns { PageProjectorType }
 * @example
 * const homePageController = PageController("home", null);
 * homePageController.setIconPath('./navigation/icons/house.svg');
 * HomePageProjector(homePageController, pinToContentElement, './pages/home/home.html');
 */
const DebugPageProjector = (navigationController, pageController, pinToElement) => {
    const pageWrapper    = pinToElement;

    const arrowSVGPathRelativeIndex = "../navigation/icons/right-arrow-gradient.svg";

    /**
     * A utility function that toggles the open CSS class
     *
     */
    const toggleOpen = () => {
        contentWrapper.classList.toggle('open');
    };

    // Initialize the dom components used on this page
    const [contentWrapper, debugTable, bubble, closeButton] = dom(`
        <!-- Create content wrapper -->
        <div></div>

        <!-- Create debug table -->
        <table id="debug-table">
            <thead>
                <tr>
                    <td>Observable Name</td>
                    <td>Observable Value</td>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
        
        <!-- Create bubble -->
        <div class="closed-debug-bubble"></div>
        
        <!-- Create close button -->
        <div class="close-button">
            <img src="${arrowSVGPathRelativeIndex}" alt="arrow">
        </div>
    `);

    const tbody = debugTable.getElementsByTagName('tbody')[0];

    /**
     * A function that initializes the content and stores it in the pageWrapper.
     *
     * @function
     * @return { void }
     */
    const initialize = () => {
        bubble.onclick      = toggleOpen;
        closeButton.onclick = toggleOpen;
        contentWrapper.append(debugTable, bubble, closeButton);

        const pageClass = pageController.getHash().slice(1);
        contentWrapper.classList.add(pageClass);

        // initalize keyboard event listener for CTRL-ALT-d key events and opens / closes the debugger on event
        document.addEventListener('keydown', e => {
            if (e.ctrlKey && e.altKey && e.key === 'd') {
                toggleOpen();
            }
        });
    };

    /**
     * A function that creates the DOM binding and initializes the page on first activation.
     *
     * @function
     * @param { ?PageControllerType } debugController - the page controller we want to debug
     * @return { void }
     */
    const projectPage = debugController => {
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

        tbody.innerHTML = '';
        if (null !== debugController) {
            // add the properties of the controller that we want to ignore
            const ignoreProperties = ['getDynamicContentControllers'];
            for (const property in debugController) {
                if (property.startsWith('get') || property.startsWith('is')) {
                    bindProperty(property, debugController, ignoreProperties);

                } else if (property.startsWith('on') && property.endsWith('Changed')) {
                    registerPropertyUpdateHandler(property, debugController);
                }
            }
        }
    };

    /**
     * A function that binds properties from the given debug controller,
     * so they can be observed and changed in the debugger while ignoring the given ignoreProperties.
     *
     * @param { String } property - the property that should be updated onChange
     * @param { PageControllerType } debugController - the page controller you want to debug
     * @param { String[] } ignoreProperties - the properties you want to ignore in the debugger
     */
    const bindProperty = (property, debugController, ignoreProperties) => {
        if (!ignoreProperties.includes(property)) {
            let observableName  = property.startsWith('get') ? property.slice(3) : property.slice(2);
            let observableValue = eval(`debugController.${property}()`);

            if (null !== observableValue && typeof eval(observableValue.getHash) === 'function') {
                observableName  = observableName + '_Controller';
                observableValue = observableValue.getHash();
            }
            addListItem(observableName, observableValue, debugController);
        }
    };

    /**
     * A function that registers an update handler on the property via the onChange callback from Kolibri.
     *
     * @function
     * @param { String } property - the property that should be updated onChange
     * @param { PageControllerType } debugController - the page controller you want to debug
     */
    const registerPropertyUpdateHandler = (property, debugController) => {
        let observableName  = property.slice(2, property.length-7);
        let observableValue = null;

        if (typeof eval(`debugController.get${observableName}`) === 'function' ) {
            observableValue = eval(`debugController.get${observableName}()`);
        } else if (typeof eval(`debugController.is${observableName}`) === 'function' ) {
            observableValue = eval(`debugController.is${observableName}()`);
        }

        // do not remove this code snippet as it is used by the updateListItem function to properly work
        if (null !== observableValue && typeof eval(observableValue.getHash) === 'function') {
            observableName  = observableName + '_Controller';
            observableValue = observableValue.getHash();
        }

        eval(`debugController.${property}(val => {
            updateListItem(observableName, val);
        })`);
    };

    pageController.onIconPathChanged(iconPath => {
       if (null !== iconPath && undefined !== iconPath) {
           bubble.innerHTML = `<img src="${iconPath}" alt="bug-icon">`;
       }
    });

    pageController.onParentChanged(parent => {
        if (navigationController.isDebugMode()) {
            projectPage(parent);
        }
    });


    // **************************** UTILITY FUNCTIONS ************************************************ /

    /**
     * A function that updates an existing list entry in the debug table
     *
     * @param { String } observableName - the name of the observable that should be updated
     * @param { Boolean | String | PageControllerType } observableValue - the new value
     */
    const updateListItem = (observableName, observableValue) => {
        if(typeof observableValue === "boolean") {
            const input = tbody.querySelector('#' + observableName + '-checkbox');
            input.checked = observableValue;
        } else  {
            const input = tbody.querySelector('#' + observableName + '-input');
            if (observableName.includes('_Controller')) {
                input.value = observableValue.getHash();
            } else {
                input.value = observableValue;
            }
        }
    };

    /**
     * A function that adds a list entry to the debug table.
     *
     * @param { String } observableName - the name of the observable that should be created
     * @param { Boolean | String } observableValue - the initial value
     * @param { PageControllerType } debugController - the page controller that will be updated onchange
     */
    const addListItem = (observableName, observableValue, debugController) => {

        // we have to create an intermediate table because the dom function creates a holder <div></div> and divs do not take table-rows as direct children.
        const [table] = dom(`
            <table>
                <tr id="${observableName}-row">
                    <td id="${observableName}-row-header">${observableName}</td>
                    <td id="${observableName}-row-value"></td>
                </tr>
            </table>
        `);

        const row = table.querySelector('#' + observableName + '-row');
        const value = row.querySelector('#' + observableName + '-row-value');

        if(typeof observableValue === "boolean") {
            handleBooleanObservable(observableName, observableValue, debugController, row, value);
        } else {
            handleStringOrPageControllerObservable(observableName, observableValue, debugController, row, value);
        }

        row.append(value);
        tbody.append(row);
    };

    /**
     * A utility function that creates a switch for boolean observable values and adds it to the debug table.
     *
     * @function
     * @param { String } observableName - the name of the observable you need to handle
     * @param { Boolean } observableValue - the value of the observable you need to handle
     * @param { PageControllerType } debugController - the controller that will be bound to changes
     * @param { HTMLTableRowElement } row - the row in which the name and value are displayed
     * @param { HTMLTableDataCellElement } value - the cell in which the value is displayed
     */
    const handleBooleanObservable = (observableName, observableValue, debugController, row, value) => {
        const [toggle, checkbox] = dom(`
            <div id="${observableName}-toggle" class="toggle-switch">
                <div></div>
            </div>
            
            <input id="${observableName}-checkbox" type="checkbox" class="toggle-checkbox" checked="${observableValue}">
        `);

        toggle.onclick = () => {
            if (!toggle.classList.contains('disabled')) {
                row.querySelector('#' + observableName + '-checkbox').click();
                toggle.classList.toggle('selected');
            }
        };
        if(observableValue) {
            toggle.classList.add('selected');
        }

        if (typeof eval(`debugController.set${observableName}`) === 'function') {
            checkbox.onchange = e => eval(`debugController.set${observableName}(e.target.checked)`);
        } else {
            toggle.classList.add('disabled');
            checkbox.disabled = true;
        }
        value.append(toggle, checkbox);
    };

    /**
     * A utility function that creates a text input for string or PageControllerType observable values and adds it to the debug table.
     *
     * @function
     * @param { String } observableName - the name of the observable you need to handle
     * @param { String } observableValue - the value of the observable you need to handle
     * @param { PageControllerType } debugController - the controller that will be bound to changes
     * @param { HTMLTableRowElement } row - the row in which the name and value are displayed
     * @param { HTMLTableDataCellElement } value - the cell in which the value is displayed
     */
    const handleStringOrPageControllerObservable = (observableName, observableValue, debugController, row, value) => {
        const [input] = dom(`
            <input id="${observableName}-input" type="text" value="${observableValue}">
        `);

        if (observableName.includes('_Controller')) {
            observableName = observableName.substring(0, observableName.indexOf('_Controller'));
            if (typeof eval(`debugController.set${observableName}`) === 'function') {
                input.onchange = e => eval(`debugController.set${observableName}(navigationController.getPageController(e.target.value))`);
            } else {
                input.disabled = true;
            }
            value.append(input);
        } else {
            if (typeof eval(`debugController.set${observableName}`) === 'function') {
                input.onchange = e => eval(`debugController.set${observableName}(e.target.value)`);
            } else {
                input.disabled = true;
            }
            value.append(input);
        }
    };
};


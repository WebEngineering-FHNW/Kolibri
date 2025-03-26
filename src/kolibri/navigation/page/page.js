import { Observable } from "../../observable.js";

export { Page }

/**
 * @typedef  PageDataType
 * @property { !String }            titleText      - title text for the html page when the page is displayed
 * @property { !HTMLStyleElement }  styleElement   - the style to add into the html head
 * @property { !HTMLElement }       contentElement - what to display
 * @property { !String }            pageClass      - name of the CSS class that identifies the style of this page in the html page header
 * @property { Number= }            activationMs   - milliseconds to run the activation animation, optional with default value
 * @property { Number= }            passivationMs  - milliseconds to run the passivation animation, optional with default value
 * @property { Function= }          onBootstrap    - behavior after first mount, optional: no operation for static pages
 */

/**
 * @typedef PageFunctionsType
 * @property { () => Boolean  }                     getVisited
 * @property { (Boolean) => void }                  setVisited
 * @property { (cb:ConsumerType<Boolean>) => void } onVisited  - notify callback when page was visited
 */

/**
 * @typedef { PageDataType & PageFunctionsType } PageType
 * A page of type PageType is a domain object in the domain of pages of a website.
 * It provides information about what to display as content plus additional information like visitation state.
 */

/**
 * Constructor for a {@link PageType Page}.
 * To be called from specialized page constructors to set up the common properties of all pages.
 * @param { PageDataType } parameterObject
 * @return { PageType }
 * @constructor
 * @example
 * Page({
 *      titleText:         "About",
 *      activationMs:      1000,
 *      passivationMs:     1000,
 *      pageClass:         "about",
 *      styleElement,
 *      contentElement,
 *  })
 */
const Page = ( {
                   titleText,
                   styleElement,
                   contentElement,
                   pageClass,
                   onBootstrap   = () => undefined, // default is do nothing
                   activationMs  = 500,
                   passivationMs = 500
              } ) => {
    const visitedObs = Observable(false);
    let   bootStrapped = false;
    const mayBootstrap = () => {
        if (bootStrapped) { return; }
        onBootstrap();
        bootStrapped = true;
    };
    return /** @type { PageType } */ {
        titleText        ,
        styleElement     ,
        contentElement   ,
        pageClass        ,
        onBootstrap:     mayBootstrap, // make sure onBootstrap is called at most once
        activationMs     ,
        passivationMs    ,
        getVisited:      visitedObs.getValue,
        setVisited:      visitedObs.setValue,
        onVisited :      visitedObs.onChange,
    }
};

import { dom  }           from "../../util/dom.js";
import { Page }           from "./page.js";
import { URI_HASH_EMPTY } from "../../../customize/uriHashes.js";

export { EmptyPage }

const PAGE_CLASS     = URI_HASH_EMPTY.substring(1);

/**
 * This page will never be displayed.
 * It serves as a stand-in for which page to activate when there is no page (yet).
 * Analogous to the Null Object Pattern.
 * @return { PageType }
 * @constructor
 */
const EmptyPage = () => Page({
     titleText:         "Empty",
     activationMs:      0,
     passivationMs:     0,
     pageClass:         PAGE_CLASS,
     styleElement  :    /** @type { HTMLStyleElement } */ styleElement,
     contentElement:    /** @type { HTMLElement }      */ contentElement,
 });

const [styleElement, contentElement] = dom(`
    <style data-style-id="${PAGE_CLASS}">  
        @layer pageStyle {
             /* no style */
        }
    </style>
    <div class="${PAGE_CLASS}">
        Empty Page      
    </div>
`);

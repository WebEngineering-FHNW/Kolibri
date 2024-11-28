import { dom  }           from "../../util/dom.js";
import { Page }           from "./page.js";
import { URI_HASH_EMPTY } from "../../../customize/uriHashes.js";

export { EmptyPage }

const PAGE_CLASS     = URI_HASH_EMPTY.substring(1);

/**
 * This page will never be displayed.
 * It serves as a stand-in just like Null Objects.
 * @return { PageType }
 * @constructor
 */
const EmptyPage = () => Page(/** @type { PageDataType } */{
     titleText:         "Empty",
     activationMs:      0,
     passivationMs:     0,
     pageClass:         PAGE_CLASS,
     styleElement,
     contentElement,
 });

const [styleElement, contentElement] = dom(`
    <style data-style-id="${PAGE_CLASS}">  
    </style>
    <div class="${PAGE_CLASS}">
        Empty Page      
    </div>
`);

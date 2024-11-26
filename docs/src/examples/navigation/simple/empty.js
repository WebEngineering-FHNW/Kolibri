import { dom  }  from "../../../kolibri/util/dom.js";
import { Page }  from "../../../kolibri/navigation/page.js";

/**
 * This page will never be displayed.
 * It serves as a stand-in just like Null Objects.
 */
export { EmptyPage }

const PAGE_CLASS     = "empty";

const EmptyPage = () => Page({
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
        Empty       
    </div>
`);

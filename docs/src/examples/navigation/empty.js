import { dom }                                 from "../../kolibri/util/dom.js";
import {Page}                                  from "./page.js";


export { EmptyPage }

const PAGE_CLASS     = "empty";
const ACTIVATION_MS  = 0;
const PASSIVATION_MS = 0;

const EmptyPage = () => Page({
     titleText:         "Empty",
     activationMs:      ACTIVATION_MS,
     passivationMs:     PASSIVATION_MS,
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

import { dom }                                    from "../../../kolibri/util/dom.js";
import { URI_HASH_UNSTYLED, URI_HASH_HOME, href } from "../../../customize/uriHashes.js";
import { Page }                                   from "../../../kolibri/navigation/page/page.js";

export { UnstyledPage }

const PAGE_CLASS     = URI_HASH_UNSTYLED.substring(1); // share between page, content, and style
const ACTIVATION_MS  = 1000;
const PASSIVATION_MS = 1000;
const TITLE          = "Unstyled";

/**
 * The Unstyled page comes with a slide-in / slide-out animation.
 * @return { PageType }
 * @constructor
 */
const UnstyledPage = () => Page({
     titleText:         TITLE,
     activationMs:      ACTIVATION_MS,
     passivationMs:     PASSIVATION_MS,
     pageClass:         PAGE_CLASS,
     styleElement  :    /** @type { HTMLStyleElement } */ styleElement,
     contentElement:    /** @type { HTMLElement }      */ contentElement,
 });

const [contentElement] = dom(`
    <div class="${PAGE_CLASS} prosa">
        <h1>${TITLE}</h1>
            <section>
                <p>The links below should not appear in button style even though they use the same
                   style classes as the home page.</p>
                <p>
                     <a class="btn primary glow" ${href(URI_HASH_HOME)}>Home</a>
                     <a class="btn accent  glow" ${href(URI_HASH_UNSTYLED)}>About</a>
                </p>
                <p>This shows <em>style isolation</em>: styles from previous pages do not contaminate any following pages.</p>
            </section>
            <section>
                <p>This page has no special styling except for animating the page transitions.
                It appears as slide-in from the right and disappears with a slide-left.</p>
            </section>
    </div>
`);

const [styleElement] = dom(`
    <style data-style-id="${PAGE_CLASS}">
        @layer pageLayer {      
             .${PAGE_CLASS} {        
                                     
                 &.activate {
                     --activation-ms:    ${ACTIVATION_MS};
                     animation:          ${PAGE_CLASS}_activation calc(var(--activation-ms) * 1ms) ease-out forwards;
                 }         
                 &.passivate {
                     --passivation-ms:   ${PASSIVATION_MS};
                     animation:          ${PAGE_CLASS}_passivation calc(var(--passivation-ms) * 1ms) ease-in forwards;
                 }                       
             }       
             /* cannot be nested and must be uniquely named */
             @keyframes ${PAGE_CLASS}_activation {
                 0% {
                     opacity:        0.5;
                     transform:      translateX(100cqw);
                 }
                 100% {
                     opacity:        1;
                     transform:      translateX(0);
                 }
             }  
             @keyframes ${PAGE_CLASS}_passivation {
                 0% {
                     opacity:        1;
                     transform:      translateX(0);
                 }
                 100% {
                     opacity:        0.5;
                     transform:      translateX(-100cqw);
                 }
             }              
        }
    </style>
`);

import { dom }                                 from "../../../kolibri/util/dom.js";
import { URI_HASH_ABOUT, URI_HASH_HOME, href } from "../../../customize/uriHashes.js";
import { Page }                                from "../../../kolibri/navigation/page.js";


export { AboutPage }

const PAGE_CLASS     = "about";
const ACTIVATION_MS  = 1000;
const PASSIVATION_MS = 1000;

const AboutPage = () => Page({
     titleText:         "About",
     activationMs:      ACTIVATION_MS,
     passivationMs:     PASSIVATION_MS,
     pageClass:         PAGE_CLASS,
     styleElement,
     contentElement,
 });

const [contentElement] = dom(`
    <div class="${PAGE_CLASS}">
        <h1>About</h1>
            <section>
                <p>The "buttons" below should not be styled.</p>
                <p>This is to make sure that styles from the home page do not spill over to this page.</p>
                <p>
                     <a class="btn primary glow" ${href(URI_HASH_HOME)}>Home</a>
                     <a class="btn accent  glow" ${href(URI_HASH_ABOUT)}>About</a>
                </p>
            </section>
    </div>
`);

const [styleElement] = dom(`
    <style data-style-id="${PAGE_CLASS}">
        .${PAGE_CLASS} {        
                                
            &.activate {
                --activation-ms:    ${ACTIVATION_MS};
                animation:          ${PAGE_CLASS}_activation calc(var(--activation-ms) * 1ms) ease-in-out forwards;
            }         
            &.passivate {
                --passivation-ms:   ${PASSIVATION_MS};
                opacity:            0.5;
                transform:          translateX(-100cqw);
                animation:          ${PAGE_CLASS}_passivation calc(var(--passivation-ms) * 1ms) ease-in-out forwards;
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
    </style>
`);

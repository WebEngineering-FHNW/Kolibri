import { dom }                                 from "../../../kolibri/util/dom.js";
import { URI_HASH_ABOUT, URI_HASH_HOME, href } from "./uriHashes.js";



export { AboutPage }

const PAGE_CLASS     = "about";
const ACTIVATION_MS  = 1000;
const PASSIVATION_MS = 1000;

// namespace object pattern
const AboutPage = () => {
    return {
        titleText : "About",
        styleElement,
        contentElement,
    }
};

// one could also use a <link rel="stylesheet"> element
// here we see a variant that allows for dynamic content
const [styleElement]   = dom(`
    <style>
        .${PAGE_CLASS} {        
            margin-top: 2em;
            
            &.message-wrapper {
                display:            flex;
                gap:                1em;
                justify-content:    center;
            }     
                  
            &.activate {
                --activation-ms:    ${ACTIVATION_MS};
                animation:          ${PAGE_CLASS}_activation calc(var(--activation-ms, 500) * 1ms) ease-in-out;
            }         
            &.passivate {
                --passivation-ms:   ${PASSIVATION_MS};
                opacity:            0.5;
                transform:          translateX(-100cqw);
                transition:         all calc(var(--passivation-ms, 500) * 1ms) ease-in-out;
            }                       
        }       
        /* cannot be nested */
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
    </style>
`);

const [contentElement] = dom(`
    <div class="${PAGE_CLASS}">
        <h1>About</h1>
        <div class="message-wrapper">
            <section class="buttons">
                <p>These "buttons" should not be styled.</p>
                <p>This is to make sure that styles from the home page do not spill over to this page.</p>
                <a class="btn primary glow" ${href(URI_HASH_HOME)}>Home</a>
                <a class="btn accent  glow" ${href(URI_HASH_ABOUT)}>No Style</a>
            </section>
        </div>
    </div>
`);

import { dom }                                 from "../../../kolibri/util/dom.js";
import { URI_HASH_ABOUT, URI_HASH_HOME, href } from "./uriHashes.js";



export { AboutPage }


// namespace object pattern
const AboutPage = () => {
    return {
        titleText,
        styleElement,
        contentElement,
    }
};

const [titleText]      = `About`;

// one could also use a <link rel="stylesheet"> element
const [styleElement]   = dom(`
    <style>
        .about {
            h1 {
                margin-top: 2em;
                color:      var(--kb-hsla-primary-accent);
            }
            .message-wrapper {
                text-align:         center;
                padding:            1em;
                display:            flex;
                justify-content:    center;
                color:              var(--kb-hsla-primary-accent);
            }
            .buttons {
                padding:            5px;
                margin-top:         2em;
            }                                
        }
    </style>
`);

const [contentElement] = dom(`
    <div class="about">
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

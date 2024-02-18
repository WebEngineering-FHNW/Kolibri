import {dom} from "../../../kolibri/util/dom.js";

export { AboutPage, URI_HASH_ABOUT }

/** @type { UriHash } */ const URI_HASH_ABOUT  = "#about";

// namespace object pattern
const AboutPage = () => {
    return {
        titleText,
        styleElement,
        contentElement,
    }
};

const titleText      = `About`;

// one could also use a <link rel="stylesheet"> element
const styleElement   = dom(`
<style>
    #content .about h1 {
        margin-top: 35px;
        color: var(--kb-hsla-primary-accent);
    }
    
    #content .about .message-wrapper {
        text-align: center;
        padding: 16px;
        display: flex;
        justify-content: center;
        color: var(--kb-hsla-primary-accent);
    }
    
    #content .about button {
        padding: 5px;
        margin-top: 32px;
    }    
</style>
`);

const contentElement = dom(`
<div id="content-wrapper">
    <h1>About</h1>
    <div class="message-wrapper">
        <section class="buttons">
            <p>These "buttons" should not be styled.</p>
            <p>This is to make sure that styles from the home page do not spill over to this page.</p>
            <a class="btn primary glow" href="${URI_HASH_HOME}">Home</a>
            <a class="btn accent  glow" href="${URI_HASH_ABOUT}">No Style</a>
        </section>
    </div>
</div>

`);

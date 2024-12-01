import {dom}                                    from "../../../kolibri/util/dom.js";
import {URI_HASH_UNSTYLED, href, URI_HASH_HOME} from "../../../customize/uriHashes.js";
import {Page}                                   from "../../../kolibri/navigation/page/page.js";
import {KOLIBRI_LOGO_SVG}                       from "../../../kolibri/style/kolibriStyle.js";

export { HomePage }

const PAGE_CLASS = URI_HASH_HOME.substring(1);

/**
 * The Home Page should always be available.
 * @return { PageType }
 * @constructor
 */
const HomePage = () => Page(/** @type { PageDataType } */{
    titleText:         "Home Page",
    activationMs:       1000,
    passivationMs:      1000,
    pageClass:          PAGE_CLASS,
    styleElement  :    /** @type { HTMLStyleElement } */ styleElement,
    contentElement:    /** @type { HTMLElement }      */ contentElement,
 });


const [contentElement] = dom(`
    <div class="${PAGE_CLASS}">            
      <header>
        <div class="kolibri-logo-anim" style="width:clamp(10rem, 30cqw, 20rem);">
            ${KOLIBRI_LOGO_SVG}
        </div>
        <h1>Kolibri Navigation</h1>
        <div class="subtitle">The Basics</div>
      </header>
      
      <main class="prosa">
        <section>
          <h2>Basic Navigation</h2>
            <p>Kolibri allows to navigate between <em>pages</em> of a <em>site</em>.</p>
            <p>This basic site starts with two pages: 
                <a ${href(URI_HASH_HOME)}>Home Page</a> and <a ${href(URI_HASH_UNSTYLED)}>Unstyled</a>.</p>
            <p>Please try the links in the text above, the buttons below, or in the top or side navigation.</p>
        </section>
    
        <section class="buttons">
          <a class="btn primary glow" ${href(URI_HASH_HOME)}>Home Page</a> 
          <a class="btn accent  glow" ${href(URI_HASH_UNSTYLED)}>Unstyled</a>
        </section>
    
        <section>
          <h2>Features</h2>
            <p>Kolibri supports the user of this site and its developers with these <em>basic</em> features:</p>
            <ul>
                <li>use links in the page content or in the navigation menues</li>
                <li>use the browsers back and forward buttons and gestures</li>
                <li>use the browser history</li>
                <li>jump directly to any page via shared URL, QR code, or bookmark</li>
                <li>see where we currently are and where we can go</li>
                <li>enjoy best practices for link visualization and privacy</li>
                <li>rely on error handling.</li>
            </ul>
            <p>There are additional <em>advanced</em> features:</p>
            <ul>
                <li><em>animated page transitions</em> that are specific per page and can overlap</li>
                <li><em>style isolation</em> to avoid conflicting page styles and contamination</li>
                <li><em>typesafe</em> navigation</li>
                <li>pages with interactive content <em>maintain their state</em> throughout navigation.</li>
            </ul>
        </section>
        
        <section>
            <h2>Typesafe Navigation</h2>
            <p> Broken links are annoying and testing against broken links is tedious
                and error-prone.
            </p>         
            <p>Kolibri uses its ubiquitous, plain-vanilla JS type system to make each broken link 
               a <em>type error</em>, such that developers fix it even before testing! The
               user can rely on all internal links being available. 
            </p>            
            <!-- Remove the type cast below to see the type error in the IDE! -->
            <p> Example of a <a ${href(/** @type { UriHashType } */"#no-such-uri")}>broken link</a> that appears in the 
                code as a <em>type error</em>! Try to click it to see the fallback error handling.
            </p>
            <p>
                <figure>
                    <img src="typeError.png" alt="screenshoot of the type error" 
                     style="max-width: 100%; border: 1px solid grey;">
                    <figcaption>The navigation type error as seen in the IDE.</figcaption> 
                </figure>
            </p>
        </section>
        
        <section>
            <h2>References</h2>
            <p>Find the sources of 
            <a href="https://github.com/WebEngineering-FHNW/Kolibri/blob/21dba296a3761ced3e909fb9eae3580994468d1a/docs/src/examples/navigation/simple/starter.js">
            this site on github
            </a>. </p>
            <p>The Kolibri navigation support is based on a bachelor project by
               our FHNW students Altermatt and Schnidrig.</p>            
            <p>You can find a showcase of the initial contribution with many more features
                <a href="https://kolibri-navigation.github.io/ip6-kolibri-navigation/prototype/showcase-app/#home">here</a>.
            </p>
        </section>
        
      </main>
    </div>
`);

// Note that we can refer to external css files for the styling. (see discussion there)
const [styleElement] = dom(`
    <style data-style-id="${PAGE_CLASS}">
        @import "./home.css";
    </style>      
`);

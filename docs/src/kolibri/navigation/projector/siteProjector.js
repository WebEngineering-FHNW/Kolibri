import {dom}                 from "../../util/dom.js";
import {href, URI_HASH_HOME} from "../../../customize/uriHashes.js";

export { SiteProjector }

const PAGE_CLASS     = "site";

const SiteProjector = siteController => {

     const sideNavigationElement = bodyElement.querySelector("#side-nav");
     const topNavigationElement  = bodyElement.querySelector("#top-nav");
     const activeContentElement  = bodyElement.querySelector("#content");
     const passiveContentElement = bodyElement.querySelector("#content-passivated");

     document.head.append(...headElements);
     document.body.append(bodyElement);

     siteController.onUnsupportedUriHash( uriHash =>                     // think about monolog and i18n
         alert(`Sorry, the target "${uriHash}" is not available.`)
     );

     siteController.onPageActivated( page => {

          // set the title
          const titleElement = document.head.querySelector("title");
          titleElement.textContent = page.titleText;

          // make sure that the required page style is in the head
          const styleElement = document.head.querySelector(`style[data-style-id="${page.pageClass}"]`);
          if (null === styleElement) {
              document.head.append(page.styleElement);
          }

          // make sure the animation timings in model and css are the same
          page.contentElement.style.setProperty("--activation-ms" ,page.activationMs);
          page.contentElement.style.setProperty("--passivation-ms",page.passivationMs);

          setTimeout( _time => {                                           // allow activation anim its time
               page.contentElement.classList.remove("activate");           // we have to remove or we cannot start again
          }, page.activationMs );

          activeContentElement.replaceChildren(page.contentElement);       // finally mount the page
          page.contentElement.classList.add("activate");
     });

     siteController.onPagePassivated( page => {
          passiveContentElement.replaceChildren(page.contentElement);      // moves from content to passivated

          // trigger the passivation anim
          page.contentElement.classList.add("passivate");
          setTimeout( _time => {                                           // give the passivation anim some time
               page.contentElement.classList.remove("passivate");          // just to be sure
               passiveContentElement.innerHTML = "";                       // remove all children
               // we do not remove the page styleElement because of issues when
               // passivation and re-activation styling overlaps
          }, page.passivationMs);
     });

     return {
          sideNavigationElement    ,
          topNavigationElement
     }
};

const headElements = dom(`

        <title>(no title - will be replaced)</title>
        <link id="favicon" rel="icon" type="image/x-icon" href='${window.BASE_URI}img/logo/logo.svg'>
        
        <style data-style-id="${PAGE_CLASS}">
        
            /*  use layers to avoid overriding defaults by accident */
            @layer pageLayer, navigationLayer, siteLayer, kolibriLayer;
        
            @import "${window.BASE_URI}css/kolibri-base-light.css" layer(kolibriLayer);
            
            @layer siteLayer { // styles for the whole website 
                 body {
                     margin: 0;
                 }
                 #application-frame {
                     position:               fixed;
                     inset:                  0;
     
                     display:                grid;
                     grid-template-columns:  min-content auto;
                     grid-template-rows:     min-content auto;
                     grid-template-areas:    "logo       top-nav"
                                             "side-nav   content";
                 }            
                 #top-nav, #side-nav, #logo {
                     padding:                .5rem;
                 }
                 #top-nav {
                     grid-area:              top-nav;
                     align-self:             center;
                     filter:                 drop-shadow(0 0 .5rem white);
                     --kolibri-color-accent: var(--kb-color-hsl-bg-light);
                     font-weight:            bold;
                     & a {
                         margin-right:       1em;
                     }
                 }
                 #side-nav {
                     grid-area:              side-nav;
                     background-color:       var(--kb-color-hsl-bg-light);
                     box-shadow:             var(--kolibri-box-shadow);
                     padding-block:          1lh;
                     & a {
                         display:            block;
                         margin-top:         .5lh;
                     }
                 }
                 #logo {
                     grid-area:              logo;
                     justify-self:           center;
                     & a img {
                         display:            block;
                         border-radius:      50%;
                         background-color:   var(--kb-color-hsl-bg-light);
                         width:              3rem;
                         aspect-ratio:       1 / 1;
                         box-shadow:         1px 1px .2rem 0 var(--kb-color-hsl-lavender-700) inset; 
                     }
                 }
                 #top-backdrop {
                     grid-row:               1;
                     grid-column:            1 / -1;
                     z-index:                -10;
                     background-image:       linear-gradient( 90deg,
                                                 var(--kb-color-hsl-pink-300) 50%,
                                                 var(--kb-color-hsl-lavender-700)
                                             );
                 }
     
                 .content {                  /* must be shared in #content and #content-passivated */
                     grid-area:              content;
                     container-type:         size; 
                     container-name:         pageContainer;
                     overflow:               auto;
                     padding:                2rem;
                 }
                 #content-passivated {
                     z-index:                -10;
                 }
            }

        </style>
`);

const [bodyElement] = dom(`
    <div id="application-frame">
        <div id="top-backdrop"></div>
        <div id="logo">
            <a ${href(URI_HASH_HOME)}>
                <img src="${window.BASE_URI}img/logo/logo-new-128.svg" alt="Kolibri-logo">
            </a>
        </div>
        <div  id="top-nav"> top  nav stand-in</div>
        <div  id="side-nav">side nav stand-in</div>
        <div  id="content-passivated"   class="content">
            <!-- holder to display content during passivation -->
        </div>
        <div  id="content"              class="content">
            <!-- page content will be added here -->
        </div>

    </div>
`);

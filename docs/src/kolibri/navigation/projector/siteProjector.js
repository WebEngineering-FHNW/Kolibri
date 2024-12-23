import { dom, select }         from "../../util/dom.js";
import { href, URI_HASH_HOME } from "../../../customize/uriHashes.js";
import {ICON_KOLIBRI}          from "../../../customize/icons.js";
import {icon}                  from "../../style/icon.js";

export { SiteProjector }

const SITE_CLASS     = "site";

const SiteProjector = siteController => {

     const [logoAnchorElement]     = select(bodyElement,"#logo a");
     const [sideNavigationElement] = select(bodyElement,"#side-nav");
     const [topNavigationElement ] = select(bodyElement,"#top-nav");
     const [activeContentElement ] = select(bodyElement,"#content");
     const [passiveContentElement] = select(bodyElement,"#content-passivated");

     document.head.append(...headElements);
     document.body.append(bodyElement);

     logoAnchorElement.append(...icon(ICON_KOLIBRI));

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
        
        <style data-style-id="${SITE_CLASS}">
        
            /*  use layers to avoid overriding defaults by accident */
            @layer pageLayer, navigationLayer, siteLayer, kolibriLayer, kolibriLightLayer;
        
            /* the new styling will have import such that we only need one line here. */
            @import "${window.BASE_URI}css/kolibri-base.css"         layer(kolibriLayer);
            
            @layer ${SITE_CLASS}Layer { /* styles for the whole website */ 
                 body {
                     margin: 0;
                     --color-nav-bg:         hsl( from var(--kolibri-color-secondary-bg) h s calc(l * 1.08));
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
                     --kolibri-color-accent: white;
                     & a {
                         margin-right:       1em;
                     }
                     & a:not(.current) {                         
                         color:              var(--kolibri-color-secondary-bg);
                     }
                 }
                 #side-nav {
                     grid-area:              side-nav;
                     background-color:       var(--color-nav-bg);
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
                     & a svg {                        
                         width:              3rem;                         
                         aspect-ratio:       1 / 1;
                         display:            block;
                         border-radius:      50%;
                         background-color:   var(--color-nav-bg);
                         box-shadow:         1px 1px .2rem 0 var(--kolibri-color-accent) inset; 
                     }
                 }
                 #top-backdrop {
                     grid-row:               1;
                     grid-column:            1 / -1;
                     z-index:                -10;
                     background-image:       var(--kolibri-color-gradient-primary)
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
                 
                 @media (width < 90ch) {    /* --kolibri-prosa-width plus side-nav hidden width */
                    .content {                        
                        grid-column:        1 / -1;
                    }
                    #side-nav {
                        display:            none;
                    }
                 }
            }

        </style>
`);

const [bodyElement] = dom(`
    <div id="application-frame">
        <div id="top-backdrop"></div>
        <div id="logo">
            <a ${href(URI_HASH_HOME)}>
            </a>
        </div>
        <div  id="top-nav"></div>
        <div  id="side-nav"></div>
        <div  id="content-passivated"   class="content">
            <!-- holder to display content during passivation -->
        </div>
        <div  id="content"              class="content">
            <!-- page content will be added here -->
        </div>

    </div>
`);

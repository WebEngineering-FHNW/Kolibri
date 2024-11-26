import {dom}                 from "../../../kolibri/util/dom.js";
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

     siteController.onPageActivated( pageModel => {

          // set the title
          const titleElement = document.head.querySelector("title");
          titleElement.textContent = pageModel.titleText;

          // make sure that the required page style is in the head
          const styleElement = document.head.querySelector(`style[data-style-id="${pageModel.pageClass}"]`);
          if (null === styleElement) {
              document.head.append(pageModel.styleElement);
          }

          // make sure the animation timings in model and css are the same
          pageModel.contentElement.style.setProperty("--activation-ms" ,pageModel.activationMs);
          pageModel.contentElement.style.setProperty("--passivation-ms",pageModel.passivationMs);

          pageModel.contentElement.classList.add("activate");
          setTimeout( _time => {                                      // allow activation anim its time
               pageModel.contentElement.classList.remove("activate"); // we have to remove or we cannot start again
          }, pageModel.activationMs );

          activeContentElement.replaceChildren(pageModel.contentElement);      // finally mount the page
     });

     siteController.onPagePassivated( pageModel => {
          passiveContentElement.replaceChildren(pageModel.contentElement);    // moves from content to passivated

          // trigger the passivation anim
          pageModel.contentElement.classList.add("passivate");
          setTimeout( _time => {                                           // give the passivation anim some time
               pageModel.contentElement.classList.remove("passivate");     // just to be sure
               passiveContentElement.innerHTML = "";                       // remove all children
          }, pageModel.passivationMs);
     });

     return {
          sideNavigationElement    ,
          topNavigationElement
     }
};

const headElements = dom(`

        <title>(no title - will be replaced)</title>
        <link id="favicon" rel="icon" type="image/x-icon" href='../../../../img/logo/logo.svg'>
        
        <style data-style-id="${PAGE_CLASS}">
            @import "../../../../css/kolibri-base-light.css";
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
                & a {
                    display: block;
                    margin-top: .5em;
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
                    box-shadow:         1px 1px .2rem 0 #9317EC inset; /* todo dk: use named colors*/
                }
            }
            #top-nav, #side-nav, #logo {
                padding:                .5rem;
            }
            #top-backdrop {
                grid-row:               1;
                grid-column:            1 / -1;
                z-index:                -10;
                background-image:       linear-gradient( 90deg,
                                            #FF2CA5 55%, /* todo dk: use named colors*/
                                            #9317EC
                                        );
            }

            .content {                  /* must be shared in #content and #content-passivated */
                grid-area:              content;
                container-type:         inline-size; /* only looks at the width */
                overflow:               auto;
                padding:                2rem;
            }
            #content-passivated {
                z-index:                -10;
            }

        </style>
`);

const [bodyElement] = dom(`
    <div id="application-frame">
        <div id="top-backdrop"></div>
        <div id="logo">
            <a ${href(URI_HASH_HOME)}>
                <img src="../../../../img/logo/logo-new-128.svg" alt="Kolibri-logo">
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

import { dom }                                         from "../../../kolibri/util/dom.js";
import { URI_HASH_MASTER_DETAIL }                      from "../../../customize/uriHashes.js";
import { Page }                                        from "../../../kolibri/navigation/page/page.js";

import {ListController, SelectionController}           from "../../person/personController.js";
import {Person, selectionMold}                         from "../../person/person.js";
import {projectDetailView, projectMasterView}          from "../../person/masterDetailProjector.js";
import {pageCss as instantUpdateProjectorCSS}          from "../../person/instantUpdateProjector.js";


export { MasterDetailPage }

const PAGE_CLASS     = URI_HASH_MASTER_DETAIL.substring(1); // share between page, content, and style
const ACTIVATION_MS  = 1000;
const PASSIVATION_MS = 1000;
const TITLE          = "Master - Detail";

/**
 * Constructor for a page that shows a typical master-detail view with direct manipulation and
 * instant update from the Kolibri examples along with explaining text.
 * @return { PageType }
 * @constructor
 */
const MasterDetailPage = () => Page({
     titleText:         TITLE,
     activationMs:      ACTIVATION_MS,
     passivationMs:     PASSIVATION_MS,
     pageClass:         PAGE_CLASS,
     onBootstrap,
     styleElement  :    /** @type { HTMLStyleElement } */ styleElement,
     contentElement:    /** @type { HTMLElement }      */ contentElement,
 });

const onBootstrap = () => {
     const listController      = ListController(Person);
     const selectionController = SelectionController(selectionMold);

     // create the sub-views, incl. binding
     const master = projectMasterView(listController, selectionController, );
     contentElement.querySelector(`#masterContainer`).append(...master);

     const detailForm = projectDetailView(selectionController, document.getElementById('detailCard'));
     contentElement.querySelector(`#detailContainer`).append(...detailForm);

     // binding of the page view
     contentElement.querySelector(`#plus`).onclick = _ => listController.addModel();
};

const [contentElement] = dom(`
    <div class="${PAGE_CLASS} prosa">
        <div class="card">
            <h1>Person Master View</h1>
        
            <div class="holder" id="masterContainer">
                <button id="plus"> + </button>
            </div>
        </div>
        
        <div class="card" id="detailCard">
            <h1>Person Detail</h1>
        
            <div class="holder" id="detailContainer">
            </div>
        </div>
        
        <section>
            <h2>Play!</h2>
            <p> Have a go and play around with adding new entries, selecting various entries, start typing in either
                the master or the detail view, delete entries, and change the lastname to less than three characters.
                See what happens.
            </p>
            <h2>Multi-Way Editing and Instant Updates</h2>
            <p> Whether you edit in the master or in the detail view, all entries are immediately synchronized.
            </p>
            <p> When there is no selection, the detail view folds away, becomes read-only, and shows no values.
                It makes absolutely no difference what led to the deselection.
                BTW: We have chosen to deselect on every delete, such that we can show this effect more easily.
                In a real application, we would of course rather select the next entry than dropping the selection.
            </p>
            <p> Kolibri makes multi-way editing and other consistent updates throughout the application
                very easy. You just define what your attribute represents by giving it a
                <a href="https://github.com/WebEngineering-FHNW/Kolibri/blob/main/docs/src/examples/person/person.js">qualifier</a>
                like "Person.1.firstname".
                Kolibri takes care that all attributes with the same qualifier are always kept in sync.
                This applies not only to their values but to all of their visual properties (validity, label,
                editable, and so on).
            </p>
            <p> Please note that this feature works without any dependencies. No view knows any other view -
                nor do the models! We can add, remove, or modify any part of the application without touching
                the other parts and the synchronization still works!
            </p>
            <h2>Business Rules</h2>
            <p> The lastname attributes have a converter to uppercase and a validator for at least three characters.
                No matter where and how you change, these rules are always enforced and apply wherever the
                same value occurs. The visualization of validation errors is equally consistent.
            </p>
            <h2>Master-Detail Views as Projectors</h2>
            <p> Master-Detail Views come in an abundance of different ways.
            </p>
            <p> Here we have a list or table as the master view and a form as a detail view.
                Other master-detail views might be less obvious like tabbed views where the tabs
                constitute the master. Then there are drop-downs, selections, radio buttons, ribbons,
                accordions, menus, cover-flows, tiles, and so on. The list is endless.
            </p>
            <p> The Kolibri approach is always the same, no matter which of the many master-detail views we encounter.
                We bind the selection to a presentation model. This is so repetitive that we can delegate the
                work to a 
                <a href="https://github.com/WebEngineering-FHNW/Kolibri/blob/main/docs/src/examples/person/masterDetailProjector.js"
                >master-detail projector</a> that delegates the handling of updates to the
                <a href="https://github.com/WebEngineering-FHNW/Kolibri/blob/main/docs/src/examples/person/instantUpdateProjector.js">instant-update
                    projector</a>.
            </p>
            <h2>Testing Master-Detail Views and Multi-Way Editing</h2>
            <p> Manual testing might be appropriate in the prototyping stage, but you will quickly find that testing
                multi-way editing is particularly cumbersome to do manually. There is just so much clicking around
                and observing effects. You get bored, become unobservant and bugs creep in.
            </p>
            <p> Test automation comes to the rescue, and it is quite easy to implement. Have a look at
                <a href="https://github.com/WebEngineering-FHNW/Kolibri/blob/main/docs/src/examples/person/personTest.js"
                >Person test</a> that covers master-detail construction, proper selection handling, and 
                multi-way update. We hope you can pick up the pattern how to write those tests.
            </p>
            <p> You can actually <a href="${window.BASE_URI}/src/allTests.html">run those tests live
                in your browser</a> right now!
            </p>
               
        </section>
    </div>
`);

const [styleElement] = dom(`
    <style data-style-id="${PAGE_CLASS}">
      @layer pageLayer {  
        .${PAGE_CLASS} {        
            ${ instantUpdateProjectorCSS }
            
            /* we assume that kolibri base is already imported */
            
            perspective:            100rem; /* on mobile, this should not be too small */
            
            .card {
                transition:         all ease-in-out .5s;
                max-width:          40em;
                margin:             1em auto 2em auto;
                padding:            2em;
                box-shadow:         var(--kolibri-box-shadow);
            }
            h1 {
                text-align:         center;
            }
            .holder {
                margin:             0 3em 0 3em;
            }
            
            #plus {
                position:           relative;
                top:                -1em;
            }     
            
            /*  here, the layers pay off, because the kolibri can provide invalidation
                styling independent of our specificity
            */
            input[type=text] {
                font-size:          1.1em;
                color:              var(--kolibri-color-output);
                border-width:       0 0 1px 0;
            
                background-image:    linear-gradient(orange, orange);
                background-position: left bottom;
                background-repeat:   no-repeat;
                background-size:     0 1px; /* default:  do not show */
            }
            
            input[type=text]:focus {
                outline:             transparent none 0;
                border-bottom-color: transparent;
            
                background-size:     100% 1px;
                transition:          background-size linear .5s;
            }     
       
            
            &.activate .card {
                --activation-ms:    ${ACTIVATION_MS};
                animation:          ${PAGE_CLASS}_activation calc(var(--activation-ms) * 1ms) ease-out forwards;
            }         
            &.passivate .card {
                --passivation-ms:   ${PASSIVATION_MS};
                animation:          ${PAGE_CLASS}_passivation calc(var(--passivation-ms) * 1ms) ease-in forwards;
            }   
        }       
        /* top level */
        
        /* cannot be nested and must be uniquely named */
        @keyframes ${PAGE_CLASS}_activation {
            0% {
                opacity:        0.5;
                transform:      translateY(-100%);
            }
            100% {
                opacity:        1;
                transform:      translateY(0);
            }
        }  
        @keyframes ${PAGE_CLASS}_passivation {
            0% {
                opacity:        1;
                transform:      translateY(0);
            }
            100% {
                opacity:        0;
                transform:      translateY(-100%);
            }
        }   
     }           
    </style>
`);

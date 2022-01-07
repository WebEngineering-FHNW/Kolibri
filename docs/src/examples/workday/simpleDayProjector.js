import { dom }         from "../../kolibri/util/dom.js";
import { projectInput} from "../../kolibri/projector/simpleForm/simpleFormProjector.js";

export { projectDay }

/**
 * Creating views and bindings for a day from projecting simple inputs.
 * @param  { DayControllerType } dayController
 * @return {[HTMLDivElement, HTMLDivElement]} - array of div elements for am and pm
 */
const projectDay = dayController => {
    const [amStartViewLabel ,amStartViewInput] =  projectInput(dayController.amStartCtrl);
    const [amEndViewLabel   ,amEndViewInput  ] =  projectInput(dayController.amEndCtrl);
    const [pmStartViewLabel ,pmStartViewInput] =  projectInput(dayController.pmStartCtrl);
    const [pmEndViewLabel   ,pmEndViewInput  ] =  projectInput(dayController.pmEndCtrl);

    // create layout from a template and put the pieces in through replacement.
    // this is not the most efficient way, but it gives a good overview where things go.
    const elements = dom(`
        <div>
            <span id="am_start"></span>
            <span class="until">until</span>
            <span id="am_end"></span>
        </div>

        <div>
            <span id="pm_start"></span>
            <span class="until">until</span>
            <span id="pm_end"></span>
        </div>  
    `);
    /** @type {HTMLDivElement} */ const amDiv = elements[0];
    /** @type {HTMLDivElement} */ const pmDiv = elements[1];

    amDiv.querySelector("#am_start").replaceWith(amStartViewLabel, amStartViewInput);
    amDiv.querySelector("#am_end")  .replaceWith(amEndViewLabel,   amEndViewInput);
    pmDiv.querySelector("#pm_start").replaceWith(pmStartViewLabel, pmStartViewInput);
    pmDiv.querySelector("#pm_end")  .replaceWith(pmEndViewLabel,   pmEndViewInput);

    // no special view and data binding since that is all done by the simpleInputProjector

    return [amDiv, pmDiv]
};


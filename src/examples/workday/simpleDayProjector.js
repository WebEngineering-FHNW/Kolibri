import { dom }            from "../../kolibri/util/dom.js";
import { InputProjector } from "../../kolibri/projector/simpleForm/simpleInputProjector.js";

export { DayProjector }

const { projectChangeInput } = InputProjector;

/**
 * @type { DayProjectionType }
 */
const projectDay = dayController => {
    const [amStartViewLabel ,amStartViewSpan] =  projectChangeInput(dayController.amStartCtrl, "DAY" );
    const [amEndViewLabel   ,amEndViewSpan  ] =  projectChangeInput(dayController.amEndCtrl,   "DAY" );
    const [pmStartViewLabel ,pmStartViewSpan] =  projectChangeInput(dayController.pmStartCtrl, "DAY" );
    const [pmEndViewLabel   ,pmEndViewSpan  ] =  projectChangeInput(dayController.pmEndCtrl,   "DAY" );

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

    amDiv.querySelector("#am_start").replaceWith(amStartViewLabel, amStartViewSpan);
    amDiv.querySelector("#am_end")  .replaceWith(amEndViewLabel,   amEndViewSpan);
    pmDiv.querySelector("#pm_start").replaceWith(pmStartViewLabel, pmStartViewSpan);
    pmDiv.querySelector("#pm_end")  .replaceWith(pmEndViewLabel,   pmEndViewSpan);

    // no special view and data binding since that is all done by the simpleInputProjector

    return [amDiv, pmDiv]
};

/**
 * @type { IDayProjector }
 */
const DayProjector = {
    projectDay
};

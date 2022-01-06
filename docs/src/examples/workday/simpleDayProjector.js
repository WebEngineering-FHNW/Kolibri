import { dom }         from "../../kolibri/util/dom.js";
import { projectInput} from "../../kolibri/projector/simpleForm/simpleFormProjector.js";

export { projectDay }

const projectDay = dayController => {
    const [amStartCtrl, amEndCtrl, pmStartCtrl, pmEndCtrl] = dayController.timeController;
    const [amStartViewLabel ,amStartViewInput] =  projectInput(amStartCtrl);
    const [amEndViewLabel   ,amEndViewInput  ] =  projectInput(amEndCtrl);
    const [pmStartViewLabel ,pmStartViewInput] =  projectInput(pmStartCtrl);
    const [pmEndViewLabel   ,pmEndViewInput  ] =  projectInput(pmEndCtrl);

    amStartViewInput.setAttribute("min","04:00");
    pmEndViewInput  .setAttribute("max","22:00");

    // create layout and put the pieces in
    const [amDiv, pmDiv] = dom(`
        <div>
            <span id="am_start"></span>
            until
            <span id="am_end"></span>
        </div>

        <div>
            <span id="pm_start"></span>
            until
            <span id="pm_end"></span>
        </div>  
    `);
    amDiv.querySelector("#am_start").replaceWith(amStartViewLabel, amStartViewInput);
    amDiv.querySelector("#am_end")  .replaceWith(amEndViewLabel,   amEndViewInput);
    pmDiv.querySelector("#pm_start").replaceWith(pmStartViewLabel, pmStartViewInput);
    pmDiv.querySelector("#pm_end")  .replaceWith(pmEndViewLabel,   pmEndViewInput);

    // no special view and data binding since that is all done by the simpleInputProjector

    return [amDiv, pmDiv]
};


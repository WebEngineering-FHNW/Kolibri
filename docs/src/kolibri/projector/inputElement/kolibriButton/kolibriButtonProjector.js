import {dom}                                                from "../../../util/dom.js";
import {colorPrimaryAccent, colorPrimaryBg}                 from "../../../../customize/kolibriStyle.js"
import {ERROR, FOCUS, SUCCESS, CLICK, DISABLED, PROCESSING} from "./kolibriButtonModel.js";
import {
    mediumRubik,
    fontSizeLinkM,
    pxSpacer2,
    pxSpacer6,
    pxSpacer8,
    colorSecondaryAccent,
    colorSecondaryBg, purple400, blue500, colorSuccessBg, colorSuccessAccent, colorDangerAccent, colorDangerBg
}                                                           from "../../../../customize/kolibriStyle.js";

export {projectTextButton, BUTTON_CSS}


const BUTTON_CLASS_NAME = "kolibri-btn";


const projectLeadingIconButton = buttonController => {

};

const projectTrailingIconButton = buttonController  => {

};


/**
 * .
 * @constructor
 * @impure
 * @param  { KolibriAttributeButtonController }  buttonController
 * @param  { ObservableBtnStyle      }  buttonStyle
 * @param  { ObservableBtnEmphasis   }  buttonEmphasis
 * @return { [HTMLButtonElement]     }
 * @example
 *
 */

const projectTextButton = (buttonController) => {

    const css_classes = `btn ${buttonController.getDesignSystem()}-${buttonController.getState()}`;

    // create view
    const element = dom(`
		<button type="${buttonController.getType()}" class="${css_classes}">${buttonController.getValue()}</button>
    `);
    /** @type { HTMLButtonElement } */
    const kbButton = element[0];

    return projectKolibriButton(kbButton, buttonController)
};

const projectIconButton = buttonController => {


};



const projectKolibriButton = (btn, controler) => {


    btn.onclick         = event => {
        btn.style.setProperty("--ripple-x", event.offsetX+"px");
        btn.style.setProperty("--ripple-y", event.offsetY+"px");
        btn.classList.add("clicked");
        setTimeout( _ => btn.classList.remove("clicked"), 400); // we need to set back for the next click
    };


    controler.onStateChanged( state => {
        if(FOCUS       === state) btn.autofocus = true;
        if(ERROR       === state) btn.classList.add('error');
        if(DISABLED    === state) btn.disabled = true;
        if(SUCCESS     === state) btn.classList.add('success');
        if(PROCESSING  === state) btn.classList.add('processing');
        if(CLICK       === state) btnClicked(event);

    });


    return [btn];

};

const BUTTON_CSS = `
    .btn {
      border-radius:    ${pxSpacer2}
      padding:          ${pxSpacer6} ${pxSpacer8} 
      font-family       ${mediumRubik}
      font-size         ${fontSizeLinkM}
      line-height:      ${pxSpacer6}    
      text-decoration:  none;
      display:          inline-block;
      position:          relative;
        --ripple-x:       0px;
        --ripple-y:       0px;
    }
    
    .filled:hover {
      box-shadow: 0px 0px 4px ${blue500};
    }
    
    .filled:focus{
      box-shadow: 0px 0px 4px ${blue500};
      background-color: ${purple400};
    }    

    .filled-primary{
      border:           none;
      background-color: ${colorPrimaryAccent};
      color:            ${colorPrimaryBg};
    }
    
    .filled-success {
      background-color: ${colorSuccessAccent};
      color:            ${colorSuccessBg};
    
    }
    .filled-error {
        background-color: ${colorDangerAccent};
        color:            ${colorDangerBg};
    }
    
    .btn-filled-processing {
        
    }
    
    btn-filled-processing::after {
      border: 16px solid #f3f3f3;
      border-radius: 50%;
      border-top: 16px solid #3498db;
      width: 120px;
      height: 120px;
      -webkit-animation: spin 2s linear infinite; /* Safari */
      animation: spin 2s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .btn::before {
        border-radius:    8px;
        content:            "";
        pointer-events:     none;
        position:           absolute;
        top: 0; left: 0; bottom: 0; right: 0;
        background:         lightsteelblue;
        mix-blend-mode:     multiply;
        clip-path:         circle(0% at var(--ripple-x) var(--ripple-y));
        -webkit-clip-path: circle(0% at var(--ripple-x) var(--ripple-y));
    }
    
    .btn.clicked::before {
        animation: ripple ease-in 400ms; // note: when changing duration, update the js handler
    }
    
    @keyframes ripple {
        0% {
            clip-path:         circle(0%   at var(--ripple-x) var(--ripple-y));
            -webkit-clip-path: circle(0%   at var(--ripple-x) var(--ripple-y));
        }
        99% {
            clip-path:         circle(100% at var(--ripple-x) var(--ripple-y));
            -webkit-clip-path: circle(100% at var(--ripple-x) var(--ripple-y));
        }
        100% {
            clip-path:         circle(0%   at var(--ripple-x) var(--ripple-y));
            -webkit-clip-path: circle(0%   at var(--ripple-x) var(--ripple-y));
        }
    }           
    
`;

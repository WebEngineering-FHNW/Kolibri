
import { dom } from "../../kolibri/util/dom.js"
import {
    colorAccent, colorOk, colorNeutral, colorSelect, colorOutput, colorShadow, shadowCss,
    colorPrimaryDark,     colorPrimaryAccent, colorPrimaryBg,    colorPrimaryLight,
    colorSecondaryAccent, colorSecondaryDark, colorSecondaryBg,  colorSecondaryLight,
    colorSuccessAccent,   colorSuccessDark,   colorSuccessLight, colorSuccessBg,
    colorWarningAccent,   colorWarningDark,   colorWarningBg,    colorWarningLight,
    colorDangerAccent,    colorDangerDark,    colorDangerBg,     colorDangerLight
}              from "../../customize/kolibriStyle.js"

const root = document.querySelector("#out");

const stanza = ( colorName, color, cssName) => dom (`
<!--suppress CssUnresolvedCustomProperty -->
    <p>${colorName}</p>    
    <p>${cssName}</p>
    <div class="drop-size drop-shape" style="background: ${color};"></div>
    <div class="drop-size drop-shape" style="background: var(${cssName});"></div>
`);

const stanza2= ( colorName, color, cssName) => dom (`
<!--suppress CssUnresolvedCustomProperty -->
    <p>${colorName}</p>    
    <p>${"--kolibri-color-" + cssName}</p>

    <div class="drop-size drop-shape" style="background: ${color};"></div>
    <div class="flow">
        <div class="drop-size drop-shape" style="background: var(${"--kolibri-color-"  + cssName});"></div>
    </div>
`);

root.append( ... stanza("colorNeutral", colorNeutral , "--kolibri-color-neutral"  ));
root.append( ... stanza("colorAccent ", colorAccent  , "--kolibri-color-accent"  ));
root.append( ... stanza("colorOk     ", colorOk      , "--kolibri-color-ok"  ));
root.append( ... stanza("colorSelect ", colorSelect  , "--kolibri-color-select"  ));
root.append( ... stanza("colorOutput ", colorOutput  , "--kolibri-color-output"  ));
root.append( ... stanza("colorShadow ", colorShadow  , "--kolibri-color-shadow"  ));
root.append( ... dom (`
    <p>shadow</p>
    <p>--kolibri-box-shadow</p>
    <div class="drop-size" style="box-shadow: ${shadowCss}"></div>
    <div class="drop-size" style="box-shadow: var(--kolibri-box-shadow)"></div>
`));


root.append( ... stanza2("colorPrimaryDark    ", colorPrimaryDark     , "primary-dark"  ));
root.append( ... stanza2("colorPrimaryAccent  ", colorPrimaryAccent   , "primary-accent"  ));
root.append( ... stanza2("colorPrimaryBg      ", colorPrimaryBg       , "primary-bg"  ));
root.append( ... stanza2("colorPrimaryLight   ", colorPrimaryLight    , "primary-light"  ));
root.append( ... stanza2("colorSecondaryAccent", colorSecondaryAccent , "secondary-accent"  ));
root.append( ... stanza2("colorSecondaryDark  ", colorSecondaryDark   , "secondary-dark"  ));
root.append( ... stanza2("colorSecondaryBg    ", colorSecondaryBg     , "secondary-bg"  ));
root.append( ... stanza2("colorSecondaryLight ", colorSecondaryLight  , "secondary-light"  ));
root.append( ... stanza2("colorSuccessAccent  ", colorSuccessAccent   , "success-accent"  ));
root.append( ... stanza2("colorSuccessDark    ", colorSuccessDark     , "success-dark"  ));
root.append( ... stanza2("colorSuccessLight   ", colorSuccessLight    , "success-light"  ));
root.append( ... stanza2("colorSuccessBg      ", colorSuccessBg       , "success-bg"  ));
root.append( ... stanza2("colorWarningAccent  ", colorWarningAccent   , "warning-accent"  ));
root.append( ... stanza2("colorWarningDark    ", colorWarningDark     , "warning-dark"  ));
root.append( ... stanza2("colorWarningBg      ", colorWarningBg       , "warning-bg"  ));
root.append( ... stanza2("colorWarningLight   ", colorWarningLight    , "warning-light"  ));
root.append( ... stanza2("colorDangerAccent   ", colorDangerAccent    , "danger-accent"  ));
root.append( ... stanza2("colorDangerDark     ", colorDangerDark      , "danger-dark"  ));
root.append( ... stanza2("colorDangerBg       ", colorDangerBg        , "danger-bg"  ));
root.append( ... stanza2("colorDangerLight    ", colorDangerLight     , "danger-light"  ));


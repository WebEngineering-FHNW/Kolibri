
import { dom } from "../../kolibri/util/dom.js"
import {
    accentColor, okColor, neutralColor, selectColor, outputColor, shadowColor, shadowCss,
    primaryDark,     primaryAccent, primaryBg,    primaryLight,
    secondaryAccent, secondaryDark, secondaryBg,  secondaryLight,
    successAccent,   successDark,   successLight, successBg,
    warningAccent,   warningDark,   warningBg,    warningLight,
    dangerAccent,    dangerDark,    dangerBg,     dangerLight
} from "../../kolibri/style/kolibriStyle.js"

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
    <p>${"--kb-rgb-" + cssName}, ${"--kb-hsla-" + cssName}</p>

    <div class="drop-size drop-shape" style="background: ${color};"></div>
    <div class="flow">
        <div class="drop-size drop-shape" style="background: var(${"--kb-rgb-"  + cssName});"></div>
        <div class="drop-size drop-shape" style="background: var(${"--kb-hsla-" + cssName});"></div>
    </div>
`);

root.append( ... stanza( "neutralColor", neutralColor ,"--kolibri-color-neutral"  ));
root.append( ... stanza( "accentColor",  accentColor  ,"--kolibri-color-accent"  ));
root.append( ... stanza( "okColor",      okColor      ,"--kolibri-color-ok"  ));
root.append( ... stanza( "selectColor",  selectColor  ,"--kolibri-color-select"  ));
root.append( ... stanza( "outputColor",  outputColor  ,"--kolibri-color-output"  ));
root.append( ... stanza( "shadowColor",  shadowColor  ,"--kolibri-color-shadow"  ));
root.append( ... dom (`
    <p>shadow</p>
    <p>--kolibri-box-shadow</p>
    <div class="drop-size" style="box-shadow: ${shadowCss}"></div>
    <div class="drop-size" style="box-shadow: var(--kolibri-box-shadow)"></div>
`));


root.append( ... stanza2( "primaryDark",     primaryDark     ,"primary-dark"  ));
root.append( ... stanza2( "primaryAccent",   primaryAccent   ,"primary-accent"  ));
root.append( ... stanza2( "primaryBg",       primaryBg       ,"primary-bg"  ));
root.append( ... stanza2( "primaryLight",    primaryLight    ,"primary-light"  ));
root.append( ... stanza2( "secondaryAccent", secondaryAccent ,"secondary-accent"  ));
root.append( ... stanza2( "secondaryDark",   secondaryDark   ,"secondary-dark"  ));
root.append( ... stanza2( "secondaryBg",     secondaryBg     ,"secondary-bg"  ));
root.append( ... stanza2( "secondaryLight",  secondaryLight  ,"secondary-light"  ));
root.append( ... stanza2( "successAccent",   successAccent   ,"success-accent"  ));
root.append( ... stanza2( "successDark",     successDark     ,"success-dark"  ));
root.append( ... stanza2( "successLight",    successLight    ,"success-light"  ));
root.append( ... stanza2( "successBg",       successBg       ,"success-bg"  ));
root.append( ... stanza2( "warningAccent",   warningAccent   ,"warning-accent"  ));
root.append( ... stanza2( "warningDark",     warningDark     ,"warning-dark"  ));
root.append( ... stanza2( "warningBg",       warningBg       ,"warning-bg"  ));
root.append( ... stanza2( "warningLight",    warningLight    ,"warning-light"  ));
root.append( ... stanza2( "dangerAccent",    dangerAccent    ,"danger-accent"  ));
root.append( ... stanza2( "dangerDark",      dangerDark      ,"danger-dark"  ));
root.append( ... stanza2( "dangerBg",        dangerBg        ,"danger-bg"  ));
root.append( ... stanza2( "dangerLight",     dangerLight     ,"danger-light"  ));


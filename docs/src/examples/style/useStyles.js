
import { dom } from "../../kolibri/util/dom.js"
import { accentColor, okColor, neutralColor, selectColor, outputColor, shadowColor, shadowCss } from "../../kolibri/style/kolibriStyle.js"

const root = document.querySelector("#out");

const dimensions = "width: 40px; height:40px;";
const stanza = ( colorName, color, cssName) => dom (`
<!--suppress CssUnresolvedCustomProperty -->
    <p>${colorName}</p>    
    <p>${cssName}</p>
    <div style="${dimensions} background: ${color};"></div>
    <div style="${dimensions} background: var(${cssName});"></div>
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
    <div style="${dimensions} box-shadow: ${shadowCss}"></div>
    <div style="${dimensions} box-shadow: var(--kolibri-box-shadow)"></div>
`));

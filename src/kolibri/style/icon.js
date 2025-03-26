import { dom }             from "../util/dom.js";
import { ICON_EMPTY, svg } from "../../customize/icons.js";
import { Seq }             from "../sequence/constructors/seq/seq.js";

export { icon }

const xmlns ="http://www.w3.org/2000/svg";

/**
 * Convenience function to properly set up SVG elements for icons from their String representation.
 * @param { IconNameType } iconName
 * @return { SequenceType<SVGElement> }
 */
const icon = iconName => {
    const svgString = svg[iconName] ?? svg[ICON_EMPTY];
    const [iconSVG] =  /** @type { Array<SVGElement> } */ dom(svgString);

    iconSVG.removeAttribute("height");      // remove attributes that we likely to override via class styling
    iconSVG.removeAttribute("width");
    iconSVG.removeAttribute("stroke-width");
    iconSVG.removeAttribute("stroke-linecap");
    iconSVG.removeAttribute("stroke-linejoin");

    iconSVG.setAttribute("xmlns", xmlns);   // add standard attributes
    iconSVG.setAttribute("class", "icon");

    return Seq(iconSVG);
};

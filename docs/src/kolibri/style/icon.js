import { dom } from "../util/dom.js";
import { svg } from "../../customize/icons.js";

export { icon }

const xmlns ="http://www.w3.org/2000/svg";

const icon = iconName => {
    const [iconSVG] = dom(svg[iconName]);
    iconSVG.removeAttribute("height"); // remove attributes that we like to override via class styling
    iconSVG.removeAttribute("width");
    iconSVG.removeAttribute("stroke-width");
    iconSVG.removeAttribute("stroke-linecap");
    iconSVG.removeAttribute("stroke-linejoin");
    iconSVG.setAttribute("xmlns", xmlns);
    iconSVG.setAttribute("class", "icon");
    return [iconSVG];
};

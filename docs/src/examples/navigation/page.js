import { Observable } from "../../kolibri/observable.js";

export { Page }

const Page = ({titleText, styleElement, contentElement, activationMs=500, passivationMs=500}) => {
    const visitedObs = Observable(false);
    return {
        titleText        ,
        styleElement     ,
        contentElement   ,
        activationMs     ,
        passivationMs    ,
        getVisited:      visitedObs.getValue,
        setVisited:      visitedObs.setValue,
        onVisited :      visitedObs.onChange,
    }
};

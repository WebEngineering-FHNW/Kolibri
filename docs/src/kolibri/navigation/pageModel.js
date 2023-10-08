import {
    Attribute,
    ACTIVE,
    DESCRIPTION,
    HASH,
    ICONPATH,
    NAVIGATIONAL,
    PARENT,
    VALUE,
    VISIBLE,
    VISITED
} from "../kolibri/presentationModel.js";

export { PageModel }

/**
 * PageModelType is the page interface that is needed to register a page with a NavigationController.
 * The PageModelType stores rich attributes that abstract its visual and contextual state in a Navigation.
 * Each PageModelType has a unique hash that identifies it while navigating.
 *
 * @typedef PageModelType
 * @template T
 * @property { () => String } getQualifier - a function that returns the qualifier for this page.
 * @property { (obsType: ObservableTypeString) => IObservable<T> } getPageObs - a function that returns the observable stored under the given observable string. Throws an error, if observable does not exist in the model.
 */

/**
 * Constructor for a PageModelType
 *
 * @constructor
 * @param { !String } qualifier - unique qualifier for the page.
 *                                The hash will be inferred from the qualifier, e.g. 'home' -> '#hash' and will be immutable.
 *                                The qualifier will also be the initial page name that can be changed later.
 * @returns PageModelType
 * @example
 * const pageModel = PageModel('home');
 */

const PageModel = qualifier => {
    if ('' === qualifier) {
        throw new Error('Qualifiers cannot be empty.')
    } else if (qualifier.includes(' ') || qualifier.includes('\n')) {
        throw new Error('Qualifiers cannot contain spaces or new lines. Consider replacing them with "-" or "_" characters. Try: ' + qualifier.replace(/[\s\n]+/g, "-"));
    } else if (/^(?![A-Za-z])+/.test(qualifier)) {
        throw new Error('Qualifiers cannot start with a number. Please remove the number at the start of qualifier: ' + qualifier);
    }
    const pageAttr = Attribute(qualifier);

    pageAttr.setQualifier(qualifier);

    pageAttr.getObs(ACTIVE, false);
    pageAttr.getObs(HASH, '#' + qualifier.replace(' ', '')); //Converter is not used because it should only apply for the hash
    pageAttr.getObs(VISITED, false);
    pageAttr.getObs(ICONPATH, '../navigation/icons/placeholder.svg');
    pageAttr.getObs(VISIBLE, true);
    pageAttr.getObs(PARENT, null);
    pageAttr.getObs(NAVIGATIONAL, true);
    pageAttr.getObs(DESCRIPTION, '');
    pageAttr.getObs(VALUE).setValue(qualifier); // set value explicitly, so it overrides any state the model world has

    return {
        getQualifier:   () => pageAttr.getQualifier(),
        getPageObs:     obsType => {
            if (!pageAttr.hasObs(obsType)) {
                throw new Error(obsType + ' is not defined for pageModel.')
            }
            return pageAttr.getObs(obsType)
        },
    }
};


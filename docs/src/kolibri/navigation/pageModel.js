import {
    Attribute,
    VALUE,
} from "../presentationModel.js";

export { PageModel,
    TARGET_ID   ,
    ACTIVE      ,
    DESCRIPTION ,
    HASH        ,
    ICONPATH    ,
    NAVIGATIONAL,
    PARENT      ,
    VISIBLE     ,
    VISITED     ,
    ALL_PROPERTY_NAMES
}

/**
 * @typedef {'targetId'|'active'|'description'|'hash'|'iconPath'|'navigational'|'parent'|'visible'|'visited'} PageModelPropertyType
 * Possible names of properties of a page model.
 */

/** @type PageModelPropertyType */ const TARGET_ID       = "targetId";
/** @type PageModelPropertyType */ const ACTIVE          = "active";
/** @type PageModelPropertyType */ const DESCRIPTION     = "description";
/** @type PageModelPropertyType */ const HASH            = "hash";
/** @type PageModelPropertyType */ const ICONPATH        = "iconPath";
/** @type PageModelPropertyType */ const NAVIGATIONAL    = "navigational";
/** @type PageModelPropertyType */ const PARENT          = "parent";
/** @type PageModelPropertyType */ const VISIBLE         = "visible";
/** @type PageModelPropertyType */ const VISITED         = "visited";

/** @type { Array<PageModelPropertyType> } */
const ALL_PROPERTY_NAMES = [ACTIVE, DESCRIPTION, HASH, ICONPATH, NAVIGATIONAL, PARENT, VISIBLE, VISITED];

/**
 * PageModelType is the page interface that is needed to register a page with a NavigationController.
 * The PageModelType stores rich attributes that abstract its visual and contextual state in a Navigation.
 * Each PageModelType has a unique (TODO: check) hash that identifies it while navigating.
 *
 * @typedef PageModelType
 *
 * @Property { Attribute<String> }                  targetIdAttr - e.g. "home"
 * @Property { Attribute<Boolean> }                 activeAttr - has been activated but not yet passivated
 * @Property { Attribute<String> }                  hashAttr - last part of the URI path, e.g. "#home"
 * @Property { Attribute<Boolean> }                 visitedAttr - this has been visible before
 * @Property { Attribute<String> }                  iconPathAttr - where the icon can be found
 * @Property { Attribute<Boolean> }                 visibleAttr - this page is currently visible TODO (???)
 * @Property { Attribute<PageModelType | null> }    parentAttr - sitemap containment, null for "no parent" TODO consider null object pattern
 * @Property { Attribute<Boolean> }                 navigationalAttr - can be navigated to via href
 * @Property { Attribute<String> }                  descriptionAttr - what can be found here
 *
 */

/**
 * Constructor for a PageModelType
 *
 * @constructor
 * @param { !String } targetId - unique targetId for the page.
 *                                Cannot be empty, contain space chars, or start with a non-alpha character
 *                                since it will be used to create URI hashes.
 *                                The hash will be inferred from the targetId, e.g. 'home' -> '#home' and will be immutable.
 *                                The targetId will also be the initial page name that can be changed later.
 * @returns PageModelType
 * @example
 * const pageModel = PageModel('home');
 */

const PageModel = targetId => {
    // TODO: log errors below and test (and simplify) the regexes. Reconsider the char replacements.
    if ('' === targetId) {
        throw new Error('Qualifiers cannot be empty.')
    }
    if (targetId.includes(' ') || targetId.includes('\n')) {
        throw new Error('Qualifiers cannot contain spaces or new lines. Consider replacing them with "-" or "_" characters. Try: ' + targetId.replace(/[\s\n]+/g, "-"));
    }
    if (/^(?![A-Za-z])+/.test(targetId)) {
        throw new Error('Qualifiers cannot start with a number. Please remove the number at the start of targetId: ' + targetId);
    }
    const qualify = propname => "Page."+targetId+"."+propname;

    const targetIdAttr      = Attribute(targetId,                               qualify(TARGET_ID));
    const activeAttr        = Attribute(false   ,                               qualify(ACTIVE));
    const hashAttr          = Attribute('#' + targetId.replace(' ', '')   ,     qualify(HASH));
    const visitedAttr       = Attribute(false,                                  qualify(VISITED));
    const iconPathAttr      = Attribute('../navigation/icons/placeholder.svg',  qualify(ICONPATH));
    const visibleAttr       = Attribute(true,                                   qualify(VISIBLE));
    const parentAttr        = Attribute(null,                                   qualify(PARENT));
    const navigationalAttr  = Attribute(true,                                   qualify(NAVIGATIONAL));
    const descriptionAttr   = Attribute('',                                     qualify(DESCRIPTION));


    // TODO: check if this is really needed (if so, consider QualifiedAttribute)
    targetIdAttr.getObs(VALUE).setValue(targetId); // set value explicitly, so it overrides any state the model world has

    return /** @type { PageModelType } */{
        // getQualifier:   () => targetIdAttr.getQualifier(), // TODO: check if this is needed
        targetIdAttr, activeAttr, hashAttr, visitedAttr, iconPathAttr, visibleAttr,
        parentAttr, navigationalAttr, descriptionAttr
    }
};


export { GridProjector }

/**
 * GridType consists of the abstracted properties that are needed to build a grid into a view.
 *
 * @typedef GridType
 * @property { number|undefined } rowStartIndex
 * @property { number|undefined } rowEndIndex
 * @property { number|undefined } colStartIndex
 * @property { number|undefined } colEndIndex
 * @property { number|undefined } rowSpan
 * @property { number|undefined } colSpan
 */

/**
 * GridProjectorType takes care of the grid properties that are assigned to pages.
 * These properties can be used by NavigationProjectorTypes to display a grid.
 *
 * @typedef GridProjectorType
 * @property { (pageQualifier: !String, grid: GridType) => void } setGridForPage - set a grid for a given page qualifier. Undefined parameters are defaulted to values from the default grid.
 * @property { (pageQualifier: !String) => boolean } removeGridForPage - removes the grid for a given page qualifier.
 * @property { (pageQualifier: !String) => ?GridType } getGridForPage - get a grid for a given page qualifier.
 */

/**
 * @constructor
 * @returns GridProjectorType
 * @example
 * const gridProjector = GridProjector();
 * const homePageController = PageController("home", null);
 * gridProjector.setGridForPage(homePageController, { rowStartIndex: 2, rowEndIndex: 5 })
 *
 */
const GridProjector = () => {
    const pageGridMapping = {};

    const defaultGrid = {
        rowStartIndex: 0,
        rowEndIndex: 0,
        colStartIndex: 0,
        colEndIndex: 0,
        rowSpan: 0,
        colSpan: 0
    };

    return {
        setGridForPage: (pageQualifier, grid) => pageGridMapping[pageQualifier] = { ...defaultGrid, ...grid },
        removeGridForPage: pageQualifier => delete pageGridMapping[pageQualifier],
        getGridForPage: pageQualifier => pageGridMapping[pageQualifier]
    }
};


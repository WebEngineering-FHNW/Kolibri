import {Observable} from '../../kolibri/observable.js';

/**
 * @module examples/bigLazyTable/virtual-scrolling
 */

export {VirtualScrollController, VirtualScrollView, RowCounterView};

/**
 * @typedef VirtualScrollControllerType
 */

/**
 * @typedef VirtualScrollController
 * @template T
 * @param {Number} containerHeightPx
 * @param {Number} rowHeightPx
 * @param {Array<T>} data       - the data of the list, no expected to change at runtime (ATM)
 * @returns {VirtualScrollControllerType}
 */
const VirtualScrollController = (containerHeightPx, rowHeightPx, data) => {

    const dataRowCount        = data.length;
    const dataWindowSize      = Math.floor(containerHeightPx / rowHeightPx) ;
    const scrollTopObservable = Observable(0);
    
    // There is an upper limit for the scrollTop values (maybe because of the max height of the scrollable element).
    // This leads to max 1.8 Mio entries that can be scrolled to.
    // We address this by scaling down the scrollable area and the rowHeight in the calculations by a factor.
    const MAX_SCROLL_TOP = 20_000_000; // 33_554_136; // chrome, safari; FF is unclear

    let virtualHeightPx = dataRowCount * rowHeightPx;
    const factor = Math.min(1.0, MAX_SCROLL_TOP / virtualHeightPx);
    virtualHeightPx *= factor;
    rowHeightPx     *= factor;
    
    let dataWindowStartIndex = 0;
    let scrollOffsetYPx      = rowHeightPx * dataWindowStartIndex;

    /**
     * Method calculates the first rendered item and return the index
     * @param {number} scrollTop
     */
    const setCurrentFirstVirtualItem = (scrollTop) => {
        scrollTop = Math.min(scrollTop, MAX_SCROLL_TOP);
        dataWindowStartIndex = Math.round(scrollTop / rowHeightPx) ;
        dataWindowStartIndex = Math.max(0, dataWindowStartIndex);
        if (dataRowCount - dataWindowStartIndex < dataWindowSize) {
            dataWindowStartIndex = dataRowCount - dataWindowSize;
        }
        scrollOffsetYPx      = rowHeightPx * dataWindowStartIndex;
    };

    return {
        getVirtualHeightPx:         () => virtualHeightPx,
        getDataWindowSize:          () => dataWindowSize,
        getDataWindowStartIndex:    () => dataWindowStartIndex,
        getDataWindowEndIndex:      () => dataWindowStartIndex + dataWindowSize,
        getDataRowCount:            () => dataRowCount,
        getDataWindow:              () => data.getWindow(dataWindowStartIndex, dataWindowSize),
        setCurrentFirstVirtualItem: setCurrentFirstVirtualItem,
        getScrollOffsetYPx:         () => scrollOffsetYPx,
        setListScrollTop:           scrollTopObservable.setValue,
        getListScrollTop:           scrollTopObservable.getValue,
        onListScrollTopChanged:     scrollTopObservable.onChange,
    };
};

/**
 * VirtualScrollView
 * @param {Node} container // todo: it is nicer when projectors return the created view - just to make sure they do not mess with the container
 * @param {VirtualScrollControllerType} virtualScrollController
 *  @param {function} rowTemplate - function which renders a row and returns an element
 */
const VirtualScrollView = (container, virtualScrollController, rowTemplate) => {

    const scrollFrame          = document.createElement('DIV'); // surrounds and holds the scrollable content
    scrollFrame.style.overflow = 'auto';                        // scroll when needed

    // the virtual "field" on which any content is placed. It is mostly used to indirectly set the scroll handle height.
    const fairWay = document.createElement('DIV');
    fairWay.style.setProperty("min-height", `${virtualScrollController.getVirtualHeightPx()}px`);  

    const placedContent = document.createElement('DIV'); // make this content appear as if it was scrolled.
    fairWay.appendChild(placedContent);
    scrollFrame.appendChild(fairWay);
    container.appendChild(scrollFrame);

    /**
     * transforms scrolling container after rerendering the list
     * @param {*} scrollingContainer
     */
    const shiftNodes = (scrollingContainer) => scrollingContainer.style.transform = `translateY(${virtualScrollController.getScrollOffsetYPx()}px)`;

    /**
     * Renders the list
     * @param {number} scrollTop
     */
    const renderList = (scrollTop) => {
        virtualScrollController.setCurrentFirstVirtualItem(scrollTop);
        //Clear container
        placedContent.replaceChildren();
        virtualScrollController.getDataWindow()
                               .map(element => rowTemplate(element)) // todo: 2 functions for create and update
                               .forEach((row) => {
                                   placedContent.appendChild(row);
                               });
        shiftNodes(placedContent);
    };

    virtualScrollController.onListScrollTopChanged(renderList);
    renderList(virtualScrollController.getListScrollTop());

    //add event listener to container scroll and rerender list when its triggered
    scrollFrame.addEventListener('scroll', scrollEvent => {
        virtualScrollController.setListScrollTop(scrollEvent.target.scrollTop);
    });
};

/**
 * View for the row counter
 * @param {VirtualScrollControllerType} virtualScrollController
 * @param {Node} container
 */
const RowCounterView = (virtualScrollController, container) => {
    //add row counter
    const rowCount = document.createElement('SPAN');
    container.appendChild(rowCount);
    const changeContainer = () => {
        rowCount.innerText = `${virtualScrollController.getDataWindowStartIndex()} - ${virtualScrollController.getDataWindowEndIndex()} / ${virtualScrollController.getDataRowCount()}`;
    };
    changeContainer();
    virtualScrollController.onListScrollTopChanged(changeContainer);
};

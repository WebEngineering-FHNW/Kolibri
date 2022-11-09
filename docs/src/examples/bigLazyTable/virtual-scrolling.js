import {Observable} from '../../kolibri/observable.js';
import {dom} from '../../kolibri/util/dom.js'

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
 * @param {VirtualScrollControllerType}       virtualScrollController
 * @param { ()       => HTMLTableRowElement } headTemplate - function which returns a thead content
 * @param { (item:*) => HTMLTableRowElement } rowTemplate - function which renders a row and returns an element
 * @returns {Array<HTMLDivElement>} the created and bound frame that holds the scrollable content
 */
const VirtualScrollView = (virtualScrollController, headTemplate, rowTemplate) => {

    const [scrollFrame] = dom(`
        <DIV id="scrollFrame" style="overflow: auto;">
            <DIV id="fairWay" style="min-height: ${virtualScrollController.getVirtualHeightPx()}px;">
                <TABLE >
                    <THEAD></THEAD>
                    <TBODY></TBODY>
                </TABLE>
            </DIV>
        </DIV>
    `);
    scrollFrame.querySelector("thead").appendChild(headTemplate());

    const table = scrollFrame.querySelector("table");
    const thead = table.querySelector("thead");

    const placedContent = scrollFrame.querySelector("tbody"); // make this content appear as if it was scrolled.

    /**
     * transforms scrolling container after rerendering the list
     * @param {*} scrollingContainer
     */
    const shiftNodes = (scrollingContainer) => scrollingContainer.style.transform = `translateY(${virtualScrollController.getScrollOffsetYPx()}px)`;

    /**
     * Renders the list initially
     * @param {number} scrollTop - the position in pixels of the scrollable area that is currently displayed at the top of the scrollable frame
     */
    const renderList = (scrollTop) => {
        virtualScrollController.setCurrentFirstVirtualItem(scrollTop);

        placedContent.replaceChildren();          // clear container
        virtualScrollController
            .getDataWindow()
            .map(item => rowTemplate(item)) // todo: 2 functions for create and update
            .forEach(row => placedContent.appendChild(row));
        shiftNodes(table);
    };

    const updateList = (scrollTop) => {
        virtualScrollController.setCurrentFirstVirtualItem(scrollTop);

        const window = virtualScrollController.getDataWindow();
        let i = 0;
        for (const tr of placedContent.querySelectorAll("tr")) {
            tr.children[0].textContent = window[i].id;
            tr.children[1].textContent = window[i].title;
            i++;
        }
        shiftNodes(placedContent);
        thead.style.transform = `translateY(${scrollTop}px)`;
    };

    virtualScrollController.onListScrollTopChanged(updateList);
    renderList(virtualScrollController.getListScrollTop());

    //add event listener to container scroll and rerender list when its triggered
    scrollFrame.addEventListener('scroll',
                                 scrollEvent => virtualScrollController.setListScrollTop(scrollEvent.target.scrollTop));

    return [scrollFrame];
};

/**
 * View for the row counter
 * @param {VirtualScrollControllerType} virtualScrollController
 * @returns {Array<HTMLSpanElement>} the created and bound span that displays the row count
 */
const RowCounterView = (virtualScrollController) => {
    /** @type {HTMLSpanElement} */
    const rowCount = document.createElement('SPAN');
    const changeContainer = () => {
        rowCount.innerText = `${virtualScrollController.getDataWindowStartIndex()} - ${virtualScrollController.getDataWindowEndIndex()} / ${virtualScrollController.getDataRowCount()}`;
    };
    changeContainer();
    virtualScrollController.onListScrollTopChanged(changeContainer);
    return [rowCount];
};

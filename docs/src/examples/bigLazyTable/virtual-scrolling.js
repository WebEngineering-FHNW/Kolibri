import { Observable }          from '../../kolibri/observable.js';
import { dom }                 from '../../kolibri/util/dom.js';
import { ForgetfulScheduler }  from "./lastWins.js";

/**
 * @module examples/bigLazyTable/virtual-scrolling
 */

export {VirtualScrollController, VirtualScrollView, RowCounterView};

/**
 * @typedef VirtualScrollControllerType
 * @property { Promise<Array> } getDataWindow
 * @property { Promise<Array> } getDataWindow
 * @property { () => Number}   getVirtualHeightPx
 * @property { () => Number}   getDataWindowStartIndex
 * @property { () => Number}   getDataWindowEndIndex
 * @property { () => Number}   getDataRowCount
 * @property { () => Promise<Array> }   getDataWindow
 * @property { (Number) => void }   setRowHeightPx
 * @property { (Number) => void }   setHeaderRowHeightPx
 * @property { (Number) => void }   setContainerHeightPx
 * @property { (Number) => void }   setCurrentFirstVirtualItem
 * @property { () => Number}   getScrollOffsetYPx
 * @property { (Number) => void }   setListScrollTop
 * @property { () => Number}   getListScrollTop
 * @property { (callback: onValueChangeCallback<Number>) => void }   onListScrollTopChanged
 */

/**
 * @typedef DataService
 * @template _T_
 * @property { (beginIndex:Number, size:Number) => Promise<Array<_T_>> } getWindow
 * @property { Number } length
 */

/**
 * @typedef VirtualScrollController
 * @template T
 * @param   { DataService } dataService       - the data of the list, not expected to change at runtime (ATM)
 * @returns { VirtualScrollControllerType }
 */
const VirtualScrollController = dataService => {

    const dataRowCount        = dataService.length;
    const scrollTopObservable = Observable(0);

    let rowHeightPx           =  20;   // initial values, to be changed through reDim()
    let headerRowHeightPx     =  20;
    let containerHeightPx     = 100;
    let dataWindowSize        =   0;

    // There is an upper limit for the scrollTop values (maybe because of the max height of the scrollable element).
    // This leads to max 1.8 Mio entries that can be scrolled to.
    // We address this by scaling down the scrollable area and the rowHeight in the calculations by a factor.
    const MAX_SCROLL_TOP = 20_000_000; // 33_554_136; // chrome, safari; FF is unclear

    let virtualHeightPx      = 0;
    let factor               = 1;
    let dataWindowStartIndex = 0;
    let scrollOffsetYPx      = 0;

    const updateScrollOffset = (scrollTop) => {
        scrollOffsetYPx  = rowHeightPx * dataWindowStartIndex;
        if (scrollTop >  headerRowHeightPx) {      // we have to move beyond the header space ...
            scrollOffsetYPx += headerRowHeightPx;
        } else {                                   // ... unless when the position is smaller than the header height
            scrollOffsetYPx = scrollTop;
        }
    };

    /** Re-Dimensioning based on changes in one of the dimensions */
    const reDim = () => {
        virtualHeightPx = headerRowHeightPx + dataRowCount * rowHeightPx;
        factor          = Math.min(1.0, MAX_SCROLL_TOP / virtualHeightPx);
        virtualHeightPx *= factor;
        rowHeightPx     *= factor;
        dataWindowSize  = Math.floor( (containerHeightPx - headerRowHeightPx) / rowHeightPx);
        updateScrollOffset(0);
    };
    reDim();

    /**
     * Method calculates the first rendered item and return the index
     * @param {number} scrollTop
     */
    const setCurrentFirstVirtualItem = (scrollTop) => {
        scrollTop = Math.min(scrollTop, MAX_SCROLL_TOP);
        dataWindowStartIndex = Math.round((scrollTop - headerRowHeightPx) / rowHeightPx) ;
        dataWindowStartIndex = Math.max(0, dataWindowStartIndex);
        if (dataRowCount - dataWindowStartIndex < dataWindowSize) { // reaching the end
            dataWindowStartIndex = dataRowCount - dataWindowSize + 1;
        }
        updateScrollOffset(scrollTop);
    };

    return {
        getVirtualHeightPx:         () => virtualHeightPx,
        getDataWindowStartIndex:    () => dataWindowStartIndex,
        getDataWindowEndIndex:      () => dataWindowStartIndex + dataWindowSize - 1,
        getDataRowCount:            () => dataRowCount,
        getDataWindow:              () => dataService.getWindow(dataWindowStartIndex, dataWindowSize),
        setRowHeightPx:             px => { rowHeightPx       = px; reDim(); },
        setHeaderRowHeightPx:       px => { headerRowHeightPx = px; reDim(); },
        setContainerHeightPx:       px => { containerHeightPx = px; reDim(); },
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
 * @param { HTMLElement}                      container
 * @param { ()       => HTMLTableRowElement } headTemplate - function which returns a thead content
 * @param { (item:*) => HTMLTableRowElement } rowTemplate - function which renders a row and returns an element
 * @param { ( tds:HTMLCollection, item:*) => void } rowFill - function that fills the table data of the row with a data item
 * @returns void - returns nothing since we have to side effect the container
 */
const VirtualScrollView = (virtualScrollController, container, headTemplate, rowTemplate, rowFill) => {

    const [scrollFrame] = dom(`
        <DIV id="scrollFrame" style="overflow: auto;">
            <DIV id="fairWay" style="min-height: ${virtualScrollController.getVirtualHeightPx()}px;">
                <TABLE style="border-collapse: collapse;border-spacing: 0;">
                    <TBODY></TBODY>
                    <THEAD></THEAD>
                </TABLE>
            </DIV>
        </DIV>
    `);
    // ATTN! It is on purpose that THEAD comes _after_ TBODY !!!
    // This ensures that the header is always painted on top of any data rows that might
    // spill over at the end display of data sets with > 2 Mio entries when rounding errors for the offset kick in.

    container.appendChild(scrollFrame);             // we need to do this early to get the bounding rect dimensions
    const table = scrollFrame.querySelector("table");
    const thead = table.querySelector("thead");
    const tbody = table.querySelector("tbody");
    let   tableRows = undefined;                    // lazy init

    const headerRow = headTemplate();
    thead.appendChild(headerRow);
    const testRow = rowTemplate(null);// make sure that null return an empty/default template
    tbody.appendChild(testRow);

    /**
     * move the content to their translation position on the fairway
     * @param { HTMLElement } contentElement
     */
    const shiftNodes = contentElement => contentElement.style.transform = `translateY(${virtualScrollController.getScrollOffsetYPx()}px)`;

    /**
     * Renders the list initially and determines the dimensions for calculating.
     * For this we need the data window and since we only get this in an async fashion, we can
     * only proceed asynchronously.
     * @return { Promise<void> } - continue asynchronously
     */
    const renderTable = () => {
        virtualScrollController.setContainerHeightPx(container.getBoundingClientRect().height);
        virtualScrollController.setHeaderRowHeightPx(headerRow.getBoundingClientRect().height);
        virtualScrollController.setRowHeightPx      (testRow  .getBoundingClientRect().height);
        tbody.replaceChildren(); // remove test row

        return virtualScrollController
            .getDataWindow()
            .then ( window => {
                tableRows = window.map(item => rowTemplate(item));
                tableRows.forEach(tr => tbody.appendChild(tr))
            });
    };

    const scheduler = ForgetfulScheduler();

    /**
     * Update the values that are to be displayed and move the views to their translation target on the fairway.
     * @param { Number } scrollTop - the position in pixels of the scrollable area that is currently displayed at the top of the scrollable frame
     */
    const updateTable = (scrollTop) => {
        virtualScrollController.setCurrentFirstVirtualItem(scrollTop);

        scheduler.add( done => {
            tbody.classList.add("loading");
            virtualScrollController
                .getDataWindow()
                .then( window => {
                    let i = 0;
                    tableRows.forEach( tr => {
                        rowFill(tr.children, window[i]);
                        i++;
                    });
                    tbody.classList.remove("loading");
                    done();
                });
        });

        shiftNodes(tbody);
        thead.style.transform = `translateY(${scrollTop}px)`; // fix the header at the top of the visible fairway

    };

    let timeout = undefined;
    const deferred = holdMs => callback => args => {          // consider moving this into Kolibri core
        if (timeout !== undefined) {
            clearTimeout(timeout);
        }
        timeout = setTimeout( _time => callback(args), holdMs);
    };

    renderTable().then(() => {
       updateTable(virtualScrollController.getListScrollTop());
       // virtualScrollController.onListScrollTopChanged(deferred(40)(updateTable)); // uncomment to try variant
       virtualScrollController.onListScrollTopChanged(updateTable);

       //add event listener to container scroll and update table content when triggered
       scrollFrame.addEventListener('scroll', _ => virtualScrollController.setListScrollTop(scrollFrame.scrollTop));
    });

};

/**
 * View for the row counter
 * @param {VirtualScrollControllerType} virtualScrollController
 * @returns {Array<HTMLSpanElement>} the created and bound span that displays the row count
 */
const RowCounterView = (virtualScrollController) => {
    /** @type {HTMLSpanElement} */
    const rowCount = document.createElement('SPAN');
    const format = new Intl.NumberFormat('de-CH').format;
    const changeContainer = () => {
        rowCount.textContent = `
            ${format(virtualScrollController.getDataWindowStartIndex())} - 
            ${format(virtualScrollController.getDataWindowEndIndex())} / 
            ${format(virtualScrollController.getDataRowCount())}`;
    };
    changeContainer();
    virtualScrollController.onListScrollTopChanged(changeContainer);
    return [rowCount];
};

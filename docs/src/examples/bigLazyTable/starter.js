import {VirtualScrollController, VirtualScrollView, RowCounterView} from './virtual-scrolling.js';
import {dom} from '../../kolibri/util/dom.js'

/**
 * initialize virtual scrolling
 * @param {*} data for the list
 * @param {HTMLElement} container where the list gets rendered
 */
const initVirtualScrolling = (data, container) => {
    
    const headTemplate = () => {
        // without TABLE, the TR does not get created.
        const [table] = dom (`                
            <TABLE>
                <THEAD>
                    <TR>
                        <TH>Nr.</TH>
                        <TH>Name</TH>
                    </TR>       
                </THEAD>
             </TABLE>
        `);
        return /** @type { HTMLTableRowElement } */ table.querySelector("tr");
    };
    
    const rowTemplate = item => {
        // without TABLE, the TR does not get created.
        const [table] = dom(`
            <TABLE>
                <TR>
                    <TD>${item ? item.id :   "n/a" }</TD>
                    <TD>${item ? item.title: "n/a" }</TD>
                </TR>
            </TABLE>
        `);
        return /** @type { HTMLTableRowElement } */ table.querySelector("tr");
    };

    const rowFill = ([idTd, titleTd], item) => {
        idTd   .textContent = item?.id;
        titleTd.textContent = item?.title;
    };
    
    //Init Virtual Scroll
    const virtualScrollController = VirtualScrollController(data);
    VirtualScrollView(virtualScrollController, container, headTemplate, rowTemplate, rowFill);
    container.append(...RowCounterView(virtualScrollController));
};

const data = length => {
    const getWindow= (beginIndex, size) =>
        Array.from( {length: beginIndex + size > length ? length - beginIndex : size }, // like "slice"
                    (_,idx) => ({id:beginIndex + idx, title:"foo"}));
    return {length, getWindow}
};

const tableContainer = document.getElementById('tableContainer');
// initVirtualScrolling(data(50), tableContainer); // max 1_864_134 in chrome and safari, FF even less
initVirtualScrolling(data(1_000_00), tableContainer);
// initVirtualScrolling(data(100_000_000), tableContainer);



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
                    <TD>${item.id}</TD>
                    <TD>${item.title}</TD>
                </TR>
            </TABLE>
        `);
        return /** @type { HTMLTableRowElement } */ table.querySelector("tr");
    };
    
    
    //Init Virtual Scroll
    const virtualScrollController = VirtualScrollController(container.clientHeight, 18, data);
    container.append(...VirtualScrollView(virtualScrollController, headTemplate, rowTemplate));
    container.append(...RowCounterView(virtualScrollController));
};

const data = length => {
    const getWindow= (beginIndex, size) =>
        Array.from( {length: beginIndex + size > length ? length - beginIndex : size }, // like "slice"
                    (_,idx) => ({id:beginIndex + idx, title:"foo"}));
    return {length, getWindow}
};

const listcontainer = document.getElementById('listContainer');
initVirtualScrolling(data(100), listcontainer); // max 1_864_134 in chrome and safari, FF even less



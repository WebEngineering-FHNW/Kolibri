import {RowCounterView, VirtualScrollController, VirtualScrollView} from './virtual-scrolling.js';
import {dom}                                                        from '../../kolibri/util/dom.js';

export { start };

/**
 * initialize virtual scrolling
 * @param { DataService } dataService - for the list
 * @param { HTMLElement } container   - where the list gets rendered
 */
const initVirtualScrolling = (dataService, container) => {
    
    const headTemplate = () => {
        // without TABLE, the TR does not get created.
        const [table] = dom (`                
            <TABLE>
                <THEAD>
                    <TR>
                        <TH>Nr.</TH>
                        <TH>Name</TH>
                        <TH>Color</TH>
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
                    <TD><div style="height:1em;width:5em;"></div></TD>
                </TR>
            </TABLE>
        `);
        return /** @type { HTMLTableRowElement } */ table.querySelector("tr");
    };

    const rowFill = ([idTd, titleTd, colorTd], item) => {
        idTd   .textContent = item?.id != null ? new Intl.NumberFormat('de-CH').format(item.id) : "";
        titleTd.textContent = item?.title;
        colorTd.firstElementChild.style['background-color'] = item ? item.color: 'black';
    };
    
    //Init Virtual Scroll
    const virtualScrollController = VirtualScrollController(dataService);
    VirtualScrollView(virtualScrollController, container, headTemplate, rowTemplate, rowFill);
    container.append(...RowCounterView(virtualScrollController));
};

const data = length => {
    const names = "Dierk Fabian Dieter Gerrit Andres".split(" ");
    const getWindow= (beginIndex, size) =>
        Array.from( {length: beginIndex + size > length ? length - beginIndex : size }, // like "slice"
                    (_,idx) => ({
                        id:beginIndex + idx,
                        title: names[(beginIndex + idx) % names.length],
                        color: `hsl( ${(beginIndex + idx)}deg, ${100 * (beginIndex + idx) / length }%, 50%)`
                    }));
    return {length, getWindow}
};

/**
 * @constructor
 * @param length
 * @return { DataService }
 */
const EagerDataService = length => {
    const rawData   = data(length);
    const getWindow = (beginIndex, size) =>
        new Promise( (resolve, _reject) => resolve(rawData.getWindow(beginIndex, size)) );
    return {length, getWindow}
};

/**
 * @constructor
 * @param length
 * @return { DataService }
 */
const LazyDataService = length => {
    const rawData   = data(length);
    const getWindow = (beginIndex, size) =>
        new Promise( (resolve, _reject) =>
             setTimeout( () => resolve(rawData.getWindow(beginIndex, size)), 100) );
    return {length, getWindow}
};

// uncomment below to try various combinations
const serviceCtor = LazyDataService;
// const serviceCtor = EagerDataService;
// const dataService = serviceCtor(50);
const dataService = serviceCtor(1_000_000);
// const dataService = serviceCtor(2_000_000); // max real size: 1_864_134 in chrome and safari, FF even less
// const dataService = serviceCtor(10_000_000);

const start = tableContainer => initVirtualScrolling(dataService, tableContainer);

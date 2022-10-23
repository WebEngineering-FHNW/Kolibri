import {VirtualScrollController, VirtualScrollView, RowCounterView} from './virtual-scrolling.js';

/**
 * initialize virtual scrolling
 * @param {*} data for the list
 * @param {*} container where the list gets rendered
 */
const initVirtualScrolling = (data, container) => {
    //row template
    const rowTemplate             = (item) => {
        const li         = document.createElement('LI');
        const text       = document.createElement('SPAN');
        text.textContent = `${item.id}. ${item.title}`;
        li.appendChild(text);
        return li;
    };
    //Init Virtual Scroll
    const virtualScrollController = VirtualScrollController(container.clientHeight, 18, data);
    VirtualScrollView(container, virtualScrollController, rowTemplate);
    RowCounterView(virtualScrollController, container);
};

const data = length => {
    const getWindow= (beginIndex, size) =>
        Array.from( {length: beginIndex + size > length ? length - beginIndex : size }, // like "slice"
                    (_,idx) => ({id:beginIndex + idx, title:"foo"}));
    return {length, getWindow}
};

const listcontainer = document.getElementById('listContainer');
initVirtualScrolling(data(100_000_000), listcontainer); // max 1_864_134 in chrome and safari, FF even less




import { TestSuite, asyncTest }      from "../../kolibri/util/test.js"
import { VirtualScrollController }   from "./virtual-scrolling.js"

const virtualScrolling = TestSuite("example/blt/virtualScrolling");

virtualScrolling.add("dimensions", assert => {
    const data = {
        length: 10,
        getWindow: (start, size) => Promise.resolve([0,1,2,3,4,5,6,7,8,9].slice(start,start+size+1))
    };
    const controller = VirtualScrollController(data);
    controller.setContainerHeightPx(100);
    controller.setHeaderRowHeightPx(50);
    controller.setRowHeightPx(20);

    // initial scrollTop is 0
    assert.is(controller.getListScrollTop(),        0); // todo: remove "list" from the API
    assert.is(controller.getDataRowCount(),        10);
    assert.is(controller.getVirtualHeightPx(),    250); // header=50 + 10 rows with 20 px
    assert.is(controller.getDataWindowStartIndex(), 0);
    assert.is(controller.getDataWindowEndIndex(),   3); // (100-50) / 20 = 2.5, makes 3 since we cannot fetch half an index
    assert.is(controller.getScrollOffsetYPx(),     50); // it's relative to the TRs original position, which is already below the header


});

virtualScrolling.run();

export {dom, fireEvent, fireChangeEvent}

const dom = innerString => {
    const holder = document.createElement("DIV");
    holder.innerHTML = innerString;
    return holder.children;
};

const fireEvent = (element, eventTypeString) => {
    const event = new Event(eventTypeString);
    element.dispatchEvent(event);
}

const fireChangeEvent = element => fireEvent(element, "change");

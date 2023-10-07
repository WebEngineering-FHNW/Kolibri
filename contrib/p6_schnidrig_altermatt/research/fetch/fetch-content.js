// async generator functions do not have arrow functions!
// * --> generator function indicator
// async as arrow function: const foo = async () => {
async function* makeTextFileLineIterator(filePath) {
    const utf8Decoder = new TextDecoder('utf-8');
    const response = await fetch(filePath); //get file content
    const reader = response.body.getReader();
    let { value: chunk, done: readerDone } = await reader.read();
    chunk = chunk ? utf8Decoder.decode(chunk) : '';

    const re = /\n|\r|\r\n/gm;
    let startIndex = 0;
    let result;

    while (true) {
        const result = re.exec(chunk);
        if (!result) {
            if (readerDone) break;
            const remainder = chunk.substr(startIndex);
            ({ value: chunk, done: readerDone } = await reader.read());
            chunk = remainder + (chunk ? utf8Decoder.decode(chunk) : '');
            startIndex = re.lastIndex = 0;
            continue;
        }
        yield chunk.substring(startIndex, result.index);
        startIndex = re.lastIndex;
    }

    if (startIndex < chunk.length) {
        // Last line didn't end in a newline char
        yield chunk.substr(startIndex);
    }
}

async function run() {
    let content = '';
    for await (const line of makeTextFileLineIterator('./content.html')) {
        content += line;
    }
    document.getElementsByTagName('body')[0].innerHTML = content;
}

run();
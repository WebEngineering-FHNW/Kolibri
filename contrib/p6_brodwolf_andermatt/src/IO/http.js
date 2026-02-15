export {HttpGet, HttpGetSync}

/**
 * HttpGet function can be used to request asynchronous data from a web server.
 * The request being automatically terminated after 30 seconds.
 *
 * @param  {string} url
 * @return {function(callback:function): void}
 * @example
 * HttpGet(jokeUrl)
 * (response => getDomElement("jokeText").textContent = JSON.parse(response).value)
 */
const HttpGet = url => callback => {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = () =>
        (xmlHttp.readyState > 1 && xmlHttp.readyState < 4)
            ? (xmlHttp.status < 200 || xmlHttp.status >= 300)                            ? xmlHttp.abort()                : () => console.log("not readystate: " + xmlHttp.readyState)
            : (xmlHttp.readyState === 4 && xmlHttp.status >= 200 && xmlHttp.status <300) ? callback(xmlHttp.responseText) : () => console.error("error fetch data")

    xmlHttp.open("GET", url, true);
    xmlHttp.timeout = 30 * 1000;                     //30 seconds
    xmlHttp.ontimeout = () => console.error("timeout after 30 seconds");
    xmlHttp.send();
}

/**
 * HttpGet function can be used to request synchronous data from a web server.
 *
 * @param  {string} url
 * @return {void}
 * @example
 * Box( HttpGet(jokeUrl) )
 *  (mapf)( JSON.parse )
 *  (fold)( x => getDomElement("joke").textContent = x.value) );
 */
const HttpGetSync = url => {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false ); // false for synchronous request
    xmlHttp.send( );
    return xmlHttp.responseText;
}
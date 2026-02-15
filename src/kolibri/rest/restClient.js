export { client }

/**
 * Representing the client of an HTTP request.
 * @param { !String } url - the url to fetch as a string. Mandatory.
 * @param { "GET"|"PUT"|"POST"|"DELETE"|"HEAD"|"OPTION" } method - HTTP request method, default: "GET"
 * @param { ?Object} data - payload data for PUT or POST requests, will be converted to JSON
 * @return { Promise<JSON> } a promise that is either
 *          rejected with an error code because the fetch failed or
 *          resolved with the JSON payload being parsed.
 * @example
   client(URL)
   .then( data => {
       console.log(data.firstname); // work with data
   })
   .catch( err => console.error(err));
 */
const client = (url, method = 'GET', data = null) => {
    const request = {
        method:      method,             // *GET, POST, PUT, DELETE, etc.
        mode:        'same-origin',      // no-cors, *cors, same-origin
        cache:       'no-cache',         // no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin',      // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json', // 'application/x-www-form-urlencoded'
        },
        redirect:    'follow',             // manual, *follow, error
        referrer:    'no-referrer',        // no-referrer, *client
    };
    if (null != data) {
        request.body = JSON.stringify(data)
    }
    return fetch(url, request)
        .then(resp => {                             // fetch API cares for the general error handling
            if (Number(resp.status) === 204) {
                console.log("got special", 204);    // special: Grails returns this on successful DELETE
                return Promise.resolve("ok");
            }
            if (resp.ok) {
                return resp.json()
            }
            if (Number(resp.status) < 400) {
                console.log("status", resp.status);
                return resp.text();
            }
            return Promise.reject(resp.status);
        })
};

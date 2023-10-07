(function (document, window) {
    document.addEventListener("DOMContentLoaded", function (event) {

        function forEach(array, callback, scope) {
            //REF: http://toddmotto.com/ditch-the-array-foreach-call-nodelist-hack/
            for (let i = 0; i < array.length; i++) {
                callback.call(scope, i, array[i]); // passes back stuff we need
            }
        };

        function loadGist(el, i, gistId) {
            //REF: http://stackoverflow.com/a/16178339
            const callbackName = "gist_callback" + i; // Create individual callbacks for each gist
            window[callbackName] = function (gistData) {
                delete window[callbackName];
                let html = '';
                html += gistData.div;
                el.innerHTML = html;
            };
            const script = document.createElement("script");
            script.setAttribute("src", "https://gist.github.com/" + gistId + ".json?callback=" + callbackName);
            document.body.appendChild(script);
        }

        // Haven't figured out the Callback function for Markdown
        setTimeout(function () {
            const gists = document.querySelectorAll('.gistEmbed');

            forEach(gists, function (i, element) {
                console.log(element);

                loadGist(element, i, element.dataset.gistId)
            });

        }, 300); //Might need to increas this time if it takes time to load
    });

})(document, window);


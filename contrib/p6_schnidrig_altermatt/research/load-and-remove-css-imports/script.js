const styleA = document.createElement('link');
styleA.setAttribute('rel', 'stylesheet');
styleA.setAttribute('href', 'style-a.css');
styleA.setAttribute('id', 'style-a');

const styleB = document.createElement('link');
styleB.setAttribute('rel', 'stylesheet');
styleB.setAttribute('href', 'style-b.css');
styleB.setAttribute('id', 'style-b');

const toggleStyle = () => {
    if(document.getElementById('style-a') != null) {
        document.getElementById('style-a').remove();
        document.getElementsByTagName("head")[0].append(styleB);
    } else {
        document.getElementById('style-b').remove();
        document.getElementsByTagName("head")[0].append(styleA);
    }
};

const init = () => {
  document.getElementsByTagName("head")[0].append(styleA);
};

init();
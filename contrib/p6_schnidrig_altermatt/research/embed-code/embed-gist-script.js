document.getElementById('button').onclick = () => {
    const testScript = document.createElement('script');
    testScript.src = '<script src="https://gist.github.com/CeeDiii/a442306c8bc3b183c0a5a3267cefcb7b.js"></script>';
    document.getElementsByTagName('div')[0].append(testScript);
};

fetch('https://gist.github.com/CeeDiii/a442306c8bc3b183c0a5a3267cefcb7b.js', {
}).then(res => {
    if (res.ok) {
        console.log(res);
    }
}).catch (e => console.log(e));
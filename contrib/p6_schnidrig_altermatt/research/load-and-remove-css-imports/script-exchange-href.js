let isStyleA = true;

const toggleStyle = () => {
    const test = document.getElementById('test');
    if(isStyleA) {
        test.setAttribute('href', 'style-a.css');
    } else {
        test.setAttribute('href', 'style-b.css');
    }
    isStyleA = !isStyleA;
};
const getData= async filePath =>{
    fetch(filePath,{
            headers : {
                'Content-Type': 'application/html',
                'Accept': 'application/html'
            }
        }
    )
    .then(response => response.text())
    .then(text => document.getElementsByTagName('body')[0].innerHTML = text);
};

getData('content.html');
(function () {
    var doc = document;
    var nav = doc.querySelector('.navbar');
    var ul = doc.createElement('ul');
    nav.appendChild(ul)
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/category', false);
    xhr.send();
    var navbar = JSON.parse(xhr.responseText);

    for(var i=0; i < navbar.length; i++) {
        var li = doc.createElement('li');
        li.innerHTML = navbar[i].name;
        if(navbar[i].subcat.length !== 0) {
            var subUl = doc.createElement('ul');
            for(var j=0; j<navbar[i].subcat.length; j++) {
                var subLi = doc.createElement('li');
                subLi.innerHTML = navbar[i].subcat[j].name;
                subUl.appendChild(subLi);
            }
            ul.appendChild(subUl);
        }
        ul.appendChild(li)
    }
})();
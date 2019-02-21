var htmlElements = ['p', 'th', 'tr', 'i', 'button', 'td', 'span', 'a', 'b', 'h1', 'h2', 'h3', 'h4',
    'div', 'em', 'cite', 'li', 'code', 'yt-formatted-string', 'abbr', 'acronym', 'textarea', 'fieldset',
    'legend', 'caption', 'title'];

var actual_JSON;
var size;
var power;
var imageSelector;
var textSelector;

var imageLinks = [
    'https://i.imgur.com/xkaUV3v.png',
    'https://i.imgur.com/Lyn9tHV.png',
    'https://i.imgur.com/40gxYJG.png',
    'https://i.imgur.com/rA5gsKc.png',
    'https://i.imgur.com/GL5W1bb.png',
    'https://i.imgur.com/l2rm3wh.png',
    'https://i.imgur.com/941qR8c.png',
    'https://i.imgur.com/UNTdgYU.png',
    'https://i.imgur.com/KZLQACH.png'
];

// Fill in size and transformation variables and execute transformations for the same time
init(function() {
    initImageSel(function() {
        if(power){
            checkText();
            checkImages();
        }
    });
});



MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

// Create a new MutationObserver object that will call its function on DOM modifications
var observer = new MutationObserver(function(mutations, observer) {
    if(power){
        checkImages();
        checkText();
    }
});

// define what element should be observed by the observer
// and what types of mutations trigger the callback
observer.observe(document.body, {
  subtree: true,
  childList: true,
  attributes: true
});



// searches for all images without the owo image as their src
function checkImages(){
    var images = document.querySelectorAll(imageSelector);

    if(images.length>0)
        changeSrc(images);
    
}

// selects html text elements without the owo class to apply the text transformations to them
function checkText(){
    var hello2 = document.querySelectorAll(textSelector);

    if(hello2.length>0)
        reText(hello2);
}

// gets the locally stored number of transformations
function init(callback) {
    chrome.storage.local.get("owaitData", function(st){
        actual_JSON = st.owaitData;
        console.log('Entered');
        chrome.storage.local.get("size", function(st2){
            size = st2.size;
            chrome.storage.local.get("power", function(st3){
                power = st3.power == "on";
                callback();
            });
        });
    });
}

// create selector string to select all images without an src that matches any of the given links
function initImageSel(callback){
    imageSelector = "img";
    for(var i=0;i<imageLinks.length;i++){
        imageSelector = imageSelector+":not([src=\'"+imageLinks[i]+"\'])";
    }
    textSelector = "";
    for(var i=0;i<htmlElements.length;i++){
        textSelector = textSelector+htmlElements[i]+":not(.owo)";
        if(i!=htmlElements.length-1)
            textSelector += ', ';
    }
    callback();
}

// changes the src from the array of images recieved to the owo image
function changeSrc(images){
    for (var i = 0; i < images.length; i++){
        var index = Math.floor((Math.random() * imageLinks.length));
        var image = images[i];

        image.src = imageLinks[index];
    }
}

// applies the text transformations to the array of elements
function reText(elements){
    console.log("retexting "+elements.length);
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        element.classList.add("owo");

        for (var j = 0; j < element.childNodes.length; j++) {
            var node = element.childNodes[j];

            if (node.nodeType === 3) {
                var text = node.nodeValue;
                var replacedText = text;

                for (var z = 0; z<size;z++ ) {
                    if(actual_JSON["Selector"+z].selected)
                        replacedText = replacedText.replace(new RegExp(actual_JSON["Selector"+z].original,
                         'gi'), actual_JSON["Selector"+z].converted);
                }


                if (replacedText !== text) {
                    element.replaceChild(document.createTextNode(replacedText), node);
                }
            }
        }
    }
}


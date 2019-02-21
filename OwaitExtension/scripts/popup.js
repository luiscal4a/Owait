var counter = 0;
var actual_JSON;
var active;

// this regex is needed to apply transformations to special javascript characters correctly
const re1 = /([\\\.\[\^\$\|\?\*\+\(\)])/gi;


init(function() {
    keyAmount(actual_JSON, function() {
        createFront();
    });
});

// gets transformation JSON and whether the extension is active or not from locaLsTORAGE
function init(callback) {
    chrome.storage.local.get("owaitData", function(st){
        actual_JSON = st.owaitData;
        chrome.storage.local.get("power", function(st2){
            active = st2.power;
            callback();
        });
    });
}

// creates the switches from the existing JSON and sets the display of the offButton
function createFront(){
   for(var i = 0; i < counter; i++){
        createChild(i);
    }
    activeColor();
}

// create switch to turn on/off and delete a string transformation
function createChild(num){
    var d = document;
    var container = document.getElementById("trContainer");
    var di = d.createElement('div');
    di.classList.add("custom-control");
    di.classList.add("custom-switch");
    di.id = "Container"+num;

    var inp = d.createElement('input');
    inp.classList.add("custom-control-input");
    inp.classList.add("myswitches");
    inp.type = 'checkbox';
    inp.id = "Selector"+num;/*options[i].text;*/
    inp.checked = actual_JSON["Selector"+num].selected;/*options[i].selected;*/

    var la = d.createElement('label');
    la.classList.add("custom-control-label");
    la.setAttribute("for", "Selector"+num);
    la.innerHTML = actual_JSON["Selector"+num].original + " => " + actual_JSON["Selector"+num].converted;

    var bu = d.createElement('button');
    bu.classList.add("close");
    bu.type = 'button';
    bu["aria-label"] = 'Close';

    var sp = d.createElement('span');
    sp["aria-hidden"] = "true";
    sp.innerHTML = "\&times;";

    bu.appendChild(sp);
    bu.addEventListener("click", function() {
        remove(num);
    });

    di.appendChild(inp);
    di.appendChild(la);
    di.appendChild(bu);

    container.appendChild(di);
}

// get the size of the elements in the transformation JSON
function keyAmount(obj, callback) 
{ 
    counter=Object.keys(obj).length;
    chrome.storage.local.set({size: counter}, function() {
        console.log(counter);
        callback();
    });
}

// show the dialog to add a transformation
function showDialog(mode){
    var dialog = document.querySelector("dialog");
    if(mode)dialog.showModal();
    else dialog.close();
}

// removes the transformation from the list and the JSON
function remove(num){
    var i;
    for(i=num;i<counter-1;i++){
        actual_JSON["Selector"+i]=actual_JSON["Selector"+(i+1)];
    }
    delete actual_JSON["Selector"+i];
    keyAmount(actual_JSON, function() {
        var element = document.getElementById(["Container"+num]);
        element.parentNode.removeChild(element);
        applyChanges();
    });
}

// change the state of the offButton
function changeActive(){
    if(active == "on"){
        active = "off";
        activeColor();
    }
    else{
        active = "on";
        activeColor();
    }
    chrome.storage.local.set({power: active}, function() {
        console.log("Power changed");
    });
}

// changes the class of offButton to showcase a different css style
function activeColor(){
    var button = document.getElementById("offButton");
    if(active == "on"){
        button.classList.remove("btnOff");
        button.classList.add("btnOn");
    }
    else{
        button.classList.remove("btnOn");
        button.classList.add("btnOff");
    }
}

document.getElementById("Select").addEventListener("click", function() {
    var element;
    for(var i=0;i<counter;i++){
        actual_JSON["Selector"+i].select=true;
        element = document.getElementById(["Selector"+i]);
        element.checked = true;
    }
});

document.getElementById("unSelect").addEventListener("click", function() {
    var element;
    for(var i=0;i<counter;i++){
        actual_JSON["Selector"+i].select=false;
        element = document.getElementById(["Selector"+i]);
        element.checked = false;
    }
});

document.getElementById("Close").addEventListener("click", function() {
    showDialog(0);
});

document.getElementById("offButton").addEventListener("click", function() {
    changeActive();
    chrome.tabs.reload();
});


document.getElementById("Add").addEventListener("click", function() {
    var original = document.getElementById("original").value;
    var converted = document.getElementById("converted").value;

    original = original.replace(re1, '\\$1');

    actual_JSON["Selector"+counter]= {
        "original": original,
        "converted": converted,
        "selected": true
    }
    showDialog(0);
    keyAmount(actual_JSON, function() {
        createChild(counter-1);
        applyChanges();
    });
});

document.getElementById("addButton").addEventListener("click", function() {
    showDialog(1);
});


document.getElementById("applyButton").addEventListener("click", function(){
    var switches = document.getElementsByClassName("myswitches")
    var arr = [];
    for(var i=0;i<counter;i++){
        actual_JSON["Selector"+i].selected=switches[i].checked;
    }
    applyChanges();
});

// save the data of the transformation JSON in localStorage
function applyChanges(update){
    chrome.storage.local.set({owaitData: actual_JSON}, function() {
        chrome.storage.local.get("owaitData", function(st){
            console.log(st.owaitData);
            chrome.tabs.reload();
        });
    });
}


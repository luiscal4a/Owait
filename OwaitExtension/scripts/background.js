'use strict';

var newProfile;

// set up default transformation data if the user is new and turn extension on on install
chrome.runtime.onInstalled.addListener(function() {
	init(function(response) {
        if(newProfile){
            console.log("New user OwO");
            chrome.storage.local.set({owaitData: response}, function() {
                chrome.storage.local.get("owaitData", function(st){
                    console.log(st.owaitData);
                });
            });
        }

        chrome.storage.local.get("owaitData", function(st){
            keyAmount(st.owaitData);
        });
		
        chrome.storage.local.set({power: "on"}, function() {
            chrome.storage.local.get("power", function(st){
                console.log(st.power);
            });
        });
	});

    alert("Thanks for installing Owait, open the extension window to edit preferences OwO");
});

// load the JSON with default transformations
function loadJSON(callback) {   
    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', 'data.json', true);
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 }

 function keyAmount(obj) 
{ 
    var counter=Object.keys(obj).length;
    chrome.storage.local.set({size: counter}, function() {
        console.log(counter);
    });
}

// load the original JSON data and check if the user is new
function init(callback) {
 loadJSON(function(response) {
    chrome.storage.local.get("owaitData", function(st){
        newProfile = st.owaitData == undefined;
        callback(JSON.parse(response));
    });
 });
}

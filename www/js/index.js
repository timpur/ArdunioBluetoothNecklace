/// <reference path="ABN-Main.js" />
/// <reference path="ABN-Maps.js" />
/// <reference path="angular.min.js" />
/// <reference path="bootstrap.min.js" />
/// <reference path="gmaps.js" />
/// <reference path="index.js" />
/// <reference path="jquery.min.js" />
var isMobile = false;
var offline = false;
var host = "http://arduinonecklace.comlu.com/";
var app = {
    // Application Constructor
    initialize: function () {
        ABN.Initialize();
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
            isMobile = true;
            bluetooth.enable = true;
            document.addEventListener("deviceready", this.onDeviceReady, false);
        } else {
            $(document).ready(this.onDeviceReady);
            //this.onDeviceReady(); //this is the browser
        }        
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        ABN.Load();
    }    
};

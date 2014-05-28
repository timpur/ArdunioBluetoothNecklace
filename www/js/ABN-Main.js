/// <reference path="ABN-Main.js" />
/// <reference path="ABN-Maps.js" />
/// <reference path="angular.min.js" />
/// <reference path="bootstrap.min.js" />
/// <reference path="gmaps.js" />
/// <reference path="index.js" />
/// <reference path="jquery.min.js" />

var ABN = {
    Initialize: function () {

    },
    angular: function () {

    }

};
var Location = {    
    watchID: -1,
    first:true,
    setWatch: function () {
        if (this.first) {
            map.map.setCenter(position.coords.latitude, position.coords.longitude);
            map.map.setZoom(15);
            this.first = false;
        }
        var onSuccess = function (position) {            
            map.setMyLocation(position.coords.latitude, position.coords.longitude, position.coords.accuracy);
        };        
        var onError = function(error) {
            alert('code: ' + error.code + '\n' +
                  'message: ' + error.message + '\n');
        }
        this.watchID = navigator.geolocation.watchPosition(onSuccess, onError, { enableHighAccuracy: true });
    }
};

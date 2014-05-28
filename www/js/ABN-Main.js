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
    intervalID: -1,
    setint: function () {
        this.get(true);
        this.intervalID = setInterval(function () {
            Location.get();
        }, 1000);
    },
    get: function (first) {
        var onSuccess = function (position) {
            if (first) {
                map.map.setCenter(position.coords.latitude, position.coords.longitude);
                map.map.setZoom(15);
            }
            map.setMyLocation(position.coords.latitude, position.coords.longitude, position.coords.accuracy);
        };        
        var onError = function(error) {
            alert('code: ' + error.code + '\n' +
                  'message: ' + error.message + '\n');
        }
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
};

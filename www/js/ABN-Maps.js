/// <reference path="angular.min.js" />
/// <reference path="bootstrap.min.js" />
/// <reference path="gmaps.js" />
/// <reference path="index.js" />
/// <reference path="jquery.min.js" />
/// <reference path="ABN-Maps.js" />
/// <reference path="ABN-Main.js" />

var map = {
    map: null,
    myLocation: null,
    myAccuracy: null,
    DetectionRadius: null,
    DetectionRadiusSize: null,
    currentLocation: { lat: -33.8678500, lng: 151.2073200, acc: 100 },
    Initialize: function () {

    },
    Load: function () {
        this.addMap();      
    },
    addMap: function () {
        this.map = new GMaps({
            div: '#testmap',
            lat: -33.8678500,
            lng: 151.2073200,
            zoom: 12
        });
    },
    addMyLoaction: function (lat, lng, acc) {
        this.myLocation = this.map.addMarker({
            lat: lat,
            lng: lng,
            title: "Me",
            animation: google.maps.Animation.DROP,
            icon: {
                url: 'img/dot.png',
                size: new google.maps.Size(16, 16),
                scaledSize: new google.maps.Size(16, 16),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(8, 8)
            },
            infoWindow: {
                content: '<p>Accuracy:<b>' + acc + '</b></p>'
            }

        });
        this.myAccuracy = this.map.drawCircle({
            lat: lat,
            lng: lng,
            radius: acc,
            strokeColor: '#4D4DDB',
            strokeOpacity: 1,
            strokeWeight: 3,
            fillColor: '#4D4DDB',
            fillOpacity: 0.4
        });
    },
    setMyLocation: function (lat, lng, acc) {
        if (this.myLocation == null && this.myAccuracy == null) {
            this.addMyLoaction(lat, lng, acc);
        } else {
            this.myLocation.setPosition({
                lat: lat,
                lng: lng
            });
            this.myLocation.infoWindow.setOptions({
                content: '<p>Accuracy:<b>' + acc + '</b></p>'
            });
            this.myAccuracy.setCenter({
                lat: lat,
                lng: lng
            })
            this.myAccuracy.setOptions({
                radius: acc
            });
        }
        this.setDetectionRadius(lat, lng)
        this.currentLocation.lat = lat;
        this.currentLocation.lng = lng;
        this.currentLocation.acc = acc;
    },
    addDetectionRadius: function (lat, lng) {
        this.DetectionRadius = this.map.drawCircle({
            lat: lat,
            lng: lng,
            radius: this.DetectionRadiusSize,
            fillOpacity: 0.1
        });
    },
    setDetectionRadius: function (lat, lng) {
        if (this.DetectionRadius == null) {
            this.addDetectionRadius(lat, lng);
        } else {
            this.DetectionRadius.setCenter({
                lat: lat,
                lng: lng
            })
        }
    }
};
map.setDetectionRadius.size = function (rad) {
    map.DetectionRadiusSize = rad;
    if (!(map.DetectionRadius == null))
        map.DetectionRadius.setOptions({
            radius: rad
        });
};











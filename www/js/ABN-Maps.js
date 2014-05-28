﻿/// <reference path="angular.min.js" />
/// <reference path="bootstrap.min.js" />
/// <reference path="gmaps.js" />
/// <reference path="index.js" />
/// <reference path="jquery.min.js" />
/// <reference path="ABN-Maps.js" />

var map = {
    map: null,
    myLocation: null,
    myAccuracy: null,
    DetectionRadius: null,
    DetectionRadiusSize:null,
    Initialize: function () {
        $("#testmap").width(400).height(400);
    },
    Load: function () {
        this.addMap();
        this.Locate(true);
        this.setDetectionRadius.size(1000);
        
        setInterval(function () { map.Locate(false); }, 1000);
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
            title: "Me -" + acc + "m",
            icon: {
                url: 'img/dot.png',
                size: new google.maps.Size(16, 16),
                scaledSize: new google.maps.Size(16, 16),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(8, 8)
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
            this.myLocation.setOptions({
                lat: lat,
                lng: lng,
                title: "Me " + acc + "m"
            });
            this.myAccuracy.setOptions({
                lat: lat,
                lng: lng,
                radius: acc
            });
        }
        this.setDetectionRadius(lat, lng)
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
            this.DetectionRadius.setOptions({
                lat: lat,
                lng: lng
            })
        }
    },
    Locate: function (first) {
        GMaps.geolocate({
            success: function (position) {
                if (first) {
                    map.map.setCenter(position.coords.latitude, position.coords.longitude);
                    map.map.setZoom(15);
                }
                map.setMyLocation(position.coords.latitude, position.coords.longitude, position.coords.accuracy);
            }
        });
    }
};
map.setDetectionRadius.size = function (rad) {
    map.DetectionRadiusSize = rad;
    if (!map.DetectionRadius == null)
        this.DetectionRadius.setOptions({
            radius: rad
        });
};











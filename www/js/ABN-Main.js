/// <reference path="ABN-Main.js" />
/// <reference path="ABN-Maps.js" />
/// <reference path="angular.min.js" />
/// <reference path="bootstrap.min.js" />
/// <reference path="gmaps.js" />
/// <reference path="index.js" />
/// <reference path="jquery.min.js" />

var ABN = {
    Initialize: function () {
        map.Initialize();
    },
    Load: function () {
        btn();
        map.Load();
    },
    angular: function () {

    }

};
var Location = {
    watchID: -1,
    first: true,
    setWatch: function () {
        if (this.first) {
            map.map.setCenter(position.coords.latitude, position.coords.longitude);
            map.map.setZoom(15);
            this.first = false;
        }
        var onSuccess = function (position) {
            map.setMyLocation(position.coords.latitude, position.coords.longitude, position.coords.accuracy);
        };
        var onError = function (error) {
            alert('code: ' + error.code + '\n' +
                  'message: ' + error.message + '\n');
        }
        this.watchID = navigator.geolocation.watchPosition(onSuccess, onError, { enableHighAccuracy: true });
    }
};


function btn() {
    $(".nav.navbar-nav a[id*=nav-]").on('click', function (e) {
        $(this).tab('show');
        if ($(window).width() <= 768) {
            $(".navbar-toggle").click();
        }
    });
    $(".navbar-brand").on('click', function (e) {
        $(this).tab('show');
        $(".nav.navbar-nav *").each(function (index, item) {
            item = $(item)
            if (item.hasClass("active")) {
                item.removeClass("active")
            }
        });
        $("#nav-0").parent().addClass("active");
    });
    $('#nav-2').on('shown.bs.tab', function (e) {
        var width = $("#testmap").width();
        var height = $("#testmap").height();
        if (!(width > 0) && !(height > 0)) {
            $("#testmap").width("100%").height("100%");
            map.map.refresh();
            map.map.setCenter(map.currentLocation.lat, map.currentLocation.lng);
        }
    })

}

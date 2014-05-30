/// <reference path="ABN-Main.js" />
/// <reference path="ABN-Maps.js" />
/// <reference path="angular.min.js" />
/// <reference path="bootstrap.min.js" />
/// <reference path="gmaps.js" />
/// <reference path="index.js" />
/// <reference path="jquery.min.js" />
window.onerror = function (errorMsg, url, lineNumber) {
    return alert('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber);
}

var ABN = {
    Initialize: function () {
        this.angular();
        map.Initialize();       
    },
    Load: function () {
        if (!offline) {
            $('#LoginModal').modal({
                keyboard: false,
                backdrop: "static"
            })
        }
        else {
            this.signinLoad();
        }
        btn();        
    },
    app:null,
    angular: function () {
        this.app = angular.module("ABN", ["angularMoment"]); //'angularMoment'

        this.app.controller("SignInCTRL", function ($scope) {
            $scope.signin_username = {};
            $scope.signin_password = {};
            $scope.signin_rememberme = {};

            if (localStorage.getItem("rememberme") == "true") {
                $scope.signin_username.value = localStorage.getItem("username");
                $scope.signin_password.value = localStorage.getItem("password");
                $scope.signin_rememberme.checked = true;
            }
            $scope.SignIn = function () {
                var username = $scope.signin_username.value,
                    password = $scope.signin_password.value,
                    remermberme = $scope.signin_rememberme.checked;
                if (username == undefined || username == "") {
                    $("#form_group_u").addClass("has-error");
                    return;
                }
                else {
                    $("#form_group_u").removeClass("has-error");
                }
                if (password == undefined || password == "") {
                    $("#form_group_p").addClass("has-error");
                    return;
                }
                else {
                    $("#form_group_p").removeClass("has-error");
                }
                setTimeout(function () { signIn(username, password); }, 0, [username, password]);
                if (remermberme) {
                    localStorage.setItem("username", username);
                    localStorage.setItem("password", password);
                    localStorage.setItem("rememberme", true);
                }
                else {
                    localStorage.removeItem("username");
                    localStorage.removeItem("password");
                    localStorage.setItem("rememberme", false);
                }
            };            
            if (localStorage.getItem("autosignin") == "true") {
                $scope.SignIn();
            }
            function signIn(username,password) {
                $.ajax({
                    async: false,
                    url: host + "php/auth.php",
                    type: "POST",
                    data: JSON.stringify({ username: username, password: password }),
                    datatype: "json",
                    contentType: "application/json; charset=utf-8",   //x-www-form-urlencoded
                    success: function (data) {
                        var validated = data.validated;
                        if (validated) {
                            ABN.signinLoad();
                        }
                        else if(!data) {
                            SigninMessage("Sign In Error", "The User Name or Password is Incorect");
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        
                        SigninMessage("Server Error", jqXHR.statusText);
                    }
                });
            }
            function SigninMessage(hedding, message) {
                var alertel = $('#signinerror');
                alertel.find("h4").text(hedding);
                alertel.find("p").text(message);
                alertel.addClass('in');
            };
        });
    },
    signinLoad: function () {
        map.Load();
        Location.setWatch();
        $('#LoginModal').modal('hide');
    }

};
var Location = {
    watchID: -1,
    first: true,
    setWatch: function () {        
        var onSuccess = function (position) {
            map.setMyLocation(position.coords.latitude, position.coords.longitude, position.coords.accuracy);
            if (Location.first) {
                map.map.setCenter(map.currentLocation.lat, map.currentLocation.lng);
                map.map.setZoom(15);
                Location.first = false;
            }
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
    $('#signinerror').find(".close").click(function () {
        $('#signinerror').removeClass('in');
    })
    if (localStorage.getItem("autosignin") == "true") {
        $('#AutoSignin').attr("checked", true);
    }
    $('#AutoSignin').change(function () {
        var c = this.checked;
        localStorage.setItem("autosignin", c);
    });
}

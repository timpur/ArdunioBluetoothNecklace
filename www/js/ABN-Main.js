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
    me: null,
    app: null,
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
            function signIn(username, password) {
                $.ajax({
                    async: true,
                    url: host + "php/auth.php",
                    type: "POST",
                    data: JSON.stringify({ username: username, password: password }),
                    datatype: "json",
                    contentType: "application/json; charset=utf-8",   //x-www-form-urlencoded
                    dataFilter: function (jsonString, type) {
                        jsonString = jsonString.replace("<!-- Hosting24 Analytics Code -->", "");
                        jsonString = jsonString.replace('<script type="text/javascript" src="http://stats.hosting24.com/count.php"></script>', "");
                        jsonString = jsonString.replace("<!-- End Of Analytics Code -->", "");
                        return jsonString;
                    },
                    success: function (data) {
                        var validated = data.validated;
                        if (validated) {
                            if (!(data.user.selectedfriends == ""))
                                data.user.selectedfriends = JSON.parse(data.user.selectedfriends);
                            else
                                data.user.selectedfriends = [];
                            ABN.me = data.user;
                            ABN.signinLoad();
                            ABN.getUsers();
                            $("#detection").val(ABN.me.detection);
                            ABN.me.detection = Number(ABN.me.detection);
                            map.setDetectionRadius.size(ABN.me.detection);
                        }
                        else if (!data) {
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
        this.app.controller("NecklaceStatus", function ($scope) {
            $scope.status = "Disconnected";            
            $scope.connect = function () {
                bluetooth.connect();
            };
            $scope.disconnect = function () {

            };

        });
        this.app.controller("FriendsList", function ($scope) {
            $scope.users = [];
            $scope.max = 3;
            $scope.current = 0;
            $scope.setUsers = function (data) {
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    item.checked = false;
                    item.dis = "-1";
                    for (var ii = 0; ii < ABN.me.selectedfriends.length; ii++) {
                        if (item.ID == ABN.me.selectedfriends[ii]) {
                            item.checked = true;
                            $scope.current++;
                        }
                    }
                }
                $scope.users = data;
                $scope.$apply();
                setTimeout(ABN.getUsersLoc, 1000);
                setInterval(ABN.getUsersLoc, 10000);
            };
            $scope.checked = function (id, indexi) {
                var index = $.inArray(id, ABN.me.selectedfriends);
                if (index == -1) {
                    if (ABN.me.selectedfriends.length < $scope.max) {
                        ABN.me.selectedfriends.push(id);
                        ABN.getUsersLoc();
                        $scope.current++;
                    } else {
                        $scope.users[indexi].checked = false;
                    }

                } else {
                    ABN.me.selectedfriends.splice(index, 1);
                    $scope.current--;
                }
            };
            $scope.save = function () {
                var text = JSON.stringify(ABN.me.selectedfriends);
                $.ajax({
                    async: true,
                    url: host + "php/saveSelection.php",
                    type: "POST",
                    data: JSON.stringify({ ID: ABN.me.ID, text: text }),
                    datatype: "json",
                    contentType: "application/json; charset=utf-8",   //x-www-form-urlencoded
                    dataFilter: function (jsonString, type) {
                        jsonString = jsonString.replace("<!-- Hosting24 Analytics Code -->", "");
                        jsonString = jsonString.replace('<script type="text/javascript" src="http://stats.hosting24.com/count.php"></script>', "");
                        jsonString = jsonString.replace("<!-- End Of Analytics Code -->", "");
                        return jsonString;
                    },
                    success: function (data) {

                    }
                });
            };
        });
    },
    signinLoad: function () {
        map.Load();
        Location.setWatch();
        $('#LoginModal').modal('hide');
    },
    users: [],
    getUsers: function () {
        $.ajax({
            async: true,
            url: host + "php/getUsers.php",
            type: "POST",
            data: "",
            datatype: "json",
            contentType: "application/json; charset=utf-8",   //x-www-form-urlencoded
            dataFilter: function (jsonString, type) {
                jsonString = jsonString.replace("<!-- Hosting24 Analytics Code -->", "");
                jsonString = jsonString.replace('<script type="text/javascript" src="http://stats.hosting24.com/count.php"></script>', "");
                jsonString = jsonString.replace("<!-- End Of Analytics Code -->", "");
                return jsonString;
            },
            success: function (data) {
                for (var i = 0 ; i < data.length; i++) {
                    if (data[i].ID == ABN.me.ID) {
                        data.splice(i, 1)
                        i--;
                    }
                }
                ABN.users = data;
                angular.element($('[ng-controller="FriendsList"]')).scope().setUsers(ABN.users);
            }
        });
    },
    getUsersLoc: function () {
        var f = ABN.me.selectedfriends;
        for (var i = 0; i < f.length; i++) {
            var id = f[i];
            var item = $.grep(ABN.users, function (item) {
                return item.ID == id;
            })[0];

            $.ajax({
                async: true,
                url: host + "php/getLoc.php",
                type: "POST",
                data: JSON.stringify({ ID: item.ID }),
                datatype: "json",
                contentType: "application/json; charset=utf-8",   //x-www-form-urlencoded
                dataFilter: function (jsonString, type) {
                    jsonString = jsonString.replace("<!-- Hosting24 Analytics Code -->", "");
                    jsonString = jsonString.replace('<script type="text/javascript" src="http://stats.hosting24.com/count.php"></script>', "");
                    jsonString = jsonString.replace("<!-- End Of Analytics Code -->", "");
                    return jsonString;
                },
                success: function (data) {
                    if (!data == false) {
                        item.lat = data.lat;
                        item.lng = data.lng;
                        if (!(google.maps.geometry == undefined)) {
                            var loc1 = new google.maps.LatLng(map.currentLocation.lat, map.currentLocation.lng);
                            var loc2 = new google.maps.LatLng(item.lat, item.lng);
                            var dis = Math.round(google.maps.geometry.spherical.computeDistanceBetween(loc1, loc2) * 100) / 100;
                            item.dis = dis;
                            bluetooth.sendDistance(dis, i);
                        }
                        angular.element($('[ng-controller="FriendsList"]')).scope().$apply();
                    }
                }
            });

        }
    },
    sendLoc: function (lat, lng) {
        $.ajax({
            async: true,
            url: host + "php/addLoc.php",
            type: "POST",
            data: JSON.stringify({ ID: this.me.ID, lat: lat, lng: lng }),
            datatype: "json",
            contentType: "application/json; charset=utf-8",   //x-www-form-urlencoded
            dataFilter: function (jsonString, type) {
                jsonString = jsonString.replace("<!-- Hosting24 Analytics Code -->", "");
                jsonString = jsonString.replace('<script type="text/javascript" src="http://stats.hosting24.com/count.php"></script>', "");
                jsonString = jsonString.replace("<!-- End Of Analytics Code -->", "");
                return jsonString;
            },
            success: function (data) {

            }
        });
    },
    saveDetection: function () {
        var distance = Number($("#detection").val());
        $.ajax({
            async: true,
            url: host + "php/saveDetection.php",
            type: "POST",
            data: JSON.stringify({ ID: this.me.ID, distance: distance }),
            datatype: "json",
            contentType: "application/json; charset=utf-8",   //x-www-form-urlencoded
            dataFilter: function (jsonString, type) {
                jsonString = jsonString.replace("<!-- Hosting24 Analytics Code -->", "");
                jsonString = jsonString.replace('<script type="text/javascript" src="http://stats.hosting24.com/count.php"></script>', "");
                jsonString = jsonString.replace("<!-- End Of Analytics Code -->", "");
                return jsonString;
            },
            success: function (data) {
                ABN.me.detection = distance;
                map.setDetectionRadius.size(ABN.me.detection);
            }
        });
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
            ABN.sendLoc(position.coords.latitude, position.coords.longitude);
        };
        var onError = function (error) {
            alert('code: ' + error.code + '\n' +
                  'message: ' + error.message + '\n');
        }
        this.watchID = navigator.geolocation.watchPosition(onSuccess, onError, { enableHighAccuracy: true });
    }
};
var bluetooth = {
    enable: false,
    connected: false,
    mac: "00:06:66:66:28:E7",
    connect: function () {
        var success = function () {
            bluetooth.connected = true;
            alert("Connected");
        }
        var fail = function () {
            bluetooth.connected = false;
            alert("Failed");
        }
        if (this.enable)
            bluetoothSerial.connect(this.mac, success, fail);
    },
    disconnect: function () {
        var success = function () {
            bluetooth.connected = false;
        }
        bluetoothSerial.disconnect(success);
    },
    sendDistance: function (dis, chanel) {
        if (this.enable && this.connected) {
            var val = 0;
            if (dis < ABN.me.detection && dis > map.currentLocation.acc  ) {
                val = Math.round(10000 - (((dis - map.currentLocation.acc) / ABN.me.detection) * 10000)) / 100;
            }
            else if (dis < map.currentLocation.acc) {
                val = 100;
            }            
            var data = "{" + chanel.toString() + "," + val.toString() + "};";
            var success = function () {
                alert("Sent");
            }
            var fail = function () {

            }
            bluetoothSerial.write(data, success, fail);
        }
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
            map.map.setCenter(map.currentLocation.lat, map.currentLocation.lng);
        }
        $("#testmap").width("100%").height("100%");
        map.map.refresh();
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

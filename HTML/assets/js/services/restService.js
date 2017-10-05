'use strict';

app.factory('RestService', ['$rootScope','$http', '$q','$cookies', '$httpParamSerializer', '$state', function($rootScope,$http, $q, $cookies, $httpParamSerializer, $state) {

    // var tshirt = 'http://10.58.20.225/tshirts/';
    // var users = 'http://10.58.20.225/users/';
    // var profiles = 'http://10.58.20.225/profiles/';
    // var login = 'http://10.58.20.225/api-auth/login/';
    // var loginNext = 'http://10.58.20.225/api-auth/login/?next=/';
    // var register = 'http://10.58.20.225/api-auth/register/';
    // var snippets = 'http://10.58.20.225/snippets/';
    // var socialnetwork = 'http://10.58.20.225/socialnetworks/';
    // var imageDir = 'http://10.58.20.225:8080/images/';
    // var imageDownload = 'http://10.58.20.225/api/qrcode';
    // var updateWithOutImage = 'http://10.58.20.225/api/updateprofile';

    var tshirt = 'http://10.8.25.244/tshirts/';
    var users = 'http://10.8.25.244/users/';
    var profiles = 'http://10.8.25.244/profiles/';
    var login = 'http://10.8.25.244/api-auth/login/';
    var loginNext = 'http://10.8.25.244/api-auth/login/?next=/';
    var register = 'http://10.8.25.244/api-auth/register/';
    var snippets = 'http://10.8.25.244/snippets/';
    var socialnetwork = 'http://10.8.25.244/socialnetworks/';
    var imageDir = 'http://10.8.25.244:8080/images/';
    var imageDownload = 'http://10.8.25.244/api/qrcode';
    var updateWithOutImage = 'http://10.8.25.244/api/updateprofile';

    return {
        loginNext: loginNext,

        imageDir: imageDir,

        usersDir: users,

        profileDir: profiles,

        getCookie: function (name) {
            return $cookies.get('csrftoken');
        },

        login: function (username, password) {
            $http({
                method: 'POST',
                url: login,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },                
                data: {'username': username, 'password': password, 'csrfmiddlewaretoken':$cookies.get('csrftoken')}
            }).success(function (result) {
                if (result['users'] != undefined && $cookies.get('sessionid')!= undefined) {
                    $cookies.put('username',username,{path: '/'});
                    $rootScope.$broadcast('connected',username);
                } else {
                    $rootScope.$broadcast('wrongLogin',username);
                }
            }).error(function(response){
                console.log("Entra al error");
            });
        },

        register: function (username, password, first_name, last_name, email, pin) {
            $http({
                method: 'POST',
                url: register,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {'username': username, 'password': password, 'first_name': first_name, 'last_name': last_name,
                    'email': email, 'pin': pin}
            }).success(function (data) {
                console.log(data);
                if (data['response'] == 'ok') {
                    var register = {
                        username: username,
                        password: password
                    };
                    $rootScope.$broadcast('register',register);
                } else {
                    $rootScope.$broadcast('wrongRegister');
                }
            }).error(function(response){
                console.log("Entra al error");
            });
        },

        addSnippet: function (title, body) {
            $http({
                method: 'POST',
                url: snippets,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {'title': title, 'body': body, 'csrfmiddlewaretoken':$cookies.get('csrftoken') }
            }).success(function (data) {
                $rootScope.$broadcast('addsnippets');
            }).error(function(response){
                console.log("Entra al error");
            });
        },

        addSocialNetwork: function (name, url, type) {
            $http({
                method: 'POST',
                url: socialnetwork,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {'name': name, 'url': url, 'type': type, 'csrfmiddlewaretoken':$cookies.get('csrftoken') }
            }).success(function (data) {
                $rootScope.$broadcast('addsocialnetwork');
            }).error(function(response){
                console.log("Entra al error");
            });
        },

        imageDownload: function () {
            $http({
                method: 'POST',
                url: imageDownload,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-CSRFToken': $cookies.get('csrftoken')
                },
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                }
            }).success(function (data) {
                $rootScope.$broadcast('imageDownloadSuccesfull', imageDir+data.qrfilename);
            }).error(function(response){
                console.log("Entra al error");
            });
        },

        updateProfile: function (profileurl, info, rating, score, avatar) {
            $http({
                method: 'PUT',
                url: profileurl,
                headers: {
                    'Content-Type': undefined,
                    'X-CSRFToken': $cookies.get('csrftoken')
                },
                transformRequest: function (data) {
                    if (data === undefined)
                        return data;
                    var fd = new FormData();
                    angular.forEach(data, function (value, key) {
                        if (value instanceof FileList) {
                            if (value.length == 1) {
                                fd.append(key, value[0]);
                            } else {
                                angular.forEach(value, function (file, index) {
                                    fd.append(key + '_' + index, file);
                                });
                            }
                        } else {
                            fd.append(key, value);
                        }
                    });
                    return fd;
                },
                data: {'info': info, 'rating': rating, 'score': score, 'avatar': avatar, 'csrfmiddlewaretoken':$cookies.get('csrftoken')}
            }).success(function (data) {
               $state.go('profile');
            }).error(function(response){
                console.log("Entra al error");
            });
        },

        updateProfileWithOutAvatar: function (profileurl, id, info, rating, score) {
            $http({
                method: 'PUT',
                url: updateWithOutImage,
                headers: {
                    'Content-Type': undefined,
                    'X-CSRFToken': $cookies.get('csrftoken')
                },
                transformRequest: function (data) {
                    if (data === undefined)
                        return data;
                    var fd = new FormData();
                    angular.forEach(data, function (value, key) {
                        if (value instanceof FileList) {
                            if (value.length == 1) {
                                fd.append(key, value[0]);
                            } else {
                                angular.forEach(value, function (file, index) {
                                    fd.append(key + '_' + index, file);
                                });
                            }
                        } else {
                            fd.append(key, value);
                        }
                    });
                    return fd;
                },
                data: {'id':id, 'info': info, 'rating': rating, 'score': score, 'csrfmiddlewaretoken':$cookies.get('csrftoken')}
            }).success(function (data) {
                $state.go('profile');
            }).error(function(response){
                console.log("Entra al error");
            });
        },

        deleteSocialNetwork: function (id) {
            $http({
                method: 'DELETE',
                url: socialnetwork+id+'/',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-CSRFToken': $cookies.get('csrftoken')
                },
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                }
            }).success(function (result) {
                $rootScope.$broadcast('deleteSocialNetwork');
            }).error(function(response){
                console.log("Entra al error");
            });
        },

        deleteSnippet: function (url) {
            $http({
                method: 'DELETE',
                url: url,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-CSRFToken': $cookies.get('csrftoken')
                },
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                }
            }).success(function (result) {
                $rootScope.$broadcast('deleteSnippet');
            }).error(function(response){
                console.log("Entra al error");
            });
        },

        fetchTshirt: function(code) {
            return $http.get(tshirt + "?code=" + code)
                .then(
                    function(response){
                        return response.data;
                    },
                    function(errResponse){
                        console.error('Error while fetching tshirts');
                        return $q.reject(errResponse);
                    }
                );
        },

        fetchUserByUser: function (username) {
            return $http.get(users + "?username=" + username)
                .then(
                    function(response){
                        return response.data;
                    },
                    function(errResponse){
                        console.error('Error while fetching user');
                        return $q.reject(errResponse);
                    }
                );
        },

        fetchObjectByUrl: function (url) {
            return $http.get(url)
                .then(
                    function(response){
                        return response.data;
                    },
                    function(errResponse){
                        console.error('Error while fetching object');
                        return $q.reject(errResponse);
                    }
                );
        },
    };
}]);

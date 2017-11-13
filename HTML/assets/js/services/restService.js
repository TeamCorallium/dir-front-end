'use strict';

app.factory('RestService', ['$rootScope', '$http', '$q', '$cookies', '$httpParamSerializer', '$state', function ($rootScope, $http, $q, $cookies, $httpParamSerializer, $state) {

    var tshirt = 'http://www.dir.com:8888/api/tshirts/';
    var users = 'http://www.dir.com:8888/api/users/';
    var profiles = 'http://www.dir.com:8888/api/profiles/';
    var login = 'http://www.dir.com:8888/api/api-auth/login/';
    var loginNext = 'http://www.dir.com:8888/api/api-auth/login/?next=/';
    var register = 'http://www.dir.com:8888/api/api-auth/register/';
    var snippets = 'http://www.dir.com:8888/api/snippets/';
    var socialnetwork = 'http://www.dir.com:8888/api/socialnetworks/';
    var imageDir = 'http://www.dir.com/images/';
    var imageDownload = 'http://www.dir.com:8888/api/qrcode';
    var updateWithOutImage = 'http://www.dir.com:8888/api/updateprofile';
    var messages = 'http://www.dir.com:8888/api/messages/';
    var sendMessages = 'http://www.dir.com:8888/api/send-message/';
    var updatePassword = 'http://www.dir.com:8888/api/api-auth/update/';
    var clapDir = 'http://www.dir.com:8888/api/clap-profile/';
    var linkStuff = 'http://www.dir.com:8888/api/link-stuff/';
    var stocks = 'http://www.dir.com:8888/api/stocks/';
    var deleteUser = 'http://www.dir.com:8888/api/delete-user/';
    var tracking = 'http://www.dir.com:8888/api/track/';
    var followDir = 'http://www.dir.com:8888/api/follow/';
    var followersDir = 'http://www.dir.com:8888/api/followers/';

    // var tshirt = 'http://www.dircoolstuff.com/api/tshirts/';
    // var users = 'http://www.dircoolstuff.com/api/users/';
    // var profiles = 'http://www.dircoolstuff.com/api/profiles/';
    // var login = 'http://www.dircoolstuff.com/api/api-auth/login/';
    // var loginNext = 'http://www.dircoolstuff.com/api/api-auth/login/?next=/';
    // var register = 'http://www.dircoolstuff.com/api/api-auth/register/';
    // var snippets = 'http://www.dircoolstuff.com/api/snippets/';
    // var socialnetwork = 'http://www.dircoolstuff.com/api/socialnetworks/';
    // var imageDir = 'http://www.dircoolstuff.com/dir/images/';
    // var imageDownload = 'http://www.dircoolstuff.com/api/qrcode';
    // var updateWithOutImage = 'http://www.dircoolstuff.com/api/updateprofile';
    // var messages = 'http://www.dircoolstuff.com/api/messages/';
    // var sendMessages = 'http://www.dircoolstuff.com/api/send-message/';
    // var updatePassword = 'http://www.dircoolstuff.com/api/api-auth/update/';
    // var clapDir = 'http://www.dircoolstuff.com/api/clap-profile/';
    // var linkStuff = 'http://www.dircoolstuff.com/api/link-stuff/';
    // var stocks = 'http://www.dircoolstuff.com/api/stocks/';
    // var deleteUser = 'http://www.dircoolstuff.com/api/delete-user/';
    // var tracking = 'http://www.dircoolstuff.com/api/track/';
    // var followDir = 'http://www.dircoolstuff.com/api/follow/';

    return {
        loginNext: loginNext,

        imageDir: imageDir,

        usersDir: users,

        profileDir: profiles,

        messageDir: messages,

        getCookie: function (name) {
            console.log($cookies.getAll());
            return $cookies.get('csrftoken');
        },

        login: function (username, password) {
            $http({
                method: 'POST',
                url: login,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {
                    'username': username,
                    'password': password,
                    'csrfmiddlewaretoken': $cookies.get('csrftoken')
                }
            }).success(function (result) {
                if (result['users'] != undefined && $cookies.get('sessionid') != undefined) {
                    $cookies.put('username', username, {
                        path: '/'
                    });
                    $rootScope.$broadcast('connected', username);
                } else {
                    $rootScope.$broadcast('wrongLogin', username);
                }
            }).error(function (response, status, header, config, statusText) { // data, status, header, config, statusText
                if (status == 403) {
                    $rootScope.$broadcast('forbidden', username);
                } else {
                    $rootScope.$broadcast('LoginNetworkConnectionError');
                }
            });
        },

        register: function (username, password, email, pin) {
            $http({
                method: 'POST',
                url: register,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {
                    'username': username,
                    'password': password,
                    'email': email,
                    'pin': pin,
                    'first_name': "",
                    'last_name': ""
                }
            }).success(function (data) {
                if (data['response'] == 'ok') {
                    var register = {
                        username: username,
                        password: password
                    };
                    $rootScope.$broadcast('register', register);
                } else {
                    $rootScope.$broadcast('wrongRegister');
                }
            }).error(function (response) {
                $rootScope.$broadcast('withoutNetworkConnection');
                if (response == null) {
                    console.log("response null register");
                } else {
                    console.log(response + " response");
                }
            });
        },

        addSnippet: function (title, body) {
            $http({
                method: 'POST',
                url: snippets,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {
                    'title': title,
                    'body': body,
                    'csrfmiddlewaretoken': $cookies.get('csrftoken')
                }
            }).success(function (data) {
                $rootScope.$broadcast('addsnippets');
            }).error(function (response) {
                $rootScope.$broadcast('addSnippetsError');
            });
        },

        addSocialNetwork: function (name, url, type) {
            $http({
                method: 'POST',
                url: socialnetwork,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {
                    'name': name,
                    'url': url,
                    'type': type,
                    'csrfmiddlewaretoken': $cookies.get('csrftoken')
                }
            }).success(function (data) {
                $rootScope.$broadcast('addsocialnetwork');
            }).error(function (response) {
                $rootScope.$broadcast('addSocialNetworkError');
            });
        },

        addTShirt: function (pin) {
            $http({
                method: 'POST',
                url: linkStuff,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {
                    'pin': pin,
                    'csrfmiddlewaretoken': $cookies.get('csrftoken')
                }
            }).success(function (data) {
                if (data.response == 'ok') {
                    $rootScope.$broadcast('addTshirt');
                } else {
                    $rootScope.$broadcast('addTshirtErrorBad');
                }
            }).error(function (response) {

            });
        },

        addStock: function (color, size, code, pin) {
            $http({
                method: 'POST',
                url: stocks,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {
                    'color': color,
                    'size': size,
                    'code': code,
                    'pin': pin,
                    'csrfmiddlewaretoken': $cookies.get('csrftoken')
                }
            }).success(function (data) {
                $rootScope.$broadcast('addStock');
            }).error(function (response) {
                $rootScope.$broadcast('addStockError');
            });
        },

        imageDownload: function (id) {
            $http({
                method: 'POST',
                url: imageDownload,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-CSRFToken': $cookies.get('csrftoken')
                },
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {
                    'id': id
                }
            }).success(function (data) {
                $rootScope.$broadcast('imageDownloadSuccesfull', imageDir + data.qrfilename);
            }).error(function (response) {
                $rootScope.$broadcast('makeQRCodeError');
            });
        },

        changePassword: function (username, password) {
            $http({
                method: 'POST',
                url: updatePassword,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {
                    'username': username,
                    'password': password,
                    'csrfmiddlewaretoken': $cookies.get('csrftoken')
                }
            }).success(function (data) {
                $rootScope.$broadcast('changepassword');
            }).error(function (response) {
                $rootScope.$broadcast('changepasswordError');
            });
        },

        sendMessage: function (sender, receiver, subject, body, readed) {
            $http({
                method: 'POST',
                url: sendMessages,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {
                    'sender': sender,
                    'receiver': receiver,
                    'subject': subject,
                    'body': body,
                    'readed': readed,
                    'csrfmiddlewaretoken': $cookies.get('csrftoken')
                }
            }).success(function (data) {
                $rootScope.$broadcast('SendMessage');
            }).error(function (response, status) {
                if (status == 403) {
                    $rootScope.$broadcast('forbidden', username);
                } else if (status == null) {
                    $rootScope.$broadcast('LoginNetworkConnectionError');
                } else {
                    $rootScope.$broadcast('WrongMessage');
                }
            });
        },

        takeClap: function (id, test) {
            $http({
                method: 'POST',
                url: clapDir,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {
                    'id': id,
                    'test': test,
                    'csrfmiddlewaretoken': $cookies.get('csrftoken')
                }
            }).success(function (data) {
                if (test && data.response == 'yes') {
                    $rootScope.$broadcast('testClapYes');
                } else if (test && data.response == 'not') {
                    $rootScope.$broadcast('testClapNo');
                } else if (!test) {
                    $rootScope.$broadcast('clapSuccesfully', data.response);
                }
            }).error(function (response) {
                $rootScope.$broadcast('clapError');
            });
        },

        deleteUser: function (id) {
            $http({
                method: 'POST',
                url: deleteUser,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {
                    'id': id,
                    'csrfmiddlewaretoken': $cookies.get('csrftoken')
                }
            }).success(function (data) {
                $rootScope.$broadcast('deleteUser');
            }).error(function (response) {
                $rootScope.$broadcast('deleteUserError');
            });
        },

        follow: function (id, test) {
            $http({
                method: 'POST',
                url: followDir,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {
                    'id': id,
                    'test': test,
                    'csrfmiddlewaretoken': $cookies.get('csrftoken')
                }
            }).success(function (data) {
                if (test && data.response == 'yes') {
                    $rootScope.$broadcast('testFollowYes');
                } else if (test && data.response == 'not') {
                    $rootScope.$broadcast('testFollowNo');
                } else if (!test) {
                    $rootScope.$broadcast('followSuccesfully', data.response);
                }
            }).error(function (response) {
                $rootScope.$broadcast('followError');
            });
        },

        updateProfile: function (profileurl, info, rating, score, avatar, fullname, email) {
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
                data: {
                    'info': info,
                    'rating': rating,
                    'score': score,
                    'avatar': avatar,
                    'fullname': fullname,
                    'email': email,
                    'csrfmiddlewaretoken': $cookies.get('csrftoken')
                }
            }).success(function (data) {
                $rootScope.$broadcast('updateProfile');
            }).error(function (response) {
                console.log("Entra al error");
            });
        },

        updateProfileWithOutAvatar: function (profileurl, id, info, rating, score, fullname, email) {
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
                data: {
                    'id': id,
                    'info': info,
                    'rating': rating,
                    'score': score,
                    'fullname': fullname,
                    'email': email,
                    'csrfmiddlewaretoken': $cookies.get('csrftoken')
                }
            }).success(function (data) {
                $rootScope.$broadcast('updateProfile');
            }).error(function (response) {
                console.log("Entra al error");
            });
        },

        updateMessage: function (url, sender, receiver, subject, body, readed) {
            $http({
                method: 'PUT',
                url: url,
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
                data: {
                    'url': url,
                    'sender': sender,
                    'receiver': receiver,
                    'subject': subject,
                    'body': body,
                    'readed': readed,
                    'csrfmiddlewaretoken': $cookies.get('csrftoken')
                }
            }).success(function (data) {
                $rootScope.$broadcast('messageUpdated');
            }).error(function (response) {
                if (status == 403) {
                    $rootScope.$broadcast('forbidden', username);
                } else {
                    $rootScope.$broadcast('LoginNetworkConnectionError');
                }
            });
        },

        updateSnippet: function (url, body) {
            $http({
                method: 'PUT',
                url: url,
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
                data: {
                    'title': '',
                    'body': body,
                    'csrfmiddlewaretoken': $cookies.get('csrftoken')
                }
            }).success(function (data) {
                $rootScope.$broadcast('snippetUpdated');
            }).error(function (response) {
                if (status == 403) {
                    $rootScope.$broadcast('forbidden', username);
                } else {
                    $rootScope.$broadcast('LoginNetworkConnectionError');
                }
            });
        },

        deleteSocialNetwork: function (id) {
            $http({
                method: 'DELETE',
                url: socialnetwork + id + '/',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-CSRFToken': $cookies.get('csrftoken')
                },
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                }
            }).success(function (result) {
                $rootScope.$broadcast('deleteSocialNetwork');
            }).error(function (response) {
                $rootScope.$broadcast('deleteSocialNetworkError');
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
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                }
            }).success(function (result) {
                $rootScope.$broadcast('deleteSnippet');
            }).error(function (response) {
                $rootScope.$broadcast('deleteSnippetError');
            });
        },

        deleteMessage: function (url) {
            $http({
                method: 'DELETE',
                url: url,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-CSRFToken': $cookies.get('csrftoken')
                },
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                }
            }).success(function (result) {
                $rootScope.$broadcast('deleteMessage');
            }).error(function (response) {
                $rootScope.$broadcast('deleteMessageError');
            });
        },

        deleteStuff: function (url) {
            $http({
                method: 'DELETE',
                url: url,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-CSRFToken': $cookies.get('csrftoken')
                },
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                }
            }).success(function (result) {
                $rootScope.$broadcast('deleteStuff');
            }).error(function (response) {
                $rootScope.$broadcast('deleteStuffError');
            });
        },

        fetchTshirt: function (code) {
            return $http.get(tshirt + "?code=" + code)
                .then(
                    function (response) {
                        return response.data;
                    },
                    function (errResponse) {
                        return $q.reject(errResponse);
                    }
                );
        },

        fetchUserByUser: function (username) {
            return $http.get(users + "?username=" + username)
                .then(
                    function (response) {
                        return response.data;
                    },
                    function (errResponse) {
                        return $q.reject(errResponse);
                    }
                );
        },

        fetchTracking: function () {
            return $http.get(tracking + '?start=2014-11&end=2018-12')
                .then(
                    function (response) {
                        return response.data;
                    },
                    function (errResponse) {
                        return $q.reject(errResponse);
                    }
                );
        },

        fetchMessages: function () {
            return $http.get(messages)
                .then(
                    function (response) {
                        return response.data;
                    },
                    function (errResponse) {
                        return $q.reject(errResponse);
                    }
                );
        },

        fetchSocialNetworks: function (username) {
            return $http.get(socialnetwork + "?username=" + username)
                .then(
                    function (response) {
                        return response.data;
                    },
                    function (errResponse) {
                        return $q.reject(errResponse);
                    }
                );
        },

        fetchSnippets: function (username) {
            return $http.get(snippets + "?username=" + username)
                .then(
                    function (response) {
                        return response.data;
                    },
                    function (errResponse) {
                        return $q.reject(errResponse);
                    }
                );
        },

        fetchObjectByUrl: function (url) {
            return $http.get(url)
                .then(
                    function (response) {
                        return response.data;
                    },
                    function (errResponse) {
                        return $q.reject(errResponse);
                    }
                );
        },

        fetchStocks: function () {
            return $http.get(stocks)
                .then(
                    function (response) {
                        return response.data;
                    },
                    function (errResponse) {
                        return $q.reject(errResponse);
                    }
                );
        },

        fetchFollowers: function (profileid, me) {
            return $http.get(followersDir + "?profileId=" + profileid + "&me=" + me)
                .then(
                    function (response) {
                        return response.data;
                    },
                    function (errResponse) {
                        return $q.reject(errResponse);
                    }
                );
        },

        fetchFollowing: function (profileid, me) {
            return $http.get(followersDir + "?profileId=" + profileid + "&me=" + me)
                .then(
                    function (response) {
                        return response.data;
                    },
                    function (errResponse) {
                        return $q.reject(errResponse);
                    }
                );
        },
    };
}]);
'use strict';

app.factory('RestService', ['$rootScope','$http', '$q','$cookies', '$httpParamSerializer', function($rootScope,$http, $q, $cookies, $httpParamSerializer) {

    // var tshirt = 'http://10.58.20.225/tshirts/';
    // var users = 'http://10.58.20.225/users/';
    // var login = 'http://10.58.20.225/api-auth/login/';
    // var register = 'http://10.58.20.225/api-auth/register/';
    // var snippets = 'http://10.58.20.225/snippets/';
    
    var tshirt = 'http://10.8.25.244/tshirts/';
    var users = 'http://10.8.25.244/users/';
    var login = 'http://10.8.25.244/api-auth/login/';
    var register = 'http://10.8.25.244/api-auth/register/';
    var snippets = 'http://10.8.25.244/snippets/';
    var socialnetwork = 'http://10.8.25.244/socialnetworks/';

    return {
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
                $rootScope.$broadcast('addsnippets');
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

        // fetchAllUsers: function() {
        //     return $http.get(users)
        //         .then(
        //             function(response){
        //                 return response.data;
        //             },
        //             function(errResponse){
        //                 console.error('Error while fetching all users');
        //                 return $q.reject(errResponse);
        //             }
        //         );
        // },
        //
        // fetchConnectedUsers: function(userId) {
        //     return $http.get(serverUrl + 'connectedUsers/' + userId)
        //         .then(
        //             function(response){
        //                 return response.data;
        //             },
        //             function(errResponse){
        //                 console.error('Error while fetching connected users by id');
        //                 return $q.reject(errResponse);
        //             }
        //         );
        // },
        //
        // fetchChatMessages: function(userId) {
        //     return $http.get(serverUrl + 'chats/' + userId)
        //         .then(
        //             function(response){
        //                 return response.data;
        //             },
        //             function(errResponse){
        //                 console.error('Error while fetching connected users by id');
        //                 return $q.reject(errResponse);
        //             }
        //         );
        // },
        //
        // createUser: function(user) {
        //     return $http.post(serverUrl +'user/', user)
        //         .then(
        //             function(response){
        //                 return response.data;
        //             },
        //             function(errResponse){
        //                 console.error('Error while creating user');
        //                 return $q.reject(errResponse);
        //             }
        //         );
        // },
        //
        // updateUser: function(user) {
        //     return $http.put(serverUrl + 'user/' , user)
        //         .then(
        //             function(response){
        //                 return response.data;
        //             },
        //             function(errResponse){
        //                 console.error('Error while updating user');
        //                 return $q.reject(errResponse);
        //             }
        //         );
        // },
        //
        // updateTask: function(task) {
        //     return $http.put(serverUrl + 'task/' , task)
        //         .then(
        //             function(response){
        //                 return response.data;
        //             },
        //             function(errResponse){
        //                 console.error('Error while updating task');
        //                 return $q.reject(errResponse);
        //             }
        //         );
        // },
        //
        // deleteUser: function(id) {
        //     return $http.delete(serverUrl + 'user/' + id)
        //         .then(
        //             function(response){
        //                 return response.data;
        //             },
        //             function(errResponse){
        //                 console.error('Error while deleting user');
        //                 return $q.reject(errResponse);
        //             }
        //         );
        // },
        //
        // fetchSimpleProjects: function(userId) {
        //     return $http.get(serverUrl + 'simpleProject/' + userId)
        //         .then(
        //             function(response){
        //                 return response.data;
        //             },
        //             function(errResponse){
        //                 console.error('Error while fetching simple Projects');
        //                 return $q.reject(errResponse);
        //             }
        //         );
        // },
        //
        // createSimpleProject: function(simpleProject) {
        //     return $http.post(serverUrl +'simpleProject/', simpleProject)
        //         .then(
        //             function(response){
        //                 return response.data;
        //             },
        //             function(errResponse){
        //                 console.error('Error while creating simple project');
        //                 return $q.reject(errResponse);
        //             }
        //         );
        // },
        //
        // fetchProjectById: function(projectId) {
        //     return $http.get(serverUrl + 'simpleProjectById/' + projectId)
        //         .then(
        //             function(response){
        //                 return response.data;
        //             },
        //             function(errResponse){
        //                 console.error('Error while fetching simple Projects By Id');
        //                 return $q.reject(errResponse);
        //             }
        //         );
        // },
        //
        // //Function for obtain all projects excepts the user's projects
        // fetchAllProject: function(userId, filter) {
        //     return $http.get(serverUrl + 'allProjectsExceptId/' + userId + '?filter=' + filter)
        //         .then(
        //             function(response){
        //                 return response.data;
        //             },
        //             function(errResponse){
        //                 console.error('Error while fetching All Projects');
        //                 return $q.reject(errResponse);
        //             }
        //         );
        // },
        //
        // fetchAllOpportunities: function(userId, filter) {
        //     return $http.get(serverUrl + 'simpleProjectOpportunities/' + userId + '?filter=' + filter)
        //         .then(
        //             function(response){
        //                 return response.data;
        //             },
        //             function(errResponse){
        //                 console.error('Error while fetching All Projects');
        //                 return $q.reject(errResponse);
        //             }
        //         );
        // },
        //
        // deleteProject: function(projectId) {
        //     return $http.get(serverUrl + 'simpleProjectDelete/' + projectId)
        //         .then(
        //             function(response){
        //                 return response.data;
        //             },
        //             function(errResponse){
        //                 console.error('Error while deleting simple Projects');
        //                 return $q.reject(errResponse);
        //             }
        //         );
        // },
        //
        // deleteTask: function(taskId) {
        //     return $http.get(serverUrl + 'taskDelete/' + taskId)
        //         .then(
        //             function(response){
        //                 return response.data;
        //             },
        //             function(errResponse){
        //                 console.error('Error while deleting task');
        //                 return $q.reject(errResponse);
        //             }
        //         );
        // },
        //
        // createTask: function(task) {
        //     return $http.post(serverUrl +'task/', task)
        //         .then(
        //             function(response){
        //                 return response.data;
        //             },
        //             function(errResponse){
        //                 console.error('Error while creating task');
        //                 return $q.reject(errResponse);
        //             }
        //         );
        // },
        //
        // fetchTaskByProjectId: function(projectId) {
        //     return $http.get(serverUrl + 'taskByProjectId/' + projectId)
        //         .then(
        //             function(response){
        //                 return response.data;
        //             },
        //             function(errResponse){
        //                 console.error('Error while fetching tasks By Id');
        //                 return $q.reject(errResponse);
        //             }
        //         );
        // },
        //
        // fetchTaskByTaskId: function(taskId) {
        //     return $http.get(serverUrl + 'task/' + taskId)
        //         .then(
        //             function(response){
        //                 return response.data;
        //             },
        //             function(errResponse){
        //                 console.error('Error while fetching tasks By Task Id');
        //                 return $q.reject(errResponse);
        //             }
        //         );
        // },
        //
        // fetchProposalByProjectId: function(projectId) {
        //     return $http.get(serverUrl + 'proposalByProjectId/' + projectId)
        //         .then(
        //             function(response){
        //                 return response.data;
        //             },
        //             function(errResponse){
        //                 console.error('Error while fetching propsal By Project Id');
        //                 return $q.reject(errResponse);
        //             }
        //         );
        // },
        //
        //
        // fetchProposalById: function(proposalId) {
        //     return $http.get(serverUrl + 'proposalById/' + proposalId)
        //         .then(
        //             function(response){
        //                 return response.data;
        //             },
        //             function(errResponse){
        //                 console.error('Error while fetching propsal By Proposal aId');
        //                 return $q.reject(errResponse);
        //             }
        //         );
        // },
        //
        // fetchAllNotifications: function(userId) {
        //     return $http.get(serverUrl + 'notifiesByUserId/' + userId)
        //         .then(
        //             function(response){
        //                 return response.data;
        //             },
        //             function(errResponse){
        //                 console.error('Error while fetching notifies By User Id');
        //                 return $q.reject(errResponse);
        //             }
        //         );
        // },
        //
        // fetchAllActivities: function(userId) {
        //     return $http.get(serverUrl + 'activitiesByUserId/' + userId)
        //         .then(
        //             function(response){
        //                 return response.data;
        //             },
        //             function(errResponse){
        //                 console.error('Error while fetching activities By User Id');
        //                 return $q.reject(errResponse);
        //             }
        //         );
        // },
        //
        // createInvertion: function(invertion) {
        //     return $http.post(serverUrl +'invertion/', invertion)
        //         .then(
        //             function(response){
        //                 return response.data;
        //             },
        //             function(errResponse){
        //                 console.error('Error while creating invertion');
        //                 return $q.reject(errResponse);
        //             }
        //         );
        // },
        //
        // fetchInvertionByProjectId: function(projectId) {
        //     return $http.get(serverUrl + 'invertion/' + projectId)
        //         .then(
        //             function(response){
        //                 return response.data;
        //             },
        //             function(errResponse){
        //                 console.error('Error while fetching invertions By ProjectId');
        //                 return $q.reject(errResponse);
        //             }
        //         );
        // },
        //
        // fetchTransactionsByProjectId: function(projectId) {
        //     return $http.get(serverUrl + 'transactionByProjectId/' + projectId)
        //         .then(
        //             function(response){
        //                 return response.data;
        //             },
        //             function(errResponse){
        //                 console.error('Error while fetching transactions By ProjectId');
        //                 return $q.reject(errResponse);
        //             }
        //         );
        // },
        //
        // fetchAllCommentsById: function(projectId) {
        //     return $http.get(serverUrl + 'commentsByProjectId/' + projectId)
        //         .then(
        //             function(response){
        //                 return response.data;
        //             },
        //             function(errResponse){
        //                 console.error('Error while fetching comments by projects id');
        //                 return $q.reject(errResponse);
        //             }
        //         );
        // },
        //
        // fetchAllCommentsByUserId: function(userId) {
        //     return $http.get(serverUrl + 'commentsByUserId/' + userId)
        //         .then(
        //             function(response){
        //                 return response.data;
        //             },
        //             function(errResponse){
        //                 console.error('Error while fetching comments by user id');
        //                 return $q.reject(errResponse);
        //             }
        //         );
        // },
        //
        // fetchAllVoteByProposalId: function(proposalId) {
        //     return $http.get(serverUrl + 'voteByProposalId/' + proposalId)
        //         .then(
        //             function(response){
        //                 return response.data;
        //             },
        //             function(errResponse){
        //                 console.error('Error while fetching votes by proposal id');
        //                 return $q.reject(errResponse);
        //             }
        //         );
        // },
    };
}]);

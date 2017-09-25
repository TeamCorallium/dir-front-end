'use strict';

app.factory('RestService', ['$http', '$q','$cookies', '$httpParamSerializer', function($http, $q, $cookies, $httpParamSerializer) {

    var tshirt = 'http://www.dir.com/tshirts/';
    var users = 'http://www.dir.com/users/';
    var login = 'http://www.dir.com/api-auth/login/';

    return {
        getCookie: function (name) {
            return $cookies.get('csrftoken');
        },

        login: function (username, password) {
            // return $http.post(login + "?username=" + username + "&password=" + password)
            //     .then(
            //         function(response){
            //             console.log(response.data);
            //         },
            //         function(errResponse){
            //             console.error('no login');
            //             return $q.reject(errResponse);
            //         }
            //     );
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
                // console.log(result);
                // console.log("Entra al response");
                if (result['users'] != undefined && $cookies.get('sessionid')!= undefined) {
                    return true;
                } else {
                    console.log(" error error");
                    return false;
                }
            }).error(function(response){
                console.log("Entra al error");
                return false;
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

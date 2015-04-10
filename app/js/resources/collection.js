'use strict';

angular.module('hummedia.services').
    factory('Collection', ['$resource', 'appConfig','$q','$http', function($resource, config, $q, $http){
        var resource = $resource(config.apiBase + '/collection/:identifier', {identifier: '@identifier'},
        {
            get:{
                method: 'GET',
                isArray: false,
                transformResponse: function(response){
                    
                    response = JSON.parse(response);
                    
                    if(response['dc:description']==="<p>None</p>" || response['dc:description']==="None"){
                        response['dc:description']="";
                    }

                    return response;
                }
            },
            query: {
                method: 'GET',
                isArray: true,
                transformResponse: function(response){
                    
                    response = JSON.parse(response).map(function (element){
                        if(element['dc:description']==="<p>None</p>" || element['dc:description']==="None"){
                            element['dc:description']="";
                        }
                        return element;
                    });
                                        
                    return response;
                }
            },
            search: {method: 'GET', isArray: true},
            update: {method: 'PATCH'}
        });

        resource.addVideosToCollection = function(video_pid_array, collection_id, collection_title) {
            var deferred = $q.defer();
            var packet = [{
                "collection":
                  {"id": collection_id,"title": collection_title},
                  "videos": video_pid_array
            }];
            $http.post('/api/v2/batch/video/membership', packet)
                .success(deferred.resolve);

            return deferred.promise;
        };

        return resource;
    }]);

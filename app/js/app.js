'use strict';

// Declare app level module which depends on filters, and services
angular.module('hummedia', ['hummedia.config','hummedia.filters', 'hummedia.services', 'hummedia.directives', 'ngLocale']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/search', {title: "Hummedia | Search", templateUrl: 'partials/search/search.html', controller: SearchCtrl, reloadOnSearch: false});
    $routeProvider.when('/', {title: "Hummedia", templateUrl: 'partials/home.html'});
    $routeProvider.when('/collection/:id', {title: "Hummedia | Collection", templateUrl: 'partials/collection.html', controller: CollectionCtrl});
    $routeProvider.when('/video/:id', {templateUrl: 'partials/video.html', controller: VideoCtrl});    
	$routeProvider.when('/admin/collection', {title: "Hummedia | Collections", admin: true, templateUrl: 'partials/admin-collection.html', controller: AdminCollectionCtrl, reloadOnSearch: false});
    $routeProvider.when('/admin/user', {title: "Hummedia | Users", admin: true, templateUrl: 'partials/admin-user.html', controller: AdminUserCtrl, reloadOnSearch: false});
    $routeProvider.when('/collection', {title: "Hummedia | Collections", templateUrl: 'partials/collections.html', controller: CollectionsCtrl});
    $routeProvider.when('/developer', {title: "Hummedia | Developer", templateUrl: 'partials/developer.html'});
    $routeProvider.otherwise({redirectTo: '/'});
  }]).
  config(['$locationProvider', function($locationProvider) {
    //$locationProvider.html5Mode(true);
  }]).
  config(['$httpProvider', function($httpProvider) {
      $httpProvider.defaults.headers.patch = {"Content-Type": "application/json"};
      // Intercepts HTTP requests to display API-related errors to the user
      // see http://docs.angularjs.org/api/ng.$http
      $httpProvider.responseInterceptors.push(['$q', 'appConfig', '$rootScope', function($q, appConfig, $rootScope){
          return function(promise) {
              return promise.then(function(response){
                  // success, do nothing
                  return response;
              }, function(response) {
                  // if this is a local request (i.e., not one to flickr or some other service)
                  // then we go back to normal
                  if(response.config.url.indexOf(appConfig.apiBase) !== 0) {
                      return response;
                  }
                  $rootScope.apiError = response.status;
                  return $q.reject(response);
              });
          };
      }]);
  }]);

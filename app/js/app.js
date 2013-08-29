'use strict';

// Declare app level module which depends on filters, and services
angular.module('hummedia', ['hummedia.config','hummedia.filters', 'hummedia.services', 'hummedia.directives', 'ngLocale', 'ngSanitize','ui.tinymce']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/search', {title: "Hummedia | Search", templateUrl: 'partials/search/search.html', controller: SearchCtrl, reloadOnSearch: false});
    $routeProvider.when('/', {title: "Hummedia", templateUrl: 'partials/home.html'});
    $routeProvider.when('/video/:id', {title: "Hummedia | Video", templateUrl: 'partials/video.html', controller: VideoCtrl,
        resolve: {
            ANNOTATION_MODE: function(){ return false; }
        }
    });    
    $routeProvider.when('/video/annotate/:id', {title: "Hummedia | Annotate", templateUrl: 'partials/video.html', controller: VideoCtrl,
        resolve: {
            ANNOTATION_MODE: function() { return true; }
        }
    });    
    $routeProvider.when('/admin/collection', {title: "Hummedia | Collections", admin: true, templateUrl: 'partials/admin-collection.html', controller: AdminCollectionCtrl, reloadOnSearch: false});
    $routeProvider.when('/admin/user', {title: "Hummedia | Users", admin: true, templateUrl: 'partials/admin-user.html', controller: AdminUserCtrl, reloadOnSearch: false});
    $routeProvider.when('/admin/video', {title: "Hummedia | Videos", admin: true, templateUrl: 'partials/admin-video.html', controller: AdminVideoCtrl, reloadOnSearch: false});
    $routeProvider.when('/admin/video/ingest', {title: "Hummedia | Ingest Video", admin: true, templateUrl: 'partials/admin-ingest.html', controller: AdminIngestCtrl, reloadOnSearch: false});
    $routeProvider.when('/admin/video/create', {title: "Hummedia | Create Video", admin: true, templateUrl: 'partials/admin-create-video.html', controller: AdminCreateVideo, reloadOnSearch: false});
    $routeProvider.when('/collection', {title: "Hummedia | Collections", templateUrl: 'partials/collections.html', controller: CollectionsCtrl});
    $routeProvider.when('/select-course/:video', {title: "Hummedia | Select Course", templateUrl: 'partials/select-course.html', controller: SelectCourseCtrl});
    $routeProvider.when('/developer', {title: "Hummedia | Developer", templateUrl: 'partials/developer.html'});
    $routeProvider.when('/about', {title: "Hummedia | About", templateUrl: 'partials/about.html'});
    $routeProvider.otherwise({redirectTo: '/'});
  }]).
  config(['$locationProvider', function($locationProvider) {
    //$locationProvider.html5Mode(true);
  }]).
  config(['$httpProvider', function($httpProvider) {
      $httpProvider.defaults.headers.patch = {"Content-Type": "application/json"};
      $httpProvider.defaults.withCredentials = true; /** @TODO: THIS LINE NEEDS TO BE REMOVED IN PRODUCTION; ONLY HERE FOR TESTING PURPOSES **/
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
  }]).
  /*!
    document title modification partially from jkoreska @ http://stackoverflow.com/a/13407227/390977
  */
  run(['$location', '$rootScope', 'user', '$window', function($location, $rootScope, user, $window) {
      // updates page title on URL change
      $rootScope.$on('$routeChangeSuccess', function(ev, current, previous) {
          // so crawlers can view cached pages and see our titles
          if(!current.$$route)
              return;
          $rootScope.title = current.$$route.title;
      });

      // require login for specific pages
      $rootScope.$on('$routeChangeStart', function(ev, current, previous) {
          if(!current.$$route)
              return;

          // 0 -- able to view page.
          // 1 -- login required, not found
          // 2 -- admin status required, not held
          var denied = function() {
              if(current.$$route.login && !user.exists)
                  return 1;
              if(current.$$route.admin && !user.canCreate)
                  return 2;
              return 0;
          }

          if(denied()) {
              var redirect = $window.location.toString();
              var oldPath = $location.path();
              $location.path("/");

              user.checkStatus().then(function() {
                   var denyStatus = denied();
                   if(!denyStatus) {
                       $location.path(oldPath);
                       return;
                   }


                   setTimeout(function(){
                       if(!user.exists)
                          user.prompt(false, redirect);
                       else if(denyStatus == 2 && !user.canCreate)
                          alert("You are not authorized to view that page.");
                   },1); // has to happen after path change
              });
          }
      });
  }]);

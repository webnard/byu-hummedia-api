'use strict';
function VideoCtrl($scope, $routeParams, Video) {
    $scope.video = Video.get({identifier:$routeParams.id, full:'true'});
    console.log($scope.video);

}
// always inject this in so we can later compress this JavaScript
VideoCtrl.$inject = ['$scope', '$routeParams', 'Video'];
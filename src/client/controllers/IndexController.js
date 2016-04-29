angular.module('appIndexController', [])
.controller('IndexController', ['$scope', function($scope) {
	$scope.welcome = 'hello there!';

  $scope.close_jumbotron = function() {
    angular.element('.jumbotron').remove();
    angular.element('.jumbotron-headline').remove();
  }


}]);
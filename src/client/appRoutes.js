angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'views/home.html',
        controller: 'IndexController'
      }).
      when('/404', {
        templateUrl: 'views/404.html'
      }).
      otherwise({
        redirectTo: '/404'
      });
      $locationProvider.html5Mode(false).hashPrefix('!');
}]);

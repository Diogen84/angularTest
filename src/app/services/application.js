var app = angular.module('App', ['ngRoute']);

app.service("eventService", ['$rootScope', function($rootScope) {
    this.broadcast = function(data) {
        $rootScope.$broadcast('invokeNotification', data);
    };
    this.listen = function(callback) {
        $rootScope.$on("invokeNotification", callback);
    };
}]);

app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider
            .when('/', {
                template: '<form-directive></form-directive>'
            })
            .otherwise({
                redirectTo: '/'
            });
    }]);
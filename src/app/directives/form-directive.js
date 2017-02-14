app.directive('formDirective', function(eventService) {
    return {
        restrict: 'E',
        replace:true,
        scope:{},
        controller: function($scope, eventService) {
            $scope.notification = {};

            $scope.invokeNotification = function(e) {
                e.preventDefault();
                $scope.form.title.$touched = true;
                $scope.form.body.$touched = true;
                $scope.form.category.$touched = true;
                if($scope.form.$valid) {
                    var notification = angular.copy($scope.notification);
                    eventService.broadcast([notification]);
                }
            };
        },
        templateUrl:'./partial/form.html'
    }
});
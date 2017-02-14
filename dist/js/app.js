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
app.controller('Nav', ['$scope', function($scope) {
    $scope.nav = false;
    $scope.openClose = function(e) {
        e.preventDefault();
        $scope.nav =  !$scope.nav;
    }
}]);
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
app.directive('notificationProvider', function(eventService) {
    return {
        restrict : "E",
        replace: true,
        scope: {},
        controller: function($scope, eventService, $rootScope) {
            $scope.itemsToDisplay = 5;
            $scope.itemsAll = [];
            $scope.items = [];

            eventService.listen(function(event, obj) {
                angular.forEach(obj, function(item, i) {
                    $scope.itemsAll.push({"details" : item});
                });
                $scope.updateItemList();
            });

            $scope.updateItemList = function() {
                var itemsLength = $scope.items.length,
                    i = 0;

                if(itemsLength < $scope.itemsToDisplay) {
                    while(i < $scope.itemsToDisplay - itemsLength && i < $scope.itemsAll.length) {
                        $scope.itemsAll.reverse();
                        $scope.items.push($scope.itemsAll.pop());
                        $scope.itemsAll.reverse();
                        i++;
                    }
                }
            };

            $scope.removeElement = function(array, index) {
                array.splice(index, 1);
                $scope.updateItemList();
            };
        },
        template:'<div class="notifications">'+
            '<div notification data-ng-repeat="item in items" data-ng-model="item" data-remove-item="removeElement(items, $index)"></div>' +
        '</div>'
    }
});
app.directive('notification', function($timeout) {
    return {
        restrict: "A",
        scope: {
            model : "=ngModel",
            removeItem:"&"
        },
        link: function(scope, element, attr){
            var category = scope.model.details.category;
            $timeout(function() {
                if(category == 'info') {
                    scope.class += ' hide';
                }
            },89000);
            $timeout(function() {
                if(category == 'info' && !(scope.isManuallyDeleted)) {
                    scope.removeItem();
                }
            }, 90000);
        },
        controller: function($scope) {
            $scope.isManuallyDeleted = false;
            $scope.class = $scope.model.details.category;
            $scope.removeNotification = function() {
                $scope.isManuallyDeleted = true;
                $scope.removeItem();
            };
        },
        template:   '<div class="notification" data-ng-class="class">' +
                        '<div class="header-notification">' +
                            '<h3>{{model.details.title}}</h3>' +
                        '</div>' +
                        '<div class="body-notification">' +
                            '<p>{{model.details.body}}</p>' +
                            '<div class="close-notification"><a href="" data-ng-click="removeNotification()">Close</a></div>' +
                        '</div>' +
                    '</div>'
    }
});
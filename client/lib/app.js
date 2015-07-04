/**
 * Created by Andrea on 06/06/2015.
 */
var app = angular.module('sam-1',['angular-meteor','ui.router','ngMaterial']);
app.config(function($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('blue')
            .accentPalette('cyan');
});

app.controller("AppCtrl",['$scope','$mdSidenav','$rootScope', function($scope,$mdSidenav,$rootScope) {
    $scope.currentTab = 'Inicio';
    $scope.showLeftMenu = function() {
        $mdSidenav('left').toggle();
    }
    $scope.getCurrentTab = function() {
        return $rootScope.currentTab;
    }
}]);

app.service("notificationService", function($mdToast){
    this.showError = function(msg) {
        $mdToast.show({
            template: '<md-toast class="md-toast error">' + msg + '</md-toast>',
            hideDelay: 6000,
            position: 'up right'
        });
    }
    this.showSuccess = function(msg) {
        $mdToast.show({
            template: '<md-toast class="md-toast success">' + msg + '</md-toast>',
            hideDelay: 6000,
            position: 'up right'
        });
    }
});
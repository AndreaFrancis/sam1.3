/**
 * Created by Andrea on 06/06/2015.
 */
var app = angular.module('sam-1',['angular-meteor','ui.router','ngMaterial', 'ngMessages']);
app.config(function($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('indigo')
            .accentPalette('pink');
});

app.controller("AppCtrl",['$scope','$mdSidenav','$rootScope', function($scope,$mdSidenav,$rootScope) {
    $scope.showLeftMenu = function() {
        $mdSidenav('left').toggle();
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

app.service("ModalService", function($mdDialog){
    this.showModal = function(controller, urlTemplate, event) {
        $mdDialog.show({
            controller: controller,
            templateUrl: urlTemplate,
            targetEvent : event
        });
    }
});

/**
 * Created by Andrea on 06/06/2015.
 */
var app = angular.module('sam-1',['angular-meteor','ui.router','ngMaterial', 'ngMessages']);
app.config(function($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('indigo')
            .accentPalette('pink');
});

app.controller("AppCtrl",['$scope','$mdSidenav','$rootScope','$state','$meteor', function($scope,$mdSidenav,$rootScope, $state, $meteor) {

    $scope.username = '';
    $scope.password = '';
    $scope.modules = $meteor.collection(Modules);
    if($rootScope.currentUser) {
        $scope.username = $rootScope.currentUser.username;
        $scope.roles =   $rootScope.currentUser.roles;
        $scope.allowed = $meteor.collection(function(){
            return Modules.find({roles: {"$in":$scope.roles}});
        });
    }

    $scope.showMenu = function(target) {
        $state.go(target.state);
        $mdSidenav('left').toggle();
    }

    $scope.showLeftMenu = function() {
        $mdSidenav('left').toggle();
    }

    $scope.logOut = function() {
        Meteor.logout();
    }

    $scope.login = function() {
        Meteor.loginWithPassword($scope.username, $scope.password, function(error){
            if(error) {
                console.log(error.reason);
            }
        });
    }
}]);

app.directive('demoDirective', function($compile) {
    return {
        template: '<div><a ng-href="{{module.state}}">&ensp;{{module.name}}</a></div>',
        replace: true
    }
});

app.directive('mainTex', function($compile) {
    return {
        template: '<div>{{module.name}}</div>',
        replace: true
    }
});

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

app.service("AuthorizationService", function(){
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

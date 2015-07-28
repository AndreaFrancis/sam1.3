/**
 * Created by Andrea on 06/06/2015.
 */
var app = angular.module('sam-1',['angular-meteor','ui.router','ngMaterial', 'ngMessages', 'mdDateTime']);
app.config(function($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('indigo')
            .accentPalette('pink');
});

app.controller("AppCtrl",['$scope','$mdSidenav','$rootScope','$state','$meteor',
    function($scope,$mdSidenav,$rootScope, $state, $meteor) {

    $scope.username = '';
    $scope.password = '';
    $scope.modules = $meteor.collection(Modules);
    if($rootScope.currentUser) {
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

app.service("ProfileService", function($rootScope) {

    this.getRol = function() {
        return $rootScope.currenUser.roles;
    };
    this.getModules = function() {

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


/**Router config**/
angular.module("sam-1").config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
    function($urlRouterProvider, $stateProvider, $locationProvider){
        $locationProvider.html5Mode(true);

        $stateProvider
            .state('labs', {
                url: '/labs',
                templateUrl: 'client/labs/views/labs-list.ng.html',
                controller: 'LabsListCtrl'
            })
            .state('users', {
                url: '/users',
                templateUrl: 'client/users/views/users-list.ng.html',
                controller: 'UsersListCtrl'
            })
            .state('start', {
                url: '/start',
                templateUrl: 'client/starter/start.ng.html'
            })
            .state('measures', {
                url: '/measures',
                templateUrl: 'client/measures/measures.ng.html',
                controller: 'MeasuresListCtrl'
            })
            .state('analisys', {
                url: '/analisys',
                templateUrl: 'client/analisys/views/analisys.ng.html',
                controller: 'AnalisysListCtrl'
            })
            .state('areas', {
                url: '/areas',
                templateUrl: 'client/areas/views/areas.ng.html',
                controller: 'AreasListCtrl'
            })
            .state('exams', {
                url: '/exams',
                templateUrl: 'client/exams/exams.ng.html',
                controller: 'ExamsListCtrl'
            })
            .state('mtests', {
                url: '/mtests',
                templateUrl: 'client/mtests/mtests-list.ng.html',
                controller: 'TestsListCtrl'
            })
            .state('roles', {
                url: '/roles',
                templateUrl: 'client/roles/roles.ng.html',
                controller: 'RolesListCtrl'
                /*
                 ,
                 resolve: {
                 "currentUser": ["$meteor", function($meteor){
                 return $meteor.requireValidUser(function(user) {
                 return user.username==='maria';
                 });
                 }]
                 }*/
            })
            .state('modules', {
                url: '/modules',
                templateUrl: 'client/modules/modules.ng.html',
                controller: 'ModulesListCtrl'
                /*
                 ,
                 resolve: {
                 "currentUser": ["$meteor", function($meteor){
                 return $meteor.requireValidUser(function(user) {
                 return user.username==='maria';
                 });
                 }]
                 }*/
            })
            .state('patients', {
                url: '/patients',
                templateUrl: 'client/patients/patients.ng.html',
                controller: 'PatientsListCtrl'
            })
            .state('patient', {
                url: '/patient/:patientId',
                templateUrl: 'client/patients/patient-details.ng.html',
                controller: 'PatientCtrl'
            });
        $urlRouterProvider.otherwise("/start");
    }]);
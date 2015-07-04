/**
 * Created by Andrea on 07/06/2015.
 */

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
            .state('kinds', {
                url: '/kinds',
                templateUrl: 'client/kinds/views/kinds-list.ng.html',
                controller: 'KindsListCtrl'
            })
            .state('areas', {
                url: '/areas',
                templateUrl: 'client/areas/views/areas.ng.html',
                controller: 'AreasListCtrl'
            });;
        $urlRouterProvider.otherwise("/start");
    }]);
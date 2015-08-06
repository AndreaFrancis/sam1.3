/**
 * Created by Andrea on 06/06/2015.
 */
var app = angular.module('sam-1',['angular-meteor','ui.router','ngMaterial', 'ngMessages', 'mdDateTime']);
app.config(function($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('blue')
            .accentPalette('light-blue');
        $mdThemingProvider.theme('nav-theme')
        .primaryPalette('lime');
    $mdThemingProvider.setDefaultTheme('default');
});


//tESTIN
app.run(function ($rootScope, $state, ModalService) {
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
    var requireLogin = toState.data.requireLogin;
    if (requireLogin && ($rootScope.currentUser === 'undefined' || $rootScope.currentUser === null)) {
      event.preventDefault();
      $state.go("login");
    }
  });

});

//End testing

app.controller("AppCtrl",['$scope','$mdSidenav','$rootScope','$state','$meteor',AppCtrl]);

function AppCtrl($scope,$mdSidenav,$rootScope, $state, $meteor) {

    $scope.username = '';
    $scope.password = '';
    $scope.currentModule = '';
    $scope.modules = $meteor.collection(Modules, false);

    $scope.goToModule = function(target) {
            $scope.currentModule = target.name;
            $state.go(target.state);
    }

    $scope.showMenu = function(target) {
            $scope.currentModule = target.name;
            $state.go(target.state);
            $mdSidenav('left').toggle();
    }
    $scope.checkRoles = function() {
            if($rootScope.currentUser) {
                $scope.roles =   [$rootScope.currentUser.profile.mainRol];
                $scope.allowed = $meteor.collection(function(){
                    return Modules.find({roles: {"$in":$scope.roles}});
                });
                $scope.username = $rootScope.currentUser.username;
                $scope.user = $rootScope.currentUser;
            } else{
                if(localStorage.getItem("rol")) {
                    $scope.username = localStorage.getItem("username");
                    $scope.allowed = $meteor.collection(function(){
                        return Modules.find({roles: {"$in":[localStorage.getItem("rol")]}});
                    });
                }
            }
        }

    $scope.showLeftMenu = function() {
        $mdSidenav('left').toggle();
    }

    $scope.logOut = function() {
        if(Meteor.connection.status().connected){
            Meteor.logout();
        }
        $rootScope.currentUser = null;
        localStorage.removeItem("rol");
        localStorage.removeItem("user");
        localStorage.removeItem("username");
        $scope.username = '';
        $scope.password = '';
        $mdSidenav('left').toggle();
        $scope.allowed = [];
        $state.go("login");
    }

    $scope.login = function() {
        Meteor.loginWithPassword($scope.username, $scope.password, function(error){
            if(error) {
                console.log(error.reason);
            } else{
                $rootScope.currentUser = Meteor.user();
                localStorage.setItem("username", $rootScope.currentUser._id);
                localStorage.setItem("user", $rootScope.currentUser._id);
                localStorage.setItem("rol", $rootScope.currentUser.profile.mainRol);
                $scope.checkRoles();
                $state.go("start");
            }
        });
    }
    $scope.checkRoles();
}

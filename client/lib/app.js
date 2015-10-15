/**
 * Created by Andrea on 06/06/2015.
 */
var app = angular.module('sam-1',['angular-meteor','ui.router','ngMaterial', 'ngMessages']);
app.config(function($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('light-blue')
            .accentPalette('indigo');
        $mdThemingProvider.theme('nav-theme')
        .primaryPalette('indigo');
    $mdThemingProvider.setDefaultTheme('default');
});

app.run(function ($rootScope, $state, ModalService) {
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
    var requireLogin = toState.data.requireLogin;
    if (requireLogin && ($rootScope.currentUser === 'undefined' || $rootScope.currentUser === null)) {
      event.preventDefault();
      //$state.go("login");
    }
  });
});

app.controller("AppCtrl",['$scope','$mdSidenav','$rootScope','$state','$meteor',AppCtrl]);

function AppCtrl($scope,$mdSidenav,$rootScope, $state, $meteor) {
    $scope.currentModule = "Inicio";
    $scope.username = '';
    $scope.password = '';
    $scope.currentModule = '';
    $scope.modules = $meteor.collection(Modules, false);

    $scope.showPerfil = function(){
      $state.go("profile");
    }

    $scope.showConfiguration = function(){
      $state.go(target.state);
    }

    $scope.goToModule = function(target) {
            $scope.currentModule = target.name;
            $state.go(target.state);
    }

    $scope.showMenu = function(target) {
            $scope.currentModule = target.name;
            $state.go(target.state);
    }
    $scope.checkRoles = function() {
      var check = localStorage.getItem("check");
      if(check =="true"){
          $scope.roles = "";
          if($rootScope.currentUser) {
              $scope.roles =   [$rootScope.currentUser.profile.mainRol];
              $scope.username = $rootScope.currentUser.username;
              $scope.user = $rootScope.currentUser;
          } else{
              if(localStorage.getItem("rol")) {
                  $scope.username = localStorage.getItem("user");
                  $scope.roles = [localStorage.getItem("rol")];
              }
          }
          $scope.allowed = $meteor.collection(function(){
            var mods =  Modules.find({roles: {"$in":$scope.roles}});
            return mods;
          }, false);
      }
    }

    $scope.logOut = function() {
        //if(Meteor.connection.status().connected){
            Meteor.logout();
        //}
        $rootScope.currentUser = null;
        localStorage.removeItem("rol");
        localStorage.removeItem("user");
        localStorage.removeItem("username");
        localStorage.removeItem("lab");
        localStorage.removeItem("rolName");
        $scope.username = '';
        $scope.password = '';
        $scope.allowed = [];
        localStorage.setItem("check","false");
        $state.go("start");
    }

    $scope.login = function() {
        Meteor.loginWithPassword($scope.username, $scope.password, function(error){
            if(error) {
                $scope.error = "Datos incorrectos";
                console.log(error.reason);
            } else{
                $rootScope.currentUser = Meteor.user();

                $scope.username = $rootScope.currentUser.username;
                $scope.userId = $rootScope.currentUser._id;

                localStorage.setItem("username", $rootScope.currentUser.username);
                localStorage.setItem("user", $rootScope.currentUser._id);
                var rolId = $rootScope.currentUser.profile.mainRol;
                localStorage.setItem("rol", rolId);

                var rol = $meteor.object(RolesData, rolId);

                localStorage.setItem("rolName", rol.name);
                localStorage.setItem("check","true");

                var ifIsPersonalLab = $meteor.collection(function(){
                    return Labpersonal.find({user: {"$in": [$scope.userId]}});
                });
                if(ifIsPersonalLab.length>0){
                  var personal = ifIsPersonalLab[0];
                  localStorage.setItem("lab",personal.lab);
                }
                $scope.checkRoles();
                $state.go("start");
            }
        });
    }
    $scope.checkRoles();
}

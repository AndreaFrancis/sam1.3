/**
 * Created by Andrea on 07/06/2015.
 */
/**
 * Created by Andrea on 07/06/2015.
 */
angular.module("sam-1").controller("UsersListCtrl",['$scope','$meteor','notificationService','$mdDialog','ModalService',
    function($scope, $meteor,notificationService,$mdDialog, ModalService) {
        $scope.users = $meteor.collection(Users, false);
        $scope.showTextSearch = true;

        $scope.showAddNew = function(ev) {
            ModalService.showModal(AddUserController, 'client/users/views/addUser.tmpl.ng.html', ev);
        }

        $scope.toggleSearch = function() {
            $scope.showTextSearch = !$scope.showTextSearch;
        }
        $scope.headers = ['', 'Nombre de usuario','Nombre', 'Apellido', 'Email'];
}]);

function AddUserController($rootScope, $scope,$mdDialog, $meteor, notificationService) {
    $scope.roles = $meteor.collection(RolesData);
    $scope.newUser = {};
    $scope.newUser.profile = {};
    $scope.selectedRol = {};
    $scope.cancel = function() {
        $mdDialog.cancel();
    }

    $scope.save = function() {
        $scope.newUser.roles = [$scope.selectedRol];
        Meteor.call("createNewUser", $scope.newUser, function(err) {
            if(err) {
                notificationService.showError("Error en el registro del usuario");
                console.log(err);
            }else{
                notificationService.showSuccess("Se ha registrado correctamente al usuario");
            }
        });
        $scope.newUser = '';
        $mdDialog.hide();
    }
}
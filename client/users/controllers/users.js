/**
 * Created by Andrea on 07/06/2015.
 */
/**
 * Created by Andrea on 07/06/2015.
 */
angular.module("sam-1").controller("UsersListCtrl",['$scope','$meteor','notificationService','$mdDialog','ModalService',
    function($scope, $meteor,notificationService,$mdDialog, ModalService) {
        $scope.users = $meteor.collection(UsersData);
        $scope.showTextSearch = true;

        $scope.showAddNew = function(ev) {
            ModalService.showModal(AddUserController, 'client/users/views/addUser.tmpl.ng.html', ev);
        }

        $scope.toggleSearch = function() {
            $scope.showTextSearch = !$scope.showTextSearch;
        }
        $scope.headers = ['', 'Nombre', 'Apellido', 'Email'];
}]);

function AddUserController($scope,$mdDialog, $meteor, notificationService) {
    $scope.users = $meteor.collection(UsersData);
    $scope.cancel = function() {
        $mdDialog.cancel();
    }

    $scope.save = function() {
        $scope.users.save($scope.newUser).then(function(number) {
            notificationService.showSuccess("Se ha registrado correctamente al usuario");
        }, function(error){
            notificationService.showError("Error en el registro del usuario");
            console.log(error);
        });
        $scope.newUser = '';
        $mdDialog.hide();
    }
}
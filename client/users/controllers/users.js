/**
 * Created by Andrea on 07/06/2015.
 */
/**
 * Created by Andrea on 07/06/2015.
 */
angular.module("sam-1").controller("UsersListCtrl",['$scope','$meteor','notificationService','$mdDialog',
    function($scope, $meteor,notificationService,$mdDialog) {
        $scope.users = $meteor.collection(UsersData);
        $scope.showAddNew = function(ev) {
            $mdDialog.show({
                controller: AddUserController,
                templateUrl: 'client/users/views/addUser.tmpl.ng.html',
                targetEvent : ev
            })
        }
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
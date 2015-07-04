/**
 * Created by Andrea on 07/06/2015.
 */
/**
 * Created by Andrea on 07/06/2015.
 */
angular.module("sam-1").controller("UsersListCtrl",['$scope','$meteor','notificationService',
    function($scope, $meteor,notificationService) {
        $scope.users = $meteor.collection(UsersData);
        $scope.buttonStatus = '+';
        $scope.showAddNew = function() {
            $scope.collapse = !($scope.collapse);
            $scope.buttonStatus = $scope.collapse ? '-' : '+';
        }
        $scope.saveUser = function() {
            $scope.users.save($scope.newUser).then(function(number) {
                notificationService.showSuccess("Se ha registrado correctamente al usuario");
            }, function(error){
                notificationService.showError("Error en el registro del usuario");
                console.log(error);
            });
            $scope.newUser = '';
            $scope.showAddNew();
        }
    }]);

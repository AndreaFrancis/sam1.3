/**
 * Created by Andrea on 07/06/2015.
 */
angular.module("sam-1").controller("AnalisysListCtrl",['$scope','$meteor','notificationService',
    function($scope, $meteor,notificationService) {
        $scope.buttonStatus = '+';
        $scope.analisysList = $meteor.collection(Analisys);
        $scope.areas = $meteor.collection(Areas);
        $scope.labs = $meteor.collection(Labs);
        $scope.showAddNew = function() {
            $scope.collapse = !($scope.collapse);
            $scope.buttonStatus = $scope.collapse ? '-' : '+';
        }
        $scope.save = function() {
            $scope.analisysList.save($scope.newAnalisys).then(function(number) {
                notificationService.showSuccess("Se ha registrado correctamente el Analisis clinico");
            }, function(error){
                notificationService.showError("Error en el registro del area");
                console.log(error);
            });
            $scope.newAnalisys = '';
            $scope.showAddNew();
        }
        $scope.removeAnalisys = function(analisysToRemove) {
            $scope.analisysList.remove(analisysToRemove);
        }
    }]);
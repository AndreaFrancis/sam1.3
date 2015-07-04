/**
 * Created by Andrea on 07/06/2015.
 */
angular.module("sam-1").controller("LabsListCtrl",['$scope','$meteor','$rootScope','$mdDialog','notificationService',
    function($scope, $meteor,  $rootScope,$mdDialog,notificationService) {
        $rootScope.currentTab = "Laboratorios";
        $scope.buttonStatus = '+';
        $scope.labs = $meteor.collection(Labs);
        $scope.showAddNew = function() {
            $scope.collapse = !($scope.collapse);
            $scope.buttonStatus = $scope.collapse ? '-' : '+';
        }
        $scope.saveLab = function() {
            var x = $rootScope;
            //$scope.newLab.owner= x.currentUser._id;
            $scope.labs.save($scope.newLab).then(function(number) {
                notificationService.showSuccess("Se ha registrado correctamente el laboratorio");
            }, function(error){
                notificationService.showError("Error en el registro del laboratorio");
                console.log(error);
            });
            $scope.newLab = '';
            $scope.showAddNew();
        }
        $scope.removeLab = function(labToRemove) {
            $scope.labs.remove(labToRemove);
        }
    }]);

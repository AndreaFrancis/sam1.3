/**
 * Created by Andrea on 08/06/2015.
 */
/**
 * Created by Andrea on 07/06/2015.
 */
angular.module("sam-1").controller("AreasListCtrl",['$scope','$meteor','notificationService',
    function($scope, $meteor,notificationService) {
        $scope.buttonStatus = '+';
        $scope.areas = $meteor.collection(Areas);
        $scope.showAddNew = function() {
            $scope.collapse = !($scope.collapse);
            $scope.buttonStatus = $scope.collapse ? '-' : '+';
        }
        $scope.saveArea = function() {
            $scope.areas.save($scope.newArea).then(function(number) {
                notificationService.showSuccess("Se ha registrado correctamente el Area");
            }, function(error){
                notificationService.showError("Error en el registro del area");
                console.log(error);
            });
            $scope.newArea = '';
            $scope.showAddNew();
        }
        $scope.removeArea = function(areaToRemove) {
            $scope.areas.remove(areaToRemove);
        }
    }]);
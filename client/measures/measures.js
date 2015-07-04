/**
 * Created by Andrea on 08/06/2015.
 */
/**
 * Created by Andrea on 07/06/2015.
 */
angular.module("sam-1").controller("MeasuresListCtrl",['$scope','$meteor','notificationService',
    function($scope, $meteor,notificationService) {
        $scope.buttonStatus = '+';
        $scope.measures = $meteor.collection(Measures);
        $scope.showAddNew = function() {
            $scope.collapse = !($scope.collapse);
            $scope.buttonStatus = $scope.collapse ? '-' : '+';
        }
        $scope.saveMeasure = function() {
            $scope.measures.save($scope.newMeasure).then(function(number) {
                notificationService.showSuccess("Se ha registrado correctamente la unidad de medida");
            }, function(error){
                notificationService.showError("Error en el registro de unidad de medida");
                console.log(error);
            });
            $scope.newMeasure = '';
            $scope.showAddNew();
        }
    }]);

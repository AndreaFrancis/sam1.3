angular.module("sam-1").controller("MeasuresListCtrl",['$scope','$meteor','ModalService',
    function($scope, $meteor,ModalService) {

        $scope.measures = $meteor.collection(Measures);
        $scope.headers = ['', 'Nombre', 'Simbolo'];

        $scope.showTextSearch = true;
        $scope.showAddNew = function(ev) {
            ModalService.showModal(AddMeasureController, 'client/measures/addMeasure.tmpl.ng.html', ev);
        }
        $scope.toggleSearch = function() {
            $scope.showTextSearch = !$scope.showTextSearch;
        }
    }]);

function AddMeasureController($scope,$mdDialog, $meteor, notificationService) {
    $scope.measures = $meteor.collection(Measures);
    $scope.newMeasure = {};

    $scope.save = function() {
        $scope.measures.save($scope.newMeasure).then(function(number) {
            notificationService.showSuccess("Se ha registrado correctamente la unidad de medida");
        }, function(error){
            notificationService.showError("Error en el registro de unidad de medida");
            console.log(error);
        });
        $scope.newMeasure = '';
        $mdDialog.hide();
    }

    $scope.cancel = function() {
        $mdDialog.cancel();
    }
}
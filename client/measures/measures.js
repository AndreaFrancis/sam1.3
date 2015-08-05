angular.module("sam-1").controller("MeasuresListCtrl",['$scope','$meteor','ModalService',
    function($scope, $meteor,ModalService) {

        $scope.measures = $meteor.collection(Measures, false);
        $scope.headers = ['Nombre', 'Simbolo','Acciones'];

        $scope.showTextSearch = true;
        $scope.showAddNew = function(ev) {
            ModalService.showModal(AddMeasureController, 'client/measures/addMeasure.tmpl.ng.html', ev);
        }
        $scope.toggleSearch = function() {
            $scope.showTextSearch = !$scope.showTextSearch;
        }


        $scope.delete = function(measure) {

        }

        $scope.show = function(measure) {
            alert(measure);
        }
    }]);

function AddMeasureController($scope,$mdDialog, $meteor, notificationService) {
    $scope.measures = $meteor.collection(Measures, false);
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

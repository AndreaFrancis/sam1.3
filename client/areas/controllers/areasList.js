/**
 * Created by Andrea on 08/06/2015.
 */
/**
 * Created by Andrea on 07/06/2015.
 */
angular.module("sam-1").controller("AreasListCtrl",['$scope','$meteor','notificationService','ModalService',
    function($scope, $meteor,notificationService, ModalService) {
        $scope.areas = $meteor.collection(Areas, false);
        $scope.headers = ['', 'Nombre', 'Descripcion', 'Acciones'];

        $scope.showTextSearch = true;
        $scope.showAddNew = function(ev) {
            ModalService.showModal(AddAreaController, 'client/areas/views/addArea.tmpl.ng.html', ev);
        }
        $scope.toggleSearch = function() {
            $scope.showTextSearch = !$scope.showTextSearch;
        }

        $scope.delete = function(area) {

        }

        $scope.show = function(area) {
            alert(area);
        }
    }]);

function AddAreaController($scope, notificationService, $mdDialog, $meteor) {
    $scope.areas = $meteor.collection(Areas);
    $scope.save = function() {
        $scope.areas.save($scope.newArea).then(function(number) {
            notificationService.showSuccess("Se ha registrado correctamente el Area");
        }, function(error){
            notificationService.showError("Error en el registro del area");
            console.log(error);
        });
        $scope.newArea = '';
        $mdDialog.hide();
    }

    $scope.cancel = function() {
        $mdDialog.cancel();
    }
}
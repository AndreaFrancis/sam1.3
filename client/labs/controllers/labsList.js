/**
 * Created by Andrea on 07/06/2015.
 */
angular.module("sam-1").controller("LabsListCtrl",['$scope','$meteor','$rootScope','notificationService','ModalService',
    function($scope, $meteor,  $rootScope,notificationService, ModalService) {
        $scope.labs = $meteor.collection(Labs, false);

        $scope.showTextSearch = true;

        $scope.showAddNew = function(ev) {
            ModalService.showModal(AddLabController, 'client/labs/views/addLab.tmpl.ng.html', ev);
        }

        $scope.toggleSearch = function() {
            $scope.showTextSearch = !$scope.showTextSearch;
        }

        $scope.delete = function(lab) {

        }

        $scope.show = function(lab) {
            alert(lab);
        }
        $scope.headers = ['Nombre', 'Descripcion', 'Acciones'];

    }]);

function AddLabController($scope,$mdDialog, $meteor, notificationService) {
    $scope.labs = $meteor.collection(Labs, false);
    $scope.newLab = {};
    $scope.save = function() {
        $scope.labs.save($scope.newLab).then(function(number) {
            notificationService.showSuccess("Se ha registrado correctamente el laboratorio");
        }, function(error){
            notificationService.showError("Error en el registro del laboratorio");
            console.log(error);
        });
        $scope.newLab = '';
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    }
}

/**
 * Created by Andrea on 24/07/2015.
 */

angular.module("sam-1").controller("ModulesListCtrl",['$scope','$meteor','notificationService','ModalService',
    function($scope, $meteor,notificationService, ModalService) {

        $scope.modules = $meteor.collection(Modules, false);
        $scope.headers = ['', 'Nombre','Prioridad','Url','Roles', 'Acciones'];

        $scope.showTextSearch = true;
        $scope.showAddNew = function(ev) {
            ModalService.showModal(AddModuleController, 'client/modules/addModule.tmpl.ng.html', ev);
        }
        $scope.toggleSearch = function() {
            $scope.showTextSearch = !$scope.showTextSearch;
        }

        $scope.delete = function(module) {

        }

        $scope.show = function(module) {
            alert(module);
        }
    }]);

function AddModuleController($scope, notificationService, $mdDialog, $meteor) {
    $scope.roles = $meteor.collection(RolesData, false);
    $scope.selectedRol = {};
    $scope.selectedRoles = [];
    $scope.modules = $meteor.collection(Modules, false);

    $scope.saveRol = function() {
        $scope.selectedRoles.push($scope.selectedRol);
    }

    $scope.save = function() {
        var rolesToJson = angular.toJson($scope.selectedRoles);
        var rolesToArray = JSON.parse(rolesToJson);
        $scope.newModule.roles = rolesToArray;
        $scope.modules.save($scope.newModule).then(function(number) {
            notificationService.showSuccess("Se ha registrado correctamente el modulo");
        }, function(error){
            notificationService.showError("Error en el registro del modulo");
            console.log(error);
        });
        $scope.newModule = '';
        $mdDialog.hide();
    }

    $scope.cancel = function() {
        $mdDialog.cancel();
    }
}

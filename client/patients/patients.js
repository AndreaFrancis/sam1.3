/**
 * Created by Andrea on 26/07/2015.
 */
angular.module("sam-1").controller("PatientsListCtrl",['$scope','$meteor','notificationService','ModalService',
    function($scope, $meteor,notificationService, ModalService) {
        $scope.patients = $meteor.collection(Patients, false);
        $scope.headers = ['', 'Nombre'];

        $scope.showTextSearch = true;
        $scope.showAddNew = function(ev) {
            ModalService.showModal(AddPatientController, 'client/patients/addPatient.tmpl.ng.html', ev);
        }
        $scope.toggleSearch = function() {
            $scope.showTextSearch = !$scope.showTextSearch;
        }
    }]);

function AddPatientController($scope, notificationService, $mdDialog, $meteor) {
    $scope.patients = $meteor.collection(Patients, false);
    $scope.save = function() {
        $scope.patients.save($scope.newPatient).then(function(number) {
            notificationService.showSuccess("Se ha registrado correctamente el paciente");
        }, function(error){
            notificationService.showError("Error en el registro del paciente");
            console.log(error);
        });
        $scope.newPatient = '';
        $mdDialog.hide();
    }

    $scope.cancel = function() {
        $mdDialog.cancel();
    }
}
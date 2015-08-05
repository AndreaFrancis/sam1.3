/**
 * Created by Andrea on 26/07/2015.
 */
angular.module("sam-1").controller("PatientsListCtrl",['$scope','notificationService','ModalService','$rootScope','$state','$meteor',
    function($scope,notificationService, ModalService, $rootScope, $state, $meteor) {
        $scope.patients = $meteor.collection(Patients, false);
        $scope.headers = ['Ci','Nombre','Apellidos', 'Acciones'];
        $scope.showTextSearch = true;

        $scope.showAddNew = function(ev) {
            ModalService.showModal(AddPatientController, 'client/patients/addPatient.tmpl.ng.html', ev);
        }

        $scope.showPatient = function(patient) {
            $state.go('patient',{patientId:patient._id});
        }

        $scope.delete = function(patient) {

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

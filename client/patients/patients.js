/**
 * Created by Andrea on 26/07/2015.
 */
angular.module("sam-1").controller("PatientsListCtrl",['$scope','$meteor','notificationService','ModalService',
    function($scope, $meteor,notificationService, ModalService, $mdBottomSheet) {
        $scope.patients = $meteor.collection(Patients, false);
        $scope.headers = ['', 'Nombre'];
        $scope.currentPatient = {};

        $scope.showAllPatients = true;
        $scope.showTextSearch = true;

        $scope.showAddNew = function(ev) {
            ModalService.showModal(AddPatientController, 'client/patients/addPatient.tmpl.ng.html', ev);
        }

        $scope.showPatient = function(patient) {
            $scope.showAllPatients = false;
            $scope.currentPatient = patient;
        }

        $scope.addStudy = function($event) {
            ModalService.showModal(AddStudyController, 'client/studies/addStudy.tmpl.ng.html', $event);
        }

    }]);


function AddStudyController($scope, $mdDialog, $meteor) {
    $scope.analisysList = $meteor.collection(function() {
        return Analisys.find({}, {
            transform: function(doc) {
                doc.examsObj = [];
                if(doc.exams) {
                    doc.examsObj = $meteor.collection(function(){
                        return Exams.find({
                            _id: {$in: doc.exams}
                        });
                    }) ;
                }

                doc.analisysObj = [];
                if(doc.analisys) {
                    doc.analisysObj = $meteor.collection(function(){
                        return Analisys.find({
                            _id: {$in: doc.analisys}
                        });
                    }) ;
                }

                return doc;
            }
        });
    });


    $scope.save = function() {
        $mdDialog.hide();
    }

    $scope.cancel = function() {
        $mdDialog.cancel();
    }
}

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
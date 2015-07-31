/**
 * Created by Andrea on 07/06/2015.
 */
angular.module("sam-1").controller("AnalisysListCtrl",['$scope','$meteor','ModalService',
    function($scope, $meteor, ModalService) {
        $scope.analisysList = $meteor.collection(Analisys, false);
        $scope.headers = ['', 'Nombre', 'Acciones'];

        $scope.showTextSearch = true;
        $scope.showAddNew = function(ev) {
            ModalService.showModal(AddAnalisysController, 'client/analisys/views/addAnalisys.tmpl.ng.html', ev);
        }
        $scope.toggleSearch = function() {
            $scope.showTextSearch = !$scope.showTextSearch;
        }

        $scope.delete = function(analisys) {

        }

        $scope.show = function(analisys) {
            alert(analisys);
        }

    }]);

function AddAnalisysController($scope, $meteor, notificationService, $mdDialog) {

    $scope.analisysList = $meteor.collection(Analisys, false);
    $scope.areas = $meteor.collection(Areas);
    $scope.labs = $meteor.collection(Labs);
    $scope.exams = $meteor.collection(Exams);
    $scope.tests = $meteor.collection(Tests);
    $scope.selectedExam = {};
    $scope.selectedExams = [];
    $scope.selectedExamsIds = [];
    $scope.selecetdTestsIds = [];
    $scope.subAnalisysList = $meteor.collection(Analisys);
    $scope.selectedTests = [];
    $scope.selectedTest = {};

    $scope.save = function() {
        var examsToJson = angular.toJson($scope.selectedExamsIds);
        var examsToArray = JSON.parse(examsToJson);
        $scope.newAnalisys.exams = examsToArray;
        var testsToJson = angular.toJson($scope.selecetdTestsIds);
        var testsToArray = JSON.parse(testsToJson);
        $scope.newAnalisys.tests = testsToArray;


        $scope.analisysList.save($scope.newAnalisys).then(function(number) {
            notificationService.showSuccess("Se ha registrado correctamente el Analisis clinico");
        }, function(error){
            notificationService.showError("Error en el registro del area");
            console.log(error);
        });
        $scope.newAnalisys = '';
        $mdDialog.hide();
    }

    $scope.saveExam = function() {
        $scope.selectedExams.push($scope.selectedExam);
        $scope.selectedExamsIds.push($scope.selectedExam._id);
    }

    $scope.saveTest = function() {
        $scope.selectedTests.push($scope.selectedTest);
        $scope.selecetdTestsIds.push($scope.selectedTest._id);
    }

    $scope.cancel = function() {
        $mdDialog.cancel();
    }
}
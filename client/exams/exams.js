/**
 * Created by Andrea on 07/06/2015.
 */
angular.module("sam-1").controller("ExamsListCtrl",['$scope','$meteor','ModalService',
    function($scope, $meteor, ModalService) {
        $scope.exams = $meteor.collection(Exams, false);
        $scope.headers = ['', 'Nombre','Acciones'];

        $scope.showTextSearch = true;
        $scope.showAddNew = function(ev) {
            ModalService.showModal(AddExamController, 'client/exams/addExam.tmpl.ng.html', ev);
        }
        $scope.toggleSearch = function() {
            $scope.showTextSearch = !$scope.showTextSearch;
        }

        $scope.delete = function(exam) {

        }

        $scope.show = function(exam) {
            alert(exam);
        }

    }]);

function AddExamController($scope, $meteor, notificationService, $mdDialog) {

    $scope.exams = $meteor.collection(Exams, false);
    $scope.tests = $meteor.collection(Tests, false);
    $scope.selectedTest = {};
    $scope.selectedTests = [];
    $scope.selectedTestsIds = [];
    $scope.newExam = {};
    $scope.save = function() {
        var testsToJson = angular.toJson($scope.selectedTestsIds);
        var testsToArray = JSON.parse(testsToJson);
        $scope.newExam.tests = testsToArray;
        $scope.exams.save($scope.newExam).then(function(number) {
            notificationService.showSuccess("Se ha registrado correctamente el examen");
        }, function(error){
            notificationService.showError("Error en el registro del Examen");
            console.log(error);
        });
        $scope.newExam = '';
        $mdDialog.hide();
    }

    $scope.saveTest = function() {
        $scope.selectedTests.push($scope.selectedTest);
        $scope.selectedTestsIds.push($scope.selectedTest._id);
    }

    $scope.cancel = function() {
        $mdDialog.cancel();
    }
}
/**
 * Created by Andrea on 17/07/2015.
 */
angular.module("sam-1").controller("ExamsListCtrl",['$scope','$meteor','ModalService',
    function($scope, $meteor, ModalService) {
        $scope.exams = $meteor.collection(Exams);
        $scope.headers = ['', 'Nombre', 'Unidad de medida'];

        $scope.showTextSearch = true;
        $scope.showAddNew = function(ev) {
            ModalService.showModal(AddExamCtrl, 'client/exams/addExam.tmpl.ng.html', ev);
        }
        $scope.toggleSearch = function() {
            $scope.showTextSearch = !$scope.showTextSearch;
        }

    }]);

function AddExamCtrl($scope, $meteor, notificationService, $mdDialog) {
    $scope.typeEvaluations = $meteor.collection(TypeEvaluation);
    $scope.measures = $meteor.collection(Measures);
    $scope.exams = $meteor.collection(Exams);
    $scope.newExam = {};
    $scope.targets = new Array();
    $scope.evaluations = new Array();
    $scope.typeEvaluation = {};
    $scope.newTarget = {};
    $scope.newEvaluation = {};
    $scope.fields = [];


    $scope.saveEvaluation = function() {
        var evaluation = {
            name: $scope.newEvaluation.name,
            type : $scope.typeEvaluation._id
        }
        for(var i= 0; i<$scope.typeEvaluation.fields.length; i++) {
            var fieldName = $scope.typeEvaluation.fields[i];
            evaluation[fieldName] = $scope.fields[i];
        }
        $scope.evaluations.push(evaluation);
        $scope.newEvaluation = {};
        $scope.fields = [];
    }

    $scope.saveTarget = function() {
        $scope.newTarget.evaluations = $scope.evaluations;
        $scope.targets.push($scope.newTarget);
        $scope.newTarget = '';
        $scope.evaluations = [];
    }

    $scope.save = function() {
        var targetsToJson = angular.toJson($scope.targets);
        var targetsToArray = JSON.parse(targetsToJson);
        $scope.newExam.targets = targetsToArray;
        $scope.exams.save($scope.newExam).then(
            function(number){
                notificationService.showSuccess("Se ha registrado correctamente la prueba");
            }, function(error){
                notificationService.showError("Error en el registro de prueba");
                console.log(error);
            }
        );
        $scope.newExam = '';
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    }
}

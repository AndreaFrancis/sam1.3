/**
 * Created by Andrea on 26/07/2015.
 */
angular.module("sam-1").controller("TestsListCtrl",['$scope','$meteor','ModalService',
    function($scope, $meteor, ModalService) {
        $scope.tests = $meteor.collection(Tests, false);
        $scope.headers = ['', 'Nombre', 'Unidad de medida','Acciones'];

        $scope.showTextSearch = true;
        $scope.showAddNew = function(ev) {
            ModalService.showModal(AddTestCtrl, 'client/mtests/addTest.tmpl.ng.html', ev);
        }
        $scope.toggleSearch = function() {
            $scope.showTextSearch = !$scope.showTextSearch;
        }

        $scope.delete = function(test) {

        }

        $scope.show = function(test) {
            alert(test);
        }
    }]);

function AddTestCtrl($scope, $meteor, notificationService, $mdDialog) {
    $scope.typeEvaluations = $meteor.collection(TypeEvaluation);
    $scope.measures = $meteor.collection(Measures);
    $scope.tests = $meteor.collection(Tests, false);
    $scope.newTest = {};
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
        $scope.newTest.targets = targetsToArray;
        $scope.tests.save($scope.newTest).then(
            function(number){
                notificationService.showSuccess("Se ha registrado correctamente la prueba");
            }, function(error){
                notificationService.showError("Error en el registro de prueba");
                console.log(error);
            }
        );
        $scope.newTest = '';
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    }
}

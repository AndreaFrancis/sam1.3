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

    $scope.measures = $meteor.collection(Measures);
    $scope.exams = $meteor.collection(Exams);
    $scope.newExam = {};

    $scope.save = function() {
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
/**
 * Created by Andrea on 26/07/2015.
 */
angular.module("sam-1").controller("ExamsListCtrl",['$scope','$meteor','ModalService',
    function($scope, $meteor, ModalService) {
        $scope.titles = $meteor.collection(Exams, false);

        $scope.exams = $meteor.collection(function() {
            return Exams.find({}, {
                transform: function(doc) {
                    doc.measureSymbol = '';
                    if(doc.measure) {
                        var measureSymbol = $meteor.object(Measures,doc.measure);
                        doc.measureSymbol = measureSymbol.name+" ("+measureSymbol.symbol+")";
                    }
                    return doc;
                }
            });
        }, false);


        $scope.showAddNew = function(ev) {
            ModalService.showModalWithParams(AddExamCtrl, 'client/exams/addExam.tmpl.ng.html', ev,{exam:null});
        }

        $scope.delete = function(exam) {
          Exams.update(exam._id, {
            $set: {active: false}
          });
        }
        $scope.show = function(selectedExam, ev) {
            ModalService.showModalWithParams(AddExamCtrl, 'client/exams/addExam.tmpl.ng.html', ev,{exam:selectedExam});
        }
    }]);

function AddExamCtrl($scope, $meteor, notificationService, exam,$mdDialog) {
    if(exam){
      $scope.exam = exam;
    }else{
      $scope.exam = {};
      $scope.exam.ranges = [];
    }
    $scope.ranges = $meteor.collection(Ranges, false);
    $scope.typeEvaluations = $meteor.collection(TypeEvaluation,false);
    $scope.measures = $meteor.collection(Measures);
    $scope.exams = $meteor.collection(Exams, false);
    $scope.fields = [];



    $scope.saveRange = function() {
        var range = {
            name: $scope.newRange.name,
            type : $scope.selectedType._id,
            fields : []
        }
        for(var i= 0; i<$scope.selectedType.fields.length; i++) {

            var fieldName = $scope.selectedType.fields[i];
            var fieldValue = $scope.fields[i];
            var field = {name: fieldName, value: fieldValue};
            range.fields.push(field);
        }
        $scope.exam.ranges.push(range);
        $scope.newRange = {};
        $scope.fields = [];
    }

    $scope.deleteRange = function(index){
      $scope.exam.ranges.splice(index,1);
    }

    $scope.save = function() {
        $scope.exams.save($scope.exam).then(
            function(number){
                notificationService.showSuccess("Se ha registrado correctamente el examen");
            }, function(error){
                notificationService.showError("Error en el registro de examen");
                console.log(error);
            }
        );
        $scope.exam = '';
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    }
}

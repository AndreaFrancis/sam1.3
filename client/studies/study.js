/**
 * Created by Andrea on 30/07/2015.
 */
/**
 * Created by Andrea on 28/07/2015.
 */
angular.module("sam-1").controller("StudyCtrl", ['$scope', '$stateParams','$meteor','ModalService','$state','RangeEvaluator',
    function($scope, $stateParams, $meteor, ModalService, $state, RangeEvaluator){

        if($stateParams.studyId){
          $scope.isExistingStudy = true;
          $scope.study = $meteor.object(Studies, $stateParams.studyId, false);
          var doctor = $meteor.object(Doctors, $scope.study.doctor);
          $scope.study.doctorObj = function(){
            return doctor.lastName + " "+ doctor.name;
          }
          $scope.selectedAttention = $meteor.object(Attentions, $scope.study.attention);
          $scope.selectedService = $meteor.object(Services, $scope.study.service);

        }

        angular.forEach($scope.study.analisys, function(analisys){
            var analisysName = $meteor.object(Analisys, analisys.analisys);
            analisys.name = function(){
              return analisysName.name;
            }
            angular.forEach(analisys.titles, function(title){
                var titleName = $meteor.object(Titles, title.title);
                title.name = function(){
                  return titleName.name;
                };
                angular.forEach(title.exams, function(exam){
                    var examTitle = $meteor.object(Exams, exam.exam);
                    exam.name = function(){
                      return examTitle.name;
                    }
                    if(examTitle.measure){
                      var measure = $meteor.object(Measures,examTitle.measure);
                      exam.symbol = function(){
                        return measure.symbol;
                      }
                    }
                    if(examTitle.ranges){
                      angular.forEach(examTitle.ranges, function(range){
                        range.typeName = function(){
                            return $meteor.object(TypeEvaluation, range.type,false).name;
                        }
                      });

                      exam.ranges = function(){
                        return examTitle.ranges;
                      }

                    }
                });
            });
        });

        $scope.patient = $meteor.object(Patients, $scope.study.patient);
        $scope.creator = $meteor.object(Users, $scope.study.creatorId);
        $scope.bioquimic = {};
        $scope.isSecretary = localStorage.getItem("rol") == "Secretario";
        $scope.isBioquimic = localStorage.getItem("rol") == "Bioquimico";
        $scope.isDoctor = localStorage.getItem("rol") == "Doctor";


        $scope.bioquimics = $meteor.collection(function(){
            var bios = Users.find({"profile.mainRol": "Bioquimico"});
            return bios;
        });

        var creatorName = $meteor.collection(function(){
            return Users.find({roles: {"$in": ['Bioquimico']}});
        });

        $scope.goStudies = function(){
            $state.go('studies');
        }

        $scope.evaluateRange = function(exam){
            exam.detail = RangeEvaluator.evaluateRange(exam);
        }

        $scope.save = function(exam) {
          var detail = "";
          var ranges = exam.ranges();

          angular.forEach(ranges,function(range){
              var typeEvaluation = $meteor.object(TypeEvaluation, range.type, false);
              var keyEvaluation = typeEvaluation.name;
              var evaluator = RangeEvaluator.evaluatorsMap[keyEvaluation];
              if(evaluator){
                var detail = evaluator(exam.result, range);
                exam.detail = detail.result;
                exam.state = detail.correct;
              }
          });
          $scope.study.save();
        }

        $scope.printContainer = function(){
          var newWin= window.open("");
          newWin.document.write("<b>Doctor (a): </b>"+$scope.study.doctorObj()+"<br>");
          newWin.document.write("<b>Paciente: </b>"+$scope.patient.lastName+" "+
          $scope.patient.lastNameMother+" "+$scope.patient.name+"<br>");
          newWin.document.write("<b>Tipo de paciente: </b>"+$scope.selectedAttention.name+"<br>");
          newWin.document.write("<b>Servicio de procedencia: </b>"+$scope.selectedService.name+"<br>");
          newWin.print();
          newWin.close();
        }

    }]);

/**
 * Created by Andrea on 30/07/2015.
 */
/**
 * Created by Andrea on 28/07/2015.
 */
angular.module("sam-1").controller("StudyCtrl", ['$scope', '$stateParams','$meteor','ModalService','$state','RangeEvaluator','TextEvaluatorService',
    function($scope, $stateParams, $meteor, ModalService, $state, RangeEvaluator, TextEvaluatorService){

        if($stateParams.studyId){
          $scope.isExistingStudy = true;
          $scope.study = $meteor.object(Studies, $stateParams.studyId, false);
          var doctor = $meteor.object(Doctors, $scope.study.doctor);

          $scope.study.doctorObj = function(){
            return doctor.lastName + " "+ doctor.name;
          }

          $scope.selectedAttention = $meteor.object(Attentions, $scope.study.attention);
          $scope.selectedService = $meteor.object(Services, $scope.study.service);

          //Fill analisis, titles, exams
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

                    if(!!exam.historial){
                      var lastModifier = exam.historial.length-1;
                      if(lastModifier>=0){
                        var userId = exam.historial[lastModifier].user;
                        var responsible = $meteor.object(Users, userId);
                        exam.responsible =   responsible.username;
                      }
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

        }

        //Extra data
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

        $scope.showHistorial = function(exam, ev){
          ModalService.showModalWithParams(HistorialController,  'client/studies/historial.tmpl.ng.html',ev, {exam:exam});
        }

        $scope.goStudies = function(){
            $state.go('studies');
        }

        $scope.evaluateRange = function(exam){
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
          //Historial
          var userAsigned = localStorage.getItem("user"); //Change if is a secretary
          var partialRecord = {};
          partialRecord.value = exam.result;
          partialRecord.user = userAsigned;
          partialRecord.date = new Date();
          exam.historial.push(partialRecord);
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
        $scope.printStudy = function(){
          var newWin= window.open("");
          newWin.document.write("<html><head><meta http-equiv='Content-Type' content='text/html; charset=UTF-8'><style type='text/css'>table {width:100%} table, th, td {border: 1px solid black;}</style></head><body>");
          newWin.document.write("<h1>Resultado de examenes</h1>");
          newWin.document.write("<h1>"+$scope.study.dailyCode+"</h1>");
          newWin.document.write("<hr>");
          newWin.document.write("<b>Paciente: </b>"+$scope.patient.lastName+" "+
          $scope.patient.lastNameMother+" "+$scope.patient.name+"<br>");
          newWin.document.write("<b>Doctor: </b>"+$scope.study.doctorObj()+"<br>");
          var gender = $scope.patient.gender == "F"? "Femenino": "Masculino";
          newWin.document.write("<b>Sexo: </b>"+gender+"<br>");
          if(!!$scope.patient.birthdate){
            newWin.document.write("<b>Edad: </b>"+$scope.calculateAge($scope.patient.birthdate)+"<br>");
          }
          if(!!$scope.patient.medHis){
            newWin.document.write("<b>H.C: </b>"+$scope.patient.medHis+"<br>");
          }
          newWin.document.write("<b>C.I: </b>"+$scope.patient.ci+"<br>");
          newWin.document.write("<b>Fecha de creación: </b>"+$scope.study.creationDate+"<br>");
          newWin.document.write("<b>Muestras: </b>"+$scope.study.shows+"<br>");
          if(!!$scope.study.bill){
            newWin.document.write("<b>Numero de recibo: </b>"+$scope.study.bill+"<br>");
          }
          newWin.document.write("<hr>");
          angular.forEach($scope.study.analisys, function(analisys){
              newWin.document.write("<h2>"+analisys.name()+"</h2>");
              angular.forEach(analisys.titles, function(title){
                newWin.document.write("<h3>"+title.name()+"<h3>");
                newWin.document.write("<table>");
                newWin.document.write("<tr><th>Examen</th><th>Resultado</th><th>Referencia</th><th>Detalle</th></tr>");
                  angular.forEach(title.exams, function(exam){
                    newWin.document.write("<tr>");
                    //Exam name
                    newWin.document.write("<td>"+exam.name()+"</td>");
                    //Result
                    newWin.document.write("<td>"+TextEvaluatorService.getTextEvenIfNullOrUndef(exam.result)+"</td>");
                    //Reference
                    if(exam.ranges()){
                      newWin.document.write("<td>");
                        angular.forEach(exam.ranges(), function(range){
                          var rangeText = range.name+" - "+range.typeName()+" ";
                          angular.forEach(range.fields, function(field){
                            rangeText+= field.name+": "+field.value+" ";
                          });
                          newWin.document.write("<p>"+rangeText+"</p>");
                        });

                      newWin.document.write("</td>");
                    }
                    //Details
                    newWin.document.write("<td>"+TextEvaluatorService.getTextEvenIfNullOrUndef(exam.detail)+"</td>");

                    newWin.document.write("</tr>");
                  });
                newWin.document.write("</table>");
              });
          });
          newWin.document.write("</body></html>");
          newWin.print();
          newWin.close();
        }

        // methods
        
        $scope.calculateAge = function getAge(date) {
          var dateString = date.toString();
          var birthdate = new Date(dateString).getTime();
          var now = new Date().getTime();
          var n = (now - birthdate)/1000;
          if (n < 604800) { // less than a week
            var day_n = Math.floor(n/86400);
            return day_n + ' dia' + (day_n > 1 ? 's' : '');
          } else if (n < 2629743) {  // less than a month
            var week_n = Math.floor(n/604800);
            return week_n + ' semana' + (week_n > 1 ? 's' : '');
          } else if (n < 63113852) { // less than 24 months
            var month_n = Math.floor(n/2629743);
            return month_n + ' mes' + (month_n > 1 ? 'es' : '');
          } else {
            var year_n = Math.floor(n/31556926);
            return year_n + ' año' + (year_n > 1 ? 's' : '');
          }
        }


    }]);


function HistorialController($scope,$mdDialog, exam, $meteor, DateService) {
        if(exam) {
          $scope.exam = exam;
        }
        $scope.dateService = DateService;
        angular.forEach($scope.exam.historial, function(modification){
          var user = $meteor.object(Users, modification.user);
          modification.userName = user.profile.name||"" + " "+ user.profile.lastName||"";
        });

        $scope.cancel = function() {
            $mdDialog.cancel();
        }
}

function verifyText(textToVerify){
  var text = "";
  if(!!textToVerify){
    text = textToVerify;
  }
  return text;
}
/**
 * Created by Andrea on 30/07/2015.
 */
/**
 * Created by Andrea on 28/07/2015.
 */
angular.module("sam-1").controller("StudyCtrl", ['$scope', '$stateParams','$meteor','ModalService','$state','RangeEvaluator','TextEvaluatorService','notificationService',
    function($scope, $stateParams, $meteor, ModalService, $state, RangeEvaluator, TextEvaluatorService,notificationService){
        $scope.myLab = localStorage.getItem("lab");
        var userRol = localStorage.getItem("rolName");
        $scope.isBioquimic = userRol=="Bioquimico";
        $scope.isDoctor = userRol=="Doctor";
        $scope.studies = $meteor.collection(Studies,false);
        if($stateParams.studyId){
          $scope.isExistingStudy = true;
          //$scope.study = $meteor.object(Studies, $stateParams.studyId, false);

          /*var doctor = $meteor.object(Doctors, $scope.study.doctor);

          $scope.study.doctorObj = function(){
            return doctor.lastName + " "+ doctor.name;
          }*/
          var doc = $meteor.object(Studies, $stateParams.studyId);

          //$scope.studies = $meteor.collection(function() {
            //  return Studies.find({_id:$stateParams.studyId}, {
              //    transform: function(doc) {
                      doc.patientObj = {};
                      if(doc.patient) {
                          var patientObj = $meteor.collection(function(){
                              return Patients.find({_id: {"$in": [doc.patient]}});
                          });
                          if(patientObj[0]) {
                            doc.patientObj = patientObj[0];
                          }
                      }



                      doc.doctorObj = {};
                      if(!!doc.doctor){
                        var doctorObj = $meteor.collection(function(){
                            return Doctors.find({_id: {"$in": [doc.doctor]}});
                        });
                        if(doctorObj[0]) {
                          doc.doctorObj = doctorObj[0];
                        }
                      }

                      doc.creatorName = {};
                      if(doc.creatorId) {
                          var creatorName = $meteor.collection(function(){
                              return Users.find({_id: {"$in": [doc.creatorId]}});
                          });
                          if(creatorName[0]) {
                              doc.creatorName = creatorName[0].profile.name + " "+ creatorName[0].profile.lastName;
                          }
                      }
                      doc.serviceName = {};
                      if(doc.service) {
                          var service = $meteor.object(Services, doc.service);
                          if(service) {
                              doc.serviceName = service.name;
                          }
                      }
                      doc.attentionName = {};
                      if(doc.attention) {
                          var attention = $meteor.object(Attentions, doc.attention);
                          if(attention) {
                              doc.attentionName = attention.name;
                          }
                      }
                      //return doc;
                  //}
              //});
          //}, false);
          $scope.study = doc;
          //$scope.study = $scope.studies[0];

          $scope.selectedAttention = $meteor.object(Attentions, $scope.study.attention);
          $scope.selectedService = $meteor.object(Services, $scope.study.service);

          //Fill analisis, titles, exams
          angular.forEach($scope.study.analisys, function(analisys){
            var analisysName = $meteor.object(Analisys, analisys.analisys);
            analisys.lab = function(){
              return analisysName.lab;
            }
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
        //$scope.patient = $meteor.object(Patients, $scope.study.patient);
        //$scope.creator = $meteor.object(Users, $scope.study.creatorId);
        $scope.bioquimic = {};
        //$scope.isSecretary = localStorage.getItem("rol") == "Secretario";
        //$scope.isBioquimic = localStorage.getItem("rol") == "Bioquimico";
        //$scope.isDoctor = localStorage.getItem("rol") == "Doctor";


        $scope.bioquimics = $meteor.collection(function(){
            var bios = Users.find({"profile.mainRol": "Bioquimico"});
            return bios;
        });

        /*var creatorName = $meteor.collection(function(){
            return Users.find({roles: {"$in": ['Bioquimico']}});
        });*/

        $scope.saveStudy = function(event){
          delete $scope.study.patientObj;
          delete $scope.study.doctorObj;
          delete $scope.study.creatorName;
          delete $scope.study.serviceName;
          delete $scope.study.attentionName;

          $scope.studies.save($scope.study).then(function(number) {
              notificationService.showSuccess("Se ha guardado correctamente el estudio");
          }, function(error){
              notificationService.showError("Error en el registro del estudio");
              console.log(error);
          });
        }
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
          $scope.studies.save($scope.study);

        }



        $scope.printContainer = function(){
          var newWin= window.open("");
          var style = "<style type='text/css'>table {width:100%} table, th, td {border: 1px solid black;}"+
                      "body {font-family: 'Verdana', Geneva, sans-serif;font-size:8pt}"+
                      "li {content: '»';}"+
                      "header nav, footer {display: none;}"+
                      "h2 {text-align: right;}"+
                      "@page {size: auto;margin: 0mm;}"+
                      " body { margin: 1.6cm; }"+
                      "</style>";
          newWin.document.write("<html><head><meta http-equiv='Content-Type' content='text/html; charset=UTF-8'>"+style+"</head><body>");
          newWin.document.write("<h2>Instituto de Gastroenterología Boliviano Japonés</h2>");
          newWin.document.write("<b>Doctor (a): </b>"+$scope.study.doctorObj.lastName+" "+$scope.study.doctorObj.name+"<br>");
          newWin.document.write("<b>Paciente: </b>"+$scope.study.patientObj.lastName+" "+
          $scope.study.patientObj.lastNameMother+" "+$scope.study.patientObj.name+"<br>");
          newWin.document.write("<b>Tipo de paciente: </b>"+$scope.selectedAttention.name+"<br>");
          newWin.document.write("<b>Servicio de procedencia: </b>"+$scope.selectedService.name+"<br>");
          newWin.document.write(new Date().toLocaleString());
          newWin.document.write("</body></html>");
          newWin.print();
          newWin.close();
        }

        $scope.printOrder = function(){
          var newWin= window.open("");
          var style = "<style type='text/css'>table {width:100%} table, th, td {border: 1px solid black;}"+
                      "body {font-family: 'Verdana', Geneva, sans-serif;font-size:8pt}"+
                      "li {content: '»';}"+
                      "header nav, footer {display: none;}"+
                      "h1 {text-align: center;}"+
                      "@page {size: auto;margin: 0mm;}"+
                      " body { margin: 1.6cm; }"+
                      "</style>";
          newWin.document.write("<html><head><meta http-equiv='Content-Type' content='text/html; charset=UTF-8'>"+style+"</head><body>");
          newWin.document.write("<h1>Orden de analisis</h1>");
          newWin.document.write("<hr>");
          newWin.document.write("<b>Paciente: </b>"+$scope.study.patientObj.lastName+" "+
          $scope.study.patientObj.lastNameMother+" "+$scope.study.patientObj.name+"<br>");
          newWin.document.write("<b>Doctor: </b>"+$scope.study.doctorObj.lastName+" "+$scope.study.doctorObj.name+"<br>");
          var gender = $scope.study.patientObj.gender == "F"? "Femenino": "Masculino";
          newWin.document.write("<b>Sexo: </b>"+gender+"<br>");
          newWin.document.write("<b>Fecha: </b>"+$scope.study.creationDate.toLocaleString()+"<br>");
          if(!!$scope.study.patientObj.birthdate){
            newWin.document.write("<b>Edad: </b>"+$scope.calculateAge($scope.study.patientObj.birthdate)+"<br>");
          }
          newWin.document.write("<hr>");
          angular.forEach($scope.study.analisys, function(analisys){
              newWin.document.write("<h3>"+analisys.name()+"</h3>");
              angular.forEach(analisys.titles, function(title){
                newWin.document.write("<b>"+title.name()+"</b></br>");
                newWin.document.write("<ul>");
                  angular.forEach(title.exams, function(exam){
                    newWin.document.write("<li>"+exam.name()+"</li>");
                  });
                newWin.document.write("</ul>");
              });
              newWin.document.write("<hr>");
          });
          newWin.document.write("</body></html>");
          newWin.print();
          newWin.close();
        }

        $scope.printStudy = function(){
          var newWin= window.open("");
          var width = localStorage.getItem("width");
          var heigth = localStorage.getItem("heigth");
          var style = "<style type='text/css'>table {width:100%} table, th, td {border: 1px solid black;}"+
                      "body {font-family: 'Verdana', Geneva, sans-serif;font-size:4pt}"+
                      "header nav, footer {display: none;}"+
                      "table {font-size:4pt; border-collapse:collapse}"+
                      "h1 {text-align: center}"+
                      ".header {text-align: right;}"+
                      "@page {size:"+width+"cm "+heigth+"cm;margin: 3mm;}"+
                      " .break { page-break-after: always; }"+
                      " body {  }"+
                      " tr {page-break-inside: avoid !important;} "+
                      "</style>";
                      //"@page {size: auto;margin: 1.6cm 1.6cm 10cm 1.6cm;}"+
          newWin.document.write("<html><head><meta http-equiv='Content-Type' content='text/html; charset=UTF-8'>"+style+"</head><body>")
          newWin.document.write("<tr>");
          newWin.document.write("<table>");
          newWin.document.write("<td>");
          newWin.document.write("<b class='header'>COMPLEJO HOSPITALARIO VIEDMA</b><br/>");
          newWin.document.write("<b class='header'>Instituto de Gastroenterología Boliviano Japonés</b><br/>");
          newWin.document.write("<b class='header'>Cochabamba - Bolivia</b><br/>");
          newWin.document.write("</td>");
          newWin.document.write("<td>");
          newWin.document.write("<h1>"+verifyText($scope.study.dailyCode)+"</h1>");
          newWin.document.write("</td>");
          newWin.document.write("</tr>");
          newWin.document.write("</table>");
          newWin.document.write("<h1>Resultado de examenes</h1>");
          newWin.document.write("<hr>");
          newWin.document.write("<b>Paciente: </b>"+$scope.study.patientObj.lastName+" "+
          $scope.study.patientObj.lastNameMother+" "+$scope.study.patientObj.name+"<br>");
          newWin.document.write("<b>Doctor: </b>"+$scope.study.doctorObj.lastName+" "+$scope.study.doctorObj.name+"<br>");
          var gender = $scope.study.patientObj.gender == "F"? "Femenino": "Masculino";
          newWin.document.write("<b>Sexo: </b>"+gender+"<br>");
          if(!!$scope.study.patientObj.birthdate){
            newWin.document.write("<b>Edad: </b>"+$scope.calculateAge($scope.study.patientObj.birthdate)+"<br>");
          }
          if(!!$scope.study.medHis){
            newWin.document.write("<b>H.C: </b>"+$scope.study.medHis||""+"<br>");
          }
          newWin.document.write("<b>C.I: </b>"+$scope.study.patientObj.ci+"<br>");
          newWin.document.write("<b>Fecha de creación: </b>"+$scope.study.creationDate.toLocaleString()+"<br>");
          newWin.document.write("<b>Muestras: </b>"+verifyText($scope.study.shows)+"<br>");
          if(!!$scope.study.bill){
            newWin.document.write("<b>Numero de recibo: </b>"+$scope.study.bill||""+"<br>");
          }
          newWin.document.write("<hr>");
          angular.forEach($scope.study.analisys, function(analisys){
              newWin.document.write("<h3>"+analisys.name()+"</h3>");
              angular.forEach(analisys.titles, function(title){
                newWin.document.write("<b>"+title.name()+"<b><br/>");
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
                newWin.document.write("<br class=”break”/>");
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

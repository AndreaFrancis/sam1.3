/**
 * Created by Andrea on 28/07/2015.
 */
angular.module("sam-1").controller("PatientCtrl", ['$scope', '$stateParams','$meteor','ModalService','$state',
    function($scope, $stateParams, $meteor, ModalService, $state){
        $scope.patient = $meteor.object(Patients, $stateParams.patientId);
        $scope.studies = $meteor.collection(function(){
            return Studies.find({patient:  $scope.patient._id}, {
                transform: function(doc){
                    doc.creatorName = {};
                    if(doc.creatorId) {
                        var creatorName = $meteor.collection(function(){
                            return Users.find({_id: {"$in": [doc.creatorId]}});
                        });
                        if(creatorName[0]) {
                            doc.creatorName = creatorName[0].profile.name + " "+ creatorName[0].profile.lastName;
                        }
                    }
                    return doc;
                }
            });
        }, false);

        $scope.goPatients = function(){
            $state.go('patients');
        }

        $scope.addStudy = function($event) {
            $state.go('newstudy',{patientId:$scope.patient._id});
            //ModalService.showModalWithParams(AddStudyController, 'client/studies/addStudy.tmpl.ng.html', $event, {patient:$scope.patient});
        }

        $scope.show = function(study){
          $state.go('study',{studyId:study._id});
        }

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

function AddStudyController($scope, $mdDialog, $meteor, notificationService, patient) {
    $scope.isDoctor = localStorage.getItem("rol") == "Doctor";
    $scope.existingStudy = false;
    if(patient){
        $scope.patient = patient;
        $scope.existingStudy = true;
    }
    $scope.studies = $meteor.collection(Studies, false);
    $scope.analisysList = $meteor.collection(function() {
        return Analisys.find({}, {
            transform: function(doc) {
                doc.examsObj = [];
                if(doc.exams) {
                    doc.examsObj = $meteor.collection(function(){
                        return Exams.find({
                                _id: {$in: doc.exams}
                            },{
                                transform: function(doc) {
                                    doc.testsObj = [];
                                    if(doc.tests) {
                                        doc.testsObj = $meteor.collection(function(){
                                            return Tests.find({
                                                _id: {$in: doc.tests}
                                            }) ;
                                        }, false);
                                    }
                                    return doc;
                                }
                            }
                        );
                    }, false) ;
                }

                doc.testsObj = [];
                if(doc.tests) {
                    doc.testsObj = $meteor.collection(function(){
                        return Tests.find({
                            _id: {$in: doc.tests}
                        });
                    }, false) ;
                }


                return doc;
            }
        });
    }, false);

    $scope.selectAnalisys = function(analisys) {
        angular.forEach(analisys.testsObj, function(test) {
            test.selected = !analisys.selected;
        });
        angular.forEach(analisys.examsObj, function(exam) {
            $scope.selectExam(exam);
            exam.selected = !analisys.selected;
        });
    };

    $scope.selectExam = function(exam) {
        angular.forEach(exam.testsObj, function(test) {
            test.selected = !exam.selected;
        });
    }

    $scope.save = function() {
        var study = {};
        study.analisys = [];
        angular.forEach($scope.analisysList, function(analisys)  {
            var isAnalisysSelected = false;
            var component = {};
            component.tests = [];
            component.exams = [];
            console.log(analisys.name+":"+analisys.selected);
            angular.forEach(analisys.testsObj, function(test){
                if(test.selected && !isAnalisysSelected){
                    isAnalisysSelected = true;
                    component.analisys = analisys._id;
                };
                if(test.selected) {
                    component.tests.push({test:test._id});
                }
            });
            angular.forEach(analisys.examsObj, function(exam){
                var isExamSelected = false;
                if(exam.selected && !isAnalisysSelected){
                    isAnalisysSelected = true;
                    component.analisys = analisys._id;
                };

                var examComponent = {};
                angular.forEach(exam.testsObj, function(testEx){
                    if(testEx.selected && !isExamSelected){
                        isExamSelected = true;
                        if(!isAnalisysSelected) {
                            isAnalisysSelected = true;
                            component.analisys = analisys._id;
                        }
                        examComponent.exam = exam._id;
                        examComponent.tests = [];
                    };
                    if(testEx.selected) {
                        examComponent.tests.push({test:testEx._id});
                    }
                });

                if(isExamSelected) {
                    examComponent.exam = exam._id;
                    component.exams.push(examComponent);
                }
            });
            if(isAnalisysSelected){
                study.analisys.push(component);
            }
        });
        if(localStorage.getItem("rol") == "Doctor"){
            study.doctorUser = localStorage.getItem("user");
        }

        study.creatorId = localStorage.getItem("user");
        study.creationDate = new Date();
        study.patient = $scope.patient._id;
        $scope.studies.save(study).then(function(number) {
            notificationService.showSuccess("Se ha registrado correctamente el estudio");
        }, function(error){
            notificationService.showError("Error en el registro del estudio");
            console.log(error);
        });
        $mdDialog.hide();
    }

    $scope.cancel = function() {
        $mdDialog.cancel();
    }
}

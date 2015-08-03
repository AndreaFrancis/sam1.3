/**
 * Created by Andrea on 26/07/2015.
 */

angular.module("sam-1").controller("StudiesListCtrl",['$scope','$meteor','notificationService','ModalService','$state',
    function($scope, $meteor,notificationService, ModalService, $state) {

        var query = {}


        if(localStorage.getItem("rol") == "Bioquimico"){
            query = {bioquimic: localStorage.getItem("user")};
        }

        if(localStorage.getItem("rol") == "Doctor"){
            query = {creatorId: localStorage.getItem("user")};
        }

        $scope.studies = $meteor.collection(function() {
            return Studies.find(query, {
                transform: function(doc) {
                    doc.patientObj = {};
                    if(doc.patient) {
                        var patientObj = $meteor.collection(function(){
                            return Patients.find({_id: {"$in": [doc.patient]}});
                        });
                        doc.patientObj = patientObj[0];
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

                    return doc;
                }
            });
        }, false);

        $scope.show = function(study) {
            $state.go('study',{studyId:study._id});
        }

        $scope.showAddNew = function($event) {
            ModalService.showModalWithParams(AddStudyController, 'client/studies/addStudy.tmpl.ng.html', $event, {patient:null});
        }
    }]);
function AddStudyController($scope, $mdDialog, $meteor, notificationService, patient, $timeout, $q, $log) {
    $scope.isDoctor = localStorage.getItem("rol") == "Doctor";
    $scope.existingStudy = false;
    $scope.newDoctor = {};
    if(patient){
        $scope.patient = patient;
        $scope.existingStudy = true;
    }else{
        $scope.patients = $meteor.collection(
        function() {
            return Patients.find({}, {
                transform: function(doc) {
                    doc.value = doc.name + " " + doc.lastName+ " "+ doc.lastNameMother;
                    return doc;
                }
            });
        }, false);
    }

    if(!$scope.isDoctor) {
        $scope.doctors = $meteor.collection(function(){
            return Doctors.find({}, {
                transform: function(doc) {
                    if(doc.userId) {
                        var user = Users.findOne({_id: doc.userId});
                        doc.name = user.profile.name;
                        doc.lastName = user.profile.lastName;
                    }
                    return doc;
                }
            });
        }, false);
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
                    component.tests.push(test._id);
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
                        examComponent.tests.push(testEx._id);
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

        if(!$scope.isDoctor){
            study.doctor = $scope.selectedDoctor._id;
        }
        study.creatorId = localStorage.getItem("user");
        study.creationDate = new Date();
        if($scope.patient) {
            study.patient = $scope.patient._id;
        }else {
            study.patient = $scope.selectedItem._id;
        }

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

    $scope.saveNewDoctor = function(){
        $scope.doctors.save($scope.newDoctor).then(function(number) {

        }, function(error){
            notificationService.showError("Error en el registro del rol");
            console.log(error);
        });
        $scope.newDoctor = '';
        $scope.createNewDoctor = false;
    }

    /**AUTOCOMPLETE**/
    $scope.isDisabled    = false;

    $scope.querySearch = function (query) {
        return query ? $scope.patients.filter( createFilterFor(query) ) : $scope.patients;
    }
    $scope.selectedItemChange = function(item) {
        $log.info('Item changed to ' + JSON.stringify(item));
    }

    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(item) {
            return (item.value.toLowerCase().indexOf(lowercaseQuery) === 0);
        };
    }

    $scope.queryDoctors = function(query) {
        return query ? $scope.doctors.filter( createFilterForDoctor(query) ) : $scope.doctors;
    }

    function createFilterForDoctor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(item) {
            return (item.name.toLowerCase().indexOf(lowercaseQuery) === 0);
        };
    }

}
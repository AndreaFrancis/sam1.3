/**
 * Created by Andrea on 26/07/2015.
 */

angular.module("sam-1").controller("StudiesListCtrl",['$scope','$meteor','notificationService','ModalService',
    function($scope, $meteor,notificationService, ModalService) {
        $scope.studies = $meteor.collection(function() {
            return Studies.find({}, {
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


        $scope.showAddNew = function($event) {
            ModalService.showModalWithParams(AddStudyController, 'client/studies/addStudy.tmpl.ng.html', $event, {patient:null});
        }
    }]);


function AddStudyController($scope, $mdDialog, $meteor, notificationService, patient, $timeout, $q, $log) {
    $scope.isDoctor = localStorage.getItem("rol") == "Doctor";
    if(patient){
        $scope.patient = patient;
    }else{
        $scope.patients = $meteor.collection(Patients,false);
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

    /**TESTING AUTOCOMPLETE**/
    $scope.isDisabled    = false;
    $scope.repos         = loadAll();
    $scope.querySearch   = querySearch;
    $scope.selectedItemChange = selectedItemChange;
    $scope.searchTextChange   = searchTextChange;
    // ******************************
    // Internal methods
    // ******************************
    /**
     * Search for repos... use $timeout to simulate
     * remote dataservice call.
     */
    function querySearch (query) {
        //return query ? $scope.repos.filter( createFilterFor(query) ) : $scope.repos;
        return query ? $scope.patients.filter( createFilterFor(query) ) : $scope.patients;
    }
    function searchTextChange(text) {
        $log.info('Text changed to ' + text);
    }
    function selectedItemChange(item) {
        $log.info('Item changed to ' + JSON.stringify(item));
    }
    /**
     * Build `components` list of key/value pairs
     */
    function loadAll() {
        var repos = [
            {
                'name'      : 'Angular 1',
                'url'       : 'https://github.com/angular/angular.js',
                'watchers'  : '3,623',
                'forks'     : '16,175'
            },
            {
                'name'      : 'Angular 2',
                'url'       : 'https://github.com/angular/angular',
                'watchers'  : '469',
                'forks'     : '760'
            },
            {
                'name'      : 'Angular Material',
                'url'       : 'https://github.com/angular/material',
                'watchers'  : '727',
                'forks'     : '1,241'
            },
            {
                'name'      : 'Bower Material',
                'url'       : 'https://github.com/angular/bower-material',
                'watchers'  : '42',
                'forks'     : '84'
            },
            {
                'name'      : 'Material Start',
                'url'       : 'https://github.com/angular/material-start',
                'watchers'  : '81',
                'forks'     : '303'
            }
        ];
        return repos.map( function (repo) {
            repo.value = repo.name.toLowerCase();
            return repo;
        });
    }
    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(item) {
            return (item.value.indexOf(lowercaseQuery) === 0);
        };
    }


}
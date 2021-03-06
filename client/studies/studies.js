/**
 * Created by Andrea on 26/07/2015.
 */

angular.module("sam-1").controller("StudiesListCtrl",['$scope','$meteor','notificationService','ModalService','$state',
    function($scope, $meteor,notificationService, ModalService, $state) {

        var query = {}
        $scope.headers = ["Codigo", "Paciente", "Fecha"];

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

        $scope.show = function(study, ev) {
            $state.go('study',{studyId:study._id});
        }

        $scope.showAddNew = function($event) {
            $state.go('newstudy',{patientId:null});
        }
    }]);


angular.module("sam-1").controller("AddStudyController",AddStudyController);
function AddStudyController($scope, $meteor, notificationService, $stateParams, ModalService,$state, CONDITIONS) {
    var patientId =  $stateParams.patientId;
    //$scope.isDoctor = localStorage.getItem("rol") == "Doctor";
    $scope.study = {};
    $scope.existingPatient = false;
    $scope.existingDoctor = false;
    $scope.newDoctor = {};
    if(patientId){
        $scope.patient = $meteor.object(Patients, patientId);
        $scope.existingPatient = true;
    }else{
        $scope.study = {};
        $scope.study.creationDate = new Date();
        $scope.study.internData = {};
        $scope.patients = $meteor.collection(
        function() {
            return Patients.find({}, {
                transform: function(doc) {
                    doc.value = (doc.lastName||"")+ " "+ (doc.lastNameMother||"") + " "+doc.name;
                    return doc;
                }
            });
        }, false);
    }

    $scope.attentions = $meteor.collection(Attentions, false);
    $scope.services = $meteor.collection(Services, false);
    $scope.doctors = $meteor.collection(function(){
      return Doctors.find({},{
        transform: function(doc){
          doc.value = doc.name +" "+ doc.lastName;
          return doc;
        }
      });
    }, false);

    $scope.studies = $meteor.collection(Studies, false);
    $scope.analisysList = $meteor.collection(function(){
      return Analisys.find({active:true},{
          transform: function(anDoc){
            anDoc.titles = $meteor.collection(function(){
              return Titles.find({$and:[{active:true},{analisys:anDoc._id}]},{
                transform: function(titDoc){
                    titDoc.exams = $meteor.collection(function(){
                      return Exams.find({$and:[{active:true},{title:titDoc._id}]});
                    },false);
                  return titDoc;
                }
              });
            },false);
            return anDoc;
          }
      });
    },false);

    $scope.createNewDoctor = function(ev){
      ModalService.showModalWithParams('AddDoctorController',  'client/doctors/addDoctor.tmpl.ng.html',ev, {doctor:null});
    }

    $scope.createNewPatient = function(ev){
      ModalService.showModalWithParams('AddPatientController', 'client/patients/addPatient.tmpl.ng.html', ev, {patient:null});
    }

    $scope.changeAttention = function(){
      var attentionJson = JSON.parse($scope.selectedAttention);
      $scope.internData = attentionJson.name==CONDITIONS.INTERN_PATIENT;
      if($scope.internData) {
        $scope.study.internData = {};
      }else{
        delete $scope.study.internData;
      }
    }

    $scope.selectAnalisys = function(analisys) {
        angular.forEach(analisys.titles, function(title) {
            $scope.selectTitle(title);
            title.selected = !analisys.selected;
        });
    };

    $scope.selectTitle = function(title) {
        angular.forEach(title.exams, function(exam) {
            exam.selected = !title.selected;
        });
    }

    $scope.save = function() {
        $scope.study.analisys = [];
        var attentionJson = JSON.parse($scope.selectedAttention);
        $scope.study.attention = attentionJson._id;
        var serviceJson = JSON.parse($scope.selectedService);
        $scope.study.service = serviceJson._id;
        $scope.study.commited = false;
        angular.forEach($scope.analisysList, function(analisys)  {
            var component = {};
            component.titles = [];
            angular.forEach(analisys.titles, function(title){
                var titleComponent = {};
                titleComponent.exams = [];
                if(title.selected && !analisys.selected){
                    analisys.selected = true;
                };
                angular.forEach(title.exams, function(exam){
                  var examComponent = {};
                  if(exam.selected) {
                    examComponent.exam = exam._id;
                    examComponent.historial = [];
                    titleComponent.exams.push(examComponent);
                      if(!title.selected){
                          title.selected = true;
                          if(!analisys.selected) {
                              analisys.selected = true;
                          }
                      };
                  }
                });

                if(title.selected) {
                    titleComponent.title = title._id;
                    component.titles.push(titleComponent);
                }
            });
            if(analisys.selected){
                component.analisys = analisys._id;
                $scope.study.analisys.push(component);
            }
        });
        if(localStorage.getItem("rol") == "Doctor"){
            $scope.study.doctorUser = localStorage.getItem("user");
        }

        if(!$scope.isDoctor){
            $scope.study.doctor = $scope.selectedDoctor._id;
        }
        $scope.study.creatorId = localStorage.getItem("user");
        if($scope.patient) {
            $scope.study.patient = $scope.patient._id;
        }else {
            $scope.study.patient = $scope.selectedItem._id;
        }

        $scope.studies.save($scope.study).then(function(number) {
            notificationService.showSuccess("Se ha registrado correctamente el estudio");
        }, function(error){
            notificationService.showError("Error en el registro del estudio");
            console.log(error);
        });
        $state.go("studies");
    }

    $scope.cancel = function() {
        $state.go("studies");
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

angular.module("sam-1").directive('dailyStudy',function() {
  return {
    require : 'ngModel',
    link : function(scope, element, attrs, ngModel) {
      ngModel.$parsers.push(function(value) {
        if(!value || value.length == 0) return;
        var studyDate = new Date(attrs.date);
        var month = studyDate.getMonth();
        var year = studyDate.getFullYear();
        var day = studyDate.getDate();
        var date = new Date(year,month, day);
        var endDate = new Date(year,month, day,23,59,59);
        var queryDate = {"creationDate": {"$gte": date}};
        var queryLess = {"creationDate": {"$lte": endDate}};

        var studies = Studies.find({$and:[{dailyCode: value},queryDate,queryLess]});
        if(studies.count()>0){
          ngModel.$setValidity('duplicated', false);
        }else {
          ngModel.$setValidity('duplicated', true);
        }
        return value;
      })
    }
  }
});

/**
 * Created by Andrea on 26/07/2015.
 */

angular.module("sam-1").controller("ResultsListCtrl",['$scope','$meteor','notificationService','ModalService','$state',
    function($scope, $meteor,notificationService, ModalService, $state) {

        var query = {};
        var conditionNotProgramed = {$and:
          [
            { "dailyCode": { $exists: true } },
            { "dailyCode": {$ne:null} }
          ]};
        $scope.headers = ["Codigo", "Paciente", "Fecha"];

        if(localStorage.getItem("rol") == "Bioquimico"){
            query = {bioquimic: localStorage.getItem("user")};
        }

        if(localStorage.getItem("rol") == "Doctor"){
            query = {creatorId: localStorage.getItem("user")};
        }

        $scope.studies = $meteor.collection(function() {
            return Studies.find({$and:[query,conditionNotProgramed]}, {
                transform: function(doc) {
                    doc.patientObj = {};
                    if(doc.patient) {
                        var patientObj = $meteor.collection(function(){
                            return Patients.find({_id: {"$in": [doc.patient]}});
                        });
                        doc.patientObj = patientObj[0];
                    }

                    doc.doctorObj = {};
                    if(!!doc.doctor){
                      var doctorObj = $meteor.collection(function(){
                          return Doctors.find({_id: {"$in": [doc.doctor]}});
                      });
                      doc.doctorObj = doctorObj[0];
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
    }]);

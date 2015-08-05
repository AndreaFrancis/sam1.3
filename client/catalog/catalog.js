/**
 * Created by Andrea on 07/06/2015.
 */
angular.module("sam-1").controller("CatalogCtrl",['$scope','$meteor','ModalService',
    function($scope, $meteor, ModalService) {
        $scope.analisysList = $meteor.collection(function(){
          return Analisys.find({},{
            transform: function(doc) {
              doc.labName = $meteor.object(Labs, doc.lab).name;
              doc.areaName = $meteor.object(Areas, doc.area).name;

              if(doc.tests){
                doc.testsObj = [];
                angular.forEach(doc.tests, function(test){
                  doc.testsObj.push($meteor.object(Tests,test).name);
                });
              }

              if(doc.exams){
                doc.examsObj = [];
                angular.forEach(doc.exams, function(exam){
                  doc.examsObj.push($meteor.object(Exams,exam).name);
                });
              }

              return doc;
            }
          });
        }, false);



        $scope.headers = ['Nombre','Area','Laboratorio','Examenes','Pruebas', 'Acciones'];

        $scope.showTextSearch = true;
        $scope.showAddNew = function(ev) {
            ModalService.showModal(AddAnalisysController, 'client/analisys/views/addAnalisys.tmpl.ng.html', ev);
        }
        $scope.toggleSearch = function() {
            $scope.showTextSearch = !$scope.showTextSearch;
        }

        $scope.delete = function(analisys) {

        }

        $scope.show = function(analisys) {
            alert(analisys);
        }

    }]);
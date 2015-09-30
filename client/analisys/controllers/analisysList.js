/**
 * Created by Andrea on 07/06/2015.
 */
angular.module("sam-1").controller("AnalisysListCtrl",['$scope','$meteor','ModalService',
    function($scope, $meteor, ModalService) {
        $scope.analisysList = $meteor.collection(function(){
          return Analisys.find({active:true},{
            transform: function(doc){
                doc.titles = $meteor.collection(function(){
                  return Titles.find({analisys:doc._id});
                },false);
              return doc;
            }
          });
        }, false);

        $scope.headers = ['Nombre','Titulos','Descripcion','Acciones'];

        $scope.showAddNew = function(ev) {
            ModalService.showModalWithParams(AddAnalisysController, 'client/analisys/views/addAnalisys.tmpl.ng.html', ev, {analisys:null});
        }

        $scope.delete = function(analisys) {
          Analisys.update(analisys._id, {
            $set: {active: false}
          });
        }

        $scope.show = function(selectedAnal, ev) {
            ModalService.showModalWithParams(AddAnalisysController, 'client/analisys/views/addAnalisys.tmpl.ng.html', ev, {analisys:selectedAnal});
        }


        $scope.search = function(){
          $scope.analisysList = $meteor.collection(function(){
          return Analisys.find(
            {$and:[{
                      "name" : { $regex : '.*' + $scope.searchText || '' + '.*', '$options' : 'i' }
            }, {active:true}]},{
            transform: function(doc){
                doc.titles = $meteor.collection(function(){
                  return Titles.find({analisys:doc._id});
                },false);
              return doc;
            }
          }
          )
          ;
          },false);
        }

    }]);

function AddAnalisysController($scope, $meteor, notificationService, analisys,$mdDialog) {
    if(analisys){
      $scope.analisys = analisys;
    }

    $scope.analisysList = $meteor.collection(Analisys, false);

    $scope.save = function() {
        //Cleaning data from transform
        delete $scope.analisys.titles;

        $scope.analisys.active = true;
        $scope.analisysList.save($scope.analisys).then(function(number) {
            notificationService.showSuccess("Se ha registrado correctamente el Analisis clinico");
        }, function(error){
            notificationService.showError("Error en el registro del analisis");
            console.log(error);
        });
        $scope.analisys = '';
        $mdDialog.hide();
    }

    $scope.cancel = function() {
        $mdDialog.cancel();
    }
}

angular.module("sam-1").directive('analisys',function() {
  return {
    require : 'ngModel',
    link : function(scope, element, attrs, ngModel) {
      ngModel.$parsers.push(function(value) {
        if(!value || value.length == 0) return;
        if(Analisys.find({name: value}).count()>0){
          ngModel.$setValidity('duplicated', false);
        }else {
          ngModel.$setValidity('duplicated', true);
        }
        return value;
      })
    }
  }
});

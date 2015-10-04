angular.module("sam-1").controller("LabPersonalListCtrl",['$scope','$meteor','ModalService','notificationService','PrintService',
    function($scope, $meteor,ModalService,notificationService,PrintService) {

        $scope.personal = $meteor.collection(Labpersonal, false);
        $scope.headers = ['Usuario', 'Laboratorio','Cargo','Acciones'];

        $scope.print = function(){

        }

        $scope.showAddNew = function(ev) {
            ModalService.showModalWithParams(AddLabpersonalController,  'client/labpersonal/addLabpersonal.tmpl.ng.html',ev, {pers:null});
        }
        $scope.toggleSearch = function() {
            $scope.showTextSearch = !$scope.showTextSearch;
        }


        $scope.delete = function(pers) {
          $scope.personal.remove(pers).then(function(number) {
              notificationService.showSuccess("Se ha eliminado correctamente el personal de laboratorio");
          }, function(error){
              notificationService.showError("Error en la eliminacino del personal de laboratorio");
              console.log(error);
          });
        }

        $scope.show = function(selectedPers, ev) {
          ModalService.showModalWithParams(AddLabpersonalController,  'client/labpersonal/addLabpersonal.tmpl.ng.html',ev, {pers:selectedPers});
        }

        $scope.search = function(){
          $scope.personal = $meteor.collection(function(){
          return Labpersonal.find(
                  {
                      "job" : { $regex : '.*' + $scope.searchText || '' + '.*', '$options' : 'i' }
                  }
          );
          }, false);
        }

    }]);

angular.module("sam-1").controller('AddLabpersonalController',AddLabpersonalController);

function AddLabpersonalController($scope,$mdDialog, $meteor, pers ,notificationService) {
    if(pers) {
      $scope.pers = pers;
    }

    $scope.personal = $meteor.collection(Labpersonal,false);
    $scope.users = $meteor.collection(function(){
      var ids = $meteor.collection(function(){
        return RolesData.find({name:'Doctor'});
      },false);
      if(ids){
        return Users.find({'profile.mainRol':ids[0]._id});
      }else{
          return [];
      }
    }, false);
    $scope.selectedUser = {};

    $scope.save = function() {
        if($scope.selectedUser){
          $scope.pers.user  = $scope.selectedUser._id;
        }
        $scope.personal.save($scope.pers).then(function(number) {
            notificationService.showSuccess("Se ha guardado correctamente el personal de laboratorio");
        }, function(error){
            notificationService.showError("Error al guardar el personal de laboratorio");
            console.log(error);
        });
        $scope.pers = '';
        $mdDialog.hide();
    }

    $scope.cancel = function() {
        $mdDialog.cancel();
    }
}

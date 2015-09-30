/**
 * Created by Andrea on 22/07/2015.
 */

angular.module("sam-1").controller("RolesListCtrl",['$scope','$meteor','notificationService','ModalService',
    function($scope, $meteor,notificationService, ModalService) {
        $scope.roles = $meteor.collection(RolesData, false);
        $scope.headers = ['Nombre', 'Acciones'];

        $scope.showTextSearch = true;
        $scope.showAddNew = function(ev) {
            ModalService.showModalWithParams(AddRolController, 'client/roles/addRol.tmpl.ng.html',ev,{rol:null});
        }
        $scope.toggleSearch = function() {
            $scope.showTextSearch = !$scope.showTextSearch;
        }

        $scope.delete = function(rol) {
          $scope.roles.remove(rol).then(function(number) {
              notificationService.showSuccess("Se ha eliminado correctamente el rol");
          }, function(error){
              notificationService.showError("Error en la eliminacino del rol");
              console.log(error);
          });
        }

        $scope.show = function(selectedRol, ev) {
            ModalService.showModalWithParams(AddRolController, 'client/roles/addRol.tmpl.ng.html',ev, {rol:selectedRol});
        }

        $scope.search = function(){
              $scope.roles = $meteor.collection(function(){
                return RolesData.find({name : { $regex : '.*' + $scope.searchText || '' + '.*', '$options' : 'i' }});
              }, false);
        }

    }]);

function AddRolController($scope, notificationService, $mdDialog,rol, $meteor) {
    if(rol) {
      $scope.rol = rol;
    }
    $scope.roles = $meteor.collection(RolesData, false);
    $scope.save = function() {
        var rolToJson = angular.toJson($scope.rol);
        var rolToArray = JSON.parse(rolToJson);
        $scope.roles.save(rolToArray).then(function(number) {
            notificationService.showSuccess("Se ha registrado correctamente el rol");
        }, function(error){
            notificationService.showError("Error en el registro del rol");
            console.log(error);
        });
        $scope.newRol = '';
        $mdDialog.hide();
    }

    $scope.cancel = function() {
        $mdDialog.cancel();
    }
}


angular.module("sam-1").directive('rol',function() {
  return {
    require : 'ngModel',
    link : function(scope, element, attrs, ngModel) {
      ngModel.$parsers.push(function(value) {
        if(!value || value.length == 0) return;
        if(RolesData.find({name: value}).count()>0){
          ngModel.$setValidity('duplicated', false);
        }else {
          ngModel.$setValidity('duplicated', true);
        }
        return value;
      })
    }
  }
});

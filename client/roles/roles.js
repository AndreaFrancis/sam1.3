/**
 * Created by Andrea on 22/07/2015.
 */

angular.module("sam-1").controller("RolesListCtrl",['$scope','$meteor','notificationService','ModalService',
    function($scope, $meteor,notificationService, ModalService) {
        $scope.roles = $meteor.collection(RolesData, false);
        $scope.headers = ['Tema', 'Nombre', 'Acciones'];

        $scope.showTextSearch = true;
        $scope.showAddNew = function(ev) {
            ModalService.showModal(AddRolController, 'client/roles/addRol.tmpl.ng.html', ev);
        }
        $scope.toggleSearch = function() {
            $scope.showTextSearch = !$scope.showTextSearch;
        }

        $scope.delete = function(rol) {

        }

        $scope.show = function(rol) {
            alert(user);
        }

    }]);

function AddRolController($scope, notificationService, $mdDialog, $meteor) {
    $scope.roles = $meteor.collection(RolesData, false);
    $scope.save = function() {
        $scope.roles.save($scope.newRol).then(function(number) {
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

    $scope.validate = function(){

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

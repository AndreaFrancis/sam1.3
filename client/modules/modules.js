/**
 * Created by Andrea on 24/07/2015.
 */

angular.module("sam-1").controller("ModulesListCtrl",['$scope','$meteor','notificationService','ModalService',
    function($scope, $meteor,notificationService, ModalService) {
        $scope.modules = $meteor.collection(Modules,false);
        $scope.headers = ['', 'Nombre','Prioridad','Url','Roles', 'Acciones'];

        $scope.showTextSearch = true;
        $scope.showAddNew = function(ev) {
            ModalService.showModalWithParams(AddModuleController, 'client/modules/addModule.tmpl.ng.html', ev, {module:null});
        }
        $scope.toggleSearch = function() {
            $scope.showTextSearch = !$scope.showTextSearch;
        }

        $scope.delete = function(module) {
            $scope.modules.remove(module).then(function(number) {
                notificationService.showSuccess("Se ha eliminado correctamente el modulo");
            }, function(error){
                notificationService.showError("Error en la eliminacino del modulo");
                console.log(error);
            });
        }
        $scope.show = function(selectedModule, ev) {
            ModalService.showModalWithParams(AddModuleController, 'client/modules/addModule.tmpl.ng.html', ev, {module:selectedModule});
        }
    }]);

function AddModuleController($scope, notificationService, $mdDialog, module, $meteor) {

  $scope.readonly = false;
  $scope.selectedItem = null;
  $scope.selectedRoles = [];
  if(module){
      $scope.module = module;
      $scope.selectedRoles = module.roles;
  }

    $scope.roles = $meteor.collection(RolesData, false);
    $scope.modules = $meteor.collection(Modules, false);


    $scope.save = function() {
        $scope.module.roles = $scope.selectedRoles;
        $scope.modules.save($scope.module).then(function(number) {
            notificationService.showSuccess("Se ha registrado correctamente el modulo");
        }, function(error){
            notificationService.showError("Error en el registro del modulo");
            console.log(error);
        });
        $scope.module = '';
        $mdDialog.hide();
    }

    $scope.cancel = function() {
        $mdDialog.cancel();
    }


    //Autocomplete:

    $scope.itemChange = function(item){
      console.console.log(item);
    }
    /**
     * Search for vegetables.
     */
    $scope.querySearch = function (query) {
      var results = query ? $scope.roles.filter(createFilterFor(query)) : [];
      return results;
    }
    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(rol) {
        var objDuplicated = _.find($scope.selectedRoles, function(obj) { return obj.name == rol.name })
        return (rol.name.toLowerCase().indexOf(lowercaseQuery) === 0) && objDuplicated==null;
      };
    }
}

angular.module("sam-1").directive('module',function() {
  return {
    require : 'ngModel',
    link : function(scope, element, attrs, ngModel) {
      ngModel.$parsers.push(function(value) {
        if(!value || value.length == 0) return;
        if(Modules.find({name: value}).count()>0){
          ngModel.$setValidity('duplicated', false);
        }else {
          ngModel.$setValidity('duplicated', true);
        }
        return value;
      })
    }
  }
});

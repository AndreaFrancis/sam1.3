/**
 * Created by Andrea on 24/07/2015.
 */

angular.module("sam-1").controller("ModulesListCtrl",['$scope','$meteor','notificationService','ModalService',
    function($scope, $meteor,notificationService, ModalService) {
        $scope.modules = $meteor.collection(function(){
          return Modules.find({},{
            transform: function(doc){
              if(doc.roles){
                doc.rolesObj = [];
                angular.forEach(doc.roles, function(rol){
                  rol = $meteor.object(RolesData,rol);
                  if(rol && rol!='undefined') {
                    doc.rolesObj.push(rol.name);
                  }
                });
              }
              return doc;
            }
          });
        }, false);
        $scope.headers = ['', 'Nombre','Prioridad','Url','Roles', 'Acciones'];

        $scope.showTextSearch = true;
        $scope.showAddNew = function(ev) {
            ModalService.showModal(AddModuleController, 'client/modules/addModule.tmpl.ng.html', ev);
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
        $scope.show = function(module) {
            alert(module);
        }
    }]);

function AddModuleController($scope, notificationService, $mdDialog, $meteor) {
    $scope.roles = $meteor.collection(RolesData, false);
    $scope.selectedRol = {};
    $scope.selectedRoles = [];
    $scope.modules = $meteor.collection(Modules, false);

    $scope.saveRol = function() {
        $scope.selectedRoles.push($scope.selectedRol);
    }

    $scope.save = function() {
        var rolesToJson = angular.toJson($scope.selectedVegetables);
        var rolesToArray = JSON.parse(rolesToJson);
        $scope.newModule.roles = rolesToArray;
        $scope.modules.save($scope.newModule).then(function(number) {
            notificationService.showSuccess("Se ha registrado correctamente el modulo");
        }, function(error){
            notificationService.showError("Error en el registro del modulo");
            console.log(error);
        });
        $scope.newModule = '';
        $mdDialog.hide();
    }

    $scope.cancel = function() {
        $mdDialog.cancel();
    }

    //Autocomplete:

    $scope.readonly = false;
    $scope.selectedItem = null;
    $scope.querySearch = querySearch;
    $scope.selectedVegetables = [];
    $scope.numberChips = [];
    $scope.numberChips2 = [];
    $scope.numberBuffer = '';
    /**
     * Search for vegetables.
     */
    function querySearch (query) {
      var results = query ? $scope.roles.filter(createFilterFor(query)) : [];
      return results;
    }
    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(rol) {
        return (rol.name.toLowerCase().indexOf(lowercaseQuery) === 0);
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

/**
 * Created by Andrea on 07/06/2015.
 */
angular.module("sam-1").controller("ServicesListCtrl",['$scope','$meteor','$rootScope','notificationService','ModalService',
    function($scope, $meteor,  $rootScope,notificationService, ModalService) {
        $scope.services = $meteor.collection(Services, false);

        $scope.showTextSearch = true;

        $scope.showAddNew = function(ev) {
            ModalService.showModalWithParams(AddServiceController, 'client/services/addService.tmpl.ng.html',ev,{service:null});
        }

        $scope.toggleSearch = function() {
            $scope.showTextSearch = !$scope.showTextSearch;
        }

        $scope.delete = function(service) {
          $scope.services.remove(service).then(function(number) {
              notificationService.showSuccess("Se ha eliminado correctamente el servicio");
          }, function(error){
              notificationService.showError("Error en la eliminacino del servicio");
              console.log(error);
          });
        }

        $scope.show = function(selectedService, ev) {
            ModalService.showModalWithParams(AddServiceController, 'client/services/addService.tmpl.ng.html',ev,{service:selectedService});
        }

        $scope.search = function(){
          $scope.services = $meteor.collection(function(){
          return Services.find({
                      "name" : { $regex : '.*' + $scope.searchText || '' + '.*', '$options' : 'i' }
                  }  
          );
        }, false);
        }

        $scope.headers = ['Nombre', 'Descripcion', 'Acciones'];

    }]);

function AddServiceController($scope,$mdDialog, $meteor, service, notificationService) {
    if(service){
      $scope.service = service;
    }
    $scope.services = $meteor.collection(Services, false);
    $scope.save = function() {
        $scope.services.save($scope.service).then(function(number) {
            notificationService.showSuccess("Se ha guardado correctamente el servicio");
        }, function(error){
            notificationService.showError("Error al guardar el servicio");
            console.log(error);
        });
        $scope.service = '';
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    }
}

angular.module("sam-1").directive('service',function() {
  return {
    require : 'ngModel',
    link : function(scope, element, attrs, ngModel) {
      ngModel.$parsers.push(function(value) {
        if(!value || value.length == 0) return;
        if(Services.find({name: value}).count()>0){
          ngModel.$setValidity('duplicated', false);
        }else {
          ngModel.$setValidity('duplicated', true);
        }
        return value;
      })
    }
  }
});

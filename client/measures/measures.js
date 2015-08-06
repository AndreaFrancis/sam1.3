angular.module("sam-1").controller("MeasuresListCtrl",['$scope','$meteor','ModalService','notificationService',
    function($scope, $meteor,ModalService,notificationService) {

        $scope.measures = $meteor.collection(Measures, false);
        $scope.headers = ['Simbolo', 'Nombre','Acciones'];

        $scope.showTextSearch = true;
        $scope.showAddNew = function(ev) {
            ModalService.showModal(AddMeasureController, 'client/measures/addMeasure.tmpl.ng.html', ev);
        }
        $scope.toggleSearch = function() {
            $scope.showTextSearch = !$scope.showTextSearch;
        }


        $scope.delete = function(measure) {
          $scope.measures.remove(measure).then(function(number) {
              notificationService.showSuccess("Se ha eliminado correctamente la unidad de medida");
          }, function(error){
              notificationService.showError("Error en la eliminacino de la unidad de medida");
              console.log(error);
          });
        }

        $scope.show = function(measure) {
            alert(measure);
        }
    }]);

function AddMeasureController($scope,$mdDialog, $meteor, notificationService) {
    $scope.measures = $meteor.collection(Measures, false);
    $scope.newMeasure = {};

    $scope.save = function() {
        $scope.measures.save($scope.newMeasure).then(function(number) {
            notificationService.showSuccess("Se ha registrado correctamente la unidad de medida");
        }, function(error){
            notificationService.showError("Error en el registro de unidad de medida");
            console.log(error);
        });
        $scope.newMeasure = '';
        $mdDialog.hide();
    }

    $scope.cancel = function() {
        $mdDialog.cancel();
    }
}

angular.module("sam-1").directive('measure',function() {
  return {
    require : 'ngModel',
    link : function(scope, element, attrs, ngModel) {
      ngModel.$parsers.push(function(value) {
        if(!value || value.length == 0) return;
        if(Measures.find({symbol: value}).count()>0){
          ngModel.$setValidity('duplicated', false);
        }else {
          ngModel.$setValidity('duplicated', true);
        }
        return value;
      })
    }
  }
});

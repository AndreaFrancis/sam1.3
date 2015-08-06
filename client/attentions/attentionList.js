/**
 * Created by Andrea on 08/06/2015.
 */
/**
 * Created by Andrea on 07/06/2015.
 */
angular.module("sam-1").controller("AttentionsListCtrl",['$scope','$meteor','notificationService','ModalService',
    function($scope, $meteor,notificationService, ModalService) {
        $scope.attentions = $meteor.collection(Attentions, false);
        $scope.headers = ['Nombre', 'Descripcion', 'Acciones'];

        $scope.showTextSearch = true;
        $scope.showAddNew = function(ev) {
            ModalService.showModal(AddAttentionController, 'client/attentions/addAttention.tmpl.ng.html', ev);
        }
        $scope.toggleSearch = function() {
            $scope.showTextSearch = !$scope.showTextSearch;
        }

        $scope.delete = function(attention) {
          $scope.attentions.remove(attention).then(function(number) {
              notificationService.showSuccess("Se ha eliminado correctamente el tipo de atencion");
          }, function(error){
              notificationService.showError("Error en la eliminacino del tipo de atencion");
              console.log(error);
          });
        }

        $scope.show = function(attention) {
            alert(attention);
        }
    }]);

function AddAttentionController($scope, notificationService, $mdDialog, $meteor) {
    $scope.attentions = $meteor.collection(Attentions);
    $scope.save = function() {
        $scope.attentions.save($scope.attention).then(function(number) {
            notificationService.showSuccess("Se ha guardado correctamente el tipo de atencion");
        }, function(error){
            notificationService.showError("Error al guardar el tipo de atencion");
            console.log(error);
        });
        $scope.attention = '';
        $mdDialog.hide();
    }

    $scope.cancel = function() {
        $mdDialog.cancel();
    }
}

angular.module("sam-1").directive('attention',function() {
  return {
    require : 'ngModel',
    link : function(scope, element, attrs, ngModel) {
      ngModel.$parsers.push(function(value) {
        if(!value || value.length == 0) return;
        if(Attentions.find({name: value}).count()>0){
          ngModel.$setValidity('duplicated', false);
        }else {
          ngModel.$setValidity('duplicated', true);
        }
        return value;
      })
    }
  }
});

/**
 * Created by Andrea on 07/06/2015.
 */
/**
 * Created by Andrea on 07/06/2015.
 */
angular.module("sam-1").controller("UsersListCtrl",['$scope','$meteor','notificationService','$mdDialog','ModalService',
    function($scope, $meteor,notificationService,$mdDialog, ModalService) {
        $scope.users = $meteor.collection(Users, false);

        $scope.showTextSearch = true;

        $scope.delete = function(user) {
          Meteor.call("deleteUser", user._id, function(err) {
              if(err) {
                  notificationService.showError("No se pudo eliminar el usuario");
                  console.log(err);
              }else{
                  notificationService.showSuccess("Se ha eliminado correctamente al usuario");
              }
          });
        }

        $scope.show = function(user) {
            alert(user);
        }

        $scope.showAddNew = function(ev) {
            ModalService.showModal(AddUserController, 'client/users/views/addUser.tmpl.ng.html', ev);
        }

        $scope.toggleSearch = function() {
            $scope.showTextSearch = !$scope.showTextSearch;
        }
        $scope.headers = ['', 'Nombre de usuario','Nombre', 'Apellido', 'Rol', 'Acciones'];
}]);

function AddUserController($rootScope, $scope,$mdDialog, $meteor, notificationService) {
    $scope.roles = $meteor.collection(RolesData);
    $scope.newUser = {};
    $scope.newUser.profile = {};
    $scope.selectedRol = {};
    $scope.newUser.profile = {};
    $scope.cancel = function() {
        $mdDialog.cancel();
    }

    $scope.uploadFile = function(evemt) {
        $scope.selectedFile = event.target.files[0];
        $scope.image = URL.createObjectURL($scope.selectedFile);
    }

    $scope.save = function(newUser) {
        if($scope.selectedFile) {
          Images.insert($scope.selectedFile, function (err, fileObj) {
              if (err){
                  notificationService.showError("Error al subir la imagen");
                  console.log(err);
              } else {
                  newUser.profile.mainRol  = $scope.selectedRol;
                  newUser.profile.image = "/cfs/files/images/" + fileObj._id;
                  Meteor.call("createNewUser", newUser, function(err) {
                      if(err) {
                          notificationService.showError("Error en el registro del usuario");
                          console.log(err);
                      }else{
                          notificationService.showSuccess("Se ha registrado correctamente al usuario");
                      }
                  });
              }
          });
        }else{
          newUser.profile.mainRol  = $scope.selectedRol;
          Meteor.call("createNewUser", newUser, function(err) {
              if(err) {
                  notificationService.showError("Error en el registro del usuario");
                  console.log(err);
              }else{
                  notificationService.showSuccess("Se ha registrado correctamente al usuario"+ newUser._id);
              }
          });
        }

        $scope.newUser = '';
        $mdDialog.hide();
    }
}

angular.module("sam-1").directive('user',function() {
  return {
    require : 'ngModel',
    link : function(scope, element, attrs, ngModel) {
      ngModel.$parsers.push(function(value) {
        if(!value || value.length == 0) return;
        if(Users.find({username: value}).count()>0){
          ngModel.$setValidity('duplicated', false);
        }else {
          ngModel.$setValidity('duplicated', true);
        }
        return value;
      })
    }
  }
});

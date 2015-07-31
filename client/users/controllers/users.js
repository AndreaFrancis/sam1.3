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
        Images.insert($scope.selectedFile, function (err, fileObj) {
            if (err){
                notificationService.showError("Error al subir la imagen");
                console.log(err);
            } else {
                newUser.roles = [$scope.selectedRol];
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

        $scope.newUser = '';
        $mdDialog.hide();
    }
}
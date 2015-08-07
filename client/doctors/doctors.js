angular.module("sam-1").controller("DoctorsListCtrl",['$scope','$meteor','ModalService','notificationService',
    function($scope, $meteor,ModalService,notificationService) {

        $scope.doctors = $meteor.collection(Doctors, false);
        $scope.headers = ['Nombre', 'Apellido','Especialidad', 'Matricula','Acciones'];

        $scope.showAddNew = function(ev) {
            ModalService.showModalWithParams(AddDoctorController,  'client/doctors/addDoctor.tmpl.ng.html',ev, {doctor:null});
        }
        $scope.toggleSearch = function() {
            $scope.showTextSearch = !$scope.showTextSearch;
        }


        $scope.delete = function(doctor) {
          $scope.doctors.remove(doctor).then(function(number) {
              notificationService.showSuccess("Se ha eliminado correctamente el doctor");
          }, function(error){
              notificationService.showError("Error en la eliminacino del doctor");
              console.log(error);
          });
        }

        $scope.show = function(selectedDoctor, ev) {
          ModalService.showModalWithParams(AddDoctorController,  'client/doctors/addDoctor.tmpl.ng.html',ev, {doctor:selectedDoctor});
        }
    }]);

function AddDoctorController($scope,$mdDialog, $meteor, doctor ,notificationService) {
    if(doctor) {
      $scope.doctor = doctor;
      if($scope.doctor.userId){
        $scope.selectedUser = $meteor.object(Users,$scope.doctor.userId);
        $scope.isUser = true;
      }
    }

    $scope.doctors = $meteor.collection(Doctors,false);
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
        if($scope.isUser && $scope.selectedUser){
          $scope.doctor.userId  = $scope.selectedUser._id;
        }
        $scope.doctors.save($scope.doctor).then(function(number) {
            notificationService.showSuccess("Se ha guardado correctamente el doctor");
        }, function(error){
            notificationService.showError("Error al guardar el doctor");
            console.log(error);
        });
        $scope.doctor = '';
        $mdDialog.hide();
    }

    $scope.cancel = function() {
        $mdDialog.cancel();
    }
}

angular.module("sam-1").directive('doctor',function() {
  return {
    require : 'ngModel',
    link : function(scope, element, attrs, ngModel) {
      ngModel.$parsers.push(function(value) {
        if(!value || value.length == 0) return;
        if(Doctors.find({enrolment: value}).count()>0){
          ngModel.$setValidity('duplicated', false);
        }else {
          ngModel.$setValidity('duplicated', true);
        }
        return value;
      })
    }
  }
});
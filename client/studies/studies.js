/**
 * Created by Andrea on 26/07/2015.
 */

angular.module("sam-1").controller("StudiesListCtrl",['$scope','$meteor','notificationService','ModalService',
    function($scope, $meteor,notificationService, ModalService, $mdBottomSheet) {
        $scope.analisysList = $meteor.collection(Analisys, false);

    }]);

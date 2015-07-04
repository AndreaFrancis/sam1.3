/**
 * Created by Andrea on 08/06/2015.
 */
/**
 * Created by Andrea on 07/06/2015.
 */
angular.module("sam-1").controller("KindsListCtrl",['$scope','$meteor','notificationService',
    function($scope, $meteor,notificationService) {
        $scope.measures = $meteor.collection(Measures);
        $scope.newKind = {};
        $scope.newKind.ranks = [];
        $scope.addNewRank = function () {
            $scope.newKind.ranks.push({nombre:'',minVal:'',maxVal:''});
        }
    }]);

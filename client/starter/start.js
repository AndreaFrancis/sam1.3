/**
 * Created by Andrea on 26/07/2015.
 */

angular.module("sam-1").controller("DashboardCtrl",['$scope','$meteor','$state',
    function($scope, $meteor,$state) {
      var today = new Date();

      var studyDate = new Date();
      var month = studyDate.getMonth();
      var year = studyDate.getFullYear();
      var day = studyDate.getDate();
      var date = new Date(year,month, day);
      var endDate = new Date(year,month, day,23,59,59);
      var queryDate = {"creationDate": {"$gte": date}};
      var queryLess = {"creationDate": {"$lte": endDate}};

      $scope.studies = Studies.find({$and:[queryDate,queryLess]}).count();
      $scope.results = Studies.find({$and:[
        {creationDate: today},
        {dailyCode: {$ne: null}}
      ]}).count();
      $scope.show = function(url){
        $state.go(url);
      }
    }]);

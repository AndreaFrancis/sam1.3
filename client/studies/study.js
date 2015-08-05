/**
 * Created by Andrea on 30/07/2015.
 */
/**
 * Created by Andrea on 28/07/2015.
 */
angular.module("sam-1").controller("StudyCtrl", ['$scope', '$stateParams','$meteor','ModalService','$state',
    function($scope, $stateParams, $meteor, ModalService, $state){
        $scope.study = $meteor.object(Studies, $stateParams.studyId);
        $scope.analisysList = [];


        angular.forEach($scope.study.analisys, function(analisys){
            var analisysName = $meteor.object(Analisys, analisys.analisys);
            /*var analisysV = {};
            analisysV.name = analisysName.name;
            analisysV.tests = [];
            analisysV.exams = [];**/
            analisys.name = analisysName.name;
            angular.forEach(analisys.tests, function(test){
                var testName = $meteor.object(Tests, test.test);
                /**
                var testV = {};
                testV.name = testName.name;
                analisysV.tests.push(testV);**/
                test.name = testName.name;
            });
            angular.forEach(analisys.exams, function(exam){
                var examName = $meteor.object(Exams, exam.exam);
                /**
                var examV = {};
                examV.tests = [];
                examV.name = examName.name;**/
                exam.name = examName.name;
                angular.forEach(exam.tests, function(eTest){
                    var examTest = $meteor.object(Tests, eTest.test);
                    /**var testV = {};
                    testV.name = examTest.name;
                    examV.tests.push(testV);**/
                    eTest.name = examTest.name;
                });
                //analisysV.exams.push(examV);
            });
            //$scope.analisysList.push(analisysV);
        });

        $scope.patient = $meteor.object(Patients, $scope.study.patient);
        $scope.creator = $meteor.object(Users, $scope.study.creatorId);
        $scope.bioquimic = {};
        $scope.isSecretary = localStorage.getItem("rol") == "Secretario";
        $scope.isBioquimic = localStorage.getItem("rol") == "Bioquimico";
        $scope.isDoctor = localStorage.getItem("rol") == "Doctor";

        $scope.bioquimics = $meteor.collection(function(){
            var bios = Users.find({"profile.mainRol": "Bioquimico"});
            return bios;
        });

        var creatorName = $meteor.collection(function(){
            return Users.find({roles: {"$in": ['Bioquimico']}});
        });

        $scope.goStudies = function(){
            $state.go('studies');
        }

        $scope.save = function($event) {
          var i = 0, j = 0, k = 0, l = 0;
            if($scope.isBioquimic) {
                angular.forEach($scope.analisysList, function(analisys){
                    console.log("--"+analisys.name);
                    j = 0;

                    angular.forEach(analisys.tests, function(test){
                        console.log("--"+test.name+":"+ test.result);
                        $scope.study.analisys[i].tests[j].result = test.result;
                        j++;
                    });
                    k = 0;
                    angular.forEach(analisys.exams, function(exam){
                        console.log("--"+exam.name);
                        l = 0;
                        angular.forEach(exam.tests, function(eTest){
                            console.log("----"+eTest.name+":"+ eTest.result);
                            $scope.study.analisys[i].exams[k].tests[l].result = eTest.result;
                            l++;
                        });
                        k++;
                    });
                    i++;
                });
                $scope.study.save();
            }
            if($scope.bioquimic) {
                $scope.study.bioquimic = $scope.bioquimic._id;
                $scope.study.save();
            }
        }
    }]);

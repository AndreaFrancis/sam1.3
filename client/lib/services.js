/**
 * Created by Andrea on 28/07/2015.
 */
angular.module('sam-1').service("notificationService", function($mdToast){
    this.showError = function(msg) {
        $mdToast.show({
            template: '<md-toast class="md-toast error">' + msg + '</md-toast>',
            hideDelay: 3000,
            position: 'bottom right'
        });
    }
    this.showSuccess = function(msg) {
        $mdToast.show({
            template: '<md-toast class="md-toast success">' + msg + '</md-toast>',
            hideDelay: 3000,
            position: 'bottom right'
        });
    }
});

angular.module('sam-1').service("ProfileService", function($rootScope) {

    this.getRol = function() {
        return $rootScope.currenUser.roles;
    };
    this.getModules = function() {

    }
});

angular.module('sam-1').service("AuthorizationService", function(){
    this.showError = function(msg) {
        $mdToast.show({
            template: '<md-toast class="md-toast error">' + msg + '</md-toast>',
            hideDelay: 6000,
            position: 'up right'
        });
    }
    this.showSuccess = function(msg) {
        $mdToast.show({
            template: '<md-toast class="md-toast success">' + msg + '</md-toast>',
            hideDelay: 6000,
            position: 'up right'
        });
    }
});

angular.module('sam-1').service("ModalService", function($mdDialog){
    this.showModal = function(controller, urlTemplate, event) {
        $mdDialog.show({
            controller: controller,
            templateUrl: urlTemplate,
            targetEvent : event
        });
    }

    this.showModalWithParams = function(controller, urlTemplate, event, params) {
        $mdDialog.show({
            controller: controller,
            templateUrl: urlTemplate,
            targetEvent : event,
            locals: params
        });
    }
});


angular.module('sam-1').service("RangeEvaluator", function(RANGE_EVALUATOR, $meteor){
    var equalEval = function(val, range){
      var detail = {result:"Fuera de rango", correct:false};
      var i = 0;
      var found = false;
      while(i<range.fields.length && !found){
        if(range.fields[i].name == "valor"){
          found = true;
          var equalValue = range.fields[i].value;
          if(equalValue == val){
            detail.result = range.name;
            detail.correct = true;
          }
        }
        i++;
      }
      return detail;
    }

    var betweenEval = function(val, range){
      var detail = {result:"Fuera de rango", correct:false};
      var i = 0;
      var initial = 0;
      var final = 0;
      var foundInitial = false;
      var foundFinal = false;
      while(i<range.fields.length && !foundInitial){
        if(range.fields[i].name == "inicial"){
          foundInitial = true;
          initial = range.fields[i].value;
        }
        i++;
      }
      i = 0;
      while(i<range.fields.length && !foundFinal){
        if(range.fields[i].name == "final"){
          foundFinal = true;
          final = range.fields[i].value;
        }
        i++;
      }

      if(initial != undefined && final!= undefined){
        if((val<=final) && (val>=initial)){
          detail.result = range.name;
          detail.correct = true;
        }
      }

      return detail;
    }


    this.evaluatorsMap = {};
    this.evaluatorsMap['Igual'] = equalEval;
    this.evaluatorsMap['Entre'] = betweenEval;

});

/**
 * Created by Andrea on 28/07/2015.
 */
angular.module('sam-1').directive('demoDirective', function($compile) {
    return {
        template: '<div>&ensp;{{module.name}}</div>',
        replace: true
    }
});

angular.module('sam-1').directive('simpleText', function($compile) {
    return {
        template: '<div>{{username}}</div>',
        replace: true
    }
});

angular.module('sam-1').directive('avatar', function($compile) {
  return {
    template: '<img ng-src="{{user.profile.image}}" class="md-avatar" alt="{{user.username}}" />',
    replace: true
  }
});


//template: '<div><a ng-href="{{module.state}}">&ensp;{{module.name}}</a></div>',
angular.module('sam-1').directive('mainTex', function($compile) {
    return {
        template: '<div><i class="{{module.icon}}"> &nbsp;&nbsp;</i>{{module.name}}</div>',
        replace: true
    }
});

angular.module('sam-1').directive('text', function($compile) {
    return {
        template: '<div>Labsis &ensp;<i class="fa fa-angle-right"></i> &ensp;{{currentModule}}</div>',
        replace: true
    }
});


/**Image directive**/
angular.module('sam-1').directive('customOnChange', function() {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var onChangeHandler = scope.$eval(attrs.customOnChange);
            element.bind('change', onChangeHandler);
        }
    };
});

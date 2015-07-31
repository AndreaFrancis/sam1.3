/**
 * Created by Andrea on 28/07/2015.
 */
angular.module('sam-1').directive('demoDirective', function($compile) {
    return {
        template: '<div>&ensp;{{module.name}}</div>',
        replace: true
    }
});

//template: '<div><a ng-href="{{module.state}}">&ensp;{{module.name}}</a></div>',
angular.module('sam-1').directive('mainTex', function($compile) {
    return {
        template: '<div>{{module.name}}</div>',
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



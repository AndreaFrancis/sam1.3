/**
 * Created by Andrea on 28/07/2015.
 */
angular.module('sam-1').directive('demoDirective', function($compile) {
    return {
        template: '<div><a ng-href="{{module.state}}">&ensp;{{module.name}}</a></div>',
        replace: true
    }
});

angular.module('sam-1').directive('mainTex', function($compile) {
    return {
        template: '<div>{{module.name}}</div>',
        replace: true
    }
});

/**
 * Created by Andrea on 07/06/2015.
 */
/**Router config**/
angular.module("sam-1").config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
    function($urlRouterProvider, $stateProvider, $locationProvider){
        $locationProvider.html5Mode(true);

        $stateProvider
            .state('labs', {
                url: '/labs',
                templateUrl: 'client/labs/views/labs-list.ng.html',
                controller: 'LabsListCtrl'
            })
            .state('users', {
                url: '/users',
                templateUrl: 'client/users/views/users-list.ng.html',
                controller: 'UsersListCtrl'
            })
            .state('start', {
                url: '/start',
                templateUrl: 'client/starter/start.ng.html'
            })
            .state('measures', {
                url: '/measures',
                templateUrl: 'client/measures/measures.ng.html',
                controller: 'MeasuresListCtrl'
            })
            .state('analisys', {
                url: '/analisys',
                templateUrl: 'client/analisys/views/analisys.ng.html',
                controller: 'AnalisysListCtrl'
            })
            .state('areas', {
                url: '/areas',
                templateUrl: 'client/areas/views/areas.ng.html',
                controller: 'AreasListCtrl'
            })
            .state('exams', {
                url: '/exams',
                templateUrl: 'client/exams/exams.ng.html',
                controller: 'ExamsListCtrl'
            })
            .state('mtests', {
                url: '/mtests',
                templateUrl: 'client/mtests/mtests-list.ng.html',
                controller: 'TestsListCtrl'
            })
            .state('roles', {
                url: '/roles',
                templateUrl: 'client/roles/roles.ng.html',
                controller: 'RolesListCtrl'
                /*
                 ,
                 resolve: {
                 "currentUser": ["$meteor", function($meteor){
                 return $meteor.requireValidUser(function(user) {
                 return user.username==='maria';
                 });
                 }]
                 }*/
            })
            .state('modules', {
                url: '/modules',
                templateUrl: 'client/modules/modules.ng.html',
                controller: 'ModulesListCtrl'
                /*
                 ,
                 resolve: {
                 "currentUser": ["$meteor", function($meteor){
                 return $meteor.requireValidUser(function(user) {
                 return user.username==='maria';
                 });
                 }]
                 }*/
            })
            .state('patients', {
                url: '/patients',
                templateUrl: 'client/patients/patients.ng.html',
                controller: 'PatientsListCtrl'
            })
            .state('patient', {
                url: '/patient/:patientId',
                templateUrl: 'client/patients/patient-details.ng.html',
                controller: 'PatientCtrl'
            });
        $urlRouterProvider.otherwise("/start");
    }]);



$(document).ready(function() {

    var table = $('#table');

    // Table bordered
    $('#table-bordered').change(function() {
        var value = $( this ).val();
        table.removeClass('table-bordered').addClass(value);
    });

    // Table striped
    $('#table-striped').change(function() {
        var value = $( this ).val();
        table.removeClass('table-striped').addClass(value);
    });

    // Table hover
    $('#table-hover').change(function() {
        var value = $( this ).val();
        table.removeClass('table-hover').addClass(value);
    });

    // Table color
    $('#table-color').change(function() {
        var value = $(this).val();
        table.removeClass(/^table-mc-/).addClass(value);
    });
});

// jQuery’s hasClass and removeClass on steroids
// by Nikita Vasilyev
// https://github.com/NV/jquery-regexp-classes
(function(removeClass) {

    jQuery.fn.removeClass = function( value ) {
        if ( value && typeof value.test === "function" ) {
            for ( var i = 0, l = this.length; i < l; i++ ) {
                var elem = this[i];
                if ( elem.nodeType === 1 && elem.className ) {
                    var classNames = elem.className.split( /\s+/ );

                    for ( var n = classNames.length; n--; ) {
                        if ( value.test(classNames[n]) ) {
                            classNames.splice(n, 1);
                        }
                    }
                    elem.className = jQuery.trim( classNames.join(" ") );
                }
            }
        } else {
            removeClass.call(this, value);
        }
        return this;
    }

})(jQuery.fn.removeClass);
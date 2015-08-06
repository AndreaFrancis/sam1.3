/**
 * Created by Andrea on 07/06/2015.
 */
/**Router config**/
angular.module("sam-1").config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
    function($urlRouterProvider, $stateProvider, $locationProvider){
        $locationProvider.html5Mode(true);

        $stateProvider
            .state('services', {
                url: '/services',
                templateUrl: 'client/services/services.ng.html',
                controller: 'ServicesListCtrl',
                data: {
                  requireLogin: true
                }
            })
            .state('users', {
                url: '/users',
                templateUrl: 'client/users/views/users-list.ng.html',
                controller: 'UsersListCtrl',
                data: {
                  requireLogin: true
                }
            })
            .state('start', {
                url: '/start',
                templateUrl: 'client/starter/start.ng.html',
                data: {
                  requireLogin: true
                }
            })
            .state('measures', {
                url: '/measures',
                templateUrl: 'client/measures/measures.ng.html',
                controller: 'MeasuresListCtrl',
                data: {
                  requireLogin: true
                }
            })
            .state('analisys', {
                url: '/analisys',
                templateUrl: 'client/analisys/views/analisys.ng.html',
                controller: 'AnalisysListCtrl',
                data: {
                  requireLogin: true
                }
            })
            .state('areas', {
                url: '/areas',
                templateUrl: 'client/areas/views/areas.ng.html',
                controller: 'AreasListCtrl',
                data: {
                  requireLogin: true
                }
            })
            .state('exams', {
                url: '/exams',
                templateUrl: 'client/exams/exams.ng.html',
                controller: 'ExamsListCtrl',
                data: {
                  requireLogin: true
                }
            })
            .state('mtests', {
                url: '/mtests',
                templateUrl: 'client/mtests/mtests-list.ng.html',
                controller: 'TestsListCtrl',
                data: {
                  requireLogin: true
                }
            })
            .state('roles', {
                url: '/roles',
                templateUrl: 'client/roles/roles.ng.html',
                controller: 'RolesListCtrl',
                data: {
                  requireLogin: true
                }
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
                controller: 'ModulesListCtrl',
                data: {
                  requireLogin: true
                }
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
                controller: 'PatientsListCtrl',
                data: {
                  requireLogin: true
                }
            })
            .state('patient', {
                url: '/patient/:patientId',
                templateUrl: 'client/patients/patient-details.ng.html',
                controller: 'PatientCtrl',
                data: {
                  requireLogin: true
                }
            })
            .state('studies', {
                url: '/studies',
                templateUrl: 'client/studies/studies.ng.html',
                controller: 'StudiesListCtrl',
                data: {
                  requireLogin: true
                }
            })
            .state('study', {
                url: '/study/:studyId',
                templateUrl: 'client/studies/study-details.ng.html',
                controller: 'StudyCtrl',
                data: {
                  requireLogin: true
                }
            })
            .state('login',{
              ulr: '/login',
              templateUrl: 'client/starter/login.ng.html',
              controller: 'AppCtrl',
              data: {
                requireLogin: false
              }
            })
            .state('catalog',{
              ulr: '/catalog',
              templateUrl: 'client/catalog/catalog.ng.html',
              controller: 'CatalogCtrl',
              data: {
                requireLogin: true
              }
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

// jQuery�s hasClass and removeClass on steroids
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

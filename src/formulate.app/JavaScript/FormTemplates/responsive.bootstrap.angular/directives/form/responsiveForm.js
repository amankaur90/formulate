'use strict';

var angular = require('angular');

var app = angular.module('formulate');

/**
 * @description Generate unique form names
 */
var genFormName = (function () {
    var counter = 0;

    return function () {
        counter += 1;

        return 'form' + counter;
    };
}());

function FormulateController($rootScope, $scope, $element, $http, $q, $window) {
    var self = this;

    // Set reference to injected object to be used in prototype functions
    this.injected = {
        $q: $q,
        $http: $http,
        $scope: $scope,
        $element: $element,
        $window: $window
    };

    // set unique form name
    this.generatedName = genFormName();

    ////////////////////////////////////////
    // Handle Post
    function parseResponse(response) {
        var deferred = self.injected.$q.defer();

        if (response.data && response.data.Success === true) {
            deferred.resolve(response.data);
        } else {
            deferred.reject(response.message);
        }

        return deferred.promise;
    }

    function submitPost(data) {
        return $http({
            method: 'POST',
            url: self.formData.url,
            data: data,
            headers: {
                'Content-Type': undefined
            },
            transformRequest: function (obj) {

                // Convert to FormData: http://stackoverflow.com/a/25264008/2052963
                // This is necessary for file uploads to submit properly via AJAX.
                var formData = new self
                    .injected
                    .$window
                    .FormData();

                angular.forEach(obj, function (value, key) {
                    if (angular.isArray(value)) {
                        value.forEach(function (itemVal) {
                            formData.append(key, itemVal);
                        });

                        // Skip over null/undefined so they don't get sent as serialized version.
                    } else if (value !== undefined && value !== null) {
                        formData.append(key, value);
                    }

                });
                return formData;

            }
        }).then(parseResponse);
    }

    function postSuccess(data) {
        $scope.$emit('Formulate.formSubmit.OK', {
            fields: self.fieldModels,
            name: self.formData.name,
            response: data
        });
    }

    function postFailed(message) {
        $scope.$emit('Formulate.formSubmit.Failed', {
            fields: self.fieldModels,
            name: self.formData.name,
            message: message
        });
    }

    function handleSubmitEvent($event, data) {
        if ($event.targetScope === $scope && !$event.defaultPrevented) {
            submitPost(data).then(postSuccess, postFailed);
        }
    }

    // Map Fields for faster access
    this.fieldMap = {};
    this.formData.fields.forEach(function (field) {
        self.fieldMap[field.id] = field;
    });

    // ng-model of fields
    this.fieldModels = {};

    // Set initial values.
    this.formData.fields.forEach(function (field) {
        var initialValue = field.initialValue;

        if (field.initialValue !== undefined && field.initialValue !== null) {
            self.fieldModels[field.id] = initialValue;
        }
    });

    ////////////////////////////////////////
    // Bind later - this is to allow consumers to intercept event on $rootScope
    var removeSubmitHandler = null;
    var timeout = $window.setTimeout(function () {
        removeSubmitHandler = $rootScope.$on('Formulate.submit', handleSubmitEvent);
    }, 40);

    // Clean up pending requests
    function onDestroy() {
        if (removeSubmitHandler) {
            removeSubmitHandler();
        }
        $window.clearTimeout(timeout);
    }
    $scope.$on('$destroy', onDestroy);
}

FormulateController.prototype.getFieldById = function (id) {
    return this.fieldMap[id];
};

FormulateController.prototype.submit = function () {
    var formCtrl = this
        .injected
        .$element
        .find('form')
        .controller('form');

    if (formCtrl.$valid) {
        var data = angular.extend({}, this.formData.payload, this.fieldModels);

        this
            .injected
            .$scope
            .$emit('Formulate.submit', data);
    }
};

/**
 *
 * @param $event
 * @param buttonKind
 */
FormulateController.prototype.buttonClicked = function (buttonKind) {
    if (buttonKind !== null) {
        this.injected.$scope.$emit('Formulate.buttonClicked', buttonKind);
    }
};

function formulate() {
    return {
        restrict: "E",
        replace: true,
        template: '<div class="formulate-container">' +
            '<form data-ng-submit="ctrl.submit(ctrl.generatedName)" class="form" name="{{ctrl.generatedName}}">' +
            '<formulate-rows rows="ctrl.formData.rows"></formulate-rows>' +
            '</form>' +
            '</div>',

        controller: FormulateController,
        controllerAs: "ctrl",
        bindToController: true,

        scope: {
            formData: '='
        }
    };
}
app.directive('formulateResponsiveForm', formulate);
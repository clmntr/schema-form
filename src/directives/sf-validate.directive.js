import angular from 'angular';

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

schemaValidate.$inject = ['sfSchema', '$parse', 'sfPath' ];

// Modification de la directive schemaValidate
// - Ajout de la possibilité de renseigner une string comme appel de fonction 
//   dans les validators & parsers
//   sous > ['$validators', '$asyncValidators'].forEach(function(attr) { ...
function schemaValidate (sfSchema, $parse, sfPath) {

    return {
        restrict: 'A',
        scope: false,
        // We want the link function to be *after* the input directives link function so we get access
        // the parsed value, ex. a number instead of a string
        priority: 500,
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {

            var error           = null;
            var node            = undefined;
            var lastValidated   = undefined;
            var schema          = undefined;

            if ( attrs.schemaValidate !== "" ) {
                node = scope.$eval( attrs.schemaValidate )
            }
            else {
                node = scope;
            }
            
            // We need the ngModelController on several places,
            // most notably for errors.
            node.ngModel    = ngModel;
            schema          = node.schema;

            if (node.form.copyValueTo) {
                ngModel.$viewChangeListeners.push(function() {
                    var paths = node.form.copyValueTo;
                    angular.forEach(paths, function(path) {
                        sfPath.select(path, scope.model, ngModel.$modelValue);
                    });
                });
            }


            // Validate against the schema.

            var validate = function( viewValue ) {

                lastValidated = viewValue;

                //Still might be undefined
                if (!node) {
                    return viewValue;
                }

                // Omit validation
                if ( node.form && node.form.validation === false ) {
                    return viewValue;
                }

                var result =  sfSchema.validate( node, viewValue );

                // Since we might have different validator errors we must clear all
                // errors that start with validator-
                Object.keys(ngModel.$error)
                        .filter(function(k) { return k.indexOf('validator-') === 0; })
                        .forEach(function(k) { ngModel.$setValidity(k, true); });

                if (!result.valid) {
                    // it is invalid, return undefined (no model update)
                    ngModel.$setValidity('validator-' + result.error.code, false);
                    error = result.error;

                    // In Angular 1.3+ return the viewValue, otherwise we inadvertenly
                    // will trigger a 'parse' error.
                    // we will stop the model value from updating with our own $validator
                    // later.
                    // >> CHANGED : add comment
                    // if (ngModel.$validators) {
                    //   return viewValue;
                    // }
                    // << CHANGED 
                    // Angular 1.2 on the other hand lacks $validators and don't add a 'parse' error.
                    return undefined;
                }
                return viewValue;
            };

            // Custom validators, parsers, formatters etc
            if (typeof node.ngModel === 'function') {
                node.ngModel(ngModel);
            }

            // In order to allow the specification of parsers & validators in the schema 
            // instead of specifying always those two in the form
            function getParserAdder( attr ) {
                return function(fn) {
                    if ( angular.isString(fn) ) {
                        var fnName = fn;
                        fn = function( viewValue ){ 
                            return scope.evalExpr( fnName, {
                                "viewValue"     : viewValue, 
                                "ngModel"       : ngModel, 
                                "parent"        : sfPath.select( scope.arrayKey.slice(0, -1), scope.model )
                            });
                        }
                    }
                    ngModel[attr].push(fn);
                }
            }

            function getValidatorAdder( attr ) {
                return function(fn, name) {
                    if ( angular.isString(fn) ) {
                        var fnName = fn;
                        fn = function( modelValue, viewValue ){ 
                            return scope.evalExpr( fnName, {
                                "modelValue"    : modelValue, 
                                "viewValue"     : viewValue,
                                "ngModel"       : ngModel, 
                                "parent"        : sfPath.select( scope.arrayKey.slice(0, -1), scope.model )
                            });
                        }
                    }
                    ngModel[attr][name] = fn;
                }
            }

            ['$parsers', '$viewChangeListeners', '$formatters'].forEach(function(attr) {
                if ( ( node.form[attr] || node.schema[attr] ) && ngModel[attr]) {
                    var adder = getParserAdder( attr );
                    angular.forEach(node.form[attr], adder);
                    angular.forEach(node.schema[attr], adder);
                }
            });

            ['$validators', '$asyncValidators'].forEach(function(attr) {
                if ( ( node.form[attr] || node.schema[attr] ) && ngModel[attr]) {
                    var adder = getValidatorAdder( attr );
                    angular.forEach(node.form[attr], adder);
                    angular.forEach(node.schema[attr], adder);
                }
            });

            // Get in last of the parses so the parsed value has the correct type.
            // We don't use $validators since we like to set different errors depending validator error codes
            ngModel.$parsers.push(validate);

            // But we do use one custom validator in the case of Angular 1.3 to stop the model from
            // updating if we've found an error.
            ngModel.$validators.schemaForm = function( value ) {
                // Patch issue when the setViewValue is called with undefined, the parsers are skipped
                // but not the validators
                if ( lastValidated !== value ) {
                    validate( value );
                }
                // Any error and we're out of here!
                return !Object.keys(ngModel.$error).some(function(e) { return e !== 'schemaForm';});
            };

            // A bit ugly but useful.
            scope.validateField =  function(formName) {
                
                // If we have specified a form name, and this model is not within 
                // that form, then leave things be.
                if(formName != undefined && ngModel.$$parentForm.$name !== formName) {
                    return;
                }

                // Special case: arrays
                // TODO: Can this be generalized in a way that works consistently?
                // Just setting the viewValue isn't enough to trigger validation
                // since it's the same value. This will be better when we drop
                // 1.2 support.
                if (schema && schema.type.indexOf('array') !== -1) {
                    validate(ngModel.$modelValue);
                }

                // We set the viewValue to trigger parsers,
                // since modelValue might be empty and validating just that
                // might change an existing error to a "required" error message.
                
                // remove errors in order to revalidate in the future
                ngModel.$error = {};
                
                // Angular 1.3+
                ngModel.$setDirty();
                ngModel.$setViewValue( ngModel.$viewValue );
                ngModel.$commitViewValue();
                
                // force validation
                validate(ngModel.$modelValue);
                if ( angular.equals(ngModel.$error, {}) ) {
                    ngModel.$$parseAndValidate();
                    validate(ngModel.$modelValue);
                }

            };

            scope.validateExternal = function() {
                if ( !scope.firstDigest ) {
                    return scope.validateField();
                }
            }

            ngModel.$formatters.push(function(val) {
                // When a form first loads this will be called for each field.
                // we usually don't want that.
                if (ngModel.$pristine  && scope.firstDigest &&
                        (!scope.options || scope.options.validateOnRender !== true))  {
                    return val;
                }
                validate(ngModel.$modelValue);
                return val;
            });

            // Listen to an event so we can validate the input on request
            scope.$on('schemaFormValidate', function(event, formName) {
                scope.validateField(formName);
            });

            scope.$on('schemaFormValidateField', function(event, fieldName, formName) {
                if ( node.arrayKey && node.arrayKey[0] === fieldName ) 
                    ngModel.$$parseAndValidate();
            });

            scope.schemaError = function() {
                return error;
            };

        }
    };
}

export default schemaValidate
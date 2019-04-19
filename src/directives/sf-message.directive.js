import angular from 'angular';

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

sfMessage.$inject = ['$injector', 'sfErrorMessage']


// Modification de la directive sfMessage
// - Gestion de l'erreur parse 
function sfMessage ($injector, sfErrorMessage) {

    //Inject sanitizer if it exists
    var $sanitize = $injector.has('$sanitize') ? $injector.get('$sanitize') : function(html) { return html; };

    return {
        scope: false,
        restrict: 'EA',
        link: function(scope, element, attrs) {

            var message = '';
            var currentMessage;

            if (attrs.sfMessage) {
                scope.$watch(attrs.sfMessage, function(msg) {
                    if (msg) {
                        message = $sanitize(msg);
                        update(!!scope.ngModel);
                    }
                });
            }

            // Only call html() if needed.
            var setMessage = function(msg) {
                if (msg !== currentMessage) {
                    element.html(msg);
                    currentMessage = msg;
                }
            };

            var update = function(checkForErrors) {
                if (checkForErrors) {
                    if (!scope.hasError()) {
                        setMessage(message);
                    } else {
                        var errors = [];
                        angular.forEach(scope.ngModel && scope.ngModel.$error, function(status, code) {
                            if (status) {
                                // if true then there is an error
                                // Angular 1.3 removes properties, so we will always just have errors.
                                // Angular 1.2 sets them to false.
                                errors.push(code);
                            }
                        });

                        // In Angular 1.3 we use one $validator to stop the model value from getting updated.
                        // this means that we always end up with a 'schemaForm' error.
                        errors = errors.filter(function(e) { return e !== 'schemaForm'; });
                        // >> CHANGED : add test to parse

                        // We delete the parse error
                        errors = errors.filter(function(e) { return e !== 'parse'; });

                        // We order the list using the validationPriority list
                        var len = ( angular.isArray( scope.form.validationPriority ) && scope.form.validationPriority.length ) || 0;
                        while ( len-- ) {
                            var index = errors.indexOf( scope.form.validationPriority[ len ] )
                            if ( index != -1 ) {
                                errors.splice( 0, 0, errors.splice( index, 1 )[ 0 ]);
                            }
                        }

                        // << CHANGED

                        // We only show one error.
                        // TODO: Make that optional
                        var error = errors[0];

                        if (error) {
                            setMessage(sfErrorMessage.interpolate(
                                error,
                                scope.ngModel.$modelValue,
                                scope.ngModel.$viewValue,
                                scope,
                                scope.options && scope.options.validationMessage,
                                scope.evalExpr('config')
                            ));
                        } else {
                            setMessage(message);
                        }
                    }
                } else {
                    setMessage(message);
                }
            };

            // Update once.
            update();

            var once = scope.$watch('ngModel',function(ngModel) {
                if (ngModel) {
                    // We also listen to changes of the model via parsers and formatters.
                    // This is since both the error message can change and given a pristine
                    // option to not show errors the ngModel.$error might not have changed
                    // but we're not pristine any more so we should change!
                    ngModel.$parsers.push(function(val) { update(true); return val; });
                    ngModel.$formatters.push(function(val) { update(true); return val; });
                    once();
                }
            });

            // We watch for changes in $error
            scope.$watchCollection('ngModel.$error', function() {
                update(!!scope.ngModel);
            });
        }
    };
}

export default sfMessage;
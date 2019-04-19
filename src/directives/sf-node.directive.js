import angular from 'angular';

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

sfNode.$inject = [ '$interpolate', '$q', 'sfErrorMessage', 'sfPath', 'sfSchema', 'sfValidators' ]

function sfNode ( $interpolate, $q, sfErrorMessage, sfPath, sfSchemaService, sfValidators ) {

    return {
        restrict: 'AE',
        replace: false,
        transclude: false,
        scope: true,
        require: '^sfSchema',
        link: {
            pre: function( scope, element, attrs, sfSchema ) {

                // --------------------------------------------------
                // We get the node and we merge it to the scope

                var nodeId  = attrs.node || attrs.sfNode
                var node    = undefined;
                try {
                    node    = scope.$eval( nodeId );
                }
                catch( error ) {
                    // We can have eval errors when the id contains words..
                    // do nothing for now, the lookup will do the rest
                }
                if ( !angular.isObject( node ) ) {
                    node    = sfSchema.lookup( nodeId ); 
                }

                // Extend the scope from the node.
                angular.extend( scope, node );
                scope.node = scope;

                // --------------------------------------------------
                // If a model is linked to this node
                // We add the model manipulation tools
                if ( angular.isString( scope.key ) ) {

                    scope.changeCallbacks = [];

                    // --------------------------------------------------
                    // Adding the scope decorators here

                    if ( scope.form && scope.form.onChange ) {
                        changeDecorator( scope );
                    }
                    if ( scope.type === "array" ) {
                        arrayDecorator( scope );
                    }
                    else if ( scope.type === "object" ) {
                        validateDecorator( scope );
                    }

                    // --------------------------------------------------
                    // Adding the model link property : scope.value
                    // A bit ugly but usefull as we do not have to rely on
                    // the old string model accessor that can change at runtime
                    // and as AngularJS is not allowing to do a simple node.get() on the directives
                    // attributes ( such as ng-model )

                    scope.value = scope.get();
                    // Watch model changes
                    scope.$watch( function() {
                        return scope.$eval( sfPath.getModelAccessor( scope.arrayKey ), { model : scope.model } )
                    }, function( newValue, oldValue, scope ) {
                        if ( newValue !== scope.value ) {
                            scope.value = newValue;
                        }
                    }, true );
                    // watch value changes
                    scope.$watch( 'value', function( newValue, oldValue, scope ) {
                        if ( newValue !== oldValue ) {
                            sfPath.select( scope.arrayKey, scope.model, newValue, true );
                            // Emit a global event on the value changed
                            scope.$emit( "schemaForm.valueChanged."+ scope.arrayKey.join('.'), newValue );
                            // Call all the callbacks
                            angular.forEach( scope.changeCallbacks, function( callback ){
                                callback.call( scope, newValue, oldValue, scope );
                            });
                        }
                    }, true );
                }

            },
            post: function(scope, element, attrs, sfSchema) {

                //Keep error prone logic from the template
                scope.showTitle = function() {
                    return scope.form && scope.form.notitle !== true && scope.form.title;
                };

                scope.listToCheckboxValues = function(list) {
                    var values = {};
                    angular.forEach(list, function(v) {
                        values[v] = true;
                    });
                    return values;
                };

                scope.checkboxValuesToList = function(values) {
                    var lst = [];
                    angular.forEach(values, function(v, k) {
                        if (v) {
                            lst.push(k);
                        }
                    });
                    return lst;
                };

                scope.buttonClick = function($event, form) {
                    if (angular.isFunction(form.onClick)) {
                        form.onClick($event, form);
                    } else if (angular.isString(form.onClick)) {
                        if (sfSchema) {
                            //evaluating in scope outside of sfSchemas isolated scope
                            sfSchema.evalExpr(form.onClick, {'$event': $event, form: form});
                        } else {
                            scope.$eval(form.onClick, {'$event': $event, form: form});
                        }
                    }
                };

                /**
                 * Evaluate an expression, i.e. scope.$eval
                 * but do it in sfSchemas parent scope sf-schema directive is used
                 * @param {string} expression
                 * @param {Object} locals (optional)
                 * @return {Any} the result of the expression
                 */
                scope.evalExpr = function(expression, locals) {
                    if (sfSchema) {
                        //evaluating in scope outside of sfSchemas isolated scope
                        return sfSchema.evalExpr(expression, locals);
                    }

                    return scope.$eval(expression, locals);
                };

                /**
                 * Evaluate an expression, i.e. scope.$eval
                 * in this decorators scope
                 * @param {string} expression
                 * @param {Object} locals (optional)
                 * @return {Any} the result of the expression
                 */
                scope.evalInScope = function(expression, locals) {
                    if (expression) {
                        return scope.$eval(expression, locals);
                    }
                };

                /**
                 * Interpolate the expression.
                 * Similar to `evalExpr()` and `evalInScope()`
                 * but will not fail if the expression is
                 * text that contains spaces.
                 *
                 * Use the Angular `{{ interpolation }}`
                 * braces to access properties on `locals`.
                 *
                 * @param  {string} content The string to interpolate.
                 * @param  {Object} locals (optional) Properties that may be accessed in the
                 *                         `expression` string.
                 * @return {Any} The result of the expression or `undefined`.
                 */
                scope.interpolate = function(expression, locals) {
                    return (expression && $interpolate(expression)(locals));
                };

                //This works since we get the ngModel from the array or the schema-validate directive.
                scope.hasSuccess = function() {
                    if (!scope.ngModel) {
                        return false;
                    }
                    if (scope.options && scope.options.pristine &&
                            scope.options.pristine.success === false) {
                        return scope.ngModel.$valid &&
                                !scope.ngModel.$pristine && !scope.ngModel.$isEmpty(scope.ngModel.$modelValue);
                    } else {
                        return scope.ngModel.$valid &&
                            (!scope.ngModel.$pristine || !scope.ngModel.$isEmpty(scope.ngModel.$modelValue));
                    }
                };

                scope.hasError = function() {
                    if (!scope.ngModel) {
                        return false;
                    }
                    if (!scope.options || !scope.options.pristine || scope.options.pristine.errors !== false) {
                        // Show errors in pristine forms. The default.
                        // Note that "validateOnRender" option defaults to *not* validate initial form.
                        // so as a default there won't be any error anyway, but if the model is modified
                        // from the outside the error will show even if the field is pristine.
                        return scope.ngModel.$invalid;
                    } else {
                        // Don't show errors in pristine forms.
                        return scope.ngModel.$invalid && !scope.ngModel.$pristine;
                    }
                };

                var form = scope.form;

                // Where there is a key there is probably a ngModel
                if (scope.arrayKey) {
                    // It looks better with dot notation.
                    scope.$on(
                        'schemaForm.error.' + scope.arrayKey.join('.'),
                        function(event, error, validationMessage, validity) {
                            if (validationMessage === true || validationMessage === false) {
                                validity = validationMessage;
                                validationMessage = undefined;
                            }

                            if (scope.ngModel && error) {
                                if (scope.ngModel.$setDirty) {
                                    scope.ngModel.$setDirty();
                                } else {
                                    // FIXME: Check that this actually works on 1.2
                                    scope.ngModel.$dirty = true;
                                    scope.ngModel.$pristine = false;
                                }

                                // Set the new validation message if one is supplied
                                // Does not work when validationMessage is just a string.
                                if (validationMessage) {
                                    if (!form.validationMessage) {
                                        form.validationMessage = {};
                                    }
                                    form.validationMessage[error] = validationMessage;
                                }

                                scope.ngModel.$setValidity(error, validity === true);

                                if (validity === true) {
                                    // Re-trigger model validator, that model itself would be re-validated
                                    scope.ngModel.$validate();

                                    // Setting or removing a validity can change the field to believe its valid
                                    // but its not. So lets trigger its validation as well.
                                    scope.$broadcast('schemaFormValidate');
                                }
                            }
                        }
                    );

                    // Clean up the model when the corresponding form field is $destroy-ed.
                    // Default behavior can be supplied as a globalOption, and behavior can be overridden
                    // in the form definition.
                    scope.$on('$destroy', function() {
                        // If the entire schema form is destroyed we don't touch the model
                        if (!scope.externalDestructionInProgress) {
                            var destroyStrategy = form.destroyStrategy ||
                                                                        (scope.options && scope.options.destroyStrategy) || 'remove';
                            // No key no model, and we might have strategy 'retain'
                            if (scope.arrayKey && destroyStrategy !== 'retain') {

                                // Get the object that has the property we wan't to clear.
                                var obj = scope.model;
                                if (scope.arrayKey.length > 1) {
                                    obj = sfPath.select(scope.arrayKey.slice(0, scope.arrayKey.length - 1), obj);
                                }

                                // We can get undefined here if the form hasn't been filled out entirely
                                if (obj === undefined) {
                                    return;
                                }

                                // Type can also be a list in JSON Schema
                                var type = (scope.schema && scope.schema.type) || '';

                                // Empty means '',{} and [] for appropriate types and undefined for the rest
                                //console.log('destroy', destroyStrategy, scope.arrayKey, type, obj);
                                if (destroyStrategy === 'empty' && type.indexOf('string') !== -1) {
                                    obj[scope.arrayKey.slice(-1)] = '';
                                } else if (destroyStrategy === 'empty' && type.indexOf('object') !== -1) {
                                    obj[scope.arrayKey.slice(-1)] = {};
                                } else if (destroyStrategy === 'empty' && type.indexOf('array') !== -1) {
                                    obj[scope.arrayKey.slice(-1)] = [];
                                } else if (destroyStrategy === 'null') {
                                    obj[scope.arrayKey.slice(-1)] = null;
                                } else {
                                    delete obj[scope.arrayKey.slice(-1)];
                                }
                            }
                        }
                    });
                }

            }
        }
    };

    // --------------------------------------------------
    // Change decorator
    // Add the on change callback 

    function changeDecorator ( scope ) {

        // --------------------------------------------------
        // Observers

        scope.changeCallbacks.push( function( newValue, oldValue, scope ) {
            if (angular.isFunction(scope.form.onChange)) {
                scope.form.onChange(newValue, scope.form);
            } else {
                scope.evalExpr(scope.form.onChange, {'modelValue': newValue, form: scope.form, model: newValue});
            }
        })

    }

    // --------------------------------------------------
    // Validate decorator
    // Add the validate callback 

    function validateDecorator ( scope ) {

        // --------------------------------------------------
        // Observers

        scope.changeCallbacks.push( function( newValue, oldValue, scope ) {
            // We validate the value each time it changes
            sfValidators.validate( scope, newValue );
        })

    }


    // --------------------------------------------------
    // Array decorator
    // Add the array specific methods to the scope

    function arrayDecorator ( scope ) {

        // --------------------------------------------------
        // Public

        /**
         * Allow the user to add a node item to this node array 
         * using the node factory
         * @return {number}     The index of the element if inserted, -1 otherwise
         */
        scope.addItem = function( ignoreModel ) {
            if ( scope.itemFactory ) {
                // node items
                var index = scope.items.length;
                var child = scope.itemFactory( index )
                scope.items.push( child );
                // model items
                if ( ignoreModel !== true ) {
                    var items = scope.get();
                    if ( !items ) {
                        scope.set([{}])
                    }
                    else {
                        items.push({}); 
                    }
                    if ( !scope.options || scope.options.setSchemaDefaults !== false ) {
                        sfSchemaService.setDefaults( scope.schema, scope.model, child.arrayKey )
                    }
                }
                return index;
            }
            return -1;
        }

        /**
         * Allow the user to remove a node item to this node array
         * @param  {number}     index   The index of the node to delete
         * @return {number}             The index of the previous item if an element was deleted, the last otherwise
         */
        scope.removeItem = function( index ) {
            if ( scope.items.length > index ) {
                // Modify the node items list
                // We just have to delete the last item as the other nodes 
                // have already the good indexes
                scope.items.splice( -1, 1 );
                // Modify the linked model
                var items = scope.get();
                items.splice( index, 1 );
                return ( index || 1 ) - 1 ;
            }
            return scope.items.length - 1;
        }

        // --------------------------------------------------
        // Private

        function adaptArrayLength ( length ) {
            if ( !angular.isArray( scope.get() ) ) {
                scope.set([])
            }
            var delta   = length - scope.get().length;
            var method  = undefined; 
            // get method or return if length is egual to the array length
            if ( delta === 0 ) return;
            else if ( delta > 0 ) method = scope.addItem;
            else method = scope.removeItem;
            // apply delta time the method
            var result = delta;
            delta = Math.abs(delta);
            while ( delta-- ) {
                method.call( scope, scope.get().length - 1 );
            }
            return result;
        }

        function applyLength ( length ) {
            length = length || scope.schema.length
            if ( angular.isString( length ) ) {
                length = sfPath.select( sfPath.parse( length ), scope.model )
            }
            if ( angular.isNumber( length ) ) {
                adaptArrayLength( length );
            }
        }

        // --------------------------------------------------
        // Observers

        scope.changeCallbacks.push( function( newValue, oldValue, scope ) {
            // Applying length requirement
            var modified = applyLength();
            if ( !modified ) {
                // We validate the array each time it changes
                if ( scope.ngModel && scope.validateExternal ) {
                    scope.validateExternal();
                }
                else {
                    sfValidators.validate( scope, newValue );
                }
            }
        })

        // --------------------------------------------------
        // Model initialisation

        var length = scope.get() && scope.get().length || 0;
        
        // Adding the node items to match the current model array length
        for ( var index = 0; index < length; index++ ) {
            scope.addItem( true );
        }

        // If the array have a forced length
        if ( scope.schema.length ) {
            if ( angular.isString( scope.schema.length ) ) {
                var parsed  = sfPath.parse( scope.schema.length ) 
                scope.$watch( function(){
                    return sfPath.select( parsed, scope.model )
                }, function( newValue, oldValue ) {
                    if ( angular.isNumber( newValue ) ) {
                        applyLength( newValue );
                    }
                });
            }
            else {
                applyLength();
            }
        }
        // If the array need to have a minimum length
        else if ( scope.schema.startEmpty !== true ) {
            var minItems    = scope.schema.minItems || 0;
            if ( length < minItems ) {
                adaptArrayLength( scope.schema.minItems || 0 )
            }
        }


    }

}

export default sfNode;
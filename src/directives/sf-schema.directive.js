import angular from 'angular';

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

sfSchema.$inject = [ 'sfDecorators', 'sfBuilder', 'sfTemplate', 'sfForm', 'sfSchema' ]

function sfSchema ( sfDecorators, sfBuilder, sfTemplate, sfForm, sfSchemaService ) {

    return {
        replace: false,
        restrict: 'A',
        transclude: true,
        require: '?form',
        scope: {
            schema: '=sfSchema',
            initialForm: '=form',
            model: '=model',
            options: '=sfOptions'
        },
        controller: [ '$scope', 'sfPath', sfSchemaController ],
        link: link
    }

    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////

    function link (scope, element, attrs, formCtrl, transclude) {

        var defaultForm = ['*'];
        var ignore      = {};
        var lastDigest  = {};
        var childScope;


        // --------------------------------------------------
        // Properties

        // expose form controller on scope so that we don't force authors to use name on form
        scope.formCtrl = formCtrl;


        // --------------------------------------------------
        // Private

        // Common renderer function, can either be triggered by a watch or by an event.
        function render (schema, form) {

            scope.tree = sfForm.compile( form, schema, scope.model, scope.options, ignore );

            // Create a new form and destroy the old one.
            // Not doing keeps old form elements hanging around after
            // they have been removed from the DOM
            // https://github.com/Textalk/angular-schema-form/issues/200
            if (childScope) {
                // Destroy strategy should not be acted upon
                scope.externalDestructionInProgress = true;
                childScope.$destroy();
                scope.externalDestructionInProgress = false;
            }
            childScope = scope.$new();

            //make the form available to decorators
            childScope.schemaForm  = {
                form    : scope.tree, 
                schema  : schema
            };

            //clean all but pre existing html.
            element.children(':not(.schema-form-ignore)').remove();

            // Find all slots.
            var slots = {};
            var slotsFound = element[0].querySelectorAll('*[sf-insert-field]');

            for (var i = 0; i < slotsFound.length; i++) {
                slots[slotsFound[i].getAttribute('sf-insert-field')] = slotsFound[i];
            }

            // We need to know if we're in the first digest looping
            // I.e. just rendered the form so we know not to validate
            // empty fields.
            childScope.firstDigest = true;
            // We use a ordinary timeout since we don't need a digest after this.
            setTimeout(function() {
                childScope.firstDigest = false;
            }, 0);

            // Make sure that all the templates / fragments are loaded before launching the rendering
            sfTemplate
                .load()
                .then( function () {
                    // if sfUseDecorator is undefined the default decorator is used.
                    var decorator = sfDecorators.decorator(attrs.sfUseDecorator);
                    
                    // Use the builder to build it and append the result
                    sfBuilder.render( scope.tree, decorator, slots, undefined, element, childScope );

                    // Ok, now that that is done let's set any defaults
                    if (!scope.options || scope.options.setSchemaDefaults !== false) {
                        sfSchemaService.setDefaults( schema, scope.model, [], true )
                    }

                    scope.$emit('sf-render-finished', element);
                })
            ;
        }

        // --------------------------------------------------
        // Observers

        // We'd like to handle existing markup,
        // besides using it in our template we also
        // check for ng-model and add that to an ignore list
        // i.e. even if form has a definition for it or form is ["*"]
        // we don't generate it.
        transclude(scope, function(clone) {
            clone.addClass('schema-form-ignore');
            element.prepend(clone);

            if (element[0].querySelectorAll) {
                var models = element[0].querySelectorAll('[ng-model]');
                if (models) {
                    for (var i = 0; i < models.length; i++) {
                        var key = models[i].getAttribute('ng-model');
                        //skip first part before .
                        ignore[key.substring(key.indexOf('.') + 1)] = true;
                    }
                }
            }
        });

        // Since we are dependant on up to three
        // attributes we'll do a common watch
        scope.$watch(function() {

            var schema = scope.schema;
            var form   = scope.initialForm || defaultForm;

            //The check for schema.type is to ensure that schema is not {}
            if ( form 
                && schema 
                && schema.type 
                && (lastDigest.form !== form || lastDigest.schema !== schema) 
                && Object.keys(schema.properties).length > 0
            ) {
                lastDigest.schema = schema;
                lastDigest.form = form;
                render(schema, form);
            }
        });

        // We also listen to the event schemaFormRedraw so you can manually trigger a change if
        // part of the form or schema is chnaged without it being a new instance.
        scope.$on('schemaFormRedraw', function() {
            var schema = scope.schema;
            var form   = scope.initialForm ? angular.copy(scope.initialForm) : defaultForm;
            if (schema) {
                render(schema, form);
            }
        });

        scope.$on('$destroy', function() {
            // Each field listens to the $destroy event so that it can remove any value
            // from the model if that field is removed from the form. This is the default
            // destroy strategy. But if the entire form (or at least the part we're on)
            // gets removed, like when routing away to another page, then we definetly want to
            // keep the model intact. So therefore we set a flag to tell the others it's time to just
            // let it be.
            scope.externalDestructionInProgress = true;
        });
        
    }


    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////

    function sfSchemaController ( $scope, sfPath ) {

        var ctrl                = this;

        /**
         * Evaluate an expression, i.e. scope.$eval
         * but do it in parent scope
         *
         * @param {String} expression
         * @param {Object} locals (optional)
         * @return {Any} the result of the expression
         */
        
        $scope.evalExpr = function( expression, locals ) {
            return $scope.$parent.$eval( expression, locals );
        };

        // Initialisation of the controller properties & methods
        ctrl.evalExpr   = $scope.evalExpr;

        ctrl.lookup = function( lookup ) {
            var array   = sfPath.parse( lookup );
            var result  = array.reduce( function ( result, value ) {
                if ( angular.isArray( result ) ) {
                    return result[ Number( value ) ]
                }
                else if ( result && angular.isArray( result.items ) && result.items[ Number( value ) ] ){
                    return result.items[ Number( value ) ]
                }
                else if ( result && angular.isObject( result.properties ) ){
                    return result.properties[ value ]
                }
                return undefined
            }, $scope.tree )
            return result;
        };

    }

}

export default sfSchema;
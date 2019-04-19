import angular from 'angular';

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

sfSchemaProvider.$inject = [ 'sfValidatorsProvider', 'sfPathProvider' ];

/**
 * @ngdoc       service
 * @name        schemaForm.provider:sfSchemaProvider
 * @description Provider that is responsible for the schema management and schema validation
 * @requires    schemaForm.provider:sfValidatorsProvider
 */
function sfSchemaProvider ( sfValidatorsProvider, sfPathProvider ) {

    var provider    = this;

    // --------------------------------------------------
    // Public

    /**
     * @ngdoc                       method
     * @name                        schemaForm.provider:sfSchemaProvider#validate
     * @methodOf                    schemaForm.provider:sfSchemaProvider
     * @description                 Method that validate the value against its schema
     * @param  {Node}               node - Node containing the schema
     * @param  {any}                value - The value to validate
     * @return {object}             An object containing the validation result ( as valid ) and the potential errors
     */
    provider.validate = function ( node, value ) {
        if ( !node || !node.schema ) {
            return { valid: true };
        }
        return sfValidatorsProvider.validate( node, value )
    }

    /**
     * @ngdoc                       method
     * @name                        schemaForm.provider:sfSchemaProvider#compile
     * @methodOf                    schemaForm.provider:sfSchemaProvider
     * @description                 Method that compile a schema in order to add the references
     * @param  {Schema}             schema - the schema to compile
     * @return {Schema}             The schema compiled
     */
    provider.compile = function ( schema, value ) {
        provider.traverseSchema( schema, function( property, path ) {
            if ( angular.isDefined( property[ '$ref' ] ) ) {
                var projection  = property[ '$ref' ].replace( /#\//g, '' ).replace( /\//g, '.' );
                var definition  = sfPathProvider.select( projection, schema )
                angular.merge( property, definition )
            }
        })
    }

    /**
     * @ngdoc                       method
     * @name                        schemaForm.provider:sfSchemaProvider#setDefaults
     * @methodOf                    schemaForm.provider:sfSchemaProvider
     * @description                 Method that set the defaults in the model
     * @param  {Schema}             schema          The global schema to use
     * @param  {object}             model           The model to use
     * @param  {array}              path            (optional) The path to use
     * @param  {boolean}            ignoreArrays    (optional) Ignore the arrays items
     */
    provider.setDefaults = function ( schema, model, path, ignoreArrays ) {
        provider.traverseSchema( schema, function( prop, path ) {
            if ( angular.isDefined( prop['default'] ) ) {
                var val = sfPathProvider.select( path, model );
                if ( angular.isUndefined( val ) ) {
                    sfPathProvider.select( path, model, prop['default'] );
                }
            }
        }, path, ignoreArrays )
    }

    /**
     * @ngdoc                       method
     * @name                        schemaForm.provider:sfSchemaProvider#traverseSchema
     * @methodOf                    schemaForm.provider:sfSchemaProvider
     * @description                 Traverse a schema, applying a function(schema,path) on every sub schema
     * @param  {Schema}             schema          The global schema to use
     * @param  {function}           callback        The callback method 
     * @param  {array}              path            (optional) The path to use
     * @param  {boolean}            ignoreArrays    (optional) Ignore the arrays items
     */
    provider.traverseSchema = function( schema, callback, path, ignoreArrays ) {
        traverse( schema, callback, path || [], Boolean( ignoreArrays ) );
    }

    // --------------------------------------------------
    // Private

    // The function used by traverse schema to call a callback on each schema node
    var traverse = function( schema, callback, path, ignoreArrays ) {
        callback(schema, path);
        angular.forEach(schema.properties, function(prop, name) {
            var currentPath = path.slice();
            currentPath.push(name);
            traverse( prop, callback, currentPath, ignoreArrays );
        });

        //Only support type "array" which have a schema as "items".
        if (!ignoreArrays && schema.items) {
            traverse( schema.items, callback, path.slice(), ignoreArrays );
        }
    };

    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////

    // --------------------------------------------------
    // Service

    sfSchema.$inject    = [];
    provider.$get       = sfSchema;

    /**
     * @ngdoc       service
     * @name        schemaForm.service:sfSchema
     * @description Service that is responsible for all the template management
     */
    function sfSchema () {

        var service = this;

        // --------------------------------------------------
        // Public

        /**
         * @ngdoc                       method
         * @name                        schemaForm.service:sfSchema#validate
         * @methodOf                    schemaForm.service:sfSchema
         * @description                 Method that validate the value against its schema
         * @param  {Form}               form - Form containing the schema
         * @param  {any}                value - The value to validate
         * @return {object}             An object containing the validation result ( as valid ) and the potential errors
         */
        service.validate = provider.validate

        /**
         * @ngdoc                       method
         * @name                        schemaForm.service:sfSchema#setDefaults
         * @methodOf                    schemaForm.service:sfSchema
         * @description                 Method that set the defaults in the model
         * @param  {Schema}             schema          The global schema to use
         * @param  {object}             model           The model to use
         * @param  {array}              path            (optional) The path to use
        * @param  {boolean}             ignoreArrays    (optional) Ignore the arrays items
         */
        service.setDefaults = provider.setDefaults

        /**
         * @ngdoc                       method
         * @name                        schemaForm.service:sfSchema#traverseSchema
         * @methodOf                    schemaForm.service:sfSchema
         * @description                 Traverse a schema, applying a function(schema,path) on every sub schema
         * @param  {Schema}             schema          The global schema to use
         * @param  {function}           callback        The callback method 
         * @param  {array}              path            (optional) The path to use
         * @param  {boolean}            ignoreArrays    (optional) Ignore the arrays items
         */
        service.traverseSchema = provider.traverseSchema

        return service;
    }

}

export default sfSchemaProvider;
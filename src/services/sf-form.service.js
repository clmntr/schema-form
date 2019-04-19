import angular from 'angular';

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

sfFormProvider.$inject = [ 'sfPathProvider', 'sfTemplateProvider', 'sfSchemaProvider' ];

/**
 * @ngdoc       service
 * @name        schemaForm.provider:sfFormProvider
 * @description Provider that is responsible for the schema management and schema validation
 * @requires    schemaForm.provider:sfPathProvider
 * @requires    schemaForm.provider:sfTemplateProvider
 * @requires    schemaForm.provider:sfSchemaProvider
 */
function sfFormProvider ( sfPathProvider, sfTemplateProvider, sfSchemaProvider ) {

    var provider    = this;

    // --------------------------------------------------
    // Properties

    /**
     * @ngdoc                       property
     * @name                        schemaForm.provider:sfFormProvider#handlers
     * @propertyOf                  schemaForm.provider:sfFormProvider
     * @description                 Object that contains the type handlers called when no form type is provided
     *                              They are called with the schema
     */
    provider.handlers = {
        string  : [
            function( schema ) { return schema.type.indexOf("string") !== -1 && schema['enum'] && "select" },
            function( schema ) { return schema.type.indexOf("string") !== -1 && !schema['enum'] && "text" }
        ],
        object  : [
            function( schema ) { return schema.type.indexOf("object") !== -1 && "fieldset" }
        ],
        number  : [
            function( schema ) { return schema.type.indexOf("number") !== -1 && "number" }
        ],
        integer : [
            function( schema ) { return schema.type.indexOf("integer") !== -1 && "number" }
        ],
        boolean : [
            function( schema ) { return schema.type.indexOf("boolean") !== -1 && "checkbox" }
        ],
        array   : [
            function( schema ) { return schema.type.indexOf("array") !== -1 && schema.items && schema.items['enum'] && "checkboxes" },
            function( schema ) { return schema.type.indexOf("array") !== -1 && "array" },
        ]
    }

    // --------------------------------------------------
    // Public

    /**
     * @ngdoc                       method
     * @name                        schemaForm.provider:sfFormProvider#compile
     * @methodOf                    schemaForm.provider:sfFormProvider
     * @description                 Method that compile the form
     * @param  {Form}               form        The form to compile
     * @param  {Schema}             schema      The schema linked to the form
     * @param  {object}             model       The model linked to this schemaForm
     * @param  {object}             options     The options passed to the schemaForm
     * @param  {object}             ignored     The ignored list
     * @return {object}                         The compiled tree
     */
    provider.compile = function ( form, schema, model, options, ignored ) {
        // Patch values
        form            = form || ['*'];
        sfSchemaProvider.compile( schema );
        // Variables
        var tokenIndex  = form.indexOf('*');
        // If we have the token '*', we are adding all the properties of the schema
        if ( tokenIndex >= 0 && schema.properties ) {
            Array.prototype.splice.apply( form, [ tokenIndex, 1 ].concat( Object.keys( schema.properties ) ) );
        }
        // Compile the form
        return compileArray( form, {}, {
            schema  : schema,
            model   : model,
            options : options,
            ignored : ignored
        });
    }

    // --------------------------------------------------
    // Private

    function getSchemaProperty ( arrayKey, schema ) {
        if ( arrayKey.length === 1 ) {
            return {
                parent      : schema,
                property    : schema.properties && schema.properties[ arrayKey[ 0 ] ] || {}
            }
        }
        else {
            var key = arrayKey[ 0 ];
            if ( key === "" ) {
                return getSchemaProperty( arrayKey.slice( 1 ), schema )
            }
            else {
                var child = schema.properties[ key ] || {}
                var array = arrayKey.slice( 1 );
                // If we have an array seed ( array[] )
                if ( array.length === 1 && angular.isObject( child.items ) ) {
                    return {
                        parent      : child,
                        property    : child.items
                    }
                }
                else if ( child.items ) {
                    return getSchemaProperty( array, child.items );
                }
                else if ( child.properties ) {
                    return getSchemaProperty( array, child )
                }
            }
        }
        return {};
    }

    // Compile schema property
    function compileProperty ( key, property, parent, root ) {
        var compiled = angular.merge({}, property );
        var required = parent.required && parent.required.indexOf( key ) !== -1;
        // Compiling schema form attributes
        compiled[ 'x-schema-form' ] = angular.merge({}, root[ 'x-schema-form' ], property[ 'x-schema-form' ] );
        if ( !compiled.required ) {
            compiled[ 'x-schema-form' ].required = required;
        }
        if ( root.readonly === true ) {
            compiled[ 'x-schema-form' ].readonly = true;
        }
        return compiled;
    }


    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////

    // --------------------------------------------------
    // Service

    sfForm.$inject  = [];
    provider.$get   = sfForm;

    /**
     * @ngdoc       service
     * @name        schemaForm.service:sfForm
     * @description Service that is responsible for all the template management
     */
    function sfForm () {

        var service = this;

        // --------------------------------------------------
        // Public

        /**
         * @ngdoc                       method
         * @name                        schemaForm.service:sfForm#compile
         * @methodOf                    schemaForm.service:sfForm
         * @description                 Method that compile the value against its schema
         * @param  {Form}               form        The form to compile
         * @param  {Schema}             schema      The schema linked to the form
         * @param  {object}             model       The model linked to this schemaForm
         * @param  {object}             options     The options passed to the schemaForm
         * @param  {object}             ignored     The ignored list
         * @return {object}                         The compiled tree
         */
        service.compile = provider.compile


        return service;
    }


    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////

    // --------------------------------------------------
    // Tree utils

    function compileArray ( array, parentNode, config, fromSchema ) {
        var subtree = [];
        angular.forEach( array, function( item, index ) {
            if ( fromSchema ) {
                item = parentNode.key + "[]." + item.key;
            }
            // Append the node to the subtree
            subtree.push( new Node( item, parentNode, config, index ) )
        });
        return subtree;
    }

    function compileObject ( object, parentNode, config, fromSchema ) {
        var subtree = {};
        angular.forEach( object, function( item, index ) {
            if ( fromSchema ) {
                item = parentNode.key + "." + index;
            }
            // Append the node to the subtree
            subtree[ index ] = new Node( item, parentNode, config, index )
        });
        return subtree;
    }

    function getTemplateType ( type, schema ) {
        if ( provider.handlers[ type ] ) {
            return provider.handlers[ type ].reduce( function ( type, handler ) {
                if ( type ) return type;
                return handler( schema );
            }, false );
        }
        return undefined;
    }

    // --------------------------------------------------
    // Node Object

    function Node ( form, parentNode, config, index ) {

        var node    = this;

        // --------------------------------------------------
        // Public

        node.set = function( value ) {
            if ( node.schema ) {
                return sfPathProvider.select( node.arrayKey, node.model, value )
            }
            return undefined;
        }

        node.get = function() {
            if ( node.schema ) {
                return sfPathProvider.select( node.arrayKey, node.model )
            }
            return undefined;
        }

        node.getSet = function ( value ) {
            return node.set( value );
        }

        /**
         * Method that create a node item based on the current one
         * @param  {number}     index   The index of the node to create
         * @return {Node}               The created node
         */
        node.itemFactory = function( index ) {
            var seed = {
                key         : node.key + "[]",
                filledKey   : node.key + "[" + index + "]",
            }
            // When the node is an array and we have array[].property in the form items
            // we have to 'recreate' the properties object
            if ( angular.isObject( node.schema.items ) && angular.isArray( node.form.items ) ) {
                seed.properties = node.form.items.reduce( function ( properties, item ) {
                    var finalKey = sfPathProvider.parse( item.key ).slice( -1 )[0]
                    var property = angular.merge( {
                        filledKey : seed.filledKey + '.' + finalKey
                    }, item );
                    properties[ finalKey ] = property;
                    return properties;
                }, {});
            }
            // If schema items is an array then we continue with the form items
            else if ( angular.isArray( node.schema.items ) && angular.isArray( node.form.items ) ) {
                seed.items = node.form.items;
            }
            return new Node( seed, node, config, index );
        }

        // --------------------------------------------------
        // Private


        function constructor () {
            node.id         = parentNode.id ? String( parentNode.id ) + '.' + String( index ) : String( index )
            node.type       = "section";
            node.model      = config.model;
            node.options    = config.options;
            // If we have an inline form
            if ( angular.isString( form ) ) {
                form    = { key : form }
            }
            // Extract the node data linked to the key
            if ( form.key ) {
                // Set the keys
                node.key        = form.filledKey || form.key;
                node.arrayKey   = sfPathProvider.parse( node.key );
                node.finalKey   = node.arrayKey[ node.arrayKey.length - 1 ];
                // Getting the schema 
                var prop        = getSchemaProperty( sfPathProvider.parse( form.key ), config.schema )
                node.schema     = compileProperty( node.finalKey, prop.property, prop.parent, config.schema )
                if ( !node.schema.type ) {
                    console.error( "Schema not found for the form key : " + node.key );
                    return {}
                }
                // If we have a key but we do not have a form type, we use the defaults 
                if ( !form.type ) {
                    if ( angular.isArray( node.schema.type ) ) {
                        for ( var i in node.schema.type ) {
                            node.templateType = getTemplateType( node.schema.type[ i ], node.schema );
                            if ( node.templateType ) {
                                node.type = node.schema.type[ i ];
                                break;
                            }
                        }
                    }
                    else {
                        node.templateType = getTemplateType( node.schema.type, node.schema );
                    }
                }
                // Patch the node type depending on the schema type
                if ( node.type == "section" && node.schema.type ) {
                    node.type = node.schema.type;
                }
            }
            // Add & merge the form to the schema
            if ( form ) {
                var schema      = node.schema;
                var seed        = angular.merge( {}, node.options && node.options.formDefaults );
                // Inherit from parent node
                if ( parentNode.form ) {
                    seed.readonly = parentNode.form.readonly;
                }
                // Inherit from schema 
                if ( schema ) {
                    if ( schema.title )
                        seed.title              = schema.title;
                    if ( schema.description )
                        seed.description        = schema.description;
                    if ( schema.required )
                        seed.required           = schema.required;
                    if ( schema.readonly )
                        seed.readonly           = schema.readonly;
                    if ( schema.maxlength || schema.maxLength )
                        seed.maxlength          = schema.maxlength || schema.maxLength;
                    if ( schema.minlength || schema.minLength )
                        seed.minlength          = schema.minlength || schema.minLength;
                    if ( schema.minimum )
                        seed.minimum            = schema.minimum + ( schema.exclusiveMinimum ? 1 : 0 );
                    if ( schema.maximum )
                        seed.maximum            = schema.maximum - ( schema.exclusiveMaximum ? 1 : 0 );
                    if ( schema.validationMessage ) 
                        seed.validationMessage  = schema.validationMessage;
                    if ( schema.enum && !form.titleMap && !schema['x-schema-form'].titleMap ) {
                        seed.titleMap = schema.enum.map( function ( item ) {
                            return { value : item, name : item }
                        });
                    }
                }
                node.form       = angular.merge( seed, schema ? schema['x-schema-form'] : {}, form );
            }
            // Add the template-related properties if not defined
            if ( !node.templateType ) {
                node.templateType   = node.form.type || 'default';
            }
            if ( node.form.template ) {
                node.template   = sfTemplateProvider.addTemplateString( node.form.template );
            }
            else if ( node.form.templateUrl ) {
                node.template   = sfTemplateProvider.addTemplateUrl( node.form.templateUrl )
            }
            if ( node.form.decorator ) {
                node.decorator = node.form.decorator;
            }
            if ( node.form.builder ) {
                node.builder = node.form.builder;
            }
            // Adding condition
            if ( node.form.condition ) {
                node.condition  = node.form.condition;
            }
            // Compile all sub items
            node.items      = [];
            node.properties = {};
            if ( angular.isArray( node.form.items ) && node.type !== "array" ) {
                node.items  = compileArray( node.form.items, node, config );
            }
            else if ( angular.isObject( node.form.properties ) ) {
                node.properties = compileObject( node.form.properties, node, config );
            }
            else if ( node.schema && node.schema.items && !angular.isObject( node.schema.items )) {
                node.items  = compileArray( node.schema.items, node, config, true );
            }
            else if ( node.schema && angular.isObject( node.schema.properties ) ) {
                node.properties = compileObject( node.schema.properties, node, config, true );
            }

            return node;
        }

        // Initialisation
        return constructor();
    }

}

export default sfFormProvider;
import angular from 'angular';

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

sfPathProvider.$inject = [];

/**
 * @ngdoc       service
 * @name        schemaForm.provider:sfPathProvider
 * @requires    ObjectPath
 */
function sfPathProvider () {

    var provider = this;

    // When building with browserify ObjectPath is available as `objectpath` but othwerwise
    // it's called `ObjectPath`.
    var ObjectPath = window.ObjectPath;

    /**
     * @ngdoc       method
     * @name        schemaForm.provider:sfPathProvider#parse
     * @methodOf    schemaForm.provider:sfPathProvider
     * @description Method linked to the ObjectPath parse function
     */
    provider.parse      = ObjectPath.parse;

    /**
     * @ngdoc       method
     * @name        schemaForm.provider:sfPathProvider#stringify
     * @methodOf    schemaForm.provider:sfPathProvider
     * @description Method linked to the ObjectPath stringify function
     */
    provider.stringify  = ObjectPath.stringify;

    /**
     * @ngdoc       method
     * @name        schemaForm.provider:sfPathProvider#normalize
     * @methodOf    schemaForm.provider:sfPathProvider
     * @description Method that parse any object then stringify it
     */
    provider.normalize  = function(data, quote) {
        return provider.stringify(Array.isArray(data) ? data : provider.parse(data), quote);
    };

    /**
     * @ngdoc       method
     * @name        schemaForm.provider:sfPathProvider#hash
     * @methodOf    schemaForm.provider:sfPathProvider
     * @description Method that parse any object then stringify it
     */
    provider.hash  = function( string ) {
        var hash = 0, i, char;
        if ( string.length === 0) {
            return hash;
        }
        for ( i = 0; i < string.length; i++ ) {
            char    = string.charCodeAt(i);
            hash    = ((hash << 5) - hash) + char;
            hash   |= 0;
        }
        return hash;
    };

    /**
     * @ngdoc       method
     * @name        schemaForm.provider:sfPathProvider#getModelAccessor
     * @methodOf    schemaForm.provider:sfPathProvider
     * @description Method that return the model accessor of a node
     * @param   {string}    key                     The node key
     * @param   {string}    modelName   (optional)  The modelName to use
     * @returns {string}                            The model accessor
     */
    provider.getModelAccessor  = function ( key, modelName ) {
        if ( key ) {
            var strKey      = provider.stringify(key).replace(/"/g, '&quot;');
            var modelValue  = ( modelName || 'model' );
            // Sometimes, like with arrays directly in arrays strKey is nothing.
            if ( strKey ) {
                modelValue += (strKey[0] !== '[' ? '.' : '') + strKey;
            }
            return modelValue;
        }
        return null;
    }

    /**
     * @ngdoc           method
     * @name            schemaForm.provider:sfPathProvider#hash
     * @methodOf        schemaForm.provider:sfPathProvider
     * @description     Utility method to access deep properties without
     *                  throwing errors when things are not defined.
     *                  Can also set a value in a deep structure, creating objects when missing
     * @param {string}  projection              A dot path to the property you want to get/set
     * @param {object}  obj         (optional)  The object to project on, defaults to 'this'
     * @param {Any}     valueToSet  (opional)   The value to set, if parts of the path of
     *                                          the projection is missing empty objects will be created.
     * @param {boolean} force       (optional)  Force the set mode
     * @returns {Any|undefined}                 returns the value at the end of the projection path
     *                                          or undefined if there is none.
     */
    provider.select = function ( projection, obj, valueToSet, force ) {
        if (!obj) {
            obj = this;
        }
        //Support [] array syntax
        var parts       = typeof projection === 'string' ? provider.parse(projection) : projection;
        var writeMode   = typeof valueToSet !== 'undefined' || force === true;

        if ( writeMode && parts.length === 1) {
            //special case, just setting one variable
            obj[parts[0]] = valueToSet;
            return obj;
        }

        if ( writeMode && typeof obj[parts[0]] === 'undefined') {
             // We need to look ahead to check if array is appropriate
            obj[parts[0]] = parts.length > 2 && /^\d+$/.test(parts[1]) ? [] : {};
        }

        var value = obj[parts[0]];
        for (var i = 1; i < parts.length; i++) {
            // Special case: We allow JSON Form syntax for arrays using empty brackets
            // These will of course not work here so we exit if they are found.
            if (parts[i] === '') {
                return undefined;
            }
            if ( writeMode ) {
                if (i === parts.length - 1) {
                    //last step. Let's set the value
                    value[parts[i]] = valueToSet;
                    return valueToSet;
                } else {
                    // Make sure to create new objects on the way if they are not there.
                    // We need to look ahead to check if array is appropriate
                    var tmp = value[parts[i]];
                    if (typeof tmp === 'undefined' || tmp === null) {
                        tmp = /^\d+$/.test(parts[i + 1]) ? [] : {};
                        value[parts[i]] = tmp;
                    }
                    value = tmp;
                }
            } else if (value) {
                //Just get nex value.
                value = value[parts[i]];
            }
        }
        return value;
    }

    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////

    // --------------------------------------------------
    // Service

    /**
     * @ngdoc       service
     * @name        schemaForm.service:sfPath
     */
    provider.$get = function() {
        return { 
            parse               : provider.parse,
            stringify           : provider.stringify,
            normalize           : provider.normalize,
            hash                : provider.hash,
            getModelAccessor    : provider.getModelAccessor,
            select              : provider.select,
        };
    }
}

export default sfPathProvider;
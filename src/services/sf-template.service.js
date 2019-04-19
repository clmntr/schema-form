import angular from 'angular';

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

sfTemplateProvider.$inject = [ 'sfPathProvider' ];

/**
 * @ngdoc       service
 * @name        schemaForm.provider:sfTemplateProvider
 * @description Provider that is responsible for all the template management
 * @requires    schemaForm.provider:sfPathProvider
 */
function sfTemplateProvider ( sfPathProvider ) {

    var provider    = this;
    var queue       = {};
    var fallback    = undefined;

    /**
     * @ngdoc       property
     * @name        schemaForm.provider:sfTemplateProvider#fragments
     * @propertyOf  schemaForm.provider:sfTemplateProvider
     * @description All fragments availables
     */
    provider.fragments = {};

    // --------------------------------------------------
    // Public

    /**
     * @ngdoc                       method
     * @name                        schemaForm.provider:sfTemplateProvider#setDefault
     * @methodOf                    schemaForm.provider:sfTemplateProvider
     * @description                 Method that set the default template
     * @param  {number|string}      hash or templateUrl
     * @return {hash}               default hash
     */
    provider.setDefault = function ( value ) {
        if ( angular.isString( value ) ) {
            fallback = sfPathProvider.hash( value );
        }
        else {
            fallback = value;
        }
        return fallback
    }

    /**
     * @ngdoc                       method
     * @name                        schemaForm.provider:sfTemplateProvider#getFragment
     * @methodOf                    schemaForm.provider:sfTemplateProvider
     * @description                 Method that return the clone of the template requested or the default if not found
     * @param  {number|string}      hash or templateUrl
     * @return {DocumentFragment}   fragment
     */
    provider.getFragment = function ( hash ) {
        if ( angular.isString( hash ) ) {
            hash = sfPathProvider.hash( hash );
        }
        var fragment = provider.fragments[ hash ] || provider.fragments[ fallback ] || document.createDocumentFragment();
        return fragment.cloneNode( true );
    }

    /**
     * @ngdoc                       method
     * @name                        schemaForm.provider:sfTemplateProvider#addTemplateString
     * @methodOf                    schemaForm.provider:sfTemplateProvider
     * @description                 
     * @param  {string}             templateString 
     * @return {number}             hash
     */
    provider.addTemplateString = function ( templateString ) {
        var hash = sfPathProvider.hash( templateString );
        if ( !provider.fragments[ hash ] ) {
            addFragment( hash, templateString );
        }
        return hash;
    }

    /**
     * @ngdoc                       method
     * @name                        schemaForm.provider:sfTemplateProvider#addTemplateUrl
     * @methodOf                    schemaForm.provider:sfTemplateProvider
     * @description                 
     * @param  {string}             templateUrl 
     * @return {number}             hash
     */
    provider.addTemplateUrl = function ( templateUrl ) {
        if ( !queue[ templateUrl ] ) {
            var hash = sfPathProvider.hash( templateUrl );
            if ( !provider.fragments[ hash ] ) {
                queue[ templateUrl ] = hash;
            }
            return hash;
        }
        return queue[ templateUrl ];
    }

    // --------------------------------------------------
    // Private

    // Create a document fragment based on the template string given
    function processTemplate ( templateString ) {
        var fragment    = document.createDocumentFragment();
        var div         = document.createElement('div');
        div.innerHTML   = templateString;
        while ( div.childNodes.length > 0 ) {
            fragment.appendChild( div.childNodes[0] );
        }
        return fragment;
    }

    function addFragment ( hash, templateString ) {
        provider.fragments[ hash ] = processTemplate( templateString );
        return hash;
    }

    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////

    // --------------------------------------------------
    // Service

    sfTemplate.$inject  = [ '$q', '$http', '$templateCache' ];
    provider.$get       = sfTemplate

    /**
     * @ngdoc       service
     * @name        schemaForm.service:sfTemplate
     * @description Service that is responsible for all the template management
     * @requires    $q
     * @requires    $templateCache
     * @requires    $compile
     */
    function sfTemplate ( $q, $http, $templateCache ) {

        var service = this;

        // --------------------------------------------------
        // Public

        /**
         * @ngdoc                       method
         * @name                        schemaForm.service:sfTemplate#getFragment
         * @methodOf                    schemaForm.service:sfTemplate
         * @description                 Method that return the clone of the template requested or the default if not found
         * @param  {number|string}      hash or templateUrl
         * @return {DocumentFragment}   fragment
         */
        service.getFragment = provider.getFragment

        /**
         * @ngdoc                       method
         * @name                        schemaForm.service:sfTemplate#addTemplateString
         * @methodOf                    schemaForm.service:sfTemplate
         * @description                 
         * @param  {string}             templateString 
         * @return {number}             hash
         */
        service.addTemplateString = provider.addTemplateString

        /**
         * @ngdoc                       method
         * @name                        schemaForm.service:sfTemplate#addTemplateUrl
         * @methodOf                    schemaForm.service:sfTemplate
         * @description                 
         * @param  {string}             templateUrl 
         * @return {number}             hash
         */
        service.addTemplateUrl = provider.addTemplateUrl

        /**
         * @ngdoc                       method
         * @name                        schemaForm.service:sfTemplate#load
         * @methodOf                    schemaForm.service:sfTemplate
         * @description                 
         * @return {Promise}            
         */
        service.load = function () {
            return $q
                .all( Object.entries( queue ).map( function( array ) {
                    if ( !provider.fragments[ array[ 1 ] ] ) {
                        var templateString = $templateCache.get( array[ 0 ] );
                        if ( templateString ) {
                            return addFragment( array[ 1 ], templateString );
                        }
                        return $http
                            .get( array[ 0 ], { cache: $templateCache } )
                            .then( function( templateString ) {
                                return addFragment( array[ 1 ], templateString );
                            });
                    }
                    return $q.when( array[ 1 ] )
                }))
                .then( function( result ) {
                    queue = {};
                })
        }

        return service;
    }

}

export default sfTemplateProvider;
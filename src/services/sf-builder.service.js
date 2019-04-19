import angular from 'angular';

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

sfBuilderProvider.$inject = [ 'sfPathProvider', 'sfTemplateProvider' ];

/**
 * @ngdoc       service
 * @name        schemaForm.provider:sfBuilderProvider
 * @requires    $templateCache
 * @requires    schemaForm.provider:sfPathProvider
 * @requires    schemaForm.provider:sfTemplateProvider
 */
function sfBuilderProvider ( sfPathProvider, sfTemplateProvider ) {

    var provider = this;


    // --------------------------------------------------
    // Variables

    var SNAKE_CASE_REGEXP = /[A-Z]/g;

    // --------------------------------------------------
    // Properties

    /**
     * @ngdoc       property
     * @name        schemaForm.provider:sfBuilderProvider#builders
     * @propertyOf  schemaForm.provider:sfBuilderProvider
     * @description All builders availables
     */
    provider.builders       = {
        sfNode: function(args) {
            args.fieldFrag.firstChild.setAttribute('sf-node', args.node.id );
        },
        simpleTransclusion: function(args) {
            var children = args.build(args.node.items, args.path + '.items', args.state);
            args.fieldFrag.firstChild.appendChild(children);
        },
        // Patch on ngModelOptions, since it doesn't like waiting for its value.
        ngModelOptions: function(args) {
            if (args.node.form && args.node.form.ngModelOptions && Object.keys(args.node.form.ngModelOptions).length > 0) {
                args.fieldFrag.firstChild.setAttribute('ng-model-options', JSON.stringify(args.node.form.ngModelOptions));
            }
        },
        transclusion: function(args) {
            var transclusions = args.fieldFrag.querySelectorAll('[sf-field-transclude]');

            if (transclusions.length) {
                for (var i = 0; i < transclusions.length; i++) {
                    var n = transclusions[i];

                    // The sf-transclude attribute is not a directive,
                    // but has the name of what we're supposed to
                    // traverse. Default to `items`
                    var sub = n.getAttribute('sf-field-transclude') || 'items';
                    var items = args.node.form[sub];

                    if (items) {
                        var childFrag = args.build(items, args.path + '.' + sub, args.state);
                        n.appendChild(childFrag);
                    }
                }
            }
        },
        condition: function(args) {
            // Do we have a condition? Then we slap on an ng-if on all children,
            // but be nice to existing ng-if.
            if (args.node.condition) {
                var evalExpr = 'evalExpr(\'' + safeString(args.node.condition) + '\', { model: model, "arrayIndex": $index})';
                if (args.node.arrayKey) {
                    var strKey = sfPathProvider.stringify(args.node.arrayKey);
                    evalExpr = 'evalExpr(\'' + safeString(args.node.condition) + '\', { model: model, "arrayIndex": $index, ' +
                                         '"modelValue": model' + (strKey[0] === '[' ? '' : '.') + strKey + '})';
                }

                var children = args.fieldFrag.children || args.fieldFrag.childNodes;
                for (var i = 0; i < children.length; i++) {
                    var child = children[i];
                    var ngIf = child.getAttribute('ng-if');
                    child.setAttribute(
                        'ng-if',
                        ngIf ?
                        '(' + ngIf +
                        ') || (' + evalExpr + ')'
                        : evalExpr
                    );
                }
            }
        }
    };

    /**
     * @ngdoc       property
     * @name        schemaForm.provider:sfBuilderProvider#builders
     * @propertyOf  schemaForm.provider:sfBuilderProvider
     * @description Standard builders used by default
     */
    provider.stdBuilders    = [
        provider.builders.sfNode,
        provider.builders.ngModelOptions,
        provider.builders.condition
    ];

    // --------------------------------------------------
    // Private

    function snakeCase (name, separator) {
        separator = separator || '_';
        return name.replace(SNAKE_CASE_REGEXP, function(letter, pos) {
            return (pos ? separator : '') + letter.toLowerCase();
        });
    }

    function safeString ( string ) {
        return string.replace(/\'/g, '\\\'').replace(/\"/g, '\\\"')
    }

    function checkForSlot (node, slots) {
        // Finally append this field to the frag.
        // Check for slots
        if (node.arrayKey) {
            var slot = slots[sfPathProvider.stringify(node.arrayKey)];
            if (slot) {
                while (slot.firstChild) {
                    slot.removeChild(slot.firstChild);
                }
                return slot;
            }
        }
    }

    // Main function that build the all form
    function build ( tree, decorator, slots, path, state ) {
        state           = state     || {};
        provider.state  = state;
        path            = path      || 'schemaForm.form';
        var container   = document.createDocumentFragment();
        tree.reduce( function( frag, node, index ) {

            // Sanity check.
            if (!node.templateType) {
                return frag;
            }

            var field       = decorator[node.templateType] || decorator['default'];
            var fragment    = sfTemplateProvider.getFragment( node.template || field.template );

            if ( fragment ) {
                // Let the form definiton override builders if it wants to.
                var builders    = node.builder || field.builder;
                var args        = {
                    fieldFrag   : fragment,
                    node        : node,
                    state       : state,
                    path        : path + '[' + index + ']',
                    // Recursive build fn
                    build: function( tree, path, state ) {
                        return build( tree, decorator, slots, path, state );
                    },
                }

                // Patch builders, only array accepted
                if ( typeof builders === 'function' ) {
                    builders = [ builders ];
                }

                // Build the template
                angular.forEach( builders, function( builder, key ){
                    builder( args )
                });

                // Append to the main fragment
                (checkForSlot(node, slots) || frag).appendChild( fragment );
            }

            return frag;
        }, container);

        return container;
    }


    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////

    // --------------------------------------------------
    // Service

    sfBuilder.$inject   = [ '$templateCache', '$compile', 'sfDecorators' ]
    provider.$get       = sfBuilder;

    /**
     * @ngdoc       service
     * @name        schemaForm.service:sfBuilder
     * @requires    $templateCache
     * @requires    $compile
     * @requires    schemaForm.service:sfDecorators
     */
    function sfBuilder ( $templateCache, $compile, sfDecorators ) {

        var service = this;

        /**
         * @ngdoc       property
         * @name        schemaForm.service:sfBuilder#builders
         * @propertyOf  schemaForm.service:sfBuilder
         * @description All builders availables 
         */
        service.builders = provider.builders;

        /**
         * @ngdoc       property
         * @name        schemaForm.service:sfBuilder#stdBuilders
         * @propertyOf  schemaForm.service:sfBuilder
         * @description Standard builders used by default
         */
        service.stdBuilders = provider.stdBuilders;

        // --------------------------------------------------
        // Public

        /**
         * @ngdoc               method
         * @name                schemaForm.service:sfBuilder#build
         * @methodOf            schemaForm.service:sfBuilder
         * @description         Method that build the DOM linked to a form
         * @param  {object}     form 
         * @param  {object}     decorator 
         * @param  {array}      slots 
         * @return {string}     model accessor 
         */
        service.build = function( tree, decorator, slots, path ) {
            decorator = decorator || sfDecorators.decorator();
            // Builder is only handling arrays
            if ( !angular.isArray( tree ) ) {
                tree = [ tree ];
            }
            return build(tree, decorator, slots, path, undefined);
        }

        /**
         * @ngdoc               method
         * @name                schemaForm.service:sfBuilder#render
         * @methodOf            schemaForm.service:sfBuilder
         * @description         Method that build the DOM linked to a form, inject it inside the element and compile it
         * @param  {object}     form  
         * @param  {object}     decorator 
         * @param  {array}      slots 
         * @param  {object}     element 
         * @param  {object}     scope 
         * @return {string}     model accessor
         */
        service.render = function( tree, decorator, slots, path, element, scope ) {
            element[0].appendChild( service.build( tree, decorator, slots, path ) );
            $compile( element.children() )( scope );
        }

        return service
    }

}

export default sfBuilderProvider
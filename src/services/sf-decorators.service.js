import angular from 'angular';

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

sfDecoratorsProvider.$inject = [ '$compileProvider', 'sfPathProvider', 'sfBuilderProvider', 'sfTemplateProvider' ]

function sfDecoratorsProvider ( $compileProvider, sfPathProvider, sfBuilderProvider, sfTemplateProvider ) {

    var defaultDecorator = '';
    var decorators = {};

    /**
     * Define a decorator. A decorator is a set of form types with templates and builder functions
     * that help set up the form.
     *
     * @param {string} name directive name (CamelCased)
     * @param {Object} fields, an object that maps "type" => `{ template, builder, replace}`.
                                         attributes `builder` and `replace` are optional, and replace defaults to true.

                                         `template` should be the key of the template to load and it should be pre-loaded
                                         in `$templateCache`.

                                         `builder` can be a function or an array of functions. They will be called in
                                         the order they are supplied.

                                         `replace` (DEPRECATED) is for backwards compatability. If false the builder
                                         will use the "old" way of building that form field using a <sf-decorator>
                                         directive.
     */
    this.defineDecorator = function(name, fields) {
        decorators[name] = {'__name': name}; // TODO: this feels like a hack, come up with a better way.

        angular.forEach(fields, function(field, type) {
            field.builder   = field.builder || sfBuilderProvider.stdBuilders;
            field.replace   = angular.isDefined(field.replace) ? field.replace : true;
            field.template  = sfTemplateProvider.addTemplateUrl( field.template );
            if ( type === 'default' ) {
                sfTemplateProvider.setDefault( field.template );
            }
            decorators[name][type] = field;
        });

        if (!decorators[defaultDecorator]) {
            defaultDecorator = name;
        }
    };

    /**
     * Getter for decorator settings
     * @param {string} name (optional) defaults to defaultDecorator
     * @return {Object} rules and templates { rules: [],templates: {}}
     */
    this.decorator = function(name) {
        name = name || defaultDecorator;
        return decorators[name];
    };

    /**
     * Adds an add-on to an existing decorator.
     * @param {String} name Decorator name
     * @param {String} type Form type for the mapping
     * @param {String} url  The template url
     * @param {Function|Array} builder (optional) builder function(s),
     */
    this.defineAddOn = function(name, type, url, builder) {
        if (decorators[name]) {
            var hash = sfTemplateProvider.addTemplateUrl( url )
            decorators[name][type] = {
                template: hash,
                builder: builder,
                replace: true
            };
            if ( type === 'default' ) {
                sfTemplateProvider.setDefault( hash );
            }
        }
    };

    //Service is just a getter for directive templates and rules
    this.$get = function() {
        return {
            decorator: function(name) {
                return decorators[name] || decorators[defaultDecorator];
            },
            defaultDecorator: defaultDecorator
        };
    };

}

export default sfDecoratorsProvider;
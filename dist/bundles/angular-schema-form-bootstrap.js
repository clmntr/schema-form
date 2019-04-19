/*!
 * angular-schema-form
 * @version 0.0.1
 * @date Thu, 18 Apr 2019 08:29:02 GMT
 * @link https://github.com/json-schema-form/angular-schema-form
 * @license MIT
 * Copyright (c) 2014-2019 JSON Schema Form
 */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = angular;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = tv4;

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(angular__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var tv4__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1);
/* harmony import */ var tv4__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(tv4__WEBPACK_IMPORTED_MODULE_1__);



angular__WEBPACK_IMPORTED_MODULE_0___default.a
    .module( 'schemaForm' )
    .config( addValidator )
;

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

addValidator.$inject = [ 'sfValidatorsProvider' ];

function addValidator ( sfValidatorsProvider ) {

    sfValidatorsProvider.addValidator( 'tv4', {

        // Good old tv4 validation function.
        // The value should either be of proper type or a string, some type
        // coercion is applied.
        validate : function( node, value ) {

            // Input of type text and textareas will give us a viewValue of ''
            // when empty, this is a valid value in a schema and does not count as something
            // that breaks validation of 'required'. But for our own sanity an empty field should
            // not validate if it's required.
            if (value === '') {
                value = undefined;
            }

            // Some fields will give a null value, which also means empty field
            if ( node.schema.type.indexOf( 'null' ) === -1 && value === null ) {
                value = undefined;
            }

            // Version 4 of JSON Schema has the required property not on the
            // property itself but on the wrapping object. Since we like to test
            // only this property we wrap it in a fake object.
            var wrap = {type: 'object', 'properties': {}};
            var propName = node.finalKey;
            wrap.properties[propName] = node.schema;

            if (node.form.required) {
                wrap.required = [propName];
            }
            var valueWrap = {};
            if (angular__WEBPACK_IMPORTED_MODULE_0___default.a.isDefined(value)) {
                valueWrap[propName] = value;
            }
            return tv4__WEBPACK_IMPORTED_MODULE_1___default.a.validateResult(valueWrap, wrap);
        }
    })

}

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: external "angular"
var external_angular_ = __webpack_require__(0);
var external_angular_default = /*#__PURE__*/__webpack_require__.n(external_angular_);

// CONCATENATED MODULE: ./src/services/sf-builder.service.js


//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

sf_builder_service_sfBuilderProvider.$inject = [ 'sfPathProvider', 'sfTemplateProvider' ];

/**
 * @ngdoc       service
 * @name        schemaForm.provider:sfBuilderProvider
 * @requires    $templateCache
 * @requires    schemaForm.provider:sfPathProvider
 * @requires    schemaForm.provider:sfTemplateProvider
 */
function sf_builder_service_sfBuilderProvider ( sfPathProvider, sfTemplateProvider ) {

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
                external_angular_default.a.forEach( builders, function( builder, key ){
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
            if ( !external_angular_default.a.isArray( tree ) ) {
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

/* harmony default export */ var sf_builder_service = (sf_builder_service_sfBuilderProvider);
// CONCATENATED MODULE: ./src/services/sf-decorators.service.js


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

        external_angular_default.a.forEach(fields, function(field, type) {
            field.builder   = field.builder || sfBuilderProvider.stdBuilders;
            field.replace   = external_angular_default.a.isDefined(field.replace) ? field.replace : true;
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

/* harmony default export */ var sf_decorators_service = (sfDecoratorsProvider);
// CONCATENATED MODULE: ./src/services/sf-error-message.service.js


//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

sfErrorMessageProvider.$inject = [];

function sfErrorMessageProvider () {

    // The codes are json schema error codes.
    // Not all of these can actually happen in a field, but for
    // we never know when one might pop up so it's best to cover them all.

    // TODO: Humanize these.
    var defaultMessages = {
        'default': 'Field does not validate',
        0: 'Invalid type, expected {{schema.type}}',
        1: 'No enum match for: {{viewValue}}',
        10: 'Data does not match any schemas from "anyOf"',
        11: 'Data does not match any schemas from "oneOf"',
        12: 'Data is valid against more than one schema from "oneOf"',
        13: 'Data matches schema from "not"',
        // Numeric errors
        100: 'Value is not a multiple of {{schema.multipleOf}}',
        101: '{{viewValue}} is less than the allowed minimum of {{schema.minimum}}',
        102: '{{viewValue}} is equal to the exclusive minimum {{schema.minimum}}',
        103: '{{viewValue}} is greater than the allowed maximum of {{schema.maximum}}',
        104: '{{viewValue}} is equal to the exclusive maximum {{schema.maximum}}',
        105: 'Value is not a valid number',
        // String errors
        200: 'String is too short ({{viewValue.length}} chars), minimum {{schema.minLength}}',
        201: 'String is too long ({{viewValue.length}} chars), maximum {{schema.maxLength}}',
        202: 'String does not match pattern: {{schema.pattern}}',
        // Object errors
        300: 'Too few properties defined, minimum {{schema.minProperties}}',
        301: 'Too many properties defined, maximum {{schema.maxProperties}}',
        302: 'Required',
        303: 'Additional properties not allowed',
        304: 'Dependency failed - key must exist',
        // Array errors
        400: 'Array is too short ({{value.length}}), minimum {{schema.minItems}}',
        401: 'Array is too long ({{value.length}}), maximum {{schema.maxItems}}',
        402: 'Array items are not unique',
        403: 'Additional items not allowed',
        // Format errors
        500: 'Format validation failed',
        501: 'Keyword failed: "{{title}}"',
        // Schema structure
        600: 'Circular $refs',
        // Non-standard validation options
        1000: 'Unknown property (not in schema)'
    };

    // In some cases we get hit with an angular validation error
    defaultMessages.number    = defaultMessages[105];
    defaultMessages.required  = defaultMessages[302];
    defaultMessages.min       = defaultMessages[101];
    defaultMessages.max       = defaultMessages[103];
    defaultMessages.maxlength = defaultMessages[201];
    defaultMessages.minlength = defaultMessages[200];
    defaultMessages.pattern   = defaultMessages[202];

    this.setDefaultMessages = function(messages) {
        defaultMessages = messages;
    };

    this.getDefaultMessages = function() {
        return defaultMessages;
    };

    this.setDefaultMessage = function(error, msg) {
        defaultMessages[error] = msg;
    };

    this.$get = ['$interpolate', function($interpolate) {

        var service = {};
        service.defaultMessages = defaultMessages;

        /**
         * Interpolate and return proper error for an eror code.
         * Validation message on form trumps global error messages.
         * and if the message is a function instead of a string that function will be called instead.
         * @param {string} error the error code, i.e. validator-xxx for validator errors, otherwise it's whats on
         *                       ngModel.$error for custom errors.
         * @param {Any} value the actual model value.
         * @param {Any} viewValue the viewValue
         * @param {Object} node
         * @param  {Object} global the global validation messages object (even though its called global
         *                         its actually just shared in one instance of sf-schema)
         * @return {string} The error message.
         */
        service.interpolate = function(error, value, viewValue, node, global, config) {
            global                  = global    || {};
            var form                = node.form || {};
            var validationMessage   = form.validationMessage || {};

            // Drop validator prefix so only the code is left.
            if (error.indexOf('validator-') === 0) {
                error = error.substring(10);
            }

            // First find apropriate message or function
            var message = validationMessage['default'] || global['default'] || '';

            [validationMessage, global, defaultMessages].some(function(val) {
                if (external_angular_default.a.isString(val) || external_angular_default.a.isFunction(val)) {
                    message = val;
                    return true;
                }
                if (val && val[error]) {
                    message = val[error];
                    return true;
                }
            });

            var context = {
                config: config,
                error: error,
                value: value,
                viewValue: viewValue,
                form: form,
                schema: node.schema,
                title: form.title || (node.schema && node.schema.title)
            };
            if (external_angular_default.a.isFunction(message)) {
                return message(context);
            } else {
                return $interpolate(message)(context);
            }
        };

        return service;
    }];
}

/* harmony default export */ var sf_error_message_service = (sfErrorMessageProvider);

// CONCATENATED MODULE: ./src/services/sf-form.service.js


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
                if ( array.length === 1 && external_angular_default.a.isObject( child.items ) ) {
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
        var compiled = external_angular_default.a.merge({}, property );
        var required = parent.required && parent.required.indexOf( key ) !== -1;
        // Compiling schema form attributes
        compiled[ 'x-schema-form' ] = external_angular_default.a.merge({}, root[ 'x-schema-form' ], property[ 'x-schema-form' ] );
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
        external_angular_default.a.forEach( array, function( item, index ) {
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
        external_angular_default.a.forEach( object, function( item, index ) {
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
            if ( external_angular_default.a.isObject( node.schema.items ) && external_angular_default.a.isArray( node.form.items ) ) {
                seed.properties = node.form.items.reduce( function ( properties, item ) {
                    var finalKey = sfPathProvider.parse( item.key ).slice( -1 )[0]
                    var property = external_angular_default.a.merge( {
                        filledKey : seed.filledKey + '.' + finalKey
                    }, item );
                    properties[ finalKey ] = property;
                    return properties;
                }, {});
            }
            // If schema items is an array then we continue with the form items
            else if ( external_angular_default.a.isArray( node.schema.items ) && external_angular_default.a.isArray( node.form.items ) ) {
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
            if ( external_angular_default.a.isString( form ) ) {
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
                    if ( external_angular_default.a.isArray( node.schema.type ) ) {
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
                var seed        = external_angular_default.a.merge( {}, node.options && node.options.formDefaults );
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
                node.form       = external_angular_default.a.merge( seed, schema ? schema['x-schema-form'] : {}, form );
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
            if ( external_angular_default.a.isArray( node.form.items ) && node.type !== "array" ) {
                node.items  = compileArray( node.form.items, node, config );
            }
            else if ( external_angular_default.a.isObject( node.form.properties ) ) {
                node.properties = compileObject( node.form.properties, node, config );
            }
            else if ( node.schema && node.schema.items && !external_angular_default.a.isObject( node.schema.items )) {
                node.items  = compileArray( node.schema.items, node, config, true );
            }
            else if ( node.schema && external_angular_default.a.isObject( node.schema.properties ) ) {
                node.properties = compileObject( node.schema.properties, node, config, true );
            }

            return node;
        }

        // Initialisation
        return constructor();
    }

}

/* harmony default export */ var sf_form_service = (sfFormProvider);
// CONCATENATED MODULE: ./src/services/sf-path.service.js


//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

sf_path_service_sfPathProvider.$inject = [];

/**
 * @ngdoc       service
 * @name        schemaForm.provider:sfPathProvider
 * @requires    ObjectPath
 */
function sf_path_service_sfPathProvider () {

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

/* harmony default export */ var sf_path_service = (sf_path_service_sfPathProvider);
// CONCATENATED MODULE: ./src/services/sf-schema.service.js


//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

sf_schema_service_sfSchemaProvider.$inject = [ 'sfValidatorsProvider', 'sfPathProvider' ];

/**
 * @ngdoc       service
 * @name        schemaForm.provider:sfSchemaProvider
 * @description Provider that is responsible for the schema management and schema validation
 * @requires    schemaForm.provider:sfValidatorsProvider
 */
function sf_schema_service_sfSchemaProvider ( sfValidatorsProvider, sfPathProvider ) {

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
            if ( external_angular_default.a.isDefined( property[ '$ref' ] ) ) {
                var projection  = property[ '$ref' ].replace( /#\//g, '' ).replace( /\//g, '.' );
                var definition  = sfPathProvider.select( projection, schema )
                external_angular_default.a.merge( property, definition )
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
            if ( external_angular_default.a.isDefined( prop['default'] ) ) {
                var val = sfPathProvider.select( path, model );
                if ( external_angular_default.a.isUndefined( val ) ) {
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
        external_angular_default.a.forEach(schema.properties, function(prop, name) {
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

/* harmony default export */ var sf_schema_service = (sf_schema_service_sfSchemaProvider);
// CONCATENATED MODULE: ./src/services/sf-template.service.js


//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

sf_template_service_sfTemplateProvider.$inject = [ 'sfPathProvider' ];

/**
 * @ngdoc       service
 * @name        schemaForm.provider:sfTemplateProvider
 * @description Provider that is responsible for all the template management
 * @requires    schemaForm.provider:sfPathProvider
 */
function sf_template_service_sfTemplateProvider ( sfPathProvider ) {

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
        if ( external_angular_default.a.isString( value ) ) {
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
        if ( external_angular_default.a.isString( hash ) ) {
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

/* harmony default export */ var sf_template_service = (sf_template_service_sfTemplateProvider);
// CONCATENATED MODULE: ./src/services/sf-validators.service.js


//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

sf_validators_service_sfValidatorsProvider.$inject = [];

/**
 * @ngdoc       service
 * @name        schemaForm.provider:sfValidatorsProvider
 * @description Provider that is responsible for the validators management.
 *              Validators can be added through methods like the decorators.
 * @requires    schemaForm.provider:sfValidatorProvider
 */
function sf_validators_service_sfValidatorsProvider () {

    var provider    = this;
    var validators  = {};

    /**
     * @ngdoc                       method
     * @name                        schemaForm.provider:sfValidatorsProvider#addValidator
     * @methodOf                    schemaForm.provider:sfValidatorsProvider
     * @description                 Method that allow the user to add a validator
     *                              <br> Should be a validate function or a Validator object as :
     *                              <br> {
     *                              <br>    messages : a message object to add to the sfErrorMessageProvider
     *                              <br>    process  : a function that will be called by the directive sfValidate to process the 
     *                                      errors stack
     *                              <br>    validate : validate function 
     *                              <br> }
     * @param  {function|Validator} A validate function or a Validator object
     */
    provider.addValidator = function( name, validator ) {
        if ( external_angular_default.a.isFunction( validator ) ) {
            validator = {
                validate : validator
            }
        }
        validators[ name ] = validator;
    }

    /**
     * @ngdoc                       method
     * @name                        schemaForm.provider:sfValidatorsProvider#removeValidator
     * @methodOf                    schemaForm.provider:sfValidatorsProvider
     * @description                 Method that allow the user to remove a validator
     * @param  {number|string}      hash or templateUrl
     */
    provider.removeValidator = function( name ) {
        validators[ name ] = undefined;
    }

    /**
     * @ngdoc                       method
     * @name                        schemaForm.provider:sfValidatorsProvider#validate
     * @methodOf                    schemaForm.provider:sfValidatorsProvider
     * @description                 Method that is called to validate a value against its form and schema
     * @param  {Form}               node object 
     * @param  {object}             value 
     * @return {object}             An object containing the validation result ( as valid ) and the potential errors
     */
    provider.validate = function( node, value ) {
        var result = { valid : true };
        if ( node.schema && node.schema.validators ) {
            external_angular_default.a.forEach( node.schema.validators, function( validatorName ) {
                processValidation( validators[ validatorName ], result, node, value );
            })
        }
        else {
            external_angular_default.a.forEach( validators, function( validator ) {
                processValidation( validator, result, node, value );
            })
        }
        return result;
    };

    // --------------------------------------------------
    // Private

    function processValidation( validator, result, node, value ) {
        if ( validator ) {
            var temp = validator.validate( node, value );
            if ( result.valid || ( !result.valid && !temp.valid ) ) {
                external_angular_default.a.merge( result, temp );
            }
        }
    }


    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////

    // --------------------------------------------------
    // Service

    sfValidators.$inject    = [];
    provider.$get           = sfValidators;

    /**
     * @ngdoc           service
     * @name            schemaForm.service:sfValidators
     * @description     Service that is responsible for the validators management.
     *                  Validators can be added through methods like the decorators.
     */
    function sfValidators ( sfValidator ) {

        var service = this;

        // --------------------------------------------------
        // Public

        /**
         * @ngdoc               method
         * @name                schemaForm.service:sfValidators#validate
         * @methodOf            schemaForm.service:sfValidators
         * @description         Method that validate the value against its schema
         * @param  {Schema}     The schema to use against the value
         * @param  {any}        The value
         * @return {object}     An object containing the validation result ( as valid ) and the potential errors
         */
        service.validate = provider.validate


        return service;
    }

}

/* harmony default export */ var sf_validators_service = (sf_validators_service_sfValidatorsProvider);
// CONCATENATED MODULE: ./src/directives/sf-message.directive.js


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
                        external_angular_default.a.forEach(scope.ngModel && scope.ngModel.$error, function(status, code) {
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
                        var len = ( external_angular_default.a.isArray( scope.form.validationPriority ) && scope.form.validationPriority.length ) || 0;
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

/* harmony default export */ var sf_message_directive = (sfMessage);
// CONCATENATED MODULE: ./src/directives/sf-node.directive.js


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
                if ( !external_angular_default.a.isObject( node ) ) {
                    node    = sfSchema.lookup( nodeId ); 
                }

                // Extend the scope from the node.
                external_angular_default.a.extend( scope, node );
                scope.node = scope;

                // --------------------------------------------------
                // If a model is linked to this node
                // We add the model manipulation tools
                if ( external_angular_default.a.isString( scope.key ) ) {

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
                            external_angular_default.a.forEach( scope.changeCallbacks, function( callback ){
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
                    external_angular_default.a.forEach(list, function(v) {
                        values[v] = true;
                    });
                    return values;
                };

                scope.checkboxValuesToList = function(values) {
                    var lst = [];
                    external_angular_default.a.forEach(values, function(v, k) {
                        if (v) {
                            lst.push(k);
                        }
                    });
                    return lst;
                };

                scope.buttonClick = function($event, form) {
                    if (external_angular_default.a.isFunction(form.onClick)) {
                        form.onClick($event, form);
                    } else if (external_angular_default.a.isString(form.onClick)) {
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
            if (external_angular_default.a.isFunction(scope.form.onChange)) {
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
            if ( !external_angular_default.a.isArray( scope.get() ) ) {
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
            if ( external_angular_default.a.isString( length ) ) {
                length = sfPath.select( sfPath.parse( length ), scope.model )
            }
            if ( external_angular_default.a.isNumber( length ) ) {
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
            if ( external_angular_default.a.isString( scope.schema.length ) ) {
                var parsed  = sfPath.parse( scope.schema.length ) 
                scope.$watch( function(){
                    return sfPath.select( parsed, scope.model )
                }, function( newValue, oldValue ) {
                    if ( external_angular_default.a.isNumber( newValue ) ) {
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

/* harmony default export */ var sf_node_directive = (sfNode);
// CONCATENATED MODULE: ./src/directives/sf-model.directive.js


//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

sfModel.$inject = [ 'sfPath', '$compile' ]

function sfModel ( sfPath, $compile ) {

    return {
        scope : false,
        priority : 1001,
        terminal: true,
        compile : compile
    }

    function compile ( element, attrs ) {

        return function ( scope, element, attrs ) {
            var node = {}
            if ( attrs.sfModel !== "" ) {
                node = scope.$eval( attrs.sfModel );
                element.attr( 'sf-node', node.id );
            }
            else {
                node = scope;
            }
            if ( node.arrayKey && node.schema ) {
                // Set the ng model
                element.attr( 'ng-model', "node.value" );
                // Schema validation
                element.attr( "schema-validate", "node" );
                // If the element is an input and if the sfSetAttribute is not false
                // we set the default attributes for the element
                if ( attrs.sfSetAttributes !== false && element.is( "input, select, textarea") ) {
                    element.attr( "name", node.key );
                    // Readonly & disabled
                    // This match the old way, see if it is not interesting to use the real readonly type
                    element.attr( "ng-disabled", "evalExpr(form.readonly, { model: model, value: value }) || form.readonly === true" );
                    // Input specific
                    if ( element.is( "input:not([type=checkbox]):not([type=radio])" ) ) {
                        var hasString   = node.schema.type.indexOf('string') !== -1;
                        var hasNumber   = node.schema.type.indexOf('number') !== -1;
                        var type        = node.form.subType || ( !hasString && hasNumber ? 'number' : 'text')
                        element.attr( "type", type );
                        if ( node.form.maximum )        element.attr( "max", node.form.maximum );
                        if ( node.form.minimum )        element.attr( "min", node.form.minimum );
                        if ( node.form.maxlength )      element.attr( "maxlength", node.form.maxlength );
                        if ( node.form.minlength )      element.attr( "minlength", node.form.minlength );
                        if ( node.form.placeholder )    element.attr( "placeholder", node.form.placeholder );
                    }
                }
            }
            element.removeAttr( 'sf-model' );

            $compile( element )( scope );
        }

    }
}

/* harmony default export */ var sf_model_directive = (sfModel);

// CONCATENATED MODULE: ./src/directives/sf-render.directive.js


//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

sfRender.$inject = [ 'sfBuilder' ]

/**
 * @ngdoc       directive
 * @name        schemaForm.directive:sfRender
 * @description Directive qui affiche le contenu d'une node
 * @restrict    'E'
 * @requires    schemaForm.service:sfBuilder
 * @param       {node}     node     The node that will be used to build the DOM
 */
function sfRender ( sfBuilder ) {

    return {
        restrict: 'E',
        scope: true,
        require: '^sfSchema',
        link: link
    };

    function link ( scope, element, attrs, sfSchemaCtrl ) {

        var node    = scope.$eval( attrs.node );

        // Patching our node if the node is an id.
        if ( !external_angular_default.a.isObject( node ) ) {
            node = sfSchemaCtrl.lookup( attrs.node );
        }

        if ( node ) {
            // Build the node and inject it inside our element
            sfBuilder.render( node, null, {}, node.path + '.items', element, scope.$new() )
        }
        else {
            console.warn("Error in sf-render, node is undefined")
        }


    }
}

/* harmony default export */ var sf_render_directive = (sfRender);
// CONCATENATED MODULE: ./src/directives/sf-schema.directive.js


//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

sf_schema_directive_sfSchema.$inject = [ 'sfDecorators', 'sfBuilder', 'sfTemplate', 'sfForm', 'sfSchema' ]

function sf_schema_directive_sfSchema ( sfDecorators, sfBuilder, sfTemplate, sfForm, sfSchemaService ) {

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
            var form   = scope.initialForm ? external_angular_default.a.copy(scope.initialForm) : defaultForm;
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
                if ( external_angular_default.a.isArray( result ) ) {
                    return result[ Number( value ) ]
                }
                else if ( result && external_angular_default.a.isArray( result.items ) && result.items[ Number( value ) ] ){
                    return result.items[ Number( value ) ]
                }
                else if ( result && external_angular_default.a.isObject( result.properties ) ){
                    return result.properties[ value ]
                }
                return undefined
            }, $scope.tree )
            return result;
        };

    }

}

/* harmony default export */ var sf_schema_directive = (sf_schema_directive_sfSchema);
// CONCATENATED MODULE: ./src/directives/sf-transform-model.directive.js


//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

sfTransformModel.$inject = []

function sfTransformModel () {
    return {
        require : 'ngModel',
        link    : link
    }

    function link ( scope, element, attrs, ngModelCtrl ) {

        var added     = false;
        var transform = undefined;

        scope.$watch( function() {
                return transform = scope.$eval( attrs.sfTransformModel );
            }, function(newValue, oldValue, scope) {
                if ( ( newValue || newValue !== oldValue ) && !added ) {
                    addTransformers();
                    added = true;
                }
            }
        );

        function addTransformers () {

            ngModelCtrl.$formatters.push( function ( modelValue ) {
                if ( external_angular_default.a.isFunction( transform ) ) {
                    return transform.call( scope, modelValue, scope, false );
                }
                // titleMap
                else if ( external_angular_default.a.isArray( transform ) ) {
                    var item = transform.find( function ( item ) {
                        return item.value === modelValue;
                    })
                    if ( item ) return item.name;
                    else return modelValue;
                }
                else if ( external_angular_default.a.isObject( transform ) ) {
                    return transform[ modelValue ];
                }
                return modelValue;
            });

            ngModelCtrl.$parsers.unshift( function ( viewValue ) {
                if ( external_angular_default.a.isFunction( transform ) ) {
                    return transform.call( scope, viewValue, scope, true );
                }
                // titleMap
                else if ( external_angular_default.a.isArray( transform ) ) {
                    var item = transform.find( function ( item ) {
                        return item.name === viewValue;
                    })
                    if ( item ) return item.value;
                    else return viewValue;
                }
                else if ( external_angular_default.a.isObject( transform ) ) {
                    external_angular_default.a.forEach( transform, function( value, key ){
                        if ( external_angular_default.a.equals( value, viewValue ) ) {
                            return key;
                        }
                    });
                }
                return viewValue;
            });

            ngModelCtrl.$processModelValue();
        }
    } 
}

/* harmony default export */ var sf_transform_model_directive = (sfTransformModel);
// CONCATENATED MODULE: ./src/directives/sf-validate.directive.js


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
                    external_angular_default.a.forEach(paths, function(path) {
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
                    if ( external_angular_default.a.isString(fn) ) {
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
                    if ( external_angular_default.a.isString(fn) ) {
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
                    external_angular_default.a.forEach(node.form[attr], adder);
                    external_angular_default.a.forEach(node.schema[attr], adder);
                }
            });

            ['$validators', '$asyncValidators'].forEach(function(attr) {
                if ( ( node.form[attr] || node.schema[attr] ) && ngModel[attr]) {
                    var adder = getValidatorAdder( attr );
                    external_angular_default.a.forEach(node.form[attr], adder);
                    external_angular_default.a.forEach(node.schema[attr], adder);
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
                if ( external_angular_default.a.equals(ngModel.$error, {}) ) {
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

/* harmony default export */ var sf_validate_directive = (schemaValidate);
// CONCATENATED MODULE: ./src/schema-form.module.js

// providers








// directives









/**
 * @ngdoc           overview
 * @name            schemaForm
 * @description     SchemaForm main module
 * @requires        ngSanitize
 */
external_angular_default.a
    .module( 'schemaForm', [ 'ngSanitize' ] )
    // providers
    .provider( 'sfPath', sf_path_service )
    .provider( 'sfTemplate', sf_template_service )
    .provider( 'sfBuilder', sf_builder_service )
    .provider( 'sfDecorators', sf_decorators_service )
    .provider( 'sfErrorMessage', sf_error_message_service )
    .provider( 'sfValidators', sf_validators_service )
    .provider( 'sfSchema', sf_schema_service )
    .provider( 'sfForm', sf_form_service )
    // directives
    .directive( 'sfNode', sf_node_directive )
    .directive( 'sfRender', sf_render_directive )
    .directive( 'sfMessage', sf_message_directive )
    .directive( 'sfModel', sf_model_directive )
    .directive( 'sfSchema', sf_schema_directive )
    .directive( 'sfTransformModel', sf_transform_model_directive )
    .directive( 'schemaValidate', sf_validate_directive )
;

/* harmony default export */ var schema_form_module = __webpack_exports__["default"] = (external_angular_default.a.module( 'schemaForm' ));

/***/ }),
/* 4 */,
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(3);
__webpack_require__(2);
module.exports = __webpack_require__(6);


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(angular__WEBPACK_IMPORTED_MODULE_0__);


angular__WEBPACK_IMPORTED_MODULE_0___default.a
  .module("schemaForm")
  .run(["$templateCache", function($templateCache) {
    $templateCache.put("directives/decorators/bootstrap/actions-trcl.html",
      "<div class=\"btn-group schema-form-actions {{form.htmlClass}}\" ng-transclude=\"\"></div>");
    $templateCache.put("directives/decorators/bootstrap/actions.html",
      "<div class=\"btn-group schema-form-actions {{form.htmlClass}}\">" 
      + "<input ng-repeat-start=\"item in items\" type=\"submit\" class=\"btn {{ item.style || \'btn-default\' }} {{form.fieldHtmlClass}}\" value=\"{{item.title}}\" ng-if=\"item.type === \'submit\'\"> <button ng-repeat-end=\"\" class=\"btn {{ item.style || \'btn-default\' }} {{form.fieldHtmlClass}}\" type=\"button\" ng-disabled=\"form.readonly\" ng-if=\"item.type !== \'submit\'\" ng-click=\"buttonClick($event,item)\">" 
      + "<span ng-if=\"item.icon\" class=\"{{item.icon}}\">" 
      + "</span>{{item.title}}</button>" 
      + "</div>");
    $templateCache.put("directives/decorators/bootstrap/array.html",
      "<div sf-array=\"form\" class=\"schema-form-array {{form.htmlClass}}\" sf-model ng-model-options=\"form.ngModelOptions\">" 
      + "<label class=\"control-label\" ng-show=\"showTitle()\">{{ form.title }}</label>" 
      + "<ol class=\"list-group\" ng-model=\"modelArray\" ui-sortable=\"\">" 
      +   "<li class=\"list-group-item {{form.fieldHtmlClass}}\" ng-repeat=\"item in modelArray track by $index\">" 
      +     "<button ng-hide=\"form.readonly || form.remove === null\" ng-click=\"deleteFromArray($index)\" style=\"position: relative; z-index: 20;\" type=\"button\" class=\"close pull-right\">" 
      +       "<span aria-hidden=\"true\">&times;</span>" 
      +       "<span class=\"sr-only\">Close</span>" 
      +     "</button>" 
      +     "<sf-render node=\"item\"></sf-render>" 
      +   "</li>" 
      + "</ol>" 
      + "<div class=\"clearfix\" style=\"padding: 15px;\">" 
      + "<button ng-hide=\"form.readonly || form.add === null\" ng-click=\"appendToArray()\" type=\"button\" class=\"btn {{ form.style.add || \'btn-default\' }} pull-right\">" 
      + "<i class=\"glyphicon glyphicon-plus\">" 
      + "</i> {{ form.add || \'Add\'}}</button>" 
      + "</div>" 
      + "<div class=\"help-block\" ng-show=\"(hasError() && errorMessage(schemaError())) || form.description\" ng-bind-html=\"(hasError() && errorMessage(schemaError())) || form.description\">" 
      + "</div>" 
      + "</div>");
    $templateCache.put("directives/decorators/bootstrap/checkbox.html",
      "<div class=\"checkbox schema-form-checkbox {{form.htmlClass}}\" ng-class=\"{\'has-error\': form.disableErrorState !== true && hasError(), \'has-success\': form.disableSuccessState !== true && hasSuccess()}\">" 
      + "<label class=\"{{form.labelHtmlClass}}\">" 
      + "<input type=\"checkbox\" ng-disabled=\"form.readonly\" sf-model ng-model-options=\"form.ngModelOptions\" schema-validate class=\"{{form.fieldHtmlClass}}\" name=\"{{arrayKey.slice(-1)[0]}}\"> <span ng-bind-html=\"form.title\">" 
      + "</span>" 
      + "</label>" 
      + "<div class=\"help-block\" sf-message=\"form.description\">" 
      + "</div>" 
      + "</div>");
    $templateCache.put("directives/decorators/bootstrap/checkboxes.html",
      "<div sf-array=\"form\" sf-model class=\"form-group schema-form-checkboxes {{form.htmlClass}}\" ng-class=\"{\'has-error\': form.disableErrorState !== true && hasError(), \'has-success\': form.disableSuccessState !== true && hasSuccess()}\">" 
      + "<label class=\"control-label {{form.labelHtmlClass}}\" ng-show=\"showTitle()\">{{form.title}}</label>" 
      + "<div class=\"checkbox\" ng-repeat=\"val in titleMapValues track by $index\">" 
      + "<label>" 
      + "<input type=\"checkbox\" ng-disabled=\"form.readonly\" class=\"{{form.fieldHtmlClass}}\" ng-model=\"titleMapValues[$index]\" name=\"{{arrayKey.slice(-1)[0]}}\"> <span ng-bind-html=\"form.titleMap[$index].name\">" 
      + "</span>" 
      + "</label>" 
      + "</div>" 
      + "<div class=\"help-block\" sf-message=\"form.description\">" 
      + "</div>" 
      + "</div>");
    $templateCache.put("directives/decorators/bootstrap/default.html",
      "<div class=\"form-group schema-form-{{templateType}} {{form.htmlClass}}\" ng-class=\"{\'has-error\': form.disableErrorState !== true && hasError(), \'has-success\': form.disableSuccessState !== true && hasSuccess(), \'has-feedback\': form.feedback !== false }\">" 
      + "<label class=\"control-label {{form.labelHtmlClass}}\" ng-class=\"{\'sr-only\': !showTitle()}\" for=\"{{arrayKey.slice(-1)[0]}}\">{{form.title}}</label>"
      + "<input bt-tooltip=\"form.tooltip\" bt-tooltip-config=\"form.tooltipConfig\" ng-if=\"!form.fieldAddonLeft && !form.fieldAddonRight\" ng-show=\"arrayKey\" type=\"{{templateType}}\" step=\"any\" placeholder=\"{{form.placeholder}}\" class=\"form-control {{form.fieldHtmlClass}}\" id=\"{{arrayKey.slice(-1)[0]}}\" ng-model-options=\"form.ngModelOptions\" sf-model ng-disabled=\"form.readonly\" schema-validate name=\"{{arrayKey.slice(-1)[0]}}\" aria-describedby=\"{{arrayKey.slice(-1)[0] + \'Status\'}}\">" 
      + "<div ng-if=\"form.fieldAddonLeft || form.fieldAddonRight\" ng-class=\"{\'input-group\': (form.fieldAddonLeft || form.fieldAddonRight)}\">" 
      + "  <span ng-if=\"form.fieldAddonLeft\" class=\"input-group-addon\" ng-bind-html=\"form.fieldAddonLeft\"></span>" 
      + "  <input bt-tooltip=\"form.tooltip\" bt-tooltip-config=\"form.tooltipConfig\" ng-show=\"arrayKey\" type=\"{{templateType}}\" step=\"any\" placeholder=\"{{form.placeholder}}\" class=\"form-control {{form.fieldHtmlClass}}\" id=\"{{arrayKey.slice(-1)[0]}}\" ng-model-options=\"form.ngModelOptions\" sf-model ng-disabled=\"form.readonly\" schema-validate name=\"{{arrayKey.slice(-1)[0]}}\" aria-describedby=\"{{arrayKey.slice(-1)[0] + \'Status\'}}\">"
      + "  <span ng-if=\"form.fieldAddonRight\" class=\"input-group-addon\" ng-bind-html=\"form.fieldAddonRight\"></span>" 
      + "</div>" 
      + "<span ng-if=\"form.feedback !== false\" class=\"form-control-feedback\" ng-class=\"evalInScope(form.feedback) || {\'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError() }\" aria-hidden=\"true\"></span>"
      + "<span ng-if=\"hasError() || hasSuccess()\" id=\"{{arrayKey.slice(-1)[0] + \'Status\'}}\" class=\"sr-only\">{{ hasSuccess() ? \'(success)\' : \'(error)\' }}</span>" 
      + "<div class=\"help-block\" sf-message=\"form.description\"></div>" 
      + "</div>");
    $templateCache.put("directives/decorators/bootstrap/fieldset-trcl.html",
      "<fieldset ng-disabled=\"form.readonly\" class=\"schema-form-fieldset {{form.htmlClass}}\">" 
      + "<legend ng-class=\"{\'sr-only\': !showTitle() }\">{{ form.title }}</legend>" 
      + "<div class=\"help-block\" ng-show=\"form.description\" ng-bind-html=\"form.description\">" 
      + "</div>" 
      + "<div ng-transclude=\"\">" 
      + "</div>" 
      + "</fieldset>");
    $templateCache.put("directives/decorators/bootstrap/fieldset.html",
      "<fieldset ng-disabled=\"form.readonly\" class=\"schema-form-fieldset {{form.htmlClass}}\">" 
      + "<legend ng-class=\"{\'sr-only\': !showTitle() }\">{{ form.title }}</legend>" 
      + "<div class=\"help-block\" ng-show=\"form.description\" ng-bind-html=\"form.description\"></div>" 
      + "<sf-render node=\"item\" ng-if=\"items\" ng-repeat=\"item in items\"></sf-render>" 
      + "<sf-render node=\"item\" ng-if=\"properties\" ng-repeat=\"item in properties\"></sf-render>"  
      + "</fieldset>");
    $templateCache.put("directives/decorators/bootstrap/help.html",
      "<div class=\"helpvalue schema-form-helpvalue {{form.htmlClass}}\" style=\"{{form.style}}\" ng-bind-html=\"form.helpvalue\"></div>");
    $templateCache.put("directives/decorators/bootstrap/radio-buttons.html",
      "<div class=\"form-group schema-form-radiobuttons {{form.htmlClass}}\" ng-class=\"{\'has-error\': form.disableErrorState !== true && hasError(), \'has-success\': form.disableSuccessState !== true && hasSuccess()}\">" 
      + "<div>" 
      + "<label class=\"control-label {{form.labelHtmlClass}}\" ng-show=\"showTitle()\">{{form.title}}</label>" 
      + "</div>" 
      + "<div class=\"btn-group\">" 
      + "<label class=\"btn {{ (item.value === value) ? form.style.selected || \'btn-default\' : form.style.unselected || \'btn-default\'; }}\" ng-class=\"{ active: item.value === value }\" ng-repeat=\"item in form.titleMap\">" 
      + "<input type=\"radio\" class=\"{{form.fieldHtmlClass}}\" style=\"display: none;\" ng-disabled=\"form.readonly\" sf-model ng-model-options=\"form.ngModelOptions\" schema-validate ng-value=\"item.value\" name=\"{{arrayKey.join(\'.\')}}\"> <span ng-bind-html=\"item.name\">" 
      + "</span>" 
      + "</label>" 
      + "</div>" 
      + "<div class=\"help-block\" sf-message=\"form.description\">" 
      + "</div>" 
      + "</div>");
    $templateCache.put("directives/decorators/bootstrap/radios-inline.html",
      "<div class=\"form-group schema-form-radios-inline {{form.htmlClass}}\" ng-class=\"{\'has-error\': form.disableErrorState !== true && hasError(), \'has-success\': form.disableSuccessState !== true && hasSuccess()}\">" 
      + "<label sf-model ng-model-options=\"form.ngModelOptions\" schema-validate class=\"control-label {{form.labelHtmlClass}}\" ng-show=\"showTitle()\">{{form.title}}</label>" 
      + "<div>" 
      + "<label class=\"radio-inline\" ng-repeat=\"item in form.titleMap\">" 
      + "<input type=\"radio\" class=\"{{form.fieldHtmlClass}}\" ng-disabled=\"form.readonly\" sf-model ng-value=\"item.value\" name=\"{{arrayKey.join(\'.\')}}\"> <span ng-bind-html=\"item.name\">" 
      + "</span>" 
      + "</label>" 
      + "</div>" 
      + "<div class=\"help-block\" sf-message=\"form.description\">" 
      + "</div>" 
      + "</div>");
    $templateCache.put("directives/decorators/bootstrap/radios.html",
      "<div class=\"form-group schema-form-radios {{form.htmlClass}}\" ng-class=\"{\'has-error\': form.disableErrorState !== true && hasError(), \'has-success\': form.disableSuccessState !== true && hasSuccess()}\">" 
      +   "<label sf-model ng-model-options=\"form.ngModelOptions\" schema-validate class=\"control-label {{form.labelHtmlClass}}\" ng-show=\"showTitle()\">{{form.title}}</label>" 
      +   "<div class=\"radio\" ng-repeat=\"item in form.titleMap\">" 
      +     "<label>" 
      +       "<input type=\"radio\" class=\"{{form.fieldHtmlClass}}\" ng-disabled=\"form.readonly\" sf-model ng-value=\"item.value\" name=\"{{arrayKey.join(\'.\')}}\">"
      +       "<span ng-bind-html=\"item.name\"></span>" 
      +     "</label>" 
      +   "</div>" 
      +   "<div class=\"help-block\" sf-message=\"form.description\"></div>" 
      + "</div>");
    $templateCache.put("directives/decorators/bootstrap/section.html",
      "<div class=\"schema-form-section {{form.htmlClass}}\">" 
      +   "<sf-render node=\"item\" ng-repeat=\"item in items\"></sf-render>" 
      + "</div>");
    $templateCache.put("directives/decorators/bootstrap/select.html",
      "<div class=\"form-group {{form.htmlClass}} schema-form-select\" ng-class=\"{\'has-error\': form.disableErrorState !== true && hasError(), \'has-success\': form.disableSuccessState !== true && hasSuccess(), \'has-feedback\': form.feedback !== false}\">" 
      +   "<label class=\"control-label {{form.labelHtmlClass}}\" ng-show=\"showTitle()\">{{form.title}}</label>" 
      +   "<select sf-model ng-model-options=\"form.ngModelOptions\" ng-disabled=\"form.readonly\" class=\"form-control {{form.fieldHtmlClass}}\" schema-validate ng-options=\"item.value as item.name group by item.group for item in form.titleMap\" name=\"{{arrayKey.slice(-1)[0]}}\"></select>" 
      +   "<div class=\"help-block\" sf-message=\"form.description\"></div>" 
      + "</div>");
    $templateCache.put("directives/decorators/bootstrap/submit.html",
      "<div class=\"form-group schema-form-submit {{form.htmlClass}}\">" 
      +   "<input type=\"submit\" class=\"btn {{ form.style || \'btn-primary\' }} {{form.fieldHtmlClass}}\" value=\"{{form.title}}\" ng-disabled=\"form.readonly\" ng-if=\"templateType === \'submit\'\">"
      +   "<button class=\"btn {{ form.style || \'btn-default\' }}\" type=\"button\" ng-click=\"buttonClick($event,form)\" ng-disabled=\"form.readonly\" ng-if=\"templateType !== \'submit\'\">" 
      +     "<span ng-if=\"form.icon\" class=\"{{form.icon}}\">" 
      +     "</span> {{form.title}}"
      +   "</button>" 
      + "</div>");
    $templateCache.put("directives/decorators/bootstrap/tabarray.html",
      "<div sf-array=\"form\" ng-init=\"selected = { tab: 0 }\" class=\"clearfix schema-form-tabarray schema-form-tabarray-{{form.tabType || \'left\'}} {{form.htmlClass}}\">" 
      +   "<div ng-if=\"!form.tabType || form.tabType !== \'right\'\" ng-class=\"{\'col-xs-3\': !form.tabType || form.tabType === \'left\'}\">" 
      +     "<ul class=\"nav nav-tabs\" ng-class=\"{ \'tabs-left\': !form.tabType || form.tabType === \'left\'}\">" 
      +       "<li ng-repeat=\"item in modelArray track by $index\" ng-click=\"$event.preventDefault() || (selected.tab = $index)\" ng-class=\"{active: selected.tab === $index}\">" 
      +         "<a href=\"#\">{{interpolate(form.title,{\'$index\':$index, value: item}) || $index}}</a>" 
      +       "</li>" 
      +       "<li ng-hide=\"form.readonly\" ng-click=\"$event.preventDefault() || (selected.tab = appendToArray().length - 1)\">" 
      +         "<a href=\"#\">" 
      +           "<i class=\"glyphicon glyphicon-plus\">" 
      +         "</i> {{ form.add || \'Add\'}}</a>" 
      +       "</li>" 
      +     "</ul>" 
      +   "</div>" 
      +   "<div ng-class=\"{\'col-xs-9\': !form.tabType || form.tabType === \'left\' || form.tabType === \'right\'}\">" 
      +     "<div class=\"tab-content {{form.fieldHtmlClass}}\">" 
      +       "<div class=\"tab-pane clearfix\" ng-repeat=\"item in modelArray track by $index\" ng-show=\"selected.tab === $index\" ng-class=\"{active: selected.tab === $index}\">" 
      +         "<sf-render node=\"item\"></sf-render>" 
      +         "<button ng-hide=\"form.readonly\" ng-click=\"selected.tab = deleteFromArray($index).length - 1\" type=\"button\" class=\"btn {{ form.style.remove || \'btn-default\' }} pull-right\">" 
      +           "<i class=\"glyphicon glyphicon-trash\"></i> {{ form.remove || \'Remove\'}}"
      +         "</button>" 
      +       "</div>" 
      +     "</div>" 
      +   "</div>" 
      +   "<div ng-if=\"form.tabType === \'right\'\" class=\"col-xs-3\">" 
      +     "<ul class=\"nav nav-tabs tabs-right\">" 
      +       "<li ng-repeat=\"item in modelArray track by $index\" ng-click=\"$event.preventDefault() || (selected.tab = $index)\" ng-class=\"{active: selected.tab === $index}\">" 
      +         "<a href=\"#\">{{interpolate(form.title,{\'$index\':$index, value: item}) || $index}}</a>" 
      +       "</li>" 
      +       "<li ng-hide=\"form.readonly\" ng-click=\"$event.preventDefault() || appendToArray()\">" 
      +         "<a href=\"#\">" 
      +           "<i class=\"glyphicon glyphicon-plus\">" 
      +           "</i> {{ form.add || \'Add\'}}"
      +         "</a>" 
      +       "</li>" 
      +     "</ul>" 
      +   "</div>" 
      + "</div>");
    $templateCache.put("directives/decorators/bootstrap/tabs.html",
      "<div ng-init=\"selected = { tab: 0 }\" class=\"schema-form-tabs {{form.htmlClass}}\">" 
      +   "<ul class=\"nav nav-tabs\">" 
      +     "<li ng-repeat=\"tab in form.tabs\" ng-disabled=\"form.readonly\" ng-click=\"$event.preventDefault() || (selected.tab = $index)\" ng-class=\"{active: selected.tab === $index}\">" 
      +       "<a href=\"#\">{{ tab.title }}</a>" 
      +     "</li>" 
      +   "</ul>" 
      +   "<div class=\"tab-content {{form.fieldHtmlClass}}\">" 
      +     "<div class=\"tab-pane\" ng-disabled=\"form.readonly\" ng-repeat=\"tab in form.tabs\" ng-show=\"selected.tab === $index\" ng-class=\"{active: selected.tab === $index}\">" 
      +       "<bootstrap-decorator ng-repeat=\"item in tab.items\" form=\"item\">" 
      +       "</bootstrap-decorator>" 
      +     "</div>" 
      +   "</div>" 
      + "</div>");
    $templateCache.put("directives/decorators/bootstrap/textarea.html",
      "<div class=\"form-group has-feedback {{form.htmlClass}} schema-form-textarea\" ng-class=\"{\'has-error\': form.disableErrorState !== true && hasError(), \'has-success\': form.disableSuccessState !== true && hasSuccess()}\">" 
      +   "<label class=\"{{form.labelHtmlClass}}\" ng-class=\"{\'sr-only\': !showTitle()}\" for=\"{{arrayKey.slice(-1)[0]}}\">{{form.title}}</label>"
      +   "<textarea ng-if=\"!form.fieldAddonLeft && !form.fieldAddonRight\" class=\"form-control {{form.fieldHtmlClass}}\" id=\"{{arrayKey.slice(-1)[0]}}\" placeholder=\"{{form.placeholder}}\" ng-disabled=\"form.readonly\" sf-model ng-model-options=\"form.ngModelOptions\" schema-validate name=\"{{arrayKey.slice(-1)[0]}}\">" 
      +   "</textarea>" 
      +   "<div ng-if=\"form.fieldAddonLeft || form.fieldAddonRight\" ng-class=\"{\'input-group\': (form.fieldAddonLeft || form.fieldAddonRight)}\">" 
      +     "<span ng-if=\"form.fieldAddonLeft\" class=\"input-group-addon\" ng-bind-html=\"form.fieldAddonLeft\">" 
      +     "</span>"
      +     "<textarea class=\"form-control {{form.fieldHtmlClass}}\" id=\"{{arrayKey.slice(-1)[0]}}\" placeholder=\"{{form.placeholder}}\" ng-disabled=\"form.readonly\" sf-model ng-model-options=\"form.ngModelOptions\" schema-validate name=\"{{arrayKey.slice(-1)[0]}}\">" 
      +     "</textarea>"
      +     "<span ng-if=\"form.fieldAddonRight\" class=\"input-group-addon\" ng-bind-html=\"form.fieldAddonRight\">" 
      +     "</span>" 
      +   "</div>" 
      +   "<span class=\"help-block\" sf-message=\"form.description\">" 
      +   "</span>" 
      + "</div>");
  }]);

angular__WEBPACK_IMPORTED_MODULE_0___default.a
  .module('schemaForm')
  .config(['sfDecoratorsProvider', function(sfDecoratorsProvider) {
    var base = 'directives/decorators/bootstrap/';

    sfDecoratorsProvider.defineDecorator('bootstrapDecorator', {
      textarea: {template: base + 'textarea.html', replace: false},
      fieldset: {template: base + 'fieldset.html', replace: false},
      array: {template: base + 'array.html', replace: false},
      tabarray: {template: base + 'tabarray.html', replace: false},
      tabs: {template: base + 'tabs.html', replace: false},
      section: {template: base + 'section.html', replace: false},
      conditional: {template: base + 'section.html', replace: false},
      actions: {template: base + 'actions.html', replace: false},
      select: {template: base + 'select.html', replace: false},
      checkbox: {template: base + 'checkbox.html', replace: false},
      checkboxes: {template: base + 'checkboxes.html', replace: false},
      number: {template: base + 'default.html', replace: false},
      password: {template: base + 'default.html', replace: false},
      submit: {template: base + 'submit.html', replace: false},
      button: {template: base + 'submit.html', replace: false},
      radios: {template: base + 'radios.html', replace: false},
      'radios-inline': {template: base + 'radios-inline.html', replace: false},
      radiobuttons: {template: base + 'radio-buttons.html', replace: false},
      help: {template: base + 'help.html', replace: false},
      'default': {template: base + 'default.html', replace: false}
    }, []);
  }])
  .directive( 'btTooltip', [ '$sanitize' , function ( $sanitize ) {
    return {
      restrict: 'A',
      link: link
    }

    function link ( scope, element, attrs, ngModel ) {

      scope.$watch( function () {
        return scope.$eval( attrs.btTooltip )
      }, function ( tooltip ) {
        if ( angular__WEBPACK_IMPORTED_MODULE_0___default.a.isString( tooltip ) && element.tooltip ) {
          element.tooltip( angular__WEBPACK_IMPORTED_MODULE_0___default.a.merge({
            placement: 'bottom',
            delay: { show : 400, hide : 100 }
          }, scope.$eval( attrs.btTooltipConfig ), {
            html: $sanitize( tooltip ),
            title:  $sanitize( tooltip )
          }));
        }
      })
    }

  }])
;


/***/ })
/******/ ]);
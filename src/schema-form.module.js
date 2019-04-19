import angular from 'angular';
// providers
import sfBuilderProvider from 'sf-builder.service';
import sfDecoratorsProvider from 'sf-decorators.service';
import sfErrorMessageProvider from 'sf-error-message.service';
import sfFormProvider from 'sf-form.service';
import sfPathProvider from 'sf-path.service';
import sfSchemaProvider from 'sf-schema.service';
import sfTemplateProvider from 'sf-template.service';
import sfValidatorsProvider from 'sf-validators.service';
// directives
import sfMessage from 'sf-message.directive';
import sfNode from 'sf-node.directive';
import sfModel from 'sf-model.directive';
import sfRender from 'sf-render.directive';
import sfSchema from 'sf-schema.directive';
import sfTransformModel from 'sf-transform-model.directive';
import schemaValidate from 'sf-validate.directive';


/**
 * @ngdoc           overview
 * @name            schemaForm
 * @description     SchemaForm main module
 * @requires        ngSanitize
 */
angular
    .module( 'schemaForm', [ 'ngSanitize' ] )
    // providers
    .provider( 'sfPath', sfPathProvider )
    .provider( 'sfTemplate', sfTemplateProvider )
    .provider( 'sfBuilder', sfBuilderProvider )
    .provider( 'sfDecorators', sfDecoratorsProvider )
    .provider( 'sfErrorMessage', sfErrorMessageProvider )
    .provider( 'sfValidators', sfValidatorsProvider )
    .provider( 'sfSchema', sfSchemaProvider )
    .provider( 'sfForm', sfFormProvider )
    // directives
    .directive( 'sfNode', sfNode )
    .directive( 'sfRender', sfRender )
    .directive( 'sfMessage', sfMessage )
    .directive( 'sfModel', sfModel )
    .directive( 'sfSchema', sfSchema )
    .directive( 'sfTransformModel', sfTransformModel )
    .directive( 'schemaValidate', schemaValidate )
;

export default angular.module( 'schemaForm' );
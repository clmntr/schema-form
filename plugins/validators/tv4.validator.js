import angular from 'angular';
import tv4 from 'tv4';

angular
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
            if (angular.isDefined(value)) {
                valueWrap[propName] = value;
            }
            return tv4.validateResult(valueWrap, wrap);
        }
    })

}
import angular from 'angular';

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

sfValidatorsProvider.$inject = [];

/**
 * @ngdoc       service
 * @name        schemaForm.provider:sfValidatorsProvider
 * @description Provider that is responsible for the validators management.
 *              Validators can be added through methods like the decorators.
 * @requires    schemaForm.provider:sfValidatorProvider
 */
function sfValidatorsProvider () {

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
        if ( angular.isFunction( validator ) ) {
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
            angular.forEach( node.schema.validators, function( validatorName ) {
                processValidation( validators[ validatorName ], result, node, value );
            })
        }
        else {
            angular.forEach( validators, function( validator ) {
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
                angular.merge( result, temp );
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

export default sfValidatorsProvider;
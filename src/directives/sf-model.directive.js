import angular from 'angular';

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

export default sfModel;

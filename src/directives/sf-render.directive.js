import angular from 'angular';

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
        if ( !angular.isObject( node ) ) {
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

export default sfRender;
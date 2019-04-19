import angular from 'angular';

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
                if ( angular.isFunction( transform ) ) {
                    return transform.call( scope, modelValue, scope, false );
                }
                // titleMap
                else if ( angular.isArray( transform ) ) {
                    var item = transform.find( function ( item ) {
                        return item.value === modelValue;
                    })
                    if ( item ) return item.name;
                    else return modelValue;
                }
                else if ( angular.isObject( transform ) ) {
                    return transform[ modelValue ];
                }
                return modelValue;
            });

            ngModelCtrl.$parsers.unshift( function ( viewValue ) {
                if ( angular.isFunction( transform ) ) {
                    return transform.call( scope, viewValue, scope, true );
                }
                // titleMap
                else if ( angular.isArray( transform ) ) {
                    var item = transform.find( function ( item ) {
                        return item.name === viewValue;
                    })
                    if ( item ) return item.value;
                    else return viewValue;
                }
                else if ( angular.isObject( transform ) ) {
                    angular.forEach( transform, function( value, key ){
                        if ( angular.equals( value, viewValue ) ) {
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

export default sfTransformModel;
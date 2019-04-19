(function(){

    angular
        .module( "example", [ "schemaForm", 'ui.ace' ] )
        .config( exampleConfig )
        .controller( "exampleController", exampleController )
    ;

    //////////////////////////////////////////////////
    //////////////////////////////////////////////////

    exampleConfig.$inject = [ 'sfErrorMessageProvider' ];

    function exampleConfig ( sfErrorMessageProvider ) {
        sfErrorMessageProvider.setDefaultMessage( 10001, 'Whoa! Can you double check that email address for me?' );
        tv4.defineError('EMAIL', 10001, 'Invalid email address');
        tv4.defineKeyword('email', function(data, value, schema) {
            if (schema.email) {
                if (/^\S+@\S+$/.test(data)) {
                    return null;
                }
                return {
                    code: 10001
                };
            }
            return null;
        });
    }

    //////////////////////////////////////////////////
    //////////////////////////////////////////////////

    exampleController.$inject = [ '$scope', '$http' ];

    function exampleController ( $scope, $http ) {

        $scope.tests = [
            { name: "Simple", data: 'data/simple.json' },
            { name: "JSON Ref", data: 'data/jsonref.json' },
            { name: "Basic JSON Schema Type", data: 'data/types.json' },
            { name: "Bootstrap Grid", data: 'data/grid.json' },
            { name: "Complex Key Support", data: 'data/complex-keys.json' },
            { name: "Array", data: 'data/array.json' },
            { name: "Array of types", data: 'data/array-of-types.json' },
            { name: "Tab Array", data: 'data/tabarray.json' },
            { name: "Deep Array", data: 'data/deep-array.json' },
            { name: "TitleMap Examples", data: 'data/titlemaps.json' },
            { name: "Kitchen Sink", data: 'data/sink.json' },
            { name: "Calculate", data: 'data/calculate.json' },
            { name: "Custom Error", data: 'data/custom-error.json' },
            { name: "Hack: Conditional required", data: 'data/conditional-required.json' }
        ]

        $scope.navbarMode   = 'default';
        $scope.decorator    = 'bootstrap-decorator';
        $scope.itParses     = true;
        $scope.itParsesForm = true;
        $scope.selectedTest = $scope.tests[0];

        $scope.$watch('selectedTest',function(val){
            if (val && val.data !== undefined) {
                $http.get(val.data).then(function(res) {setNewData(res.data);});
            }
        });

        $scope.$watch('schemaJson',function(val,old){
            if (val && val !== old) {
                try {
                    $scope.schema = JSON.parse($scope.schemaJson);
                    $scope.itParses = true;
                } catch (e){
                    $scope.itParses = false;
                }
            }
        });

        $scope.$watch('formJson',function(val,old){
            if (val && val !== old) {
                try {
                    $scope.form = JSON.parse($scope.formJson);
                    $scope.itParsesForm = true;
                } catch (e){
                    $scope.itParsesForm = false;
                }
            }
        });

        var setNewData = function(data) {
            $scope.schema     = data.schema;
            $scope.form       = data.form;
            $scope.schemaJson = JSON.stringify($scope.schema,undefined,2);
            $scope.formJson   = JSON.stringify($scope.form,undefined,2);
            $scope.modelData  = data.model || {};
        };

        $scope.log = function(msg){
          console.log("Simon says",msg);
        };

        $scope.sayNo = function() {
          alert('Noooooooo');
        };

        $scope.say = function(msg) {
          alert(msg);
        };

        $scope.submitForm = function(form) {
            // First we broadcast an event so all fields validate themselves
            $scope.$broadcast('schemaFormValidate');
            // Then we check if the form is valid
            if (form.$valid) {
              alert('You did it!');
            }
        };
    }

})()
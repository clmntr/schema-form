import angular from 'angular';

// Création de la directive recaptcha nécessaire pour les sf templates
angular
  .module( 'schemaForm' )
  .directive( 'sfRecaptcha', sfRecaptcha )
;

sfRecaptcha.$inject = [ '$window', '$document', '$q' ];

function sfRecaptcha ( $window, $document, $q ) {
  return {
    restrict  : 'A',
    link      : link,
    require   : "ngModel"
  }

  function link ( scope, element, attrs, ngModel ) {

    var recaptcha;
    var deferred    = $q.defer();
    var promise     = deferred.promise;
    // extract form data
    var form = scope.$eval(attrs.sfRecaptcha);

    // callback called when recaptcha is found
    var recaptchaCallback = function() {
        recaptcha = $window.grecaptcha;
        deferred.resolve(recaptcha);
    }

    // add the callback to the global object
    $window.recaptchaCallback = recaptchaCallback;

    // test if the library is here
    // if true, call the callback
    // if false, add a script tag to the document that load the recaptcha
    if (angular.isDefined($window.grecaptcha)) {
        recaptchaCallback();
    } else {
        // Generate link on demand
        var script = $window.document.createElement('script');
        script.async = true;
        script.defer = true;
        script.src = 'https://www.google.com/recaptcha/api.js?onload=recaptchaCallback&render=explicit';
        $document.find('body').append(script);
    }

    // when the promise is resolved
    // we can render the recaptcha
    promise.then( function( ) {

        var recaptchaId = undefined;

        // create the callback function
        var clickCallback = function ( response ) {
          if ( form.callback ) {
            scope.$eval( form.callback );
          }
          else {
            ngModel.$setViewValue(response);
            element.closest('form').triggerHandler( 'submit', response );
            resetCallback.call();
          }
        }

        var resetCallback = function () {
          recaptcha.reset(recaptchaId);
        }

        // render the recaptcha
        recaptchaId = recaptcha.render(
          element[0],
          {
            'sitekey'           : form.siteKey,
            'callback'          : clickCallback,
            'expired-callback'  : resetCallback
          },
          true
        )
    })
  }
}
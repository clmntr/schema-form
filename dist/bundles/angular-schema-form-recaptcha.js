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
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports) {

module.exports = angular;

/***/ }),

/***/ 7:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(8);


/***/ }),

/***/ 8:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(angular__WEBPACK_IMPORTED_MODULE_0__);


// Création de la directive recaptcha nécessaire pour les sf templates
angular__WEBPACK_IMPORTED_MODULE_0___default.a
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
    if (angular__WEBPACK_IMPORTED_MODULE_0___default.a.isDefined($window.grecaptcha)) {
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

/***/ })

/******/ });
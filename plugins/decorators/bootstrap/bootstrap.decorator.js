import angular from 'angular';

angular
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

angular
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
        if ( angular.isString( tooltip ) && element.tooltip ) {
          element.tooltip( angular.merge({
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
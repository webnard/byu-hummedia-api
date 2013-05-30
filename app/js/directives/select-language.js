/**
 * Populates a language selection dropdown menu.
 * The value of the select-language attribute should be the ng-model value you want to bind to.
 * Defaults to language.
 * 
 * @author Ian Hunter
 * @see selectLanguageMulti and selectLanguageHelper
 * 
 * Attributes:
 *  lang-exists - whether or not we select our languages from languages that we have translations for
 *                do not include this attribute if you want a selection of all available languages
 */
"use strict";
HUMMEDIA_DIRECTIVES.
    directive('selectLanguage', ['selectLanguageHelper', function(SLH) {
        return {
            link: SLH.linkFn,
            scope: false,
            template: '<select ng-model="__language" data-ng-options="lang.value as lang.label | language for lang in __languages"></select>',
            replace: true
        };
    }]);
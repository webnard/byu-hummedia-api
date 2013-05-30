/**
 * Allows for changing the locale and performing translations
 */
HUMMEDIA_SERVICES.factory('language', ['analytics','$http', 'user', function(analytics, $http, user) {
    var defaultLang = "en"; // default
    var language = {};
    var translations = null; // to be loaded; a key-value object of translations
    var loadingTranslations = false;
    var languages = $http.get('translations/ALL.json')
        .then(function(response) {
            var codes = [];
            for(var i = 0; i<response.data.length; i++) {
                codes.push({label: response.data[i], value: response.data[i]});
            }
            return codes;
        });

    // Tells us if the language code exists
    // requires that the languages already be loaded
    var languageExists = function( code ) {
        for(var i = 0; i < languages.$$v.length; i++) {
            if(languages.$$v[i]['label'] === code) {
                return true;
            }
        }
        return false;
    };

    user.checkStatus().then(function(){
        language.current = user.data.preferredLanguage;
    });

    Object.defineProperty(language, "list", {
        value: languages,
        configurable: false,
        enumerable: true,
        writable: false
    });
    Object.defineProperty(language, "current", {
        get : function(){
            return window.localStorage['language'] || defaultLang;
        },
        set : function(str) {
            // don't set if there's nothing to change
            if(typeof str != "string" || str === this.current || !str) {
                return;
            }

            languages.then(function() { // some defensive maneuvering to help us not set a language when we don't know if it exists or not yet
                
                // and don't change it if the language doesn't exist
                if(!languageExists(str)) {
                    return;
                }

                analytics.event('Language','Switch',str);
                translations = null; // reset
                window.localStorage['language'] = str;
                /**
                 * @todo: Figure out how to reload the angular localization files
                 * and get them to work when switching languages. Right now simply calling loadLanguage won't work
                 */
                //window.location.reload();
            });
        },
        configurable : false,
        enumerable: true
    });
    /**
     * @TODO: Load and enable localization files
     */
    language.loadLanguage = function() {
        //$.getScript("//code.angularjs.org/1.0.3/i18n/angular-locale_" + this.current + ".js");
    };

    // lazily loading translations
    language.translate = function(str) {
        // default language should be the same language as the string we're translating
        if(this.current === defaultLang) {
            return str;
        }
        else if(translations === null) { // should only ever happen when we switch a language

            $http.get('translations/' + this.current + '.json')
                .success(function(data) {
                    loadingTranslations = false;
                    translations = data;
                })
                .error(function() {
                    loadingTranslations = false;
                    translations = {};
                });
        }
        else if(translations[str] === undefined || translations[str] === "") {
            return str;
        }
        else
        {
            return translations[str];
        }
    };
    Object.seal(language);
    Object.freeze(language);

    language.loadLanguage();
    return language;
}]);
/**
 * Copyright (C) 2012 Chris Wharton (chris@weare2ndfloor.com)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * THIS SOFTWARE AND DOCUMENTATION IS PROVIDED "AS IS," AND COPYRIGHT
 * HOLDERS MAKE NO REPRESENTATIONS OR WARRANTIES, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO, WARRANTIES OF MERCHANTABILITY OR
 * FITNESS FOR ANY PARTICULAR PURPOSE OR THAT THE USE OF THE SOFTWARE
 * OR DOCUMENTATION WILL NOT INFRINGE ANY THIRD PARTY PATENTS,
 * COPYRIGHTS, TRADEMARKS OR OTHER RIGHTS.COPYRIGHT HOLDERS WILL NOT
 * BE LIABLE FOR ANY DIRECT, INDIRECT, SPECIAL OR CONSEQUENTIAL
 * DAMAGES ARISING OUT OF ANY USE OF THE SOFTWARE OR DOCUMENTATION.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://gnu.org/licenses/>.

 Documentation available at https://github.com/marcodejongh/CuttACookie/wiki

 */
(function ($) {
    "use strict";
    var defaults  = {
        cookieCutter: false, // you'd like to enable the div/section/span etc. hide feature? change this to true
        cookieCutterDeclineOnly: false, // you'd like the CookieCutter to only hide when someone has clicked declined set this to true
        cookieAnalytics: true, // just using a simple analytics package? change this to true
        cookieDeclineButton: false, // this will disable non essential cookies
        cookieAcceptButton: true, // this will disable non essential cookies
        cookieResetButton: false,
        cookieOverlayEnabled: false, // don't want a discreet toolbar? Fine, set this to true
        cookiePolicyLink: '/privacy-policy/', // if applicable, enter the link to your privacy policy here...
        cookieMessage: 'We use cookies on this website, you can <a href="{{cookiePolicyLink}}" title="read about our cookies">read about them here</a>. To use the website as intended please...',
        cookieAnalyticsMessage: 'We use cookies, just to track visits to our website, we store no personal details.',
        cookieErrorMessage: "We\'re sorry, this feature places cookies in your browser and has been disabled. <br>To continue using this functionality, please",
        cookieWhatAreTheyLink: "http://www.allaboutcookies.org/",
        cookieDisable: '',
        cookieExpires: 365,
        cookieAcceptButtonText: "ACCEPT COOKIES",
        cookieDeclineButtonText: "DECLINE COOKIES",
        cookieResetButtonText: "RESET COOKIES FOR THIS WEBSITE",
        cookieWhatAreLinkText: "What are cookies?",
        cookieNotificationLocationBottom: false, // top or bottom - they are your only options, so true for bottom, false for top
        cookiePolicyPage: false,
        cookiePolicyPageMessage: 'Please read the information below and then choose from the following options',
        cookieDiscreetLink: false,
        cookieDiscreetReset: false,
        cookieDiscreetLinkText: "Cookies?",
        cookieDiscreetPosition: "topleft", //options: topleft, topright, bottomleft, bottomright
        cookieNoMessage: false, // change to true hide message from all pages apart from your policy page
        cookieDomain: "",
        cookieAcceptName: 'cc_cookie_accept',
        cookieAcceptValue: 'cc_cookie_accept',
        cookieDeclineName: 'cc_cookie_decline',
        cookieDeclineValue: 'cc_cookie_decline',
        cookieClickableOverlay: false,
        cookieClickableDiv: "",
        cookieClickAnyLink: false,
        cookieCuttrCompatible: true
    };
    $.cuttACookie = function (o) {

        var options = $.extend({}, defaults, o),
            $cookieAccepted = $.cookie(options.cookieAcceptName) == options.cookieAcceptValue,
            $cookieDeclined = $.cookie(options.cookieDeclineName) == options.cookieDeclineValue,
            cookieAccept = '',
            cookieDecline = '',
            cookieOverlay = '',
            acceptCookies = function (elmt) {
                if (!options.cookieClickAnyLink) {
                    elmt.preventDefault();
                }

                $.cookie(options.cookieAcceptName, options.cookieAcceptValue, {
                    expires: options.cookieExpires,
                    path: '/'
                });
                $.cookie("cc_cookie_decline", null, {
                    path: '/'
                });
                // reload page to activate cookies (overriden with clickanylink)
                location.reload();
            },
            resetCookies = function (elmt) {
                elmt.preventDefault();

                $.cookie(options.cookieAcceptName, null, {
                    path: '/'
                });
                $.cookie(options.cookieDeclineName, null, {
                    path: '/'
                });
                $(".cc-cookies").fadeOut(function () {
                    // reload page to activate cookies
                    location.reload();
                });
            },
            declineCookies = function (elmt) {
                elmt.preventDefault();

                if ($(this).is('[href$=#decline]')) {
                    $.cookie(options.cookieAcceptName, null, { path: '/' });
                    $.cookie(options.cookieDeclineName, options.cookieDeclineValue, { expires: options.cookieExpires, path: '/' });

                    if (options.cookieDomain) {
                        // kill google analytics cookies
                        $.cookie("__utma", null, { domain: '.' + options.cookieDomain, path: '/' });
                        $.cookie("__utmb", null, { domain: '.' + options.cookieDomain, path: '/' });
                        $.cookie("__utmc", null, { domain: '.' + options.cookieDomain, path: '/' });
                        $.cookie("__utmz", null, { domain: '.' + options.cookieDomain, path: '/' });
                    }
                } else {
                    $.cookie(options.cookieDeclineName, null, { path: '/' });
                    $.cookie(options.cookieAcceptName, options.cookieAcceptValue, { expires: options.cookieExpires, path: '/' });
                }

                $(".cc-cookies").fadeOut(function () {
                    location.reload();
                });
            };

        options.cookieMessage = options.cookieMessage.replace('{{cookiePolicyLink}}', options.cookiePolicyLink);

        // cookie identifier
        $.cookieAccepted = function () { return $cookieAccepted; };
        $.cookieDeclined = function () { return $cookieDeclined; };

        // write cookie accept button
		if (options.cookieAcceptButton) {
            cookieAccept = ' <a href="#accept" class="cc-cookie-accept">' + options.cookieAcceptButtonText + '</a> ';
		}

        // write cookie decline button
		if (options.cookieDeclineButton) {
            cookieDecline = ' <a href="#decline" class="cc-cookie-decline">' + options.cookieDeclineButtonText + '</a> ';
		}

        // write extra class for overlay
		if (options.cookieOverlayEnabled) {
            cookieOverlay = ' cc-overlay';
        }

        var setDiscrete = function () {
            if (options.cookieDiscreetPosition == "topleft") {
                $('div.cc-cookies').css("top", "0");
                $('div.cc-cookies').css("left", "0");
            }
            if (options.cookieDiscreetPosition == "topright") {
                $('div.cc-cookies').css("top", "0");
                $('div.cc-cookies').css("right", "0");
            }
            if (options.cookieDiscreetPosition == "bottomleft") {
                $('div.cc-cookies').css("bottom", "0");
                $('div.cc-cookies').css("left", "0");
            }
            if (options.cookieDiscreetPosition == "bottomright") {
                $('div.cc-cookies').css("bottom", "0");
                $('div.cc-cookies').css("right", "0");
            }
		};

        // to prepend or append, that is the question?
        var appOrPre = (options.cookieNotificationLocationBottom         ||
                        options.cookieDiscreetPosition == "bottomright"  ||
                        options.cookieDiscreetPosition == "bottomleft") ? 'append' : 'prepend';
        if (!(options.cookieNoMessage && !options.cookiePolicyPage)) {
            if ($cookieAccepted || $cookieDeclined) {
                // write cookie reset button
                if (options.cookieResetButton && options.cookieDiscreetReset) {
                    $('body')[appOrPre]('<div class="cc-cookies cc-discreet"><a href="#" class="cc-cookie-reset">' + options.cookieResetButtonText + '</a></div>');
                    setDiscrete();
                } else if (options.cookieResetButton) {
                    $('body')[appOrPre]('<div class="cc-cookies"><a href="#" class="cc-cookie-reset">' + options.cookieResetButtonText + '</a></div>');
                }
            } else if (options.cookieDiscreetLink && !options.cookiePolicyPage) { // show discreet link
                $('body')[appOrPre]('<div class="cc-cookies cc-discreet"><a href="' + options.cookiePolicyLink + '" title="' + options.cookieDiscreetLinkText + '">' + options.cookieDiscreetLinkText + '</a></div>');
                setDiscrete();
            } else if (options.cookieAnalytics) { // show analytics overlay
                $('body')[appOrPre]('<div class="cc-cookies' + cookieOverlay + '">' + options.cookieAnalyticsMessage + cookieAccept + cookieDecline + '<a rel="external" href="' + options.cookieWhatAreTheyLink + '">' + options.cookieWhatAreLinkText + '</a></div>');
            }
            else if (options.cookiePolicyPage) { // show policy page overlay
                $('body')[appOrPre]('<div class="cc-cookies' + cookieOverlay + '">' + options.cookiePolicyPageMessage + " " + ' <a href="#accept" class="cc-cookie-accept">' + options.cookieAcceptButtonText + '</a> ' + ' <a href="#decline" class="cc-cookie-decline">' + options.cookieDeclineButtonText + '</a> ' + '</div>');
            }
            else if (!options.cookieAnalytics && !options.cookieDiscreetLink) { // show privacy policy option
                $('body')[appOrPre]('<div class="cc-cookies' + cookieOverlay + '">' + options.cookieMessage + cookieAccept + cookieDecline + '</div>');
            }   
        }
        
        if ((options.cookieCutter && !options.cookieCutterDeclineOnly && ($cookieDeclined || !$cookieAccepted)) ||
            (options.cookieCutter && options.cookieCutterDeclineOnly && $cookieDeclined)){
            $(options.cookieDisable).html('<div class="cc-cookies-error">' + options.cookieErrorMessage + ' <a href="#accept" class="cc-cookie-accept">' + options.cookieAcceptButtonText + '</a> ' + '</div>');
        }

        // if bottom is true, switch div to bottom if not in discreet mode
        if ((options.cookieNotificationLocationBottom && !options.cookieDiscreetLink) ||
            (options.cookieNotificationLocationBottom && options.cookieDiscreetLink && options.cookiePolicyPage)) {
            $('div.cc-cookies').css({ top: 'auto', bottom: 0 });
        }

		if(options.cookieClickableOverlay && (!$cookieAccepted || $cookieDeclined))	{
			if(options.cookieClickableDiv === "") {
				options.cookieClickableDiv = "cc-cookies-bodywrapper";
				$('body').innerWrap("<div class='" + options.cookieClickableDiv + "'/>" );
			}
			
			$("." + options.cookieClickableDiv).click(acceptCookies);
		}
		
		if(options.cookieClickAnyLink && !$cookieAccepted) {
			$("a").click(acceptCookies);
		}
        
        // handler: for [top/bottom] bar
		$('.cc-cookie-accept, .cc-cookie-decline').click(declineCookies);

        // handler: reset cookies
		$('a.cc-cookie-reset').click(resetCookies);

        //cookie error accept
        $('.cc-cookies-error a.cc-cookie-accept').click(acceptCookies);
    };

    // drop-in replacement compatibility for the cookieCuttr plugin (from which cuttACookie was forked)
    if (defaults.cookieCuttrCompatible && !$.cookieCuttr) {
        $.cookieCuttr = $.cuttACookie;
    }
})(jQuery);
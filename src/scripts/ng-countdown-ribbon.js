/**
 * @license ng-countdown-ribbon v0.1.0
 * http://paveldemyanenko.github.io/ng-countdown-ribbon
 * (c) 2015 MIT License, paveldemyanenko.com
 */
(function() {
    'use strict';

    /**
     * @description
     *
     * This module provides AngularJS application with a system for displaying
     * time remaining before the scheduled event on a ribbon.
     */

    var module = angular.module('ngCountdownRibbon', []);

    module.provider('ngCountdownRibbon', function() {

        this.$get = ['$document', '$compile', '$rootScope',

            function($document, $compile, $rootScope) {

                var options = {
                    theme: 'black',
                    position: 'left'
                };

                var themes = {
                    black: 'ribbon_black',
                    blue: 'ribbon_blue'
                };

                var positions = {
                    left: 'ribbon_left',
                    right: 'ribbon_right'
                };

                var types = {
                    birthday: 'birthday',
                    event: 'special-event'
                };

                var ribbonScope = $rootScope.$new();

                var tpl = $compile(
                  '<a ng-href="{{ngCountdownRibbon.ribbonLink}}" class="ribbon-container" target="_blank">' +
                  '<span class="ribbon" ng-class="ngCountdownRibbon.ribbonClass">' +
                  '<span><ng-pluralize count="ngCountdownRibbon.ribbonDays" ' +
                  'when="{\'0\': \'Event has come\', \'one\': \'1 day left\', \'other\': \'{} days left\'}"' +
                  '</ng-pluralize></span></span></a>'
                )(ribbonScope);

                $document.find('body').append(tpl);

                var setTheme = function(providedTheme) {
                    var theme = providedTheme || options.theme;
                    return themes[theme] || themes.black;
                };

                var setPosition = function(providedPosition) {
                    var position = providedPosition || options.position;
                    return positions[position] || positions.left;
                };

                var setType = function(providedType) {
                    var type = (providedType || options.type);
                    return types[type] || types.birthday;
                };


                var ribbonObject = {

                    config: function(params) {
                        params = params || {};
                        angular.extend(options, params);
                    },

                    set: function(date, link, userOpt) {

                        if (!date) {
                            return;
                        }

                        var endDate = new Date(date.split('-').join('/'));

                        var asMidnight = function(date) {
                            var result = new Date(date);
                            result.setHours(0,0,0,0);
                            return result;
                        };

                        var daysBetween = function(startDate, endDate) {
                            var millisecondsPerDay = 24 * 60 * 60 * 1000;
                            return (asMidnight(endDate) - asMidnight(startDate)) / millisecondsPerDay;
                        };

                        var currentDate = new Date().getTime();

                        var days = Math.round(daysBetween(currentDate, endDate));

                        var userOpts = {};

                        if (typeof userOpt === 'object') {
                            userOpts = {
                                theme: userOpt.theme || undefined,
                                position: userOpt.position || undefined,
                                type: userOpt.type || undefined
                            };
                        } else {
                            userOpts.type = userOpt;
                        }

                        var ribbonClass = setTheme(userOpts.theme) + ' ' + setPosition(userOpts.position) + ' ' + setType(userOpts.type);

                        ribbonScope.ngCountdownRibbon = {
                            ribbonLink: link,
                            ribbonClass: ribbonClass,
                            ribbonDays: days
                        };
                    },

                    addTheme: function(themeName, themeClass) {
                        if (!themeName || !themeClass) {
                            return;
                        }
                        themes[themeName] = themeClass;
                    },

                    addType: function(typeName, typeClass) {
                        if (!typeName || !typeClass) {
                            return;
                        }
                        types[typeName] = typeClass;
                    }
                };
                return ribbonObject;
            }
        ];
    });
})();

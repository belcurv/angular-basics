// ================================ Directives ================================
weatherApp.directive('weatherPanel', function () {
    return {
        restrict: 'AE',
        templateUrl: 'directives/weatherpanel.html',
        replace: true,
        scope: {
            weatherDay: '=',
            convertToStandard: '&',
            convertToDate: '&',
            dateFormat: '@'
        }
    }
});
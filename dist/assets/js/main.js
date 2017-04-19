/**
 * Created by isak16 on 2017-03-21.
 */

var app = angular.module('app', ['chart.js']);

app.controller('main', function ($scope, $http) {
    $scope.navigate = {};
    $scope.stock = {};
    $scope.navigate.nav =  false;
    $scope.navigate.navInc = 10;

    

    $http({
        method: 'GET',
        url: 'http://localhost:1337/stock/ANOT'
    }).then(function successCallback(response) {
        $scope.respo = response;
        $scope.navigate.nav = 0;
    }, function errorCallback(response) {
        console.log(response);
    });

    $scope.series = ['Open', 'Low', "High", "Close"];


    $scope.add = function () {
        $scope.navigate.nav = $scope.navigate.nav + 100;
    };

    $scope.$watch('navigate.nav', function(newValue, oldValue) {
      if(!$scope.respo)return;
        $scope.stock.name = $scope.respo.data.namn;
        $scope.data = [
            $scope.respo.data.prices.indicators.quote[0].open.slice($scope.navigate.nav, ($scope.navigate.nav + $scope.navigate.navInc)),
            $scope.respo.data.prices.indicators.quote[0].low.slice($scope.navigate.nav, ($scope.navigate.nav + $scope.navigate.navInc)),
            $scope.respo.data.prices.indicators.quote[0].high.slice($scope.navigate.nav, ($scope.navigate.nav + $scope.navigate.navInc)),
            $scope.respo.data.prices.indicators.quote[0].close.slice($scope.navigate.nav, ($scope.navigate.nav + $scope.navigate.navInc))
        ];
        $scope.labels = $scope.respo.data.prices.timestamp.slice($scope.navigate.nav, ($scope.navigate.nav + $scope.navigate.navInc));

        $scope.messages =  $scope.respo.data.messages;

        $scope.stock.messages = filterArr($scope.messages, $scope.labels);
    });

});


app.directive('ngMouseWheelUp', function() {
    return function(scope, element, attrs) {
        element.bind("DOMMouseScroll mousewheel onmousewheel", function(event) {
            // cross-browser wheel delta
            var event = window.event || event; // old IE support
            var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));

            if(delta > 0) {
                scope.$apply(function(){
                    scope.$eval(attrs.ngMouseWheelUp);
                });

                // for IE
                event.returnValue = false;
                // for Chrome and Firefox
                if(event.preventDefault) {
                    event.preventDefault();
                }

            }
        });
    };
});


app.directive('ngMouseWheelDown', function() {
    return function(scope, element, attrs) {
        element.bind("DOMMouseScroll mousewheel onmousewheel", function(event) {

            // cross-browser wheel delta
            var event = window.event || event; // old IE support
            var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));

            if(delta < 0) {
                scope.$apply(function(){
                    scope.$eval(attrs.ngMouseWheelDown);
                });

                // for IE
                event.returnValue = false;
                // for Chrome and Firefox
                if(event.preventDefault)  {
                    event.preventDefault();
                }

            }
        });
    };
});


function filterArr(messages, dates) {
    var tempArr = [];
    var dateLow = dates[0]-86400;
    var dateHigh = dates[dates.length-1];

    for(var i = 0; i < messages.messages.length; i++){
        if(messages.timestamp[i] > dateLow && messages.timestamp[i] < dateHigh){
            tempArr.push({message: messages.messages[i], timestamp: messages.timestamp[i]})
        }
    }
    console.log(tempArr);
    return tempArr;
}
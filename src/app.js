(function () {
    var templates = angular.module('templates', []);
    var directives = angular.module('App.Directives', []);
    var services = angular.module('App.Services', []);
    var app = angular.module('priceParser', [
            'App.Directives',
            'App.Services',
            'templates',
            'Zpianist.StorageService'
        ])

        .controller('ConverterController', function ($scope, $http, storage) {
            // $scope.text = '';
            $scope.parsedPrice = '';
            $scope.showResult = false;
            $scope.positions = (storage.get('positions') ? storage.get('positions') : []);

            console.log($scope.positions);
            if ($scope.positions.length) $scope.showResult = true;
            //console.log($scope.parsedPrice);
            $scope.back = function () {
                $scope.showResult = false;
                //$scope.parsedPrice = '';
            }
            $scope.clear = function () {
                $scope.showResult = false;
                $scope.positions = [];
                storage.set('positions', []);
                //$scope.parsedPrice = '';
            }

            var search;
            var objects = {};
            var formatPrice = function (price, count) {
                return (parseFloat(price.replace(',', '.')) * parseFloat(count)).toFixed(2);
            }
            $scope.showPositions = function () {
                $scope.showResult = true;
            }
            $scope.convert = function (text) {
                $scope.text = text;
                var positions = [];

                var x = 0;
                if (text) {
                    text.split('\n').forEach(function (line) {
                        var count, weight, price;
                        var isHeading;

                        var regexps = {
                            weight: /(\d+кг|по \d кг.|\d+ (кг|кг.))/gi,
                            count: /\d+(шт| шт|ш| ш| шт.)/gi,
                            price: /\d+.\d+(руб.| руб.)/gi,
                        };
                        var position = {};

                        if (count = regexps.count.exec(line)) {
                            position['inbox'] = count[0];
                        } else {
                            //position['inbox'] = 1;
                        }
                        //position['nal'] = 2222;
                        if (price = regexps.price.exec(line)) {
                            //console.log(price);
                            position['nal'] = price[0];
                            if (position['inbox'])
                                position['beznal'] = formatPrice(position['nal'], position['inbox']);
                        }
                        if (!count && !price) {
                            isHeading = true;

                            position['heading'] = true;

                            x = 0;
                        } else {
                            isHeading = false;
                            x++;
                        }

                        if (weight = regexps.weight.exec(line)) {
                            if (!isHeading && !count) {
                                position['inbox'] = parseFloat(weight[0]);
                                position['beznal'] = formatPrice(position['nal'], parseFloat(position['inbox']));
                            }
                            console.log('weight', weight);
                        }


                        position['index'] = x;
                        position['title'] = line;
                        if(position['beznal']) {
                            position['beznal'] = position['beznal'].replace('.',','); 
                            position['beznal'] += ' руб.';
                        }
                        positions.push(position)
                        if (isHeading) {
                            /* positions.splice(positions.indexOf(position), 0, {
                             legend: true,
                             index: '№',
                             title: 'Наименование продукции',
                             nal: (!count && weight ? 'Цена за кг. ' : 'Цена за ед.'),
                             inbox: 'Кол-во в уп.',
                             beznal: "Цена за уп.",
                             //total: "333",
                             //active: false
                             })*/

                        }

                    });
                }
                if (positions.length) {
                    storage.set('positions', positions);
                    $scope.positions = positions;
                    $scope.showResult = true;
                }

            }
        })
})();
(function () {
    var templates = angular.module('templates', []);
    var directives = angular.module('App.Directives', []);
    var services = angular.module('App.Services', []);
    var app = angular.module('priceParser', [
            'App.Directives',
            'App.Services',
            'templates'
        ])
        .controller('ConverterController', function ($scope, $http) {
            // $scope.text = '';
            $scope.parsedPrice = '';
            $scope.clear = function () {
                $scope.parsedPrice = '';
            }



            $scope.convert = function (text) {
                $scope.text =
                    $scope.parsedPrice = text;
                var positions = [];
                text.split('\n').forEach(function (line) {
                    // var num = line.test(new RegExp(/\d+шт/gi));
                    // num = line.replace(/\d+шт/gi,"$1")
                    var regexps = {
                        inbox: /\d+шт/gi,
                        beznal: /\d+руб./gi,
                    };

                    var position = {};
                    var inbox = line.search(regexps.inbox);
                    var data = line.substring(inbox, inbox.length)
                        .replace(/\ шт+/g, 'шт')
                        .replace(/\ руб+/g, 'руб')

                        .replace(/\шт.+/g, 'шт#')
                        .replace(/\руб.+/g, 'руб#')
                        .replace(',', '.')
                        .replace(/\s+/g, '');

                    data = data.split('#');
                    //console.log(data);
                    data.forEach(function (i, index) {
                        var x = i.split('*');
                        data[index] = parseSentenceForNumber(x[1] ? x[1] : x[0]);
                    })
                    if (!data[0]) {
                        position['heading'] = true;

                        console.log(line);
                    } else {
                        position['nal'] = data[1];
                        position['inbox'] = data[0];
                    }

                    // var beznal = regexps.beznal.exec(line);

                    // position['inbox'] = (inbox ? inbox[0] : null);

                    // console.log(beznal);
                    // /The best/.exec(text)
                    /*while ((m = re.exec(str)) !== null) {
                     if (m.index === re.lastIndex) {
                     re.lastIndex++;
                     }
                     position['inbox'] = m[0];
                     console.log(m);
                     // View your result using the m-variable.
                     // eg m[0] etc.
                     }*/
                    position['title'] = line;
                    /*{
                     title: line,
                     nal: "111",
                     inbox: "222",
                     beznal: "222",
                     total: "333",
                     active: false
                     }*/
                    positions.push(position)
                });
                $scope.positions = positions;

            }
        })
})();
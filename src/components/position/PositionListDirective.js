(function(){
    var app = angular.module('App.Directives');
    app.directive('positions', ['$templateCache', function($templateCache){
        return {
            restrict: 'E',
            scope: {
                positions: '=list'
            },
            template: $templateCache.get('position/list.html'),
            link: function($scope){
                $scope.check = function (position) {
                    $scope.positions.forEach(function (pos) {
                        pos.active = false;
                        // return pos;
                    })
                    position.active = true;
                }
            }
        }
    }])
})();
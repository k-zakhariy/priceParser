(function(){
    var app = angular.module('App.Directives');
    app.directive('positions', ['$templateCache', 'storage', function($templateCache, storage){
        return {
            restrict: 'E',
            scope: {
                positions: '=list'
            },
            template: $templateCache.get('position/list.html'),
            link: function($scope, $element){
                /*var activePositionsCache = storage.set('activePositions', []);*/
                //var positionsCache = storage.set('positions', $scope.positions);

/*                $element.find('.nal').each(function(i,el){
                    var client = new ZeroClipboard( el );
                    client.on( "ready", function( readyEvent ) {
                        // alert( "ZeroClipboard SWF is ready!" );

                        client.on( "aftercopy", function( event ) {
                            // `this` === `client`
                            // `event.target` === the element that was clicked
                            //event.target.style.display = "none";
                            alert("Copied text to clipboard: " + event.data["text/plain"] );
                        } );
                    } );
                })*/


                $element.find('table').click(function(i,el){
                   console.log($(el).html());
                });
                $scope.focusInput = function($event){
                    $event.stopPropagation();
                    $event.target.setSelectionRange(0, $event.target.value.length)
                    try {
                        var successful = document.execCommand('copy');
                        var msg = successful ? 'successful' : 'unsuccessful';
                        console.log('Copying text command was ' + msg);

                    } catch (err) {
                        console.log('Oops, unable to copy');
                    }

                }
                $scope.check = function (position) {

                    //var positionsCache = storage.get('positions');
                    //$scope.positions.forEach(function (pos) {
                        //pos.active = false;
                        // return pos;
                    //})
                    console.log(event);

                    position.active = !position.active;
                    storage.set('positions', $scope.positions);

                }
            }
        }
    }])
})();
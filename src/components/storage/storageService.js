(function(ng) {
    function _get(key) {
        var data = localStorage.getItem(key);
        //console.log(data);
        return (data != 'undefined' ? JSON.parse(data) : null);
    }
    function _isSet(key) {
        return localStorage.getItem(key) !== null;
    }
    function _set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }
    function _clear(key) {
        localStorage.removeItem(key);
    }
    ng.module("Zpianist.StorageService" , []).factory("storage", function() {
        return {
            clear: _clear,
            remove: _clear,
            get: _get,
            set: _set,
            isSet: _isSet
        };
    });
})(window.angular);
(function(){
    "use strict";

    /**
     * A utility class that creates a delay by making an HTTP request.
     */
    var HttpUtils = {
        delay: function(callback){
            var oReq = new XMLHttpRequest();
            
            oReq.addEventListener("load", callback);
            oReq.open("GET", "http://www.httpbin.org/delay/1", true);
            oReq.send();
        }
    };

    module.exports = HttpUtils;
}());
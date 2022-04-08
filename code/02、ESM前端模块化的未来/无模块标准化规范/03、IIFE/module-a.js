// IIFE
//module.a.js

(function() {
    let data = "moduleA";

    function method() {
        console.log(data + "execute");
    }

    window.moduleA = {
        method,
    };
})();
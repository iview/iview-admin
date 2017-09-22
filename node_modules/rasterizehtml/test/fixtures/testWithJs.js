/* See testScaled50PercentWithJs.html for reference to integrational aspects of this file */
(function () {
    setTimeout(function () {
        if (window.matchMedia("(min-width: 200px) and (max-height: 100px)").matches) {
            var div = document.createElement("div");
            div.className = "bgimage webfont teST";
            div.innerHTML = "A";
            document.getElementsByTagName("body")[0].appendChild(div);
        }
    }, 50);
}())
